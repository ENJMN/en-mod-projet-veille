#!/bin/bash
# ============================================================
# Script de mise à jour du site ways-ci.com sur VPS
# Usage : bash deploy.sh
# À exécuter depuis /var/www/ways-ci sur le VPS
# ============================================================

set -e  # Stopper en cas d'erreur

echo "🚀 Déploiement WAYS Digital Solutions — ways-ci.com"
echo "=================================================="

# 1. Récupérer les dernières modifications depuis GitHub
echo "📥 Récupération du code..."
git pull origin main

# 2. Installer les dépendances (si package.json a changé)
echo "📦 Installation des dépendances..."
npm ci --production=false

# 3. Builder l'application
echo "🔨 Build Next.js..."
npm run build

# 4. Redémarrer l'application avec PM2
echo "♻️  Redémarrage de l'application..."
pm2 reload ways-ci

echo ""
echo "✅ Déploiement terminé ! Le site est en ligne sur https://ways-ci.com"
