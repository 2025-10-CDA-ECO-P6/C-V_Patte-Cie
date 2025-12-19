import { Router } from "express";
import { getVets, getByIdVet, postVet, patchVet, deleteVet } from "../controllers/owner.controller";

const router = Router();

router.get("/", getVets);
router.get("/:id", getByIdVet);
router.post("/", postVet);
router.patch("/:id", patchVet);
router.delete("/:id", deleteVet);

export default router;