# Image Node.js 20
FROM node:20-alpine

# Dossier de travail
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .


# COPY prisma ./prisma
# RUN npx prisma generate

# Build si tu utilises TypeScript
RUN npm run build

# Port exposé (Render : process.env.PORT)
EXPOSE 3010

# Lancement du serveur en production
CMD ["npm", "start"]
