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
npx prisma studio  # interface graphique
psql $DATABASE_URL # via psql
```


## 👥 Équipe

- [Charlène SCOMPARIN] - [@ChSPN](https://github.com/ChSPN)
- [Victoria Fonteny] - [@github-username](https://github.com/Victoria-31)

---


## 🔗 Repos liés

- **Front-end (non lié)**  
  https://github.com/Victoria-31/petcareTheo  
  _⚠️ Ce dépôt n’a pas pu être lié. Initialement prévu pour être géré à deux, je me suis finalement retrouvée seule sur le projet. N’ayant pas réussi, dans un premier temps, à accéder au frontend de ce dépôt, j’ai choisi de me concentrer en priorité sur le second repository._

- **Front-end**  
  https://github.com/Victoria-31/Louis-Patte-and-cie  

  - 📄 **Documentation de la connexion front / back** :  
    https://github.com/Victoria-31/Louis-Patte-and-cie/blob/main/README-Link-Back.md


## 🚀 Déploiement

### Front-end
- **Application (Vercel)** :  
  https://louis-patte-and-cie.vercel.app

### Back-end
- **API** :  
  https://pattes-and-cie.onrender.com/api/animals

- **Documentation API (Swagger)** :  
  https://pattes-and-cie.onrender.com/api-docs/


---

## Axes d'amélioration

- Adapter les endpoints existants pour :
    - Retourner tous les animaux si l’utilisateur connecté est vétérinaire.
    - Retourner uniquement les animaux liés au compte si l’utilisateur est propriétaire.

- ajouter des dashboard sur le front en fonction vet ou owner
