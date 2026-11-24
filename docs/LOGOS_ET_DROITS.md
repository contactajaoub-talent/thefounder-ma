# Logos et droits d’usage — revue du 24 novembre 2026

Neuf fichiers SVG locaux sont utilisés dans la grille 3 × 3. Aucun logo n’a été redessiné et aucune couleur de marque n’a été inventée. Les trois images d’identité TheFounder fournies ont été conservées sans modification ; des tailles dérivées servent au logo affiché et aux favicons.

| Technologie | Ressource locale | Provenance |
| --- | --- | --- |
| n8n | `assets/logos/n8n.svg` | [Système de marque officiel](https://guidelines.n8n.design/), [fichier officiel](https://guidelines.n8n.design/downloads/logo/lockup/n8n-logo-black-accent.svg), marque actuelle consultée en novembre 2026 |
| Supabase | `assets/logos/supabase.svg` | [Guide officiel](https://supabase.com/brand), [wordmark vert/noir](https://supabase.com/brand-assets/supabase-logo-green-black-transparent.svg) |
| Next.js | `assets/logos/nextjs.svg` | [Guide Vercel / Next.js](https://vercel.com/geist/brands), [fichier officiel](https://vercel.com/geist/brands/assets/nextjs-logotype-black.svg) |
| Make | `assets/logos/make.svg` | [Newsroom officielle](https://www.make.com/press), [SVG compact utilisé par le site officiel](https://cdn.prod.website-files.com/6a294495bc84130c6dd0c4fd/6a7f0579b41606438259693d_make_logo.svg) ; [guide de marque](https://cdn.make.com/cms/documents/brand-guidelines.pdf) |
| Codex | `assets/logos/codex.svg` | Pictogramme Codex distribué par [LobeHub, version 1.106.0](https://unpkg.com/@lobehub/icons-static-svg@1.106.0/icons/codex-color.svg). [Projet distributeur](https://github.com/lobehub/lobe-icons), [marque OpenAI](https://openai.com/brand/). **Exception de provenance : distributeur tiers, pas un fichier récupéré directement dans un kit OpenAI.** |
| Claude | `assets/logos/claude.svg` | [Kit de presse officiel Anthropic](https://www.anthropic.com/press-kit), entrée `Claude logos/1 Claude logo/SVG/Claude logo - Slate.svg` ; [règles de marque](https://www.anthropic.com/legal/trademark-guidelines) |
| GitHub | `assets/logos/github.svg` | [Kit officiel](https://brand.github.com/GitHub_Logos.zip), entrée `GitHub Logos/SVG/GitHub_Lockup_Black.svg` ; [guide](https://brand.github.com/foundations/logo) |
| Docker | `assets/logos/docker.svg` | [Page officielle et guide](https://www.docker.com/company/newsroom/media-resources/), [symbole officiel actuel](https://www.docker.com/app/uploads/brand/logo/docker-mark-ether.svg). Le nom Docker est affiché comme légende distincte. |
| Vercel | `assets/logos/vercel.svg` | [Guide officiel](https://vercel.com/geist/brands), [wordmark officiel](https://vercel.com/geist/brands/assets/vercel-logotype-black.svg) |

## Conditions identifiées

- Les marques restent la propriété de leurs titulaires. La disponibilité publique d’un fichier ne vaut pas autorisation générale de l’utiliser dans une communication commerciale.
- Vercel / Next.js : pas d’altération trompeuse ni suggestion d’approbation ou de sponsoring.
- Make : préserver proportions, espacement et variantes autorisées ; le guide consulté recommande une largeur minimale de 96 px pour le logo complet. La variante compacte officielle est affichée à au moins 96 px, y compris à 320 px, sans changer la grille 3 × 3. Son état gris reste soumis à la validation des règles de marque.
- Anthropic : ses règles réservent l’usage aux matériaux approuvés et interdisent l’altération, notamment de couleur. Une autorisation d’usage commercial n’est pas établie par le kit fourni.
- Les logos noir et blanc (Next.js, GitHub, Vercel) restent authentiquement noirs au survol ; aucune teinte fictive n’est ajoutée pour simuler une couleur inexistante.
- Le gris au repos est un filtre CSS de prévisualisation. Il ne modifie pas les fichiers source, mais son acceptation par les titulaires ne doit pas être présumée.
- [Licence du distributeur LobeHub](https://github.com/lobehub/lobe-icons/blob/master/LICENSE) : vérifier les conditions de distribution et les droits de marque séparément. Le client n’a fourni aucune autorisation spécifique OpenAI.

## TODO_CLIENT — avant publication

Valider les droits et variantes de marque, en particulier Claude et le filtre gris demandé. Confirmer ou fournir le SVG Codex officiel approuvé, ou autoriser la variante distribuée par LobeHub après vérification. Aucun message à un éditeur n’a été envoyé. Le build de production reste bloqué tant que `brandUseApproved` n’est pas explicitement confirmé, en plus des autres validations.
