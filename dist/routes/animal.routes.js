"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const animal_controller_1 = require("../controllers/animal.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validatorAnimal_middlewares_1 = require("../middlewares/validatorAnimal.middlewares");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Animals
 *   description: Gestion des animaux
 */
/**
 * @swagger
 * /animals:
 *   get:
 *     summary: Récupérer tous les animaux
 *     tags: [Animals]
 *     responses:
 *       200:
 *         description: Liste des animaux
 */
router.get("/", animal_controller_1.getAnimals);
/**
 * @swagger
 * /animals/{id}:
 *   get:
 *     summary: Récupérer un animal par ID
 *     tags: [Animals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'animal
 *     responses:
 *       200:
 *         description: Animal trouvé
 *       404:
 *         description: Animal non trouvé
 */
router.get("/:id", animal_controller_1.getByIdAnimalController);
/**
 * @swagger
 * /animals:
 *   post:
 *     summary: Créer un nouvel animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               picture:
 *                 type: string
 *               weight:
 *                 type: number
 *               gender:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Animal créé
 */
router.post("/", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)("veterinarian"), validatorAnimal_middlewares_1.validateCreateAnimal, animal_controller_1.createAnimalController);
/**
 * @swagger
 * /animals/{id}:
 *   put:
 *     summary: Mettre à jour un animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'animal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               picture:
 *                 type: string
 *               weight:
 *                 type: number
 *               gender:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Animal mis à jour
 *       404:
 *         description: Animal non trouvé
 */
router.put("/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)("veterinarian"), validatorAnimal_middlewares_1.validateUpdateAnimal, animal_controller_1.updateAnimalController);
/**
 * @swagger
 * /animals/{id}:
 *   delete:
 *     summary: Supprimer un animal
 *     tags: [Animals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'animal
 *     responses:
 *       204:
 *         description: Animal supprimé
 *       404:
 *         description: Animal non trouvé
 */
router.delete("/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)("veterinarian"), animal_controller_1.deleteAnimalController);
exports.default = router;
