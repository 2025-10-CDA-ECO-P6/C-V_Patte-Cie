import { Router } from "express";
import { getVets, getByIdVet, postVet, patchVet, deleteVetById } from "../controllers/veterinarian.controller";
import { validateCreateVeterinarian, validateUpdateVeterinarian } from "../middlewares/validatorVeterinarian.middlewares";

const router = Router();

router.get("/", getVets);
router.get("/:id", getByIdVet);
router.post("/", validateCreateVeterinarian, postVet);
router.patch("/:id", validateUpdateVeterinarian, patchVet);
router.delete("/:id", deleteVetById);

export default router;