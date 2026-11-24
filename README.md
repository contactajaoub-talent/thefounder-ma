# TheFounder.ma — préparation de la production (PR #3)

Reprise du kit fourni et de la branche `refonte/thefounder-v2`, le 24 novembre 2026. L’accueil statique existant et son identité sont conservés. La production reste sur l’ancienne version tant que les validations ci-dessous manquent. Ne pas supprimer `archive/ancienne-version`.

## Prévisualiser

Node.js 24 LTS, comme le projet Vercel existant. Aucune dépendance nécessaire à l’exécution du site, au build ou aux tests statiques / HTTP. Les anciennes dépendances React et Vite ont déjà été retirées.

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

Arrêter le serveur de développement avant `npm run preview` si le port 4173 est déjà utilisé. Le build local et Vercel Preview produit `dist/` en mode **preview non indexable**. Sur Vercel Production (`VERCEL_ENV` ou `VERCEL_TARGET_ENV=production`), la commande habituelle exécute obligatoirement les protections de production. `--preview` ne peut pas les désactiver. Le serveur local reste toujours non indexable.

Pour des tests navigateur reproductibles sur un autre poste :

```sh
npm ci
npx playwright install chromium
npm run dev
# Dans un autre terminal :
npm run test:browser
```

Les dépendances Playwright et axe-core sont uniquement des dépendances de développement. Le script QA accepte `BASE_URL`, `BROWSER_EXECUTABLE`, `PLAYWRIGHT_MODULE_PATH`, `AXE_SOURCE_PATH` et `QA_OUTPUT_DIR`. Par défaut, les résultats sont dans `docs/qa/`. Pour une Preview protégée, utiliser le jeton OIDC temporaire du même projet via `vercel env run` ; le test l’envoie uniquement à l’origine contrôlée et n’enregistre aucune valeur de cookie ni de jeton. Ne pas désactiver la protection Vercel.

Les indicateurs de lien/action partagent le symbole `assets/icons/link.svg#arrow-up-right`, utilisé en SVG inline via `<use>`. Réutiliser le wrapper décoratif `.link-icon` et conserver `aria-hidden="true"` / `focusable="false"` ; aucune flèche de police ou emoji. `.card-link-icon` gère le petit emplacement supérieur des cartes, et les autres emplacements héritent de `currentColor`. Le test `test:link-icons` vérifie la résolution réelle du symbole, les dimensions mobiles/desktop, les couleurs, le focus et le clic tactile ; WebKit est également testé si son moteur est installé. Redémarrer le serveur après toute modification de la liste des ressources publiques.

## Contenu livré

Le [preloader fourni de deux secondes](docs/PRELOADER_INTEGRATION.md) est intégré uniquement à l’accueil. Ses trois images originales, CSS et JS sont dans `assets/preloader/`. `npm run test:preloader` vérifie sa séquence, sa fermeture et ses modes de secours dans le navigateur.

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

Le domaine canonique `https://thefounder.ma` et son rattachement au projet existant `thefounder-ma-pcwy` sont confirmés. Compléter les pages légales et la confidentialité et justifier les droits de marque. L’autorisation de fusion/publication donnée dans la demande est conditionnelle à la validation complète : tant que ces conditions manquent, conserver la PR #3 en brouillon et ne pas fusionner. Consulter [TODO_CLIENT](TODO_CLIENT.md), [la checklist](CHECKLIST-LANCEMENT.md) et [le contrôle de production](docs/VALIDATION_PRODUCTION_PR3.md).

`config/release.json` reflète maintenant l’accord explicite de publication, l’identification complète de l’éditeur et la présentation textuelle des neuf technologies contrôlée dans le navigateur. `privacyApproved` reste `false` : le client confirme qu’aucune démarche CNDP n’a encore été faite. Voir [les preuves de validation](docs/VALIDATIONS_CLIENT_ET_RELEASE.md) et [le dossier restant](docs/CNDP_AVANT_PUBLICATION.md). `npm run build:production` échoue tant qu’une validation manque ou que les pages légales contiennent `TODO_CLIENT`. Un test positif utilise exclusivement une fixture jetable avec `example.invalid`, sans autorisation réelle. Le build autorisé produira canonical, OG absolus, WebSite JSON-LD avec empreinte CSP, robots et sitemap ; il ne déploie rien.

`vercel.json` surcharge l’ancien preset Vite uniquement pour ce code : framework statique, `npm ci --omit=dev --ignore-scripts`, `npm run build`, export `dist/`. Le build copie uniquement les pages et ressources autorisées dans `.vercel/output/static` et génère les routes/en-têtes effectifs via [Build Output API v3](https://vercel.com/docs/build-output-api). Le fichier portable `dist/_headers` n’est pas interprété par Vercel. Le manifeste et `_headers` ne font pas partie du site servi ; docs, configuration, sources internes et modèles commerciaux n’y sont jamais copiés. Les deux sorties sont nettoyées à chaque build réussi, sans suivre de lien symbolique. Les routes absentes et `/404.html` répondent 404. Aucun catch-all vers l’accueil.

Le site reste entièrement modifiable en HTML/CSS/JS. Aucun nouveau dépôt/projet, changement DNS, facturation ou affaiblissement des protections n’est nécessaire. Après validation réelle seulement : rerun tests et build Production, pousser, contrôler le SHA exact de la PR, passer Ready, fusionner sans supprimer la sauvegarde puis vérifier le déploiement Production et ses URL. Ne jamais promouvoir une Preview non indexable.
