# Rapport de finalisation — TheFounder.ma

Version 0.2.0, revue du 24 novembre 2026. **Prête pour validation locale ; non publiée.**

## Réalisé

- Lecture des quatre documents du kit et inspection du prototype original, des références et de l’identité approuvée. Reprise du HTML existant sans migration de framework.
- Logo, palette blanc/noir/violet #7357FF/lavande, typographie de l’existant et ordre des six sections conservés. Les trois images d’identité originales ont des SHA-256 identiques à ceux de l’archive fournie.
- Hero et CTA conservés, diagnostic gratuit explicité, navigation mobile réparée, modale supprimée, animations bornées et réduction du mouvement prise en charge. Correction de l’alignement des CTA et des contrastes de texte secondaires.
- Neuf logos SVG locaux en grille 3 × 3 sur toutes les largeurs testées, gris au repos et couleurs authentiques au survol/focus ; couleurs directement sur tactile. Minimum Make de 96 px contrôlé. Huit sources officielles ; **Codex distribué par LobeHub**, exception détaillée dans les droits.
- Pages Solutions, Réalisations, Fondateur, Méthode, Contact, Mentions légales, Confidentialité et 404. Aucun cas client ou fait biographique non étayé. Pages juridiques de revue avec TODO_CLIENT, sans coordonnées fictives.
- CTA directs vers l’e-mail confirmé, avec l’objet demandé ; contact copiable si le navigateur n’a pas de messagerie configurée.
- Statistiques vérifiées et contextualisées. **Capgemini corrigé : économies réalisées ou attendues dans de grands groupes**, pas seulement économies observées. La date 2026 de l’article final Harvard/BCG a été confirmée. Détails et liens : [sources statistiques](docs/SOURCES_STATISTIQUES.md).
- Métadonnées uniques, favicon léger et image OG locale. Build préparant canonical, OG absolus, WebSite JSON-LD, robots et sitemap après confirmation de l’origine et des validations ; prévisualisation actuellement non indexable.
- CSP restrictive et en-têtes de sécurité, vraies réponses HTTP 404, restrictions de méthodes et liste explicite des fichiers servis. Aucun formulaire, traceur, cookie ou stockage navigateur dans le code livré. Aucun secret détecté par les motifs de contrôle sur les fichiers actifs ; cela ne constitue pas un audit d’intrusion.
- CSS/JS extraits en ressources locales partagées. Build statique de **219 661 octets, 28 fichiers**, sans les références lourdes ni les documents internes.
- Catalogue, modèles de devis et facture non émis, processus client, diagnostic, CRM de 16 en-têtes sans prospects et checklist de lancement détaillée.

## Testé

| Vérification | Résultat et périmètre |
| --- | --- |
| Tests Node | **12/12 réussis** : structure, liens et fragments, CTA, ressources, metadata, build, HTTP, protections et documents attendus |
| Build preview | Réussi ; dossier `dist/` non indexable |
| Génération SEO production | Test positif et retour au preview sur une fixture temporaire isolée avec domaine `example.invalid` ; configuration réelle laissée à `false` / `null`. Aucun déploiement. Blocage des TODO légaux également testé. |
| Navigateur réel | Chromium / Chrome installé ; **54 contrôles** des neuf pages à 320/375/768/1024/1440/1920 px, sans débordement horizontal ni image cassée |
| Parcours | Menu au clavier et mobile, Échap et retour du focus, fermeture sur ancre, navigation vers une offre, lien Réalisations, vraie 404, affichage sans JavaScript |
| CTA e-mail | Clic et URI contrôlés avec interception de test avant ouverture de la messagerie ; aucun message envoyé |
| Compteurs | Valeur intermédiaire, fin en ~1,3 s, décimale française, absence de redémarrage et mouvement réduit |
| Grille et logos | 3 colonnes × 3 lignes aux six largeurs ; fichiers chargés ; survol, focus et tactile ; Make ≥ 96 px |
| Accessibilité automatisée | **18 audits axe-core**, aucune violation détectée sur les règles WCAG 2.x A/AA prises en charge. Les fonds dégradés/pseudo-éléments restent signalés en contrôle manuel pour le contraste. Ce résultat n’est pas une certification WCAG. |
| Contrastes complémentaires | **18 vues** à 375/1440 px, 852 fragments de texte examinés par échantillonnage des fonds : aucun écart restant après deux corrections. Logos exclus de ce calcul. Revue visuelle des captures effectuée. |
| Console | **0 erreur JavaScript/CSP observée** lors du dernier parcours complet sur le build `dist/` |
| Liens externes | 14 liens contrôlés : 11 réponses HTTP réussies ; 3 accès refusés aux requêtes automatisées (Claude, QJE et INFORMS). Les publications QJE/INFORMS ont pu être consultées via l’outil web. Leur ouverture sur le navigateur du client reste à recontrôler. |
| Dépendances | Pas de dépendance d’exécution. Playwright/axe-core verrouillés pour les tests ; audit npm lors de la création du lockfile : 0 vulnérabilité signalée sur les 4 paquets audités. |

Commandes exécutées : `npm test`, `npm run build`, `npm run dev`, `npm run preview`, `npm run test:browser`, `node --check` sur les scripts actifs et `npm install --package-lock-only --ignore-scripts`. Playwright et les outils d’image ont été réutilisés depuis le runtime fourni. Les preuves sont dans [docs/qa](docs/qa/).

## Restant à valider

1. Identité légale, statut, adresse, responsable de publication et identifiants effectivement applicables ; revue des mentions et modèles par un conseiller compétent.
2. Domaine canonique, propriété/autorisation d’usage, hébergeur et conditions réelles des traitements : journaux, messagerie, conservations, destinataires, transferts et formalités CNDP.
3. Droits d’usage des marques, dont Claude et le gris au repos ; provenance / SVG Codex officiel ou validation de la variante distribuée. [Détail des droits](docs/LOGOS_ET_DROITS.md).
4. Validation graphique et éditoriale de la version ; preuves autorisées avant ajout de réalisations ou d’une biographie détaillée.
5. Vérification sur appareils physiques Safari iOS / Chrome Android, lecteurs d’écran et zoom renforcé ; ouverture réelle de la messagerie. Seul Chromium est couvert par les tests livrés.
6. Mesures Lighthouse / Core Web Vitals, compression, HTTPS, redirections, vraie 404 et en-têtes sur l’hébergement retenu. Les timings localhost ne permettent pas de conclure à des scores publics.
7. Conditions commerciales, fiscalité, acompte éventuel de 50 % et moyen d’encaissement avant émission de documents réels ; autorisation séparée de tout message de prospection.

## Bloqué avant publication

**Aucune anomalie technique bloquante n’a été observée dans le périmètre local testé.** La publication reste bloquée par les informations juridiques, confidentialité, droits de marque et domaine manquants, ainsi que par l’absence d’autorisation explicite. Ces points sont détaillés dans [TODO_CLIENT](TODO_CLIENT.md) et la [checklist](CHECKLIST-LANCEMENT.md).

La configuration réelle de publication est restée inactive. Aucun site, compte GitHub/Vercel, DNS, message, contrat ou paiement n’a été créé ou modifié à l’extérieur.

## Examiner la version

Preview local du build lancé pour cette revue : [http://127.0.0.1:4175/](http://127.0.0.1:4175/). S’il a été arrêté, lancer `npm run build`, puis `npm run preview` depuis le dossier du projet ; port par défaut 4173.

- [Comparatif desktop avant/après](docs/qa/comparatif-desktop.png)
- [Comparatif mobile avant/après](docs/qa/comparatif-mobile.png)
- [Accueil desktop complet](docs/qa/accueil-desktop.png)
- [Accueil mobile complet](docs/qa/accueil-mobile.png)
- [Grille mobile](docs/qa/technologies-mobile.png)
- [Résultats navigateur](docs/qa/browser-results.json), [contrastes](docs/qa/contrast-pixel-review.json), [liens externes](docs/qa/external-links.json), [intégrité et inventaire des modifications](docs/qa/integrity.json)

## Fichiers créés / modifiés

Modifiés : `docs/AUDIT_ET_RESTANT.md`, `index.html`, `package.json`, `README.md`, `scripts/dev-server.mjs`, `tests/homepage.test.mjs`.

Créés, hors captures et build : `RAPPORT_FINAL.md`, `404.html`, `assets/apple-touch-icon.png`, `assets/brand-mark.png`, `assets/favicon-32.png`, `assets/logos/claude.svg`, `assets/logos/codex.svg`, `assets/logos/docker.svg`, `assets/logos/github.svg`, `assets/logos/make.svg`, `assets/logos/n8n.svg`, `assets/logos/nextjs.svg`, `assets/logos/supabase.svg`, `assets/logos/vercel.svg`, `assets/og-thefounder.png`, `assets/site.css`, `assets/site.js`, `business/catalogue-services.md`, `business/crm-prospection.csv`, `business/modele-devis.md`, `business/modele-facture.md`, `business/process-client.md`, `CHECKLIST-LANCEMENT.md`, `confidentialite.html`, `config/release.json`, `contact.html`, `docs/LOGOS_ET_DROITS.md`, `docs/SOURCES_JURIDIQUES.md`, `docs/SOURCES_STATISTIQUES.md`, `fondateur.html`, `mentions-legales.html`, `methode.html`, `package-lock.json`, `realisations.html`, `robots.txt`, `scripts/build.mjs`, `scripts/site-files.mjs`, `solutions.html`, `tests/browser.mjs`, `tests/server.test.mjs`, `tests/site.test.mjs`, `TODO_CLIENT.md`.
