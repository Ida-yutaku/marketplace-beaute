#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Créer un superutilisateur automatiquement s'il n'existe pas
python manage.py shell -c "
from users.models import User;
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'AdminPass123!')
    print('Superuser créé avec succès !')
"