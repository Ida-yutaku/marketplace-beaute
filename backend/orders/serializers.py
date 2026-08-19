from django.conf import settings

from rest_framework import serializers

from catalog.serializers import ProductSerializer

from .models import Order, OrderItem


class BuyerSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "unit_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer = BuyerSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "total_amount", "items", "buyer", "created_at"]


class CheckoutItemInput(serializers.Serializer):
    """Un item envoyé par le front pour créer la commande + transaction FedaPay."""

    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    items = CheckoutItemInput(many=True)
