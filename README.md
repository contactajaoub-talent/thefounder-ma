# TheFounder.ma — version locale à valider

Reprise du kit fourni, version 0.2.0 du 24 novembre 2026. L’accueil statique existant a été conservé et finalisé ; aucun changement de framework. **Aucune publication effectuée.**

## Prévisualiser

Node.js 20 ou plus récent. Aucune dépendance nécessaire à l’exécution du site, au build ou aux tests statiques / HTTP.

```sh
npm run dev
```

Ouvrir `http://127.0.0.1:4173`. Le serveur écoute uniquement l’ordinateur local. Les pages et ressources publiques sont servies par liste explicite ; documents internes, références, configuration et modèles commerciaux restent hors du serveur.

## Vérifier et préparer le dossier statique

```sh
npm test
npm run build
npm run preview
```

Arrêter le serveur de développement avant `npm run preview` si le port 4173 est déjà utilisé. Le build par défaut produit `dist/` en mode **preview non indexable**. Ne pas envoyer tout le projet à un hébergeur : seul `dist/` contient les fichiers prévus pour l’affichage.

Pour des tests navigateur reproductibles sur un autre poste :

```sh
npm ci
npx playwright install chromium
npm run dev
# Dans un autre terminal :
npm run test:browser
```

Les dépendances Playwright et axe-core sont uniquement des dépendances de développement. Le script QA accepte `BASE_URL`, `BROWSER_EXECUTABLE`, `PLAYWRIGHT_MODULE_PATH` et `AXE_SOURCE_PATH` pour réutiliser un navigateur / runtime installé. Les résultats et captures sont dans `docs/qa/`.

## Contenu livré

- `index.html` : six sections, structure et identité d’origine conservées.
- `solutions.html`, `realisations.html`, `fondateur.html`, `methode.html`, `contact.html` : pages secondaires réelles, sans fausse référence ni biographie inventée.
- `mentions-legales.html`, `confidentialite.html` : notices de revue avec informations confirmées et TODO_CLIENT explicites.
- `404.html` : page d’erreur navigable, servie avec le statut HTTP 404 pour les adresses absentes.
- `assets/site.css`, `assets/site.js`, logos et images locales optimisées ; originaux de marque conservés.
- `scripts/` : serveur local, liste des fichiers publics, build statique et en-têtes de sécurité.
- `business/` : catalogue, modèles de devis / facture non émis, processus client et mini-CRM sans prospects.
- `TODO_CLIENT.md`, `CHECKLIST-LANCEMENT.md`, `RAPPORT_FINAL.md` : validations manquantes, lancement et compte rendu.
- `docs/SOURCES_STATISTIQUES.md`, `docs/LOGOS_ET_DROITS.md`, `docs/SOURCES_JURIDIQUES.md` : preuves et réserves.
- `references/` et les deux documents initiaux : contexte fourni, conservé ; l’audit initial décrit l’état avant reprise.

## Publication : validation préalable obligatoire

Le domaine est une cible envisagée ; sa propriété, son origine canonique HTTPS et l’hébergement ne sont pas confirmés. Compléter d’abord les pages légales et la confidentialité, valider les droits de marque et obtenir l’accord explicite de publication. Consulter [TODO_CLIENT](TODO_CLIENT.md) et la [checklist](CHECKLIST-LANCEMENT.md).

`config/release.json` conserve toutes les autorisations à `false` et `siteOrigin` à `null`. `npm run build:production` échoue volontairement tant que ces validations manquent ou que les pages légales contiennent encore `TODO_CLIENT`. Il ne déploie rien, même une fois autorisé : il génère seulement les fichiers locaux, les canonical, OG absolus, WebSite JSON-LD, robots et sitemap.

Le fichier `_headers` doit être pris en charge ou traduit dans la configuration de l’hébergeur choisi. Configurer une vraie 404 et vérifier HTTPS / redirections. `noindex` n’est pas un contrôle d’accès : tout preview distant contenant des données internes doit aussi être protégé par l’hébergeur.

Seul le contact `contactajaoub@gmail.com` est confirmé. Aucun paiement, envoi de message, modification DNS ou déploiement n’a été effectué.
