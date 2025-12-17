# Guide de test avec Postman - API User

## Configuration de base

**Base URL**: `http://localhost:3000` (ou le port configuré dans votre application)

## Endpoints disponibles

### 1. Créer un utilisateur (POST)

**Endpoint**: `POST /users`

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "email": "owner@example.com",
  "password": "password123",
  "userRole": "owner"
}
```

**Valeurs possibles pour userRole**: `owner`, `veterinarian`, `admin`

**Réponses attendues**:
- ✅ **201 Created**: Utilisateur créé avec succès
  ```json
  {
    "userId": 1,
    "email": "owner@example.com",
    "userRole": "owner",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "owner": null,
    "veterinarian": null
  }
  ```
  ⚠️ **Note**: Le `passwordHash` n'est PAS retourné (sécurité)

- ❌ **400 Bad Request**: Email invalide
  ```json
  { "message": "Invalid email format" }
  ```

- ❌ **400 Bad Request**: Mot de passe trop court
  ```json
  { "message": "Password must be at least 8 characters long" }
  ```

- ❌ **409 Conflict**: Email déjà existant
  ```json
  { "message": "Email already exists" }
  ```

---

### 2. Se connecter (POST)

**Endpoint**: `POST /users/login`

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "email": "owner@example.com",
  "password": "password123"
}
```

**Réponses attendues**:
- ✅ **200 OK**: Login réussi
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoib3duZXJAZXhhbXBsZS5jb20iLCJ1c2VyUm9sZSI6Im93bmVyIiwiaWF0IjoxNzM0NDU2Nzg5LCJleHAiOjE3MzQ1NDMxODl9..."
  }
  ```
  ⚠️ **Important**: Sauvegarder le `accessToken` pour les requêtes protégées

- ❌ **400 Bad Request**: Champs manquants
  ```json
  { "message": "Email and password are required" }
  ```

- ❌ **401 Unauthorized**: Identifiants incorrects
  ```json
  { "message": "Invalid credentials" }
  ```

---

### 3. Récupérer tous les utilisateurs (GET)

**Endpoint**: `GET /users`

**Headers**: Aucun header requis pour le moment

**Réponse attendue**:
- ✅ **200 OK**: Liste des utilisateurs
  ```json
  [
    {
      "userId": 1,
      "email": "owner@example.com",
      "passwordHash": "$2b$10$...",
      "userRole": "owner",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "owner": null,
      "veterinarian": null
    }
  ]
  ```

---

### 4. Récupérer un utilisateur par ID (GET)

**Endpoint**: `GET /users/:id`

**Exemple**: `GET /users/1`

**Headers**: Aucun header requis pour le moment

**Réponses attendues**:
- ✅ **200 OK**: Utilisateur trouvé
  ```json
  {
    "userId": 1,
    "email": "owner@example.com",
    "passwordHash": "$2b$10$...",
    "userRole": "owner",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "owner": null,
    "veterinarian": null
  }
  ```

- ❌ **400 Bad Request**: ID invalide
  ```json
  { "message": "Invalid user ID" }
  ```

- ❌ **404 Not Found**: Utilisateur non trouvé
  ```json
  { "message": "User not found" }
  ```

---

## Scénario de test complet

### Étape 1: Créer un utilisateur
1. Ouvrir Postman
2. Créer une nouvelle requête POST vers `http://localhost:3000/users`
3. Dans l'onglet "Body", sélectionner "raw" et "JSON"
4. Copier-coller le JSON de création d'utilisateur
5. Cliquer sur "Send"
6. Vérifier le statut 201 et la réponse

### Étape 2: Tester les validations
1. Créer avec un email invalide: `test@invalid`
   - Vérifier erreur 400
2. Créer avec un mot de passe court: `"password": "123"`
   - Vérifier erreur 400
3. Créer avec le même email
   - Vérifier erreur 409

### Étape 3: Se connecter
1. Créer une nouvelle requête POST vers `http://localhost:3000/users/login`
2. Utiliser les identifiants créés
3. Copier le token retourné

### Étape 4: Tester les lectures
1. GET `/users` - Liste tous les utilisateurs
2. GET `/users/1` - Récupère l'utilisateur avec ID 1
3. GET `/users/999` - Vérifier erreur 404
4. GET `/users/abc` - Vérifier erreur 400

---

## Utilisation du token JWT (pour plus tard)

Quand les routes seront protégées, il faudra ajouter le token dans les headers:

**Headers pour requêtes protégées**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

Dans Postman:
1. Onglet "Headers"
2. Key: `Authorization`
3. Value: `Bearer [VOTRE_TOKEN]`

---

## Codes de statut HTTP

- **200 OK**: Requête réussie
- **201 Created**: Ressource créée avec succès
- **400 Bad Request**: Données invalides
- **401 Unauthorized**: Non authentifié
- **404 Not Found**: Ressource non trouvée
- **409 Conflict**: Conflit (ex: email déjà existant)
- **500 Internal Server Error**: Erreur serveur
