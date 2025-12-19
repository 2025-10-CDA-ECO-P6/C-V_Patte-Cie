import { Router } from "express";
import { getVaccines,  getByIdVaccine, createVaccineController, updateVaccineController, deleteVaccineController } from "../controllers/vaccine.controller";
import { validateCreateVaccine, validateUpdateVaccine } from "../middlewares/validatorVaccine.middlewares";
const router = Router();

router.get("/", getVaccines);
router.get("/:id", getByIdVaccine);
router.post("/", validateCreateVaccine, createVaccineController);
router.put("/:id", validateUpdateVaccine, updateVaccineController);
router.delete("/:id", deleteVaccineController);

export default router;
