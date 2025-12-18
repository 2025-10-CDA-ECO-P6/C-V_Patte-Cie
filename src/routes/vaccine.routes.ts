import { Router } from "express";
import { getVaccines,  getByIdVaccine } from "../controllers/vaccine.controller";
import { Request, Response } from "express";

const router = Router();

console.info('cc')


export const updateAnimalController = async (req: Request, res: Response) => {
res.send('ok' );
}

router.get("/", updateAnimalController);
router.get("/:id", getByIdVaccine);
// router.post("/", createVaccineController);
// router.put("/:id", updateVaccineController);
// router.delete("/:id", deleteVaccineController);

export default router;
