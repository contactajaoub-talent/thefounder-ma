# Préparation de la production — PR #3

Revue du 24 novembre 2026 sur `refonte/thefounder-v2`, à partir de `8cc8e4facebfed03e0468399eab105ae1e074492`. La demande autorise une fusion et une publication **seulement après validation complète**. Cette condition n’est pas remplie. Conserver la PR en brouillon ; ne pas fusionner ni promouvoir la Preview.

## Infrastructure inspectée

- Dépôt et projet existants : `contactajaoub-talent/thefounder-ma`, `thefounder-ma-pcwy`.
- Production : `main`, commit `484ca41ca6fb01a21713bebb6ee5d6a91d9d06d3` ; sauvegarde `archive/ancienne-version` au même commit.
- Origine confirmée : `https://thefounder.ma`. Les deux domaines `thefounder.ma` et `www.thefounder.ma` sont vérifiés dans Vercel.
- Réglages globaux historiques : preset Vite, Node 24.x, racine du dépôt, pas de surcharge build/output/install. Ils n’ont pas été modifiés. La configuration du nouveau site est versionnée dans `vercel.json` et s’applique à ses déploiements.
- Protection Preview conservée (`all_except_custom_domains`). Aucun changement de DNS, de facturation, de secret ni de variable d’environnement persistante.

## Corrections

1. Le build habituel reconnaît Vercel Production, applique les validations réelles et ne peut pas être forcé en Preview. Les quatre autorisations sont vérifiées avec `=== true` ; une chaîne `"true"` est refusée. L’origine confirmée est renseignée ; aucune autorisation n’a été activée.
2. `dist/` est l’export statique. Un adaptateur [Build Output API v3](https://vercel.com/docs/build-output-api) copie uniquement les fichiers publics dans `.vercel/output/static` et fournit les en-têtes effectifs à Vercel. `_headers` n’y suffit pas à lui seul et n’est pas servi au public, de même que le manifeste.
3. Les sorties sont nettoyées avant écriture après validation des entrées ; chemins limités au dépôt, liens symboliques refusés. Aucun fichier interne ou ancien reliquat n’entre dans l’export Vercel.
4. CSP restrictive, `nosniff`, anti-framing, politique de référent et permissions ; HSTS en Production. La CSP autorise uniquement l’empreinte du JSON-LD généré. Les erreurs et `/404.html` répondent avec un vrai statut 404 et restent non indexables.
5. En Production validée : canonical et OG absolus, huit URL HTTPS dans le sitemap, robots ouvert, `index, follow` sur les pages publiques. Preview : robots fermé, sitemap vide, méta/en-tête `noindex`. Le serveur de revue local reste volontairement non indexable.
6. Hébergement Vercel et coordonnées de correspondance publiées par ses [conditions officielles](https://vercel.com/legal/terms) ajoutés aux mentions ; hébergement et messagerie réellement connus précisés dans la confidentialité. Aucune identité de l’éditeur ni durée de conservation n’a été inventée.
7. UI, textes commerciaux, six sections, navigation, logos, CSS, JS et animations conservés. Aucune dépendance React/Vite à réintroduire : le site statique ne nécessite aucune dépendance runtime. Playwright et axe-core sont uniquement destinés aux tests.

## Contrôles locaux

- `npm.cmd test` : 12 tests réussis, dont production positive sur fixture jetable `example.invalid`, blocages légaux, refus d’une fausse validation, détection du mode Production Vercel, cohérence CSP/JSON-LD, sitemap et nettoyage des fichiers périmés.
- Navigateur Chrome : 54 contrôles de pages à six largeurs (320–1920 px), neuf pages ; 18 audits axe, aucune violation détectée. Menu mobile et clavier, focus, CTA mailto sans envoi, navigation sans JS, compteurs et mouvement réduit, grille 3 × 3, couleurs au survol/focus et tactile vérifiés.
- Les quatre statistiques restent attribuées à des études externes avec population et limites ; revue des sources QJE, MIT/Science, Capgemini (figure 16 : réalisé **ou attendu**) et INFORMS. Voir `SOURCES_STATISTIQUES.md`.
- `npm.cmd run build:production` réel doit rester en échec tant que les conditions suivantes manquent. Le succès de la fixture ne valide pas le site juridiquement.
- Preview du correctif `9809a8f8f83ff41d794b94a2c52d9197ffbd242c` : Ready et contrôle GitHub Vercel réussi ; configuration effective statique, `dist/`, Node 24.x. Navigateur distant : 54 contrôles et 18 audits sans violation détectée ; 29 vérifications HTTP réussies (en-têtes, vraie 404, ressources, robots, sitemap, fichiers internes absents). L’accès anonyme redirige vers `vercel.com/sso-api` ; protection conservée. Cette preuve concerne la Preview, pas une nouvelle Production.
- `npm audit` : aucune vulnérabilité signalée dans le verrou courant. Comparaison Git : 22 fichiers d’interface et ressources identiques à la version validée, hors notices légales mises à jour. Recherche par motifs connus dans 54 fichiers texte suivis : aucun motif de secret détecté ; ce contrôle n’est pas une garantie exhaustive.

## TODO_CLIENT bloquants

- Identité, statut, activité, responsables, ICE/IF/TP et adresse exacte confirmée AV MED V, 11102 Rabat, Maroc intégrés aux mentions : validation d’identification acquise.
- Neuf noms textuels stylisés autorisés par le client, anciens visuels retirés du rendu/export/code courant, grille 3 × 3 et interactions contrôlées : validation de présentation acquise.
- Accord explicite de publication réitéré et enregistré : aucun nouvel accord de publication à demander.
- **Seul dossier restant : confidentialité.** Le client confirme qu’aucune démarche CNDP n’a encore été faite. Vérifier/régulariser les formalités et transferts applicables, documenter les modalités réelles de conservation/destinataires, puis finaliser la notice. `privacyApproved=false`. Voir `CNDP_AVANT_PUBLICATION.md` et `VALIDATIONS_CLIENT_ET_RELEASE.md`.

Après réception des preuves : compléter les notices, documenter les validations, puis seulement refléter leur état dans `config/release.json`. Exécuter les tests et le build Production, vérifier le dossier et les contrôles au SHA exact, passer Ready et fusionner selon l’autorisation conditionnelle existante. Ne pas supprimer la sauvegarde. Vérifier ensuite HTTPS, redirections, huit pages indexables, vraie 404 et absence de fichiers internes sur la Production réellement déployée. Ne jamais promouvoir directement cette Preview non indexable.
