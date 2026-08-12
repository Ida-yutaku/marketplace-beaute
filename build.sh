#!/usr/bin/env bash
# exit on error
set -o errexit

# Se déplacer dans le dossier du backend Django
cd backend

# Installer les dépendances
pip install -r requirements.txt

# Collecter les fichiers statiques et faire les migrations
python manage.py collectstatic --no-input
python manage.py migrate