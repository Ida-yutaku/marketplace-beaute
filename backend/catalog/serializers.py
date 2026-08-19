from django.conf import settings
from django.utils.encoding import iri_to_uri

from rest_framework import serializers

from shops.models import Shop

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


def _absolute_url(request, relative_url: str | None) -> str | None:
    """Convert a relative /media/... path to an absolute URL."""
    if not relative_url:
        return None
    if relative_url.startswith("http"):
        return relative_url
    # Build absolute URL from request or from API env
    if request:
        return iri_to_uri(f"{request.scheme}://{request.get_host()}{relative_url}")
    from .views import API_HOST
    return iri_to_uri(f"{API_HOST}{relative_url}")


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    shop_id = serializers.PrimaryKeyRelatedField(
        queryset=Shop.objects.all(), source="shop", write_only=True
    )
    shop_name = serializers.ReadOnlyField(source="shop.name")
    image_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "title", "description", "price", "stock",
            "image", "image_url", "video", "video_url",
            "is_active", "is_available", "category", "category_id",
            "shop", "shop_id", "shop_name", "created_at",
        ]
        read_only_fields = ["shop", "created_at"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        return _absolute_url(request, obj.image.url if obj.image else None)

    def get_video_url(self, obj):
        request = self.context.get("request")
        return _absolute_url(request, obj.video.url if obj.video else None)

    def validate_shop_id(self, shop):
        request = self.context.get("request")
        if request and shop.owner_id != request.user.id:
            raise serializers.ValidationError("Cette boutique ne t'appartient pas.")
        return shop
