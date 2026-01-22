import { Router } from "express";
import { getOwners, getByIdOwner, postOwner, patchOwner, deleteOwner } from "../controllers/owner.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Owners
 *   description: Gestion des propriétaires d'animaux
 */

/**
 * @swagger
 * /owners:
 *   get:
 *     summary: Récupérer tous les propriétaires
 *     tags: [Owners]
 *     responses:
 *       200:
 *         description: Liste des propriétaires
 */
router.get("/", getOwners);

/**
 * @swagger
 * /owners/{id}:
 *   get:
 *     summary: Récupérer un propriétaire par ID
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du propriétaire
 *     responses:
 *       200:
 *         description: Propriétaire trouvé
 *       404:
 *         description: Propriétaire non trouvé
 */
router.get("/:id", getByIdOwner);

/**
 * @swagger
 * /owners:
 *   post:
 *     summary: Créer un nouveau propriétaire
 *     tags: [Owners]
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
 *               address:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Propriétaire créé
 */
router.post("/", postOwner);

/**
 * @swagger
 * /owners/{id}:
 *   patch:
 *     summary: Mettre à jour partiellement un propriétaire
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du propriétaire
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
 *               address:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Propriétaire mis à jour
 *       404:
 *         description: Propriétaire non trouvé
 */
router.patch("/:id", patchOwner);

/**
 * @swagger
 * /owners/{id}:
 *   delete:
 *     summary: Supprimer un propriétaire
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du propriétaire
 *     responses:
 *       204:
 *         description: Propriétaire supprimé
 *       404:
 *         description: Propriétaire non trouvé
 */
router.delete("/:id", deleteOwner);

export default router;
