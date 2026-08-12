# Roadmap — Marketplace Beauté, application mobile (2 semaines)

⚠️ Changement de cap : le projet passe d'un site web à une **application mobile**
(React Native + Expo). Le backend Django reste **inchangé** — une API JSON ne
sait pas si elle parle à un site web ou une appli mobile, donc tout le travail
déjà fait côté `catalog/`, `orders/`, `users/` reste valable tel quel.

Répartition toujours par verticale complète :
- **Toi → Espace Vendeur** (écrans mobiles + endpoints Django `catalog/`)
- **Gloria → Espace Acheteur** (écrans mobiles + endpoints Django `orders/`)

## Jour 0 — Socle commun (déjà fait pour la partie back, à refaire pour le mobile)

- [x] Backend Django (déjà fonctionnel, aucun changement nécessaire)
- [ ] Setup du projet Expo (déjà généré ✅ dans `mobile/`)
- [ ] Chacun configure `lib/api.ts` avec l'IP locale de la machine qui fait tourner Django
- [ ] Vérifier que le téléphone de chacun est sur le même Wi-Fi que son PC
- [ ] Django lancé avec `python manage.py runserver 0.0.0.0:8000` (pas juste `runserver`)

## Semaine 1

### Toi — Vendeur
- Jour 1-2 : écran `/vendeur` (liste mes annonces, déjà scaffoldé ✅) connecté à l'API
- Jour 3-4 : écran `/vendeur/nouveau` (déjà scaffoldé ✅ avec upload photo) testé sur téléphone réel
- Jour 5 : écran `/vendeur/[id]` (modifier une annonce, déjà scaffoldé ✅) + suppression

### Gloria — Acheteur
- Jour 1-2 : écran catalogue (liste produits + filtres par catégorie)
- Jour 3-4 : écran détail produit + panier (state local pour l'instant)
- Jour 5 : lancement du paiement Stripe Checkout (ouverture dans le navigateur du téléphone via un lien, ou WebView)

**Fin de semaine 1 — test croisé** : toi tu crées un produit depuis ton téléphone, Gloria doit le voir apparaître dans son catalogue sur le sien.

## Semaine 2

### Toi — Vendeur
- Jour 6-7 : vérifier que le stock se décrémente bien après une vente
- Jour 8 : écran "commandes reçues" (liste simple)
- Jour 9-10 : gestion des erreurs (permissions refusées, réseau indisponible), finitions visuelles

### Gloria — Acheteur
- Jour 6-7 : confirmation du paiement (webhook Stripe déjà scaffoldé côté back ✅)
- Jour 8 : écran "mes commandes"
- Jour 9-10 : gestion des erreurs, finitions visuelles

### Ensemble — Jour 10
- [ ] Build de démo (Expo permet de tester sans publier sur les stores — pas besoin de passer par Google Play/App Store pour la soutenance)
- [ ] Jeu de données de démo
- [ ] Répétition : chacun montre son appli sur son téléphone (ou un émulateur projeté)

## Ce qu'on ne fait PAS si le temps manque

- Publication réelle sur les stores (Google Play / App Store) — hors scope pour un stage de 2 semaines, teste juste via Expo Go
- Notifications push
- Mode hors-ligne

## Répartition en un coup d'œil

| | Toi (Vendeur) | Gloria (Acheteur) |
|---|---|---|
| Back Django | `catalog/` (inchangé) | `orders/` (inchangé) |
| Mobile (Expo) | `app/vendeur/*` | écrans catalogue/panier à créer |
| Commun | `app/login.tsx`, `app/register.tsx`, `lib/api.ts` (déjà scaffoldés ✅) | |

## Point de vigilance spécifique au mobile

- **L'IP locale change parfois** (redémarrage du routeur, changement de réseau) — si l'appli n'arrive plus à parler à l'API, vérifie d'abord `API_URL` dans `lib/api.ts`
- Le téléphone de test et le PC doivent être sur le **même réseau Wi-Fi**, sinon aucune requête ne passera
