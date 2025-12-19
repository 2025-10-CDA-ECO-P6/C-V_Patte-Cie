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
cp .env.sample .env
# Éditer .env avec vos valeurs

# Générer une clé secrète JWT sécurisée
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copier le résultat dans .env comme valeur de JWT_SECRET
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


### Réinitialiser et synchroniser la base
> ⚠️ **Attention :** cette opération supprime toutes les données existantes.

```bash
# Réinitialiser la base de données de développement
npx prisma migrate reset

# Synchroniser le client Prisma
npx prisma generate

# Remplir la base avec des données de test
npx prisma db seed

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

## 🔐 Configuration JWT

### Générer un JWT_SECRET

Pour sécuriser l'authentification, vous devez générer une clé secrète forte pour le JWT_SECRET dans votre fichier `.env`.

**Méthode 1 : Node.js (recommandé)**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Méthode 2 : OpenSSL**
```bash
openssl rand -hex 64
```

**Méthode 3 : Terminal Linux/Mac**
```bash
head /dev/urandom | tr -dc A-Za-z0-9 | head -c 64
```

Copiez le résultat généré et ajoutez-le dans votre fichier `.env`:
```bash
JWT_SECRET="votre_clé_générée_ici"
```

**Important**: Ne partagez jamais cette clé et ne la commitez jamais dans Git. Ne changez pas cette valeur en production car cela invaliderait tous les tokens existants.

## 👥 Équipe

- [Charlène SCOMPARIN] - [@ChSPN](https://github.com/ChSPN)
- [Victoria Fonteny] - [@github-username](https://github.com/Victoria-31)

---
