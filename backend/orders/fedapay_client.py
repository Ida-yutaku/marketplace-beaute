"""
Petit client HTTP pour l'API FedaPay (paiement Mobile Money : MTN, Moov — Bénin).

Documentation officielle : https://docs.fedapay.com/
- Sandbox : https://sandbox-api.fedapay.com/v1
- Live    : https://api.fedapay.com/v1

Flux utilisé :
1. create_transaction()  -> crée la transaction (montant en FCFA, sans décimales)
2. generate_token()      -> génère l'URL de paiement hébergée (checkout FedaPay)
   -> on redirige l'acheteur vers cette URL, il choisit MTN Mobile Money ou
      Moov Money et confirme sur son téléphone.
3. Confirmation :
   - via webhook (FedaPayWebhookView) si le backend est accessible publiquement
   - via get_transaction() en polling (OrderVerifyView), utile en local où
     FedaPay ne peut pas atteindre http://localhost.

⚠️ FedaPay fait parfois évoluer la forme exacte de ses réponses JSON (parfois
la ressource est imbriquée sous une clé du type "v1/transaction", parfois à
plat). _unwrap() gère les deux cas, mais vérifie toujours le comportement
réel de ton compte sandbox avant la mise en prod.
"""
from __future__ import annotations

import requests
from django.conf import settings


class FedaPayError(Exception):
    """Levée quand l'API FedaPay répond une erreur ou est inaccessible."""


def _base_url() -> str:
    return (
        "https://api.fedapay.com/v1"
        if settings.FEDAPAY_ENVIRONMENT == "live"
        else "https://sandbox-api.fedapay.com/v1"
    )


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.FEDAPAY_SECRET_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def _unwrap(data: dict, *keys: str) -> dict:
    for key in keys:
        if isinstance(data, dict) and key in data:
            return data[key]
    return data


def _request(method: str, path: str, **kwargs) -> dict:
    if not settings.FEDAPAY_SECRET_KEY:
        raise FedaPayError(
            "FEDAPAY_SECRET_KEY n'est pas configurée (voir .env.example)."
        )
    try:
        res = requests.request(
            method, f"{_base_url()}{path}", headers=_headers(), timeout=15, **kwargs
        )
    except requests.RequestException as exc:
        raise FedaPayError(f"Impossible de joindre l'API FedaPay : {exc}") from exc

    if res.status_code not in (200, 201):
        raise FedaPayError(
            f"FedaPay a répondu {res.status_code} sur {method} {path} : {res.text}"
        )
    try:
        return res.json()
    except ValueError as exc:
        raise FedaPayError(f"Réponse FedaPay illisible : {res.text}") from exc


def create_transaction(
    *,
    amount: int,
    description: str,
    customer_email: str,
    customer_firstname: str,
    customer_lastname: str,
    callback_url: str,
    custom_metadata: dict | None = None,
) -> dict:
    """Crée une transaction FedaPay. `amount` est en FCFA (entier, sans décimales)."""
    payload = {
        "description": description,
        "amount": int(amount),
        "currency": {"iso": "XOF"},
        "callback_url": callback_url,
        "customer": {
            "firstname": customer_firstname or "Client",
            "lastname": customer_lastname or "Marketplace",
            "email": customer_email,
        },
    }
    if custom_metadata:
        payload["custom_metadata"] = custom_metadata

    data = _request("POST", "/transactions", json=payload)
    return _unwrap(data, "v1/transaction", "transaction")


def generate_token(transaction_id: int | str) -> dict:
    """Génère l'URL de paiement hébergée (checkout) pour une transaction créée."""
    data = _request("POST", f"/transactions/{transaction_id}/token")
    return _unwrap(data, "v1/token", "token")


def get_transaction(transaction_id: int | str) -> dict:
    """Relit le statut à jour d'une transaction (utile pour le polling)."""
    data = _request("GET", f"/transactions/{transaction_id}")
    return _unwrap(data, "v1/transaction", "transaction")
