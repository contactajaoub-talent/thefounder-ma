# Preloader fourni — intégration du 24 novembre 2026

Source : `TheFounder_Preloader_Code_2s.zip`, SHA-256 `727d3b3911d5e74c1e7b1a7eadbffa269dad652ead9c4f49088793358992d2f0`. `README_CODEX.md`, CSS, JavaScript et fragment d’installation du kit ont été lus avant intégration. Les instructions du kit ont été appliquées dans le cadre de la demande client ; la démonstration autonome n’a pas remplacé le site.

## Intégration

- Uniquement sur l’accueil, avant `.site-shell` ; aucune section marketing ajoutée ou remplacée. Les six sections et le CSS principal sont conservés.
- Trois PNG copiés octet pour octet, CSS et JS du kit dans `assets/preloader/`. Les cinq fichiers sont dans `scripts/site-files.mjs`, donc disponibles dans le serveur local, `dist/` et l’export statique Vercel.
- Séquence fournie : symbole à 80 ms, séparateur à 470 ms, nom à 590 ms, signature à 1 110 ms ; fermeture douce terminée à 2 000 ms. Aucun trait lumineux traversant le nom.
- Mobile : composition verticale et signature textuelle prévus par le kit. La signature PNG est masquée avec une règle de spécificité suffisante pour éviter son affichage simultané avec le texte mobile.
- Le PNG du symbole contient un fragment de signature dans son coin inférieur droit. Un masque CSS limité à ce coin retire ce fragment de l’affichage sans modifier le fichier ni rogner le F.
- La fermeture CSS de 120 ms en mouvement réduit utilise une priorité compatible avec la règle globale du site. Sans JavaScript, le preloader devient invisible et laisse les liens accessibles, y compris en mouvement réduit.
- Le JS reprend le minuteur fourni, supprime également l’élément à la fin de son animation CSS et réagit au changement de préférence de mouvement. Il émet un événement de fin pour démarrer les compteurs après l’overlay ; un secours indépendant permet leur fonctionnement si ce script ne charge pas.
- Aucune bibliothèque, donnée persistée, ressource tierce ou modification de CSP requise.

## Vérification

`npm.cmd test`, `npm.cmd run build`, `npm.cmd run preview`, `npm.cmd run test:preloader` et `npm.cmd run test:browser`.

Le test dédié contrôle la séquence réelle, les trois images, les dimensions à 320/375/768/1440/1920 px, la suppression après environ deux secondes, les liens après fermeture, l’absence sur les pages secondaires, le mouvement réduit initial/en cours, le fonctionnement sans JS et l’échec simulé du seul JS du preloader. Les tests unitaires verrouillent les empreintes des PNG fournis.

La Preview distante du commit poussé doit être contrôlée avec les mêmes scénarios et les ressources servies réellement. Les preuves/captures sont conservées hors de l’export du site.

## Publication

Ce composant ne lève pas les autres conditions de production. Ne pas activer les validations de `config/release.json` pour le publier. Conserver la PR #3 en brouillon et la production existante jusqu’à validation complète, conformément à la demande client.
