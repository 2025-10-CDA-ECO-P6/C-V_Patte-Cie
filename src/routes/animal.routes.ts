import { Router } from "express";
import { 
  getAnimals, 
  getByIdAnimalController, 
  createAnimalController, 
  updateAnimalController, 
  deleteAnimalController 
} from "../controllers/animal.controller";
import { authorizeRoles, authenticateToken } from "../middlewares/auth.middleware";
import { validateCreateAnimal, validateUpdateAnimal } from "../middlewares/validatorAnimal.middlewares";

const router = Router();

router.get("/", getAnimals);
router.get("/:id", getByIdAnimalController);
router.post("/", authenticateToken, authorizeRoles("veterinarian"), validateCreateAnimal, createAnimalController);
router.put("/:id", authenticateToken, authorizeRoles("veterinarian"),validateUpdateAnimal, updateAnimalController);
router.delete("/:id", authenticateToken, authorizeRoles("veterinarian"), deleteAnimalController);

export default router;
