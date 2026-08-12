# Backend — Marketplace Beauté (Django)

## Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API disponible sur http://localhost:8000/api/
Admin sur http://localhost:8000/admin/

## Endpoints principaux
- POST /api/auth/register/
- POST /api/auth/login/
- GET  /api/auth/me/
- GET  /api/categories/
- GET/POST /api/products/  (?category__slug=..., ?search=..., ?mine=true)
- GET/PATCH/DELETE /api/products/{id}/
- POST /api/orders/checkout/
- GET  /api/orders/mine/
- POST /api/stripe/webhook/

## Stripe en local
```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook/
```
Copie la clé `whsec_...` affichée dans ton `.env` (STRIPE_WEBHOOK_SECRET).
