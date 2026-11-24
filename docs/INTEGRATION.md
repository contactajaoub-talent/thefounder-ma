# Intégration GitHub et Vercel — 24 novembre 2026

## Sauvegarde et périmètre

Ancienne version React 18/Vite 6 au commit `484ca41ca6fb01a21713bebb6ee5d6a91d9d06d3` : sauvegarde complète de l’historique dans un bundle local et branche distante `backup/react-vite-2026-11-24`. La refonte est isolée sur `refonte/ia-automatisation-2026-11-24`. Aucune fusion sur `main`.

Projet Vercel vérifié : `thefounder-ma-pcwy`, ID `prj_bH2YoKUVDqx8EzdJeFtZrv6g1qk5`, équipe `contactajaoub-8754s-projects`. Racine `.` ; Node.js 24.x ; dépôt `contactajaoub-talent/thefounder-ma` ; branche de production `main`. Les réglages globaux et les domaines ne sont pas modifiés.

Production de référence lors de l’inspection : déploiement `dpl_3R8x8tsHngEiN4tZUTfMvU58k3xF`, domaines `thefounder.ma` et `www.thefounder.ma`. Le Preview garde la protection Vercel préexistante.

## Adaptation

- Reprise des pages HTML, CSS, JS, logos et contenus de la version finalisée ; aucune conversion supplémentaire en React.
- Retrait des anciens fichiers `src/App.jsx`, `src/main.jsx`, `vite.config.js` et des anciennes ressources SEO de `public/`.
- Retrait de React, React DOM, Vite et du plugin React du manifeste et du lockfile. Les seules dépendances conservées servent aux tests : Playwright et axe-core.
- Les anciens parcours Salesforce Web-to-Lead, calendrier et inclusions de suivi ne sont pas repris. Les CTA ouvrent directement la messagerie de contact validée.
- Configuration de déploiement dans `vercel.json` : preset statique, sortie `dist/`, installation sans dépendances de développement, en-têtes de sécurité et non-indexation, pas de réécriture SPA.
- Garde de build refusant la production, `main` et une mauvaise cible de projet. Les validations de publication demeurent à `false`.
- `.vercelignore` limite l’envoi CLI aux sources de build nécessaires ; les fichiers internes ne se retrouvent pas dans `dist/`.

## Validation prévue pour la livraison

Tests Node et HTTP, garde Preview, compilation statique, 54 contrôles de pages responsive et 18 audits axe-core ; validation du Preview distant une fois READY. Les résultats et captures sont fournis dans le rapport de livraison, sans jeton ni état d’authentification.

Les statistiques restent documentées dans `SOURCES_STATISTIQUES.md`, notamment les économies Capgemini réalisées **ou attendues**. Les limites de marque, de confidentialité et d’identification légale sont conservées dans `LOGOS_ET_DROITS.md`, `SOURCES_JURIDIQUES.md` et `../TODO_CLIENT.md`.

## Maintenance

Les pages HTML et les fichiers de `assets/` sont les sources éditables. `dist/` est régénéré, jamais la seule copie du site. Le code est indépendant d’un éditeur visuel propriétaire et ne nécessite pas de dépendance d’exécution.

Pour revenir à l’ancien code sans publier : consulter ou extraire la branche de sauvegarde. Restaurer la production ou fusionner une branche exigerait une autorisation distincte. La refonte ne change ni le DNS, ni les variables d’environnement, ni les paramètres de protection du projet.
