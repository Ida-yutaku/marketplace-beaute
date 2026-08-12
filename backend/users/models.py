from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Un utilisateur peut être acheteur, vendeur, ou les deux à la fois."""

    email = models.EmailField(unique=True)
    is_seller = models.BooleanField(default=False)
    shop_name = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=30, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email or self.username
