import { Router } from "express";
import { 
  getVets, 
  getByIdVet, 
  postVet, 
  patchVet, 
  deleteVetById 
} from "../controllers/veterinarian.controller";
import { 
  validateCreateVeterinarian, 
  validateUpdateVeterinarian 
} from "../middlewares/validatorVeterinarian.middlewares";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Veterinarians
 *   description: Gestion des vétérinaires
 */

/**
 * @swagger
 * /veterinarians:
 *   get:
 *     summary: Récupérer tous les vétérinaires
 *     tags: [Veterinarians]
 *     responses:
 *       200:
 *         description: Liste des vétérinaires
 */
router.get("/", getVets);

/**
 * @swagger
 * /veterinarians/{id}:
 *   get:
 *     summary: Récupérer un vétérinaire par ID
 *     tags: [Veterinarians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vétérinaire
 *     responses:
 *       200:
 *         description: Vétérinaire trouvé
 *       404:
 *         description: Vétérinaire non trouvé
 */
router.get("/:id", getByIdVet);

/**
 * @swagger
 * /veterinarians:
 *   post:
 *     summary: Créer un nouveau vétérinaire
 *     tags: [Veterinarians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vétérinaire créé
 */
router.post("/", validateCreateVeterinarian, postVet);

/**
 * @swagger
 * /veterinarians/{id}:
 *   patch:
 *     summary: Mettre à jour partiellement un vétérinaire
 *     tags: [Veterinarians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vétérinaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vétérinaire mis à jour
 *       404:
 *         description: Vétérinaire non trouvé
 */
router.patch("/:id", validateUpdateVeterinarian, patchVet);

/**
 * @swagger
 * /veterinarians/{id}:
 *   delete:
 *     summary: Supprimer un vétérinaire
 *     tags: [Veterinarians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vétérinaire
 *     responses:
 *       204:
 *         description: Vétérinaire supprimé
 *       404:
 *         description: Vétérinaire non trouvé
 */
router.delete("/:id", deleteVetById);

export default router;
