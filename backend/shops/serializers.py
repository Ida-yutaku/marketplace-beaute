from rest_framework import serializers

from .models import Shop


class ShopSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Shop
        fields = ["id", "name", "description", "logo", "owner", "owner_username", "created_at"]
        read_only_fields = ["owner", "created_at"]
