# MISSION CODEX — Finaliser TheFounder.ma à partir du projet EXISTANT

Tu es développeur senior full-stack, designer UX/UI B2B, QA et responsable de mise en production. Tu dois **terminer, fiabiliser et auditer** ce projet réel, **pas le reconstruire depuis zéro**.

## 0. D'abord comprendre l'existant
1. Lire `README.md`, `docs/DECISIONS_VALIDÉES.md`, `docs/AUDIT_ET_RESTANT.md`.
2. Inspecter `index.html` et `references/Original_Sections_01_04.html`, et les images des références et assets. Identifier précisément les éléments déjà validés.
3. Exécuter `npm test`, `npm run dev` et tester l'interface avec un vrai navigateur si l'outil est disponible.
4. Établir une mini-liste des écarts puis implémenter. Préserver structure, couleurs, composants, typographie et animations déjà approuvés. Éviter tout gros refactoring ou migration vers Next.js si le site statique satisfait les besoins : privilégier simplicité, accessibilité, maintenabilité et performance. Si migration requise, documenter pourquoi.

## 1. Contrat fonctionnel impératif
**Accueil français, court, dans CET ORDRE :**
01 Hero : « Votre prochain levier de croissance ? L’intelligence artificielle. » Texte concis. CTA primaire « Discuter de mon projet » vers `mailto:contactajaoub@gmail.com?subject=Demande%20de%20projet%20-%20TheFounder`. CTA secondaire « Nos réalisations » vers une page valide, discrète (pas de grosse section portfolio sur la home).
02 Résultats IA : 4 statistiques avec compteurs de 0 à valeur finale déclenchés à l'entrée dans le viewport, 1 fois, ~1,3s et compatibles `prefers-reduced-motion`. **Vérifier les publications primaires** : +15 % productivité sur support, économies rapportées 26–31 % dans des fonctions étudiées, −40 % de temps sur certaines tâches de rédaction, +25,1 % de rapidité sur des tâches de conseil. NE PAS attribuer ces valeurs à TheFounder; si preuve ou périmètre non confirmés, corriger ou supprimer la statistique. Chaque valeur doit lier vers sa source avec contexte et date.
03 Nos solutions, fond noir : 4 blocs IA/agents, automatisation, logiciels métier, CRM/ERP. Liens vers pages ou ancres réelles; pas de modale « en préparation » une fois finalisé.
04 Notre méthode : Diagnostic (gratuit), Proposition et devis, Conception et tests, Déploiement + formation + suivi. Texte concis.
05 Notre stack, fond blanc : grille **3 colonnes × 3 lignes SUR DESKTOP ET MOBILE**, 9 logos officiels n8n, Supabase, Next.js, Make, Codex, Claude, GitHub, Docker, Vercel. Logo gris désaturé au repos ; vrai logo couleur au survol (aussi état focus, éventuellement tactile sans hover). **Les wordmarks de `index.html` sont temporaires**. Rechercher les SVG officiels et leurs conditions d'utilisation ; prévoir alternative textuelle, dimensions, contraste et fichiers locaux optimisés. Ne pas revendiquer partenariat, certification ou statut partenaire.
06 CTA final : « Et si on simplifiait votre entreprise ? » et bouton de contact direct e-mail `contactajaoub@gmail.com`, objet prérempli. Footer discret.

**Identité** : TheFounder / domaine `thefounder.ma`, blanc, noir, violet #7357FF, lavande ; inspiration du rythme et de la clarté de LOW/CODE Agency, mais identité originale, pas de copie de leur contenu/assets. Site **en français**, responsive 320/375/768/1024/1440/1920px ; conserver logo validé et variante favicon.

## 2. Pages secondaires MINIMALES mais exploitables
Créer de vraies pages cohérentes pour les liens réellement exposés :
- `/solutions` ou `solutions.html` avec quatre offres, exemples de problèmes traités, livrables, diagnostic gratuit, et limites réalistes.
- `/realisations` ou `realisations.html` **sobre**, avec uniquement des cas réels vérifiables. Ne pas inventer logos clients, témoignages, certifications, captures ou chiffres. S'il manque les preuves, cacher les cas non prêts et garder une introduction professionnelle vraie.
- `/fondateur` ou `fondateur.html` : texte personnel bref et prudent; l'histoire détaillée d'Othmane, Talentiques et les « trois recommencements » est reportée à validation éditoriale. Ne pas inventer résultats ou faits personnels.
- Contact (pas de formulaire complexe). Boutons `mailto:` ; éventuellement informations complémentaires uniquement si confirmées.
- Mentions légales et confidentialité conformes aux informations réellement fournies. Demander ou marquer un `TODO_CLIENT` pour toute donnée inconnue ; **ne rien inventer** (adresse, ICE, statut fiscal exact, TVA, comptes bancaires, politiques de confidentialité). Vérifier textes avec conseil professionnel si nécessaire.
- Mettre à jour et tester tous les liens, la navbar, le menu burger, ancres, footer et boutons. Supprimer toute interception artificielle par une modale « page en préparation » avant publication.

## 3. Qualité et fiabilité
- Accessibilité WCAG 2.2 AA autant que faisable : alt, titres, contraste, focus visibles, clavier, menu ARIA, réductions d'animations, cibles tactiles.
- SEO : title/meta de chaque page, headings, canonical une fois domaine confirmé, Open Graph local, favicon, robots.txt et sitemap.xml si domaine prêt, JSON-LD approprié, pas de claims infondés.
- Sécurité : aucune clé ni secret au frontend/repo, CSP raisonnable si possible, safe external links, aucun formulaire factice.
- Optimiser les images (dimensions, formats, poids), chargement, responsivité sans scroll horizontal, éviter CLS et effets lourds ; ne pas recopier de logos/visuels tiers sans licence.
- Tester `npm test`, build si ajouté, lints si ajoutés, et navigation dans un navigateur réel. Tester au minimum desktop + mobile, CTA mailto, 3×3 de stack mobile, section stats au scroll, menu mobile, pages secondaires, 404, liens externes.
- Produire captures desktop/mobile comparables aux références, puis corriger jusqu'à rendu cohérent.

## 4. Livrables utiles en plus du code
Produire dans `/business/` des modèles **non contractualisés tant que les coordonnées ne sont pas confirmées** :
1. `catalogue-services.md` simple : IA, automatisation, CRM/ERP, logiciels métier, formation et éventuellement hébergement local. Prix uniquement après diagnostic/devis personnalisé.
2. `modele-devis.md` et `modele-facture.md` contenant les mentions obligatoires **à vérifier** pour un auto-entrepreneur marocain. Pas de faux numéros fiscaux, pas de TVA inventée ni d'affirmation fiscale sans source.
3. `process-client.md` : Prospection → Diagnostic → Proposition/devis → Acompte (proposition commerciale 50 % si validée par le client) → Réalisation → Tests → Formation → Facture solde et suivi. Ne pas déclencher paiement réel.
4. `crm-prospection.csv` (en-têtes uniquement), une mini-liste d'étapes de prospection sans prospects inventés.
5. `CHECKLIST-LANCEMENT.md` séparant : vérifié, à vérifier, blocage externe, décision client. Ajouter encaissement bancaire, domaine, documents juridiques et envoi réel de messages comme décisions/actions à autoriser.

## 5. Conditions de livraison
- Ne pas effacer le travail fourni, ne pas changer le logo ou le thème, ne pas multiplier les sections de la home, ne pas ajouter une section « Pourquoi TheFounder » longue ou une grande galerie de réalisations sur la home.
- S'il manque des informations essentielles, avancer sur les tâches réalisables, consigner `TODO_CLIENT` dans la checklist, sans inventer.
- **Ne pas déployer sur le site public, envoyer de messages, créer d'engagement financier ou modifier le domaine sans autorisation explicite.** Préparer un preview d'abord et demander validation avant publication.
- À la fin : rapport concis « réalisé / testé / restant / bloqué », commandes exécutées, URLs de preview si autorisées et captures comparatives, fichiers créés/modifiés.

Ta priorité est : **une vitrine B2B crédible, rapidement publiable et sans promesse trompeuse**, ensuite des documents commerciaux simples et un système de prospection léger.
