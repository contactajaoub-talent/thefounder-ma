# Processus client — version à valider

Ce processus est une proposition de fonctionnement issue du cahier des charges ; il ne décrit pas des clients ou contrats existants. Aucun e-mail n’a été envoyé et aucun encaissement n’a été déclenché.

| Étape | Travail et preuve attendue | Responsable proposé |
| --- | --- | --- |
| Prospection | Qualifier une entreprise réelle, documenter la source du contact, vérifier les règles applicables avant tout message ; enregistrer seulement les données nécessaires | Fondateur |
| Diagnostic gratuit | Clarifier le problème, les utilisateurs, les outils, les données et les contraintes ; rédiger un compte rendu et décider de la suite | Fondateur + interlocuteur client |
| Proposition / devis | Décrire périmètre, livrables, exclusions, critères de recette, calendrier, coûts tiers et conditions ; obtenir un accord écrit | Fondateur + signataire client |
| Acompte | Proposition de 50 % uniquement après validation dans le devis ; émettre le document applicable et vérifier la réception réelle | Responsable administratif à désigner |
| Réalisation | Utiliser des accès minimum, protéger les secrets, documenter les changements et les points de validation ; chiffrer tout hors périmètre avant exécution | Intervenant projet |
| Tests et recette | Exécuter les scénarios convenus, consigner les réserves, les corriger et obtenir la validation de livraison | Intervenant + référent client |
| Formation | Former les utilisateurs, remettre documentation et accès, confirmer les responsabilités de sauvegarde et de support | Intervenant + utilisateurs |
| Facture de solde et suivi | Imputer les paiements réels, vérifier la facture, demander le solde selon les conditions acceptées ; organiser le suivi convenu | Responsable administratif + fondateur |

## Trame de diagnostic

1. Quel processus pose problème ? Qui l’exécute et à quelle fréquence ?
2. Où se trouvent les données ? Quels outils, contrats, API et droits d’accès existent déjà ?
3. Quelles erreurs ou délais observe-t-on aujourd’hui ? Comment les mesurer sans les estimer arbitrairement ?
4. Quelles informations sont sensibles ? Quelles contraintes d’hébergement, d’accès et de conservation s’appliquent ?
5. Quel premier périmètre est utile ? Quels cas doivent rester sous validation humaine ?
6. Qui décide, qui teste et qui utilisera la solution ? Quelles dépendances et échéances sont confirmées ?
7. Quels livrables et critères permettront une recette claire ?
8. Quel budget peut être discuté et quels frais récurrents faut-il distinguer ?

## Prospection légère

Utiliser `crm-prospection.csv` : un enregistrement par entreprise / contact réellement qualifié. Étapes suggérées : à qualifier, contact autorisé, diagnostic proposé, diagnostic réalisé, devis envoyé, gagné, perdu, à reprendre. Consigner la source et la date de collecte, la dernière interaction et une prochaine action explicite. Ne pas ajouter de données sensibles ; définir les accès et durées de conservation avant usage réel.

Préparer un message adapté à un problème identifié, le faire valider, puis envoyer seulement avec autorisation. Respecter les oppositions, ne pas relancer sans limite et clore les dossiers sans suite selon la durée de conservation validée.

TODO_CLIENT : valider politique de prospection, interlocuteurs, échéances, conditions de paiement, banque d’encaissement, maintenance, gouvernance et documents commerciaux avant utilisation.
