# TODO_CLIENT — éléments à fournir ou à valider

Les points ci-dessous sont non résolus au 24 novembre 2026. Ils ne bloquent pas la revue locale. Les mentions légales, la confidentialité, les droits de marque et l’autorisation de publication bloquent le passage en production.

| Priorité | Élément | Réponse / preuve attendue | Effet |
| --- | --- | --- | --- |
| Avant publication | Identité de l’éditeur | Nom complet ou dénomination légale, statut effectivement enregistré, adresse professionnelle et responsable de publication | Compléter `mentions-legales.html` ; ne pas déduire le statut du nom commercial |
| Avant publication / facture | Identifiants applicables | IF, ICE, registre auto-entrepreneur et taxe professionnelle, selon applicabilité confirmée par conseiller | Compléter les documents ; ne publier que les mentions réellement nécessaires |
| Avant production | Domaine et hébergement | Projet Vercel `thefounder-ma-pcwy` et domaines `thefounder.ma` / `www` confirmés par inspection ; confirmer les mentions légales de l’hébergeur et autoriser séparément la publication | Le Preview est autorisé ; les domaines restent liés à l’ancienne production |
| Avant publication | Données personnelles | Responsable, finalités, base juridique, destinataires, conservations, gestion des droits, hébergeur et messagerie, transferts éventuels, formalités CNDP applicables | Finaliser `confidentialite.html` et faire valider les traitements réels |
| Avant publication | Logos et marques | Validation de l’usage commercial, de la désaturation CSS et des variantes ; SVG Codex officiel approuvé ou accord sur la ressource tierce | Voir `docs/LOGOS_ET_DROITS.md` ; ne pas présenter les neuf fichiers comme tous issus de kits officiels |
| Avant publication | Revue visuelle et éditoriale | Validation du rendu et des textes des neuf pages | Ajustements après retour, sans remettre en cause les choix graphiques fournis |
| Avant publication | Autorisation explicite | Accord de publication du client, sur une version identifiée, une cible et une date définies | Aucune mise en ligne n’a été faite ; `publicationApproved` reste `false` |
| Avant émission commerciale | Régime fiscal et clauses | Validation du statut, traitement TVA / taxes, mentions, numérotation, acomptes, délais, propriété intellectuelle, responsabilité et maintenance | Modèles de devis / facture non contractualisés jusque-là |
| Avant encaissement | Paiement | Moyen d’encaissement et coordonnées bancaires vérifiées ; acceptation éventuelle de l’acompte proposé de 50 % | Aucune donnée bancaire préremplie ni paiement créé |
| Avant prospection réelle | Règles d’usage CRM | Sources permises, accès, conservation, oppositions, messages et destinataires validés | CSV vide, aucun prospect inventé ni message envoyé |
| Facultatif, avant publication de cas | Réalisations | Preuves de projets réels, rôle exact, autorisations clients, captures et résultats vérifiables | Aucun cas client affiché tant que ces preuves manquent |
| Facultatif, avant biographie | Fondateur | Nom et portrait autorisés, biographie validée ; éventuel récit Othmane / Talentiques / recommencements | Page actuelle limitée à la démarche professionnelle, aucune citation personnelle inventée |

Les valeurs `legalApproved`, `privacyApproved`, `brandUseApproved`, `siteOrigin` et `publicationApproved` du fichier `config/release.json` doivent refléter ces validations effectives. Ne pas les modifier simplement pour faire passer un build.
