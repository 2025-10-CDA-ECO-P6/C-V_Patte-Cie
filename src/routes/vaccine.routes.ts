import { Router } from "express";
import { getVaccines,  getByIdVaccine } from "../controllers/vaccine.controller";
import { Request, Response } from "express";

const router = Router();

router.get("/", getVaccines);
router.get("/:id", getByIdVaccine);
// router.post("/", createVaccineController);
// router.put("/:id", updateVaccineController);
// router.delete("/:id", deleteVaccineController);

export default router;
