import { Router } from "express";
import { 
  getVisits, 
  getByIdVisit, 
  createVisitController, 
  updateVisitController, 
  deleteVisitController 
} from "../controllers/visit.controller";
import { authorizeRoles, authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: Gestion des visites vétérinaires
 */

/**
 * @swagger
 * /visits:
 *   get:
 *     summary: Récupérer toutes les visites
 *     tags: [Visits]
 *     responses:
 *       200:
 *         description: Liste des visites
 */
router.get("/", getVisits);

/**
 * @swagger
 * /visits/{id}:
 *   get:
 *     summary: Récupérer une visite par ID
 *     tags: [Visits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visite
 *     responses:
 *       200:
 *         description: Visite trouvée
 *       404:
 *         description: Visite non trouvée
 */
router.get("/:id", getByIdVisit);

/**
 * @swagger
 * /visits:
 *   post:
 *     summary: Créer une nouvelle visite
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *               visitStatus:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *               observation:
 *                 type: string
 *               animalId:
 *                 type: string
 *               veterinarianId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Visite créée
 */
router.post("/", authenticateToken, authorizeRoles("veterinarian"), createVisitController);

/**
 * @swagger
 * /visits/{id}:
 *   put:
 *     summary: Mettre à jour une visite
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *               visitStatus:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *               observation:
 *                 type: string
 *               animalId:
 *                 type: string
 *               veterinarianId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Visite mise à jour
 *       404:
 *         description: Visite non trouvée
 */
router.put("/:id", authenticateToken, authorizeRoles("veterinarian"), updateVisitController);

/**
 * @swagger
 * /visits/{id}:
 *   delete:
 *     summary: Supprimer une visite
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visite
 *     responses:
 *       204:
 *         description: Visite supprimée
 *       404:
 *         description: Visite non trouvée
 */
router.delete("/:id", authenticateToken, authorizeRoles("veterinarian"), deleteVisitController);

export default router;
