import { Router } from "express";
import { 
  getVaccines,  
  getByIdVaccine, 
  createVaccineController, 
  updateVaccineController, 
  deleteVaccineController 
} from "../controllers/vaccine.controller";
import { validateCreateVaccine, validateUpdateVaccine } from "../middlewares/validatorVaccine.middlewares";
import { authorizeRoles, authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vaccines
 *   description: Gestion des vaccins
 */

/**
 * @swagger
 * /vaccines:
 *   get:
 *     summary: Récupérer tous les vaccins
 *     tags: [Vaccines]
 *     responses:
 *       200:
 *         description: Liste des vaccins
 */
router.get("/", getVaccines);

/**
 * @swagger
 * /vaccines/{id}:
 *   get:
 *     summary: Récupérer un vaccin par ID
 *     tags: [Vaccines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vaccin
 *     responses:
 *       200:
 *         description: Vaccin trouvé
 *       404:
 *         description: Vaccin non trouvé
 */
router.get("/:id", getByIdVaccine);

/**
 * @swagger
 * /vaccines:
 *   post:
 *     summary: Créer un nouveau vaccin
 *     tags: [Vaccines]
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
 *               administrationDate:
 *                 type: string
 *                 format: date
 *               vaccineStatus:
 *                 type: string
 *                 enum: [pending, administered, expired]
 *               reminderDelays:
 *                 type: array
 *                 items:
 *                   type: integer
 *               animalId:
 *                 type: string
 *               veterinarianId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vaccin créé
 */
router.post("/", authenticateToken, authorizeRoles("veterinarian"), validateCreateVaccine, createVaccineController);

/**
 * @swagger
 * /vaccines/{id}:
 *   put:
 *     summary: Mettre à jour un vaccin
 *     tags: [Vaccines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vaccin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               administrationDate:
 *                 type: string
 *                 format: date
 *               vaccineStatus:
 *                 type: string
 *                 enum: [pending, administered, expired]
 *               reminderDelays:
 *                 type: array
 *                 items:
 *                   type: integer
 *               animalId:
 *                 type: string
 *               veterinarianId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vaccin mis à jour
 *       404:
 *         description: Vaccin non trouvé
 */
router.put("/:id", authenticateToken, authorizeRoles("veterinarian"), validateUpdateVaccine, updateVaccineController);

/**
 * @swagger
 * /vaccines/{id}:
 *   delete:
 *     summary: Supprimer un vaccin
 *     tags: [Vaccines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vaccin
 *     responses:
 *       204:
 *         description: Vaccin supprimé
 *       404:
 *         description: Vaccin non trouvé
 */
router.delete("/:id", authenticateToken, authorizeRoles("veterinarian"), deleteVaccineController);

export default router;
