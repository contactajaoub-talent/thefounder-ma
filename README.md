# TheFounder.ma — refonte IA, automatisation et logiciels métier

Refonte du dépôt React/Vite à partir du site statique finalisé, version 1.1.0 du 24 novembre 2026. Le nouveau site conserve le logo validé, les six sections, les animations et les contenus français. **Cette branche est autorisée uniquement pour un Preview Vercel ; aucune mise en production.**

L’ancienne version reste disponible sur `backup/react-vite-2026-11-24`, au commit `484ca41ca6fb01a21713bebb6ee5d6a91d9d06d3`, avec son historique. `main` n’est pas modifiée.

## Prévisualiser

Node.js 24 (version du projet Vercel existant et de `.nvmrc`). Aucune dépendance nécessaire à l’exécution du site, au build ou aux tests statiques / HTTP.

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
- `TODO_CLIENT.md`, `CHECKLIST-LANCEMENT.md`, `docs/INTEGRATION.md` : validations manquantes, lancement et compte rendu.
- `docs/SOURCES_STATISTIQUES.md`, `docs/LOGOS_ET_DROITS.md`, `docs/SOURCES_JURIDIQUES.md` : preuves et réserves.
- `references/` et les deux documents initiaux : contexte fourni, conservé ; l’audit initial décrit l’état avant reprise.

## Intégration Vercel : Preview uniquement

Projet existant : `thefounder-ma-pcwy`, équipe `contactajaoub-8754s-projects`. Le dépôt associé est `contactajaoub-talent/thefounder-ma` et la branche de production est `main`. Le domaine `thefounder.ma` et sa variante `www` restent affectés à l’ancienne production.

Le fichier `vercel.json` remplace le preset Vite **pour cette version du code**, avec le framework statique, `npm run build:vercel` et la sortie `dist/`. Il ne modifie pas les paramètres globaux du projet. La commande `npm ci --omit=dev --ignore-scripts` n’installe aucune ancienne dépendance d’exécution.

`scripts/vercel-build.mjs` refuse tout environnement autre que `preview`, une cible de projet inattendue et la branche `main`. Le serveur Vercel conserve sa protection d’accès ; aucun secret ou paramètre sensible n’a besoin d’être changé. Les règles HTTP de sécurité sont dans `vercel.json`, car Vercel ne traite pas automatiquement le fichier `_headers` de l’hébergement statique générique.

Les pages HTML gardent leurs extensions, sans fallback SPA : une adresse inconnue doit renvoyer la vraie page 404 avec statut 404. Les preuves navigateur sont générées dans `docs/qa/` et ne sont pas versionnées.

## Évolutions futures et publication

Modifier directement les pages `*.html`, le style dans `assets/site.css`, les interactions dans `assets/site.js` et les ressources locales dans `assets/`. Ajouter une page exige de l’ajouter à `scripts/site-files.mjs` et de vérifier ses liens. Aucune plateforme fermée ni fichier compilé n’est la source du site.

`config/release.json` conserve toutes les autorisations à `false` ; l’origine `https://thefounder.ma` est confirmée par l’infrastructure inspectée. `npm run build:production` reste bloqué tant que les validations et pages légales ne sont pas complètes. Cette commande ne déploie rien. Le garde Preview de Vercel devra aussi être revu explicitement après accord pour une future publication.

Les validations juridiques, confidentialité et droits de marque sont détaillées dans [TODO_CLIENT](TODO_CLIENT.md). `noindex` ne remplace pas la protection Vercel du Preview.

Contact confirmé : `contactajaoub@gmail.com`. Aucun paiement, envoi de message ou changement DNS n’est inclus dans cette intégration.
