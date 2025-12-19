import { Router } from "express";
import { getVaccines,  getByIdVaccine, createVaccineController } from "../controllers/vaccine.controller";
import { validateCreateVaccine } from "../middlewares/validatorVaccine.middlewares";
const router = Router();

router.get("/", getVaccines);
router.get("/:id", getByIdVaccine);
router.post("/", validateCreateVaccine, createVaccineController);
// router.put("/:id", updateVaccineController);
// router.delete("/:id", deleteVaccineController);

export default router;
