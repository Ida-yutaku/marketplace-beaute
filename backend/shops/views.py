from rest_framework import permissions, viewsets

from .models import Shop
from .permissions import IsShopOwnerOrReadOnly
from .serializers import ShopSerializer


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsShopOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get("mine") == "true" and self.request.user.is_authenticated:
            return Shop.objects.filter(owner=self.request.user)
        return qs
