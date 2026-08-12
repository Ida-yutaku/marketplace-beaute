from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    # On retire "api/" ici car il est déjà inclus dans l'URL de base du frontend (API_BASE_URL)
    path("auth/", include("users.urls")),
    path("", include("shops.urls")),
    path("", include("catalog.urls")),
    path("", include("orders.urls")),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)