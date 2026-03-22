// Configuration PM2 — garde l'application Next.js en vie sur le VPS
// Usage : pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: "ways-ci",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/ways-ci",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
