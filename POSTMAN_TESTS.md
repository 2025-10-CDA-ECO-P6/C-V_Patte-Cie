# Guide de test avec Postman - API Patte & Cie

## Configuration de base

**Base URL**: `http://localhost:3000/api` (ou le port configuré dans votre application)

**⚠️ Prérequis**:
- Serveur de développement démarré (`npm run dev`)
- Base de données PostgreSQL configurée
- Variables d'environnement définies dans `.env`

## Table des matières

1. [Authentification et Utilisateurs](#1-authentification-et-utilisateurs)
2. [Gestion des Animaux](#2-gestion-des-animaux)
3. [Gestion des Visites](#3-gestion-des-visites)
4. [Variables d'environnement Postman](#variables-denvironnement-postman)
5. [Scénarios de test](#scénarios-de-test)

---

## 1. Authentification et Utilisateurs

### 1.1. Créer un utilisateur (POST)

**Endpoint**: `POST /api/users`

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "email": "test.owner@example.com",
  "password": "SecurePass123",
  "userRole": "owner"
}
```

**Valeurs possibles pour userRole**: `owner`, `veterinarian`, `admin`

**Réponses attendues**:
- ✅ **201 Created**: Utilisateur créé avec succès
  ```json
  {
    "data": {
      "id": 1,
      "attributes": {
        "email": "test.owner@example.com",
        "userRole": "owner",
        "createdAt": "2025-12-19T10:30:00.000Z",
        "updatedAt": "2025-12-19T10:30:00.000Z"
      }
    }
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

### 1.2. Se connecter (POST)

**Endpoint**: `POST /api/users/login`

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "email": "test.owner@example.com",
  "password": "SecurePass123"
}
```

**Réponses attendues**:
- ✅ **200 OK**: Login réussi
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  ⚠️ **Important**:
  - Sauvegarder le `accessToken` pour les requêtes protégées
  - Le token est valide pendant **24 heures**
  - Le token contient : `userId`, `email`, `userRole`

- ❌ **400 Bad Request**: Champs manquants
  ```json
  { "message": "Email and password are required" }
  ```

- ❌ **401 Unauthorized**: Identifiants incorrects
  ```json
  { "message": "Invalid credentials" }
  ```

---

### 1.3. Lister tous les utilisateurs (GET)

**Endpoint**: `GET /api/users?page=1&pageSize=25`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Query Parameters** (optionnels):
- `page`: Numéro de page (défaut: 1)
- `pageSize`: Nombre d'éléments par page (défaut: 25)

**Réponse attendue**:
- ✅ **200 OK**: Liste des utilisateurs avec pagination
  ```json
  {
    "data": [
      {
        "id": 1,
        "attributes": {
          "email": "test.owner@example.com",
          "userRole": "owner",
          "createdAt": "2025-12-19T10:30:00.000Z",
          "updatedAt": "2025-12-19T10:30:00.000Z"
        }
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "pageSize": 25,
        "pageCount": 1,
        "total": 1
      }
    }
  }
  ```

---

### 1.4. Récupérer un utilisateur par ID (GET)

**Endpoint**: `GET /api/users/:id`

**Exemple**: `GET /api/users/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponses attendues**:
- ✅ **200 OK**: Utilisateur trouvé
  ```json
  {
    "data": {
      "id": 1,
      "attributes": {
        "email": "test.owner@example.com",
        "userRole": "owner",
        "createdAt": "2025-12-19T10:30:00.000Z",
        "updatedAt": "2025-12-19T10:30:00.000Z"
      }
    }
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

### 1.5. Modifier un utilisateur (PATCH)

**Endpoint**: `PATCH /api/users/:id`

**Exemple**: `PATCH /api/users/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (JSON)** - Tous les champs sont optionnels:
```json
{
  "email": "newemail@example.com",
  "password": "NewSecurePass456"
}
```

**Réponses attendues**:
- ✅ **200 OK**: Utilisateur modifié
  ```json
  {
    "data": {
      "id": 1,
      "attributes": {
        "email": "newemail@example.com",
        "userRole": "owner",
        "updatedAt": "2025-12-19T11:00:00.000Z"
      }
    }
  }
  ```

- ❌ **404 Not Found**: Utilisateur non trouvé
- ❌ **409 Conflict**: Email déjà utilisé

---

### 1.6. Supprimer un utilisateur (DELETE)

**Endpoint**: `DELETE /api/users/:id`

**Exemple**: `DELETE /api/users/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponses attendues**:
- ✅ **204 No Content**: Utilisateur supprimé (pas de body)
- ❌ **404 Not Found**: Utilisateur non trouvé

---

## 2. Gestion des Animaux

### 2.1. Créer un animal (POST)

**Endpoint**: `POST /api/animals`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "name": "Max",
  "species": "Dog",
  "dateOfBirth": "2020-05-15T00:00:00.000Z",
  "picture": "https://example.com/images/max.jpg",
  "weight": "25.5",
  "gender": "M",
  "ownerId": "f4c5d1f9-d42b-4da8-9c58-d6b121c1c8b2"
}

```

**Champs requis**: `name`, `species`, `breed`, `dateOfBirth`, `weight`, `gender`, `ownerId`

**Valeurs pour gender**: `M` (mâle) ou `F` (femelle)

**Réponses attendues**:
- ✅ **201 Created**: Animal créé
  ```json
  {
    "data": {
      "id": 1,
      "attributes": {
        "name": "Max",
        "species": "Chien",
        "breed": "Labrador",
        "dateOfBirth": "2020-05-15",
        "weight": 25.5,
        "gender": "M",
        "picture": "https://example.com/images/max.jpg",
        "ownerId": 1,
        "createdAt": "2025-12-19T10:30:00.000Z",
        "updatedAt": "2025-12-19T10:30:00.000Z"
      }
    }
  }
  ```

- ❌ **400 Bad Request**: Champs manquants ou invalides
- ❌ **404 Not Found**: Owner n'existe pas

---

### 2.2. Lister tous les animaux (GET)

**Endpoint**: `GET /api/animals?page=1&pageSize=25`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Query Parameters** (optionnels):
- `page`: Numéro de page (défaut: 1)
- `pageSize`: Nombre d'éléments par page (défaut: 25)

**Réponse attendue**:
- ✅ **200 OK**: Liste avec pagination
  ```json
  {
    "data": [
      {
        "id": 1,
        "attributes": {
          "name": "Max",
          "species": "Chien",
          "breed": "Labrador",
          "weight": 25.5,
          "gender": "M"
        }
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "pageSize": 25,
        "pageCount": 1,
        "total": 1
      }
    }
  }
  ```

---

### 2.3. Récupérer un animal par ID (GET)

**Endpoint**: `GET /api/animals/:id`

**Exemple**: `GET /api/animals/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponses attendues**:
- ✅ **200 OK**: Animal trouvé
- ❌ **404 Not Found**: Animal non trouvé

---

### 2.4. Modifier un animal (PUT)

**Endpoint**: `PUT /api/animals/:id`

**Exemple**: `PUT /api/animals/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (JSON)** - Tous les champs requis:
```json
{
  "name": "Max",
  "species": "Chien",
  "breed": "Golden Retriever",
  "dateOfBirth": "2020-05-15",
  "weight": 28.0,
  "gender": "M",
  "ownerId": 1
}
```

**Réponses attendues**:
- ✅ **200 OK**: Animal modifié
- ❌ **404 Not Found**: Animal non trouvé

---

### 2.5. Supprimer un animal (DELETE)

**Endpoint**: `DELETE /api/animals/:id`

**Exemple**: `DELETE /api/animals/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponses attendues**:
- ✅ **204 No Content**: Animal supprimé
- ❌ **404 Not Found**: Animal non trouvé

---

## 3. Gestion des Visites

### 3.1. Créer une visite (POST)

**Endpoint**: `POST /api/visits`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "date": "2025-12-20T14:30:00.000Z",
  "reason": "Vaccination annuelle",
  "visitStatus": "scheduled",
  "observation": "Animal en bonne santé générale",
  "animalId": 1,
  "veterinarianId": 1
}
```

**Champs requis**: `date`, `reason`, `visitStatus`, `animalId`, `veterinarianId`

**Valeurs pour visitStatus**: `scheduled`, `completed`, `cancelled`

**Réponses attendues**:
- ✅ **201 Created**: Visite créée
  ```json
  {
    "data": {
      "id": 1,
      "attributes": {
        "date": "2025-12-20T14:30:00.000Z",
        "reason": "Vaccination annuelle",
        "visitStatus": "scheduled",
        "observation": "Animal en bonne santé générale",
        "animalId": 1,
        "veterinarianId": 1,
        "createdAt": "2025-12-19T10:30:00.000Z",
        "updatedAt": "2025-12-19T10:30:00.000Z"
      }
    }
  }
  ```

- ❌ **400 Bad Request**: Champs manquants ou invalides
- ❌ **404 Not Found**: Animal ou vétérinaire n'existe pas

---

### 3.2. Lister toutes les visites (GET)

**Endpoint**: `GET /api/visits?page=1&pageSize=25`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Query Parameters** (optionnels):
- `page`: Numéro de page (défaut: 1)
- `pageSize`: Nombre d'éléments par page (défaut: 25)

**Réponse attendue**:
- ✅ **200 OK**: Liste avec pagination

---

### 3.3. Récupérer une visite par ID (GET)

**Endpoint**: `GET /api/visits/:id`

**Exemple**: `GET /api/visits/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponses attendues**:
- ✅ **200 OK**: Visite trouvée
- ❌ **404 Not Found**: Visite non trouvée

---

### 3.4. Modifier une visite (PUT)

**Endpoint**: `PUT /api/visits/:id`

**Exemple**: `PUT /api/visits/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
Content-Type: application/json
```

**Body (JSON)** - Tous les champs requis:
```json
{
  "date": "2025-12-21T10:00:00.000Z",
  "reason": "Contrôle de routine",
  "visitStatus": "completed",
  "observation": "Vaccins à jour, animal en parfaite santé",
  "animalId": 1,
  "veterinarianId": 1
}
```

**Réponses attendues**:
- ✅ **200 OK**: Visite modifiée
- ❌ **404 Not Found**: Visite non trouvée

---

### 3.5. Supprimer une visite (DELETE)

**Endpoint**: `DELETE /api/visits/:id`

**Exemple**: `DELETE /api/visits/1`

**Headers**:
```
Authorization: Bearer <VOTRE_TOKEN>
```

**Réponses attendues**:
- ✅ **204 No Content**: Visite supprimée
- ❌ **404 Not Found**: Visite non trouvée

---

## Variables d'environnement Postman

Pour simplifier vos tests, créez un environnement dans Postman :

1. **Créer un environnement** :
   - Nom : "Patte & Cie - Dev"
   - Variables :
     - `baseUrl` = `http://localhost:3000/api`
     - `token` = (vide au départ, sera rempli automatiquement)
     - `userId` = (pour stocker l'ID de l'utilisateur connecté)

2. **Automatiser la capture du token** :
   Dans la requête `POST /api/users/login`, onglet **Tests** :
   ```javascript
   pm.test("Login successful", function () {
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.accessToken);
   });
   ```

3. **Utiliser les variables dans vos requêtes** :
   - URL : `{{baseUrl}}/users`
   - Authorization : Bearer Token → `{{token}}`

---

## Scénarios de test

### Scénario 1 : Workflow complet "Owner"

1. **Créer un utilisateur owner**
   - `POST {{baseUrl}}/users` avec `userRole: "owner"`
   - Vérifier statut 201

2. **Se connecter**
   - `POST {{baseUrl}}/users/login`
   - Sauvegarder le token automatiquement

3. **Créer un animal**
   - `POST {{baseUrl}}/animals` avec le token
   - Vérifier statut 201

4. **Lister ses animaux**
   - `GET {{baseUrl}}/animals` avec pagination
   - Vérifier la présence de l'animal créé

5. **Modifier l'animal**
   - `PUT {{baseUrl}}/animals/1` (mise à jour du poids par exemple)
   - Vérifier statut 200

6. **Créer une visite pour l'animal**
   - `POST {{baseUrl}}/visits`
   - Vérifier statut 201

7. **Consulter les visites**
   - `GET {{baseUrl}}/visits`
   - Vérifier la visite créée

---

### Scénario 2 : Tests de validation

1. **Email invalide**
   - `POST {{baseUrl}}/users` avec email sans `@`
   - Vérifier erreur 400

2. **Mot de passe trop court**
   - `POST {{baseUrl}}/users` avec password de 5 caractères
   - Vérifier erreur 400

3. **Email déjà existant**
   - Créer un user puis recréer avec même email
   - Vérifier erreur 409

4. **Gender invalide pour animal**
   - `POST {{baseUrl}}/animals` avec `gender: "X"`
   - Vérifier erreur 400

5. **Ressource inexistante**
   - `GET {{baseUrl}}/animals/99999`
   - Vérifier erreur 404

---

### Scénario 3 : Tests de sécurité (quand les routes seront protégées)

1. **Requête sans token**
   - `GET {{baseUrl}}/animals` sans header Authorization
   - Vérifier erreur 401

2. **Token expiré**
   - Utiliser un token de plus de 24h
   - Vérifier erreur 401

3. **Token invalide**
   - Utiliser un token modifié
   - Vérifier erreur 401

---

## Codes de statut HTTP

- **200 OK**: Requête GET/PATCH réussie
- **201 Created**: Ressource créée (POST)
- **204 No Content**: Suppression réussie (DELETE)
- **400 Bad Request**: Données invalides ou manquantes
- **401 Unauthorized**: Token manquant, invalide ou expiré
- **403 Forbidden**: Rôle insuffisant pour cette action
- **404 Not Found**: Ressource non trouvée
- **409 Conflict**: Conflit (ex: email déjà existant)
- **500 Internal Server Error**: Erreur serveur

---

## Notes importantes

- **Token JWT** : Valable 24 heures, contient `userId`, `email`, `userRole`
- **Pagination** : Par défaut `page=1` et `pageSize=25`
- **Format des dates** : ISO 8601 (`2025-12-20T14:30:00.000Z`)
- **Protection des routes** : Actuellement, l'authentification est implémentée mais pas encore appliquée aux routes
- **Cascade delete** : Supprimer un owner supprime ses animaux et leurs visites associées

---

## Ressources

- **Documentation Postman** : https://learning.postman.com/
- **Format de réponse** : Compatible avec Strapi (`data`, `attributes`, `meta`)
- **JWT.io** : https://jwt.io/ (pour décoder et inspecter vos tokens)
