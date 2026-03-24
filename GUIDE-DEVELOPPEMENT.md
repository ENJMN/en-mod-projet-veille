# Guide de développement — WAYS Digital Solutions
## ways-ci.com | Next.js 16 | VPS Hostinger

---

## 1. Stack technique

| Élément | Version / Détail |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS v4 |
| Animations | Framer Motion |
| Formulaires | React Hook Form + Zod |
| Email | Resend SDK |
| IA | Anthropic SDK (claude-opus-4-6) |
| Processus VPS | PM2 |
| Reverse proxy | Traefik (Hostinger) |
| Hébergement | VPS Hostinger — IP : 72.62.29.132 |
| Domaine | ways-ci.com |

---

## 2. Structure du projet

```
ways-ci/
├── app/                        # Pages Next.js (App Router)
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx          # À propos
│   ├── blog/
│   │   ├── page.tsx            # Liste articles
│   │   └── [slug]/page.tsx     # Article individuel
│   ├── videos/page.tsx         # Vidéos YouTube
│   ├── contact/page.tsx        # Formulaire de contact
│   ├── services/
│   │   ├── consulting/         # WAYS IA & Digital
│   │   ├── data-dashboards/    # WAYS Stratégie
│   │   ├── btp-immobilier/     # WAYS Build
│   │   └── formation/          # WAYS Academy & Supply
│   ├── admin/
│   │   ├── commentaires/       # Modération commentaires
│   │   └── articles/           # Gestion brouillons blog
│   └── api/
│       ├── contact/            # Envoi email Resend
│       ├── comments/[slug]/    # Commentaires public
│       └── admin/
│           ├── comments/       # Modération (PATCH/DELETE)
│           ├── articles/       # Gestion brouillons
│           └── generate-post/  # Génération article IA
├── components/
│   ├── Header.tsx              # Navigation (active state)
│   ├── Footer.tsx              # Pied de page
│   ├── BlogCard.tsx            # Carte article (badges colorés)
│   ├── BlogList.tsx            # Grille + filtres catégories
│   ├── CommentForm.tsx         # Formulaire commentaire
│   └── ServiceCard.tsx         # Carte service homepage
├── content/
│   ├── blog/                   # Articles MDX
│   ├── comments/               # Commentaires JSON par slug
│   ├── topics.json             # File d'attente sujets blog
│   └── videos.json             # Vidéos YouTube
├── lib/
│   ├── blog.ts                 # Lecture articles MDX
│   ├── comments.ts             # CRUD commentaires
│   └── videos.ts               # Lecture vidéos JSON
├── scripts/
│   └── generate-post.mjs       # Script génération article CLI
├── public/
│   ├── logo-full.png           # Logo header
│   └── logo-icon.png           # Logo footer
├── .env.local                  # Variables d'environnement (secret)
├── .env.production.example     # Template variables prod
├── ecosystem.config.cjs        # Config PM2
├── nginx.conf                  # Config Nginx (référence)
├── deploy.sh                   # Script de mise à jour
└── next.config.ts              # Config Next.js
```

---

## 3. Charte graphique

| Élément | Valeur |
|---|---|
| Couleur principale | `#0A2342` (navy) |
| Couleur accent | `#E8861A` (amber) |
| Fond clair | `#F8F9FA` |
| Texte principal | `#1A1A2E` |
| Police | Geist Sans / Geist Mono |

**Badges catégories blog :**
- IA & Digital → bleu navy `#0A2342`
- Stratégie → amber `#E8861A`
- BTP → vert `#059669`
- Formation → violet `#7c3aed`

---

## 4. Variables d'environnement

Fichier `.env.local` sur le VPS (`/var/www/ways-ci/.env.local`) :

```env
ADMIN_KEY=votre_mot_de_passe_admin
RESEND_API_KEY=re_votre_cle_resend
CONTACT_EMAIL=contact@ways-ci.com
ANTHROPIC_API_KEY=sk-ant-votre_cle_anthropic
```

---

## 5. Espaces d'administration

### Commentaires — `/admin/commentaires`
- Connexion avec `ADMIN_KEY`
- Approuver / retirer / supprimer les commentaires
- Filtres : En attente / Approuvés / Tous

### Articles — `/admin/articles`
- Connexion avec `ADMIN_KEY`
- Voir les brouillons générés par l'IA
- Publier (draft: true → false) ou supprimer
- Bouton "Générer le prochain article" (depuis la queue topics.json)

---

## 6. Gestion du blog

### Ajouter un article manuellement
Créer un fichier `content/blog/mon-article.mdx` :
```mdx
---
title: "Titre de l'article"
date: "2026-03-23"
author: "N'Guessan Jacques EBAKA"
excerpt: "Description courte (150 caractères)"
category: "IA & Digital"
draft: false
---

Contenu de l'article...
```

### Générer un article avec l'IA (CLI)
```bash
# Prend le prochain sujet dans content/topics.json
npm run generate-post

# Sujet personnalisé
npm run generate-post -- --topic "Mon sujet" --category "BTP"
```

### Ajouter des sujets à la queue
Modifier `content/topics.json` :
```json
{
  "id": "7",
  "topic": "Titre du sujet",
  "category": "Formation",
  "keywords": ["mot-clé 1", "mot-clé 2"],
  "status": "pending"
}
```

### Automatisation n8n
- **Déclencheur** : Schedule (ex: tous les lundis 8h)
- **Action** : POST `https://ways-ci.com/api/admin/generate-post`
- **Header** : `x-admin-key: VOTRE_ADMIN_KEY`
- L'article est sauvegardé en brouillon → validation sur `/admin/articles`

---

## 7. Gestion des vidéos YouTube

Modifier `content/videos.json` :
```json
[
  {
    "id": "ID_VIDEO_YOUTUBE",
    "title": "Titre de la vidéo",
    "description": "Description courte",
    "category": "IA & Digital",
    "date": "2026-03-23"
  }
]
```
L'ID YouTube se trouve dans l'URL : `youtube.com/watch?v=**ID_ICI**`

---

## 8. Déploiement VPS

### Informations serveur
- **OS** : Ubuntu 24.04 LTS
- **IP** : 72.62.29.132
- **Dossier** : `/var/www/ways-ci`
- **Port app** : 3000
- **Gestionnaire de processus** : PM2 (`ways-ci`)
- **Reverse proxy** : Traefik (Docker, `/docker/traefik/`)

### Commandes PM2 utiles
```bash
pm2 status              # Voir l'état de l'app
pm2 logs ways-ci        # Voir les logs en temps réel
pm2 restart ways-ci     # Redémarrer l'app
pm2 reload ways-ci      # Rechargement sans interruption
```

### Mettre à jour le site après modification
```bash
cd /var/www/ways-ci
bash deploy.sh
```
Le script : `git pull` → `npm ci` → `npm run build` → `pm2 reload`

### Déploiement manuel étape par étape
```bash
cd /var/www/ways-ci
git pull origin main
npm ci
npm run build
pm2 reload ways-ci
```

---

## 9. Workflow de modification du site

### Via Claude Code (recommandé)
1. Ouvrir le projet dans VS Code
2. Démarrer Claude Code
3. Décrire les modifications souhaitées
4. Vérifier le résultat sur le serveur de développement local
5. Commiter et pusher sur GitHub :
   ```bash
   git add .
   git commit -m "Description des modifications"
   git push origin main
   ```
6. Sur le VPS : `bash deploy.sh`

### Via un développeur externe
Accès nécessaires :
- Dépôt GitHub : `github.com/ENJMN/ways-ci` (inviter comme collaborateur)
- Variables d'environnement (`.env.local`) à transmettre séparément
- Accès SSH VPS Hostinger (optionnel si déploiement via GitHub uniquement)

---

## 10. Pages et routes du site

| URL | Description |
|---|---|
| `/` | Homepage |
| `/about` | À propos — fondateur, mission, valeurs |
| `/services/consulting` | WAYS IA & Digital |
| `/services/data-dashboards` | WAYS Stratégie |
| `/services/btp-immobilier` | WAYS Build |
| `/services/formation` | WAYS Academy & Supply |
| `/blog` | Liste des articles (filtrés par catégorie) |
| `/blog/[slug]` | Article individuel + commentaires |
| `/videos` | Vidéos YouTube (@EnModProjet) |
| `/contact` | Formulaire de contact (Resend) |
| `/admin/commentaires` | Admin — modération commentaires |
| `/admin/articles` | Admin — gestion brouillons |
| `/sitemap.xml` | Sitemap SEO (auto-généré) |
| `/robots.txt` | Robots SEO (auto-généré) |

---

## 11. Contacts et comptes

| Service | Usage |
|---|---|
| GitHub | `github.com/ENJMN/ways-ci` — code source |
| Resend | `resend.com` — envoi emails formulaire contact |
| Anthropic | `console.anthropic.com` — génération articles IA |
| Hostinger VPS | IP `72.62.29.132` — hébergement |
| YouTube | `@EnModProjet` — chaîne vidéos |

---

## 12. À faire / Points en suspens

- [ ] SSL HTTPS (certificat Let's Encrypt via Traefik — automatique une fois DNS propagé)
- [ ] Vérifier domaine ways-ci.com dans Resend (pour envoyer depuis `@ways-ci.com`)
- [ ] Créer image Open Graph `public/og-image.png` (1200×630px)
- [ ] Espace formations (CDC en cours de préparation)
- [ ] Remplacer numéros WhatsApp placeholder si changement
- [ ] Activer n8n pour automatisation blog

---

*Document généré le 23 mars 2026 — WAYS Digital Solutions*
