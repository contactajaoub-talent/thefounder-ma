# Checklist de lancement — TheFounder

Version de revue du 24 novembre 2026, complétée pour la PR #3. **La publication Production est autorisée uniquement après validation complète ; les blocages légaux et de marque subsistent.** La Preview est contrôlée, la production n’est pas modifiée. État actuel : [validation de production](docs/VALIDATION_PRODUCTION_PR3.md) et [TODO_CLIENT](TODO_CLIENT.md).

## Vérifié localement

- [x] Reprise de `index.html` fourni, sans changement de framework ni reconstruction de l’accueil.
- [x] Logo original conservé ; blanc / noir / violet #7357FF / lavande et six sections dans le bon ordre.
- [x] Pages Solutions, Réalisations, Fondateur, Méthode, Contact, Mentions légales, Confidentialité et 404 créées.
- [x] Suppression de la modale et des interceptions `data-next` ; liens internes et fragments valides.
- [x] CTA vers `contactajaoub@gmail.com`, objet « Demande de projet - TheFounder » ; adresse copiable sur Contact.
- [x] Neuf logos SVG locaux, grille 3 × 3 aux six largeurs, survol / focus et rendu tactile contrôlés. Provenance et réserves de marque documentées.
- [x] Compteurs ~1,3 s, déclenchement au viewport une fois, chiffres lisibles sans JS, mouvement réduit respecté.
- [x] Quatre chiffres vérifiés ; Capgemini corrigé en économies « réalisées ou attendues », grands groupes ; aucune garantie TheFounder.
- [x] Navbar et menu clavier / mobile, liens d’évitement, focus visibles, titres, textes alternatifs et 404.
- [x] Pages testées à 320, 375, 768, 1024, 1440 et 1920 px ; contrôles sans JS et tactile.
- [x] Audit automatisé WCAG 2.2 AA sur les règles prises en charge : aucune violation détectée lors du premier passage ; revue finale et réserves dans le rapport QA.
- [x] CSS / JS et logos locaux, favicons redimensionnés et Open Graph local 1200 × 630 ; aucun appel tiers nécessaire à l’affichage.
- [x] CSP restrictive, prévention des types MIME incorrects et du framing, restrictions des méthodes et ressources du serveur de revue.
- [x] Le serveur ne sert pas `business/`, `docs/`, les scripts, tests ou fichiers de configuration.
- [x] Build statique par liste explicite : les références lourdes et documents commerciaux sont exclus.
- [x] Prévisualisation non indexable : meta robots, robots.txt et en-tête local ; build production bloqué par validations explicites.
- [x] Catalogue, devis, facture, processus client, trame de diagnostic et CSV d’en-têtes préparés ; aucun paiement ou message réel.

## À vérifier sur la cible finale

- [x] Domaines existants vérifiés dans Vercel ; HTTPS de `thefounder.ma` répond. Aucun changement DNS/TLS effectué. Recontrôler www/canonique après le vrai déploiement Production.
- [x] En-têtes effectifs et vraie 404 contrôlés sur la Preview via Build Output API ; types MIME corrects. Recontrôler la politique Production et la compression après publication autorisée.
- [x] Preview protégée par l’authentification Vercel conservée ; aucune protection désactivée.
- [ ] Compléter les pages légales et les preuves de marque, puis refléter les validations réelles. `siteOrigin` est confirmé ; le build Production reste volontairement bloqué.
- [ ] Vérifier canonical, `og:url`, OG absolu, WebSite JSON-LD, sitemap et robots du build autorisé. Tester le partage sur les plateformes cibles.
- [ ] Valider sur appareils physiques : Safari iOS, Chrome Android, zoom 200–400 %, contraste renforcé et lecteur d’écran (VoiceOver / NVDA). Aucun contrôle de ces environnements n’est revendiqué.
- [ ] Mesurer Lighthouse mobile / desktop et Core Web Vitals sur HTTPS avec réseau réaliste ; les temps localhost ne sont pas un score public.
- [ ] Tester l’ouverture effective de la messagerie sur l’appareil client et la délivrabilité de l’adresse, sans message envoyé par l’agent.
- [ ] Recontrôler les liens vers publications et éditeurs au lancement ; distinguer les filtres anti-bot des liens réellement disparus.
- [ ] Prévoir sauvegarde de version, procédure de rollback, accès d’administration minimum et journalisation adaptée.

## Blocages externes

- [x] Identité, statut, responsables, ICE/IF/TP et adresse confirmée AV MED V, 11102 Rabat, Maroc intégrés aux mentions.
- [x] Hébergeur Vercel et ses coordonnées publiques confirmés. Identité de l’éditeur toujours manquante.
- [ ] Notice de confidentialité complète, modalités de messagerie et traitements, formalités CNDP et éventuels transferts validés.
- [x] Alternative textuelle autorisée appliquée aux neuf technologies ; aucun visuel tiers dans le rendu ou l’export, grille 3 × 3 et noms complets contrôlés sur mobile/desktop.
- [ ] Modèles de facturation et clauses revus par un conseiller compétent avant usage.

## Décisions et actions client à autoriser

- [ ] Valider le rendu de la version livrée et les textes publics.
- [ ] Autorisation de publication reçue et enregistrée ; identification et présentation des technologies validées. Seul le dossier de confidentialité empêche encore le build Production. Le client confirme qu’aucune démarche CNDP n’a encore été faite ; voir `docs/CNDP_AVANT_PUBLICATION.md`.
- [ ] Autoriser toute modification de domaine, DNS ou compte d’hébergement.
- [ ] Choisir le moyen d’encaissement et transmettre les coordonnées vérifiées ; décider de l’acompte proposé de 50 %.
- [ ] Valider, signer et émettre les documents commerciaux réels.
- [ ] Autoriser séparément l’envoi de messages de prospection et leurs destinataires.
- [ ] Fournir des preuves et autorisations avant tout ajout de réalisations, témoignages ou logos clients.

## Séquence de mise en ligne après accord

1. Résoudre les blocages et conserver la preuve des validations.
2. Identifier la version exacte à publier, sauvegarder le livrable et confirmer la cible.
3. Exécuter `npm test`, `npm run build` et les tests navigateur sur le preview.
4. Une fois l’accord explicite enregistré, renseigner `config/release.json` et finaliser les textes légaux ; exécuter `npm run build:production` (génération locale uniquement).
5. Vérifier le contenu de `dist/`, les métadonnées absolues et les en-têtes ; publier uniquement ce dossier avec l’outil choisi et autorisé.
6. Contrôler HTTPS, indexabilité voulue, pages / ressources, 404, CTA, menu, sources et affichage mobile sur la cible ; consigner l’heure et le résultat.
7. Si une anomalie bloquante apparaît, revenir à la version validée précédente et en informer le client.
