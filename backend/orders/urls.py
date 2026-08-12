from django.urls import path

from .views import CheckoutView, FedaPayWebhookView, MyOrdersView, OrderVerifyView

urlpatterns = [
    path("orders/checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/mine/", MyOrdersView.as_view(), name="my-orders"),
    path("orders/<int:pk>/verify/", OrderVerifyView.as_view(), name="order-verify"),
    path("fedapay/webhook/", FedaPayWebhookView.as_view(), name="fedapay-webhook"),
]
