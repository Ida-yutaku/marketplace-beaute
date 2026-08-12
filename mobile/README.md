# Application mobile — Marketplace Beauté (React Native + Expo)

## Installation

```bash
cd mobile
npm install
```

## Avant de lancer : configure l'adresse de l'API

Ouvre `lib/api.ts` et remplace l'IP dans `API_URL` par l'adresse IP locale de
ton ordinateur (celui qui fait tourner Django) :

```bash
# Trouver ton IP locale
ipconfig          # Windows : cherche "Adresse IPv4"
ifconfig          # Mac/Linux
ip a              # Linux (alternative)
```

Exemple : si ton IP est `192.168.1.42`, alors :
```ts
const API_URL = "http://192.168.1.42:8000/api";
```

⚠️ "localhost" ne fonctionne PAS depuis un téléphone — ça pointerait vers le
téléphone lui-même, pas vers ton PC.

## Lancer l'appli

1. Assure-toi que le backend Django tourne (`python manage.py runserver 0.0.0.0:8000`
   — le `0.0.0.0` est important pour accepter les connexions depuis ton téléphone,
   pas juste depuis l'ordinateur)
2. Installe l'app **Expo Go** sur ton téléphone (Play Store / App Store)
3. Lance :
```bash
npm start
```
4. Scanne le QR code affiché dans le terminal avec l'app Expo Go (Android : scanner
   intégré à Expo Go ; iOS : appareil photo natif)
5. Ton téléphone ET ton ordinateur doivent être sur le **même réseau Wi-Fi**

## Écrans disponibles (partie vendeur)

- `/` — accueil, redirige selon connexion
- `/login`, `/register` — authentification
- `/vendeur` — liste "mes annonces" (glisser vers le bas pour rafraîchir)
- `/vendeur/nouveau` — créer une annonce (avec photo)
- `/vendeur/[id]` — modifier une annonce (avec photo)

## Notes techniques

- Le token JWT est stocké avec `AsyncStorage` (équivalent mobile du localStorage web)
- L'upload de photo utilise `expo-image-picker` (accès à la galerie du téléphone)
- La navigation utilise `expo-router` — même logique de "dossier = écran" que Next.js
