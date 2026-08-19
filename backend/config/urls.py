from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("users.urls")),
    path("", include("shops.urls")),
    path("", include("catalog.urls")),
    path("", include("orders.urls")),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
