import { Router } from "express";
import { getAnimals, getByIdAnimal } from "../controllers/animal.controller";


const router = Router();

router.get("/", getAnimals);
router.get("/:id", getByIdAnimal);

export default router;
