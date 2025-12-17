import { Router } from "express";
import { 
  getAnimals, 
  getByIdAnimalController, 
  createAnimalController, 
  updateAnimalController, 
  deleteAnimalController 
} from "../controllers/animal.controller";

const router = Router();

router.get("/", getAnimals);
router.get("/:id", getByIdAnimalController);
router.post("/", createAnimalController);
router.put("/:id", updateAnimalController);
router.delete("/:id", deleteAnimalController);

export default router;
