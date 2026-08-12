from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Seul le propriétaire de la boutique peut modifier/supprimer l'annonce."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.shop.owner_id == request.user.id
