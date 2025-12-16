# Utilise Node 20
FROM node:20

# Définit le dossier de travail dans le conteneur
WORKDIR /app

# Copie package.json + package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le projet
COPY . .

# Expose le port
EXPOSE 3000

# Génère Prisma client
RUN npx prisma generate

# Commande pour lancer le serveur
CMD ["npm", "run", "dev"]
