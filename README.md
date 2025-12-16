# 🐾 Patte & Cie - Backend API

Backend pour la gestion d'un carnet de santé vétérinaire numérique.

## 🛠 Technologies

- Node.js 20.x
- TypeScript
- Express.js
- PostgreSQL (Neon.tech)
- Prisma ORM

## 📦 Installation
```bash
# Cloner le projet
git clone https://github.com/votre-team/patte-et-cie-backend.git
cd patte-et-cie-backend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

## ⚙️ Configuration

Créez un fichier `.env` :
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
PORT=3000
NODE_ENV=development
```

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
└── .env
│   └── prisma.config.ts
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
```

## 👥 Équipe

- [Charlène SCOMPARIN] - [@ChSPN](https://github.com/ChSPN)
- [Nom Binôme] - [@github-username](https://github.com/username)

---
