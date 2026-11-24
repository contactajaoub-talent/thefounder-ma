# Audit préliminaire — 24 novembre 2026

> Historique du kit avant reprise. Pour l’état après finalisation, lire `../RAPPORT_FINAL.md`, `../TODO_CLIENT.md` et `../CHECKLIST-LANCEMENT.md`. Les défauts techniques décrits ci-dessous (modale, pages absentes, wordmarks) ont été traités ; les informations légales et autorisations non fournies restent à confirmer.

## Vérifié en inspectant les fichiers
- Fichier original complet des sections 1–4 présent et copié en `references/Original_Sections_01_04.html`.
- Le Hero et le titre retenu sont bien dans le HTML; quatre indicateurs animés avec liens vers études également.
- Section 03 : 4 offres, section 04 : 4 étapes.
- Section 05 ajoutée à `index.html` comme base HTML/CSS (wordmarks provisoires, pas de logos SVG officiels).
- Section 06 ajoutée à `index.html`; CTA Hero et Contact modifiés vers `mailto:contactajaoub@gmail.com`.
- Le code possède encore des liens vers `solutions.html`, `realisations.html`, `fondateur.html` et un script interceptant leurs clics par une modale « page en préparation » : **NON FINALISÉ**.
- Aucune publication Vercel ni configuration DNS/domaines n'a été vérifiée dans le cadre de ce kit.

## À finir avant mise en ligne
1. Pages secondaires réellement fonctionnelles, liens internes, menu mobile, navigation clavier, ancres.
2. Section 05 : véritables logos, chargement local, alternance gris/couleur, touch et focus, responsive 3×3.
3. Validation étude par étude de chacune des 4 stats : source, échantillon, périmètre, valeur et formulation. Si une source ne soutient pas le chiffre, corriger ou supprimer.
4. Pages Mentions légales et Confidentialité : recueillir informations légales *confirmées*, ne rien inventer. Éviter de publier des identifiants fiscaux sur la simple base d’une capture de compte; demander confirmation des mentions nécessaires et applicables.
5. SEO technique : title, meta, canonical après domaine confirmé, OG réel, robots, sitemap, données structurées adaptées.
6. Performance, optimisation images, responsive 320–1920 px, accessibilité, contraste, reduced-motion, parcours mailto.
7. Tests automatisés et contrôle navigateur réel avant déploiement (mobile et desktop).
8. Git, GitHub et Vercel : connecter les comptes si l'autorisation existe, puis vérifier le domaine `thefounder.ma`, TLS et liens de production.
9. Protection des secrets : aucun mot de passe, API key, cookie ou donnée fiscale personnelle non requise dans le dépôt.
10. Liste commerciale hors code : préparer catalogue d'offres, devis, factures, acompte, moyen d'encaissement, mini-CRM et script de diagnostic; séparer les tâches que Codex peut documenter de celles nécessitant une décision humaine.

## Éléments interdits sans preuve
- 350 projets, 90% de clients satisfaits ou tout autre indicateur interne fictif.
- Logos de clients ou prétendus partenariats/certifications pour les outils utilisés.
- Résultats garantis de l'IA tirés d'études généralistes.
- Numéros bancaires, adresses ou obligations fiscales devinés.
