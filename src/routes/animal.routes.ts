import { Router } from "express";
import { 
  getAnimals, 
  getByIdAnimalController, 
  createAnimalController, 
  updateAnimalController, 
  deleteAnimalController 
} from "../controllers/animal.controller";
import { authorizeRoles, authenticateToken } from "../middlewares/auth.middleware";
import { validateCreateAnimal, validateUpdateAnimal } from "../middlewares/validatorAnimal.middlewares";

const router = Router();

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
router.get("/", getAnimals);

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
router.get("/:id", getByIdAnimalController);

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
router.post("/", authenticateToken, authorizeRoles("veterinarian"), validateCreateAnimal, createAnimalController);

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
router.put("/:id", authenticateToken, authorizeRoles("veterinarian"), validateUpdateAnimal, updateAnimalController);

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
router.delete("/:id", authenticateToken, authorizeRoles("veterinarian"), deleteAnimalController);

export default router;
