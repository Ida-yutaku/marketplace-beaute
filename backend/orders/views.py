import hashlib
import hmac
import logging

from django.conf import settings
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product

from . import fedapay_client
from .fedapay_client import FedaPayError
from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer

logger = logging.getLogger(__name__)


class MyOrdersView(APIView):
    """GET /api/orders/mine/ — commandes de l'acheteur connecté."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(buyer=request.user)
        return Response(OrderSerializer(orders, many=True).data)


class SellerOrdersView(APIView):
    """GET /api/orders/seller/ — commandes contenant les produits du vendeur connecté."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from catalog.models import Product
        from shops.models import Shop

        seller_shop_ids = Shop.objects.filter(owner=request.user).values_list("id", flat=True)
        orders = (
            Order.objects
            .filter(items__product__shop_id__in=seller_shop_ids)
            .distinct()
            .order_by("-created_at")
        )
        return Response(OrderSerializer(orders, many=True).data)


class CheckoutView(APIView):
    """
    POST /api/orders/checkout/
    body: {"items": [{"product_id": 1, "quantity": 2}, ...]}

    Crée la Order (status=pending), ouvre une transaction Mobile Money
    (MTN / Moov) via FedaPay, et renvoie l'URL de paiement hébergée vers
    laquelle le front doit rediriger l'acheteur.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        items_data = serializer.validated_data["items"]

        total = 0

        with transaction.atomic():
            order = Order.objects.create(buyer=request.user, total_amount=0)

            for item in items_data:
                product = Product.objects.select_for_update().get(id=item["product_id"])
                if product.stock < item["quantity"]:
                    return Response(
                        {"detail": f"Stock insuffisant pour {product.title}"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item["quantity"],
                    unit_price=product.price,
                )
                total += product.price * item["quantity"]

            order.total_amount = total
            order.save()

        try:
            fedapay_transaction = fedapay_client.create_transaction(
                amount=int(total),
                description=f"Commande #{order.id} — Marketplace Beauté",
                customer_email=request.user.email,
                customer_firstname=request.user.first_name,
                customer_lastname=request.user.last_name,
                callback_url=f"{settings.FRONTEND_URL}/cart/success?order_id={order.id}",
                custom_metadata={"order_id": order.id},
            )
            token = fedapay_client.generate_token(fedapay_transaction["id"])
        except FedaPayError as exc:
            logger.error("Échec de la création du paiement FedaPay: %s", exc)
            order.status = Order.Status.CANCELED
            order.save()
            return Response(
                {"detail": "Impossible d'initier le paiement Mobile Money pour le moment."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        order.fedapay_transaction_id = fedapay_transaction["id"]
        order.save()

        return Response({"checkout_url": token["url"], "order_id": order.id})


class OrderVerifyView(APIView):
    """
    GET /api/orders/<id>/verify/

    Relit le statut de la transaction directement auprès de FedaPay et met
    à jour la commande en conséquence. Utile en développement local, où
    FedaPay ne peut pas atteindre le webhook (http://localhost n'est pas
    joignable depuis internet) : le front interroge cette route depuis la
    page de succès pour confirmer le paiement.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, buyer=request.user)
        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if order.status == Order.Status.PENDING and order.fedapay_transaction_id:
            try:
                fedapay_transaction = fedapay_client.get_transaction(
                    order.fedapay_transaction_id
                )
                _apply_transaction_status(order, fedapay_transaction.get("status"))
            except FedaPayError as exc:
                logger.warning("Vérification FedaPay impossible pour order %s: %s", order.id, exc)

        return Response(OrderSerializer(order).data)


def _apply_transaction_status(order: Order, fedapay_status: str | None) -> None:
    """Met à jour le statut de la commande à partir du statut FedaPay
    ('approved', 'declined', 'canceled', ...) et décrémente le stock une
    seule fois, au premier passage à 'paid'."""
    if fedapay_status == "approved" and order.status != Order.Status.PAID:
        order.status = Order.Status.PAID
        order.save()
        for item in order.items.select_related("product"):
            product = item.product
            product.stock = max(product.stock - item.quantity, 0)
            product.save()
    elif fedapay_status in ("declined", "canceled") and order.status == Order.Status.PENDING:
        order.status = Order.Status.CANCELED
        order.save()


class FedaPayWebhookView(APIView):
    """
    POST /api/fedapay/webhook/

    Confirme le paiement en temps réel dès que FedaPay notifie l'événement
    (transaction.approved, transaction.declined, transaction.canceled...).
    À configurer dans le dashboard FedaPay avec une URL publique
    (ex: https://ton-domaine.com/api/fedapay/webhook/) — ne fonctionne pas
    avec http://localhost, voir OrderVerifyView pour le dev local.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if not self._is_signature_valid(request):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        event = request.data
        event_name = event.get("name", "")
        entity = event.get("entity", {})
        transaction_id = entity.get("id")

        if not transaction_id or not event_name.startswith("transaction."):
            return Response(status=status.HTTP_200_OK)

        try:
            order = Order.objects.get(fedapay_transaction_id=str(transaction_id))
        except Order.DoesNotExist:
            return Response(status=status.HTTP_200_OK)

        # entity["status"] correspond au statut FedaPay ('approved', 'declined'...)
        _apply_transaction_status(order, entity.get("status"))

        return Response(status=status.HTTP_200_OK)

    def _is_signature_valid(self, request) -> bool:
        """Vérifie la signature FedaPay-Signature (format "t=...,s=...",
        HMAC-SHA256 de "{t}.{payload}" avec le secret webhook).

        Si FEDAPAY_WEBHOOK_SECRET n'est pas configuré (ex: premiers tests
        sandbox), on n'exige pas la signature — mais configure-la avant la
        mise en prod pour ne pas accepter de faux webhooks.
        """
        secret = settings.FEDAPAY_WEBHOOK_SECRET
        if not secret:
            logger.warning(
                "FEDAPAY_WEBHOOK_SECRET absent : signature du webhook non vérifiée."
            )
            return True

        header = request.META.get("HTTP_X_FEDAPAY_SIGNATURE", "")
        parts = dict(p.split("=", 1) for p in header.split(",") if "=" in p)
        timestamp, signature = parts.get("t"), parts.get("s")
        if not timestamp or not signature:
            return False

        payload = request.body.decode("utf-8")
        expected = hmac.new(
            secret.encode("utf-8"),
            f"{timestamp}.{payload}".encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
