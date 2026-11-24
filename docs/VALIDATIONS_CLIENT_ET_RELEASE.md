# État réel des validations — 24 novembre 2026

Les validations ne sont pas activées pour contourner un échec du build. Chaque valeur ci-dessous correspond à un élément confirmé ou vérifié. Le build et son exigence de quatre booléens strictement vrais restent inchangés.

| Champ | État | Preuve / périmètre |
| --- | --- | --- |
| siteOrigin | https://thefounder.ma | Domaine demandé par le client et vérifié dans le projet Vercel existant |
| publicationApproved | true | Ordre explicite et réitéré du client de publier sur main ; aucune nouvelle permission de publication à demander |
| legalApproved | true | Identification de l’éditeur, statut, activité et responsables confirmés par le client ; ICE/IF/TP fournis dans la capture ; adresse exacte ajoutée selon sa réponse « AV MED V RABAT 11102 ». Coordonnées de l’hébergeur vérifiées sur sa source officielle. Les traitements de données relèvent du contrôle séparé privacyApproved |
| brandUseApproved | true | Alternative textuelle explicitement autorisée par le client. Les neuf visuels de technologie tiers sont retirés du rendu, de l’export et du code courant ; neuf noms génériques dans la typographie du site, grille 3 × 3 préservée, usage réel confirmé, indépendance affichée. Contrôle navigateur à six largeurs, focus/survol/tactile et absence des ressources SVG |
| privacyApproved | false | Le client confirme qu’aucune démarche CNDP n’a encore été faite. Les références et conditions applicables ne sont pas vérifiées ; aucune exemption ni démarche accomplie ne peut être inventée. Voir CNDP_AVANT_PUBLICATION.md |

Le lot technique est testé et peut être revu en Preview. La condition posée par le client pour la fusion/publication — validations terminées sans contourner le build — n’est donc pas encore satisfaite. Le build Production doit continuer à échouer sur la seule validation de confidentialité manquante. La PR reste ouverte en brouillon, la production et la sauvegarde sont conservées.
