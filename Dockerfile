# Image Node.js 20
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du projet
COPY . .

# Build si tu utilises TypeScript
RUN npm run build

# Port exposé (Render : process.env.PORT)
EXPOSE 3010

# Lancement du serveur en production
CMD ["npm", "start"]
