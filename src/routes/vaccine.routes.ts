import { Router } from "express";
import { getVaccines,  getByIdVaccine, createVaccineController, updateVaccineController, deleteVaccineController } from "../controllers/vaccine.controller";
import { validateCreateVaccine, validateUpdateVaccine } from "../middlewares/validatorVaccine.middlewares";
import { authorizeRoles, authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getVaccines);
router.get("/:id", getByIdVaccine);
router.post("/", authenticateToken, authorizeRoles("veterinarian"), validateCreateVaccine, createVaccineController);
router.put("/:id", authenticateToken, authorizeRoles("veterinarian"), validateUpdateVaccine, updateVaccineController);
router.delete("/:id", authenticateToken, authorizeRoles("veterinarian"), deleteVaccineController);

export default router;
