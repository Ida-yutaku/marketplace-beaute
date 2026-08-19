from rest_framework import serializers

from shops.models import Shop

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    shop_id = serializers.PrimaryKeyRelatedField(
        queryset=Shop.objects.all(), source="shop", write_only=True
    )
    shop_name = serializers.ReadOnlyField(source="shop.name")

    class Meta:
        model = Product
        fields = [
            "id", "title", "description", "price", "stock", "image", "video",
            "is_active", "is_available", "category", "category_id",
            "shop", "shop_id", "shop_name", "created_at",
        ]
        read_only_fields = ["shop", "created_at"]

    def validate_shop_id(self, shop):
        request = self.context.get("request")
        if request and shop.owner_id != request.user.id:
            raise serializers.ValidationError("Cette boutique ne t'appartient pas.")
        return shop
