from django.conf import settings

from rest_framework import serializers

from shops.models import Shop

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


def _absolute_url(request, relative_url: str | None) -> str | None:
    """Return a full absolute URL for a media file.

    - Cloudinary returns full https:// URLs → returned as-is
    - Local /media/... paths → converted using request host or API_HOST env
    """
    if not relative_url:
        return None
    if relative_url.startswith("http"):
        return relative_url
    if request:
        return f"{request.scheme}://{request.get_host()}{relative_url}"
    from .views import API_HOST
    return f"{API_HOST}{relative_url}"


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
        if obj.image:
            try:
                return _absolute_url(request, obj.image.url)
            except Exception:
                return _absolute_url(request, obj.image.name)
        return None

    def get_video_url(self, obj):
        request = self.context.get("request")
        if obj.video:
            try:
                return _absolute_url(request, obj.video.url)
            except Exception:
                return _absolute_url(request, obj.video.name)
        return None

    def validate_shop_id(self, shop):
        request = self.context.get("request")
        if request and shop.owner_id != request.user.id:
            raise serializers.ValidationError("Cette boutique ne t'appartient pas.")
        return shop
