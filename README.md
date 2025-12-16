# 🐾 Patte & Cie - Backend API

Backend pour la gestion d'un carnet de santé vétérinaire numérique.

## 🛠 Technologies

- Node.js 20.x
- TypeScript
- Express.js
- PostgreSQL (Neon.tech)
- Prisma ORM
- Docker

## 📦 Installation
```bash
# Cloner le projet
git clone git@github.com:2025-10-CDA-ECO-P6/C-V_Patte-Cie.git
cd C-V_Patte-Cie

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```
## Lancer le serveur

# Première fois : build + lancement
docker compose up --build

# Pour un redémarrage rapide sans rebuild
docker compose up

# Lancer le serveur TypeScript en mode watch
npm run dev


## 📁 Structure du projet
```
patte-et-cie-backend/
├── database/
│   ├── script.sql          # Script SQL complet
│   ├── mld.pdf
│   └── mpd.pdf
├── prisma/
│   ├── schema.prisma       # Schéma Prisma (généré)
├── src/
│   ├── app.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── repositories/
├── dist/                   # Build TypeScript (ignored)
├── node_modules/           # Ignoré
└── .env
    prisma.config.ts
```

## 🗄️ Base de données

### Modèle

La base PostgreSQL (Neon.tech) comprend :
- `user` - Comptes utilisateurs
- `owner` - Propriétaires d'animaux
- `veterinarian` - Vétérinaires
- `animal` - Animaux
- `visit` - Visites vétérinaires
- `vaccine` - Vaccinations

### Réinitialiser la base
```bash
# Synchroniser Prisma
npx prisma db pull
npx prisma generate
```

### Explorer la base
```bash
# Interface graphique Prisma Studio
npx prisma studio

# Ou via psql
psql $DATABASE_URL
```

## 📜 Scripts
```bash
npx prisma studio    # Interface graphique DB
npm run dev          # Lancer le serveur en watch
```

## 👥 Équipe

- [Charlène SCOMPARIN] - [@ChSPN](https://github.com/ChSPN)
- [Victoria Fonteny] - [@github-username](https://github.com/Victoria-31)

---
