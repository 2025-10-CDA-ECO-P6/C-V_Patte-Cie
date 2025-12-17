import { Router } from "express";
import { getAnimals, getByIdAnimal, createAnimalController } from "../controllers/animal.controller";


const router = Router();

router.get("/", getAnimals);
router.get("/:id", getByIdAnimal);
router.post("/", createAnimalController);

export default router;
