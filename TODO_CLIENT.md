# TODO_CLIENT — éléments à fournir ou à valider

Les points ci-dessous sont non résolus au 24 novembre 2026. Ils ne bloquent pas la revue locale. Les mentions légales, la confidentialité, les droits de marque et l’autorisation de publication bloquent le passage en production.

| Priorité | Élément | Réponse / preuve attendue | Effet |
| --- | --- | --- | --- |
| Avant publication | Identité de l’éditeur | Nom complet ou dénomination légale, statut effectivement enregistré, adresse professionnelle et responsable de publication | Compléter `mentions-legales.html` ; ne pas déduire le statut du nom commercial |
| Avant publication / facture | Identifiants applicables | IF, ICE, registre auto-entrepreneur et taxe professionnelle, selon applicabilité confirmée par conseiller | Compléter les documents ; ne publier que les mentions réellement nécessaires |
| Confirmé techniquement | Domaine et hébergement | `https://thefounder.ma`, projet Vercel existant `thefounder-ma-pcwy` ; domaines vérifiés dans le compte. Prestataire Vercel, Inc., coordonnées publiques ajoutées aux mentions | Origine renseignée ; SEO et headers Production générés seulement après validation réelle |
| Avant publication | Données personnelles | Responsable, finalités, base juridique, destinataires, conservations, gestion des droits, hébergeur et messagerie, transferts éventuels, formalités CNDP applicables | Finaliser `confidentialite.html` et faire valider les traitements réels |
| Bloquant avant publication | Logos et marques | Le client demande de conserver Claude et Codex. Fournir une autorisation du titulaire ou une règle officielle couvrant précisément cet usage commercial et le filtre gris ; pour Codex, prouver aussi la provenance/variante approuvée | Voir `docs/LOGOS_ET_DROITS.md` ; le souhait du client et la licence d’un distributeur tiers ne prouvent pas les droits de marque ; `brandUseApproved=false` |
| Avant publication | Revue visuelle et éditoriale | Validation du rendu et des textes des neuf pages | Ajustements après retour, sans remettre en cause les choix graphiques fournis |
| Condition non encore remplie | Autorisation de publication | La demande autorise la fusion et la production uniquement après validation complète. Documenter la version et les preuves de réalisation de ces conditions | Les informations légales et les droits manquent encore : `publicationApproved=false`, aucune fusion ni promotion Production |
| Avant émission commerciale | Régime fiscal et clauses | Validation du statut, traitement TVA / taxes, mentions, numérotation, acomptes, délais, propriété intellectuelle, responsabilité et maintenance | Modèles de devis / facture non contractualisés jusque-là |
| Avant encaissement | Paiement | Moyen d’encaissement et coordonnées bancaires vérifiées ; acceptation éventuelle de l’acompte proposé de 50 % | Aucune donnée bancaire préremplie ni paiement créé |
| Avant prospection réelle | Règles d’usage CRM | Sources permises, accès, conservation, oppositions, messages et destinataires validés | CSV vide, aucun prospect inventé ni message envoyé |
| Facultatif, avant publication de cas | Réalisations | Preuves de projets réels, rôle exact, autorisations clients, captures et résultats vérifiables | Aucun cas client affiché tant que ces preuves manquent |
| Facultatif, avant biographie | Fondateur | Nom et portrait autorisés, biographie validée ; éventuel récit Othmane / Talentiques / recommencements | Page actuelle limitée à la démarche professionnelle, aucune citation personnelle inventée |

Les valeurs `legalApproved`, `privacyApproved`, `brandUseApproved`, `siteOrigin` et `publicationApproved` du fichier `config/release.json` doivent refléter ces validations effectives. Ne pas les modifier simplement pour faire passer un build.
