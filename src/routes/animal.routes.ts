import { Router } from "express";
import { getAnimals } from "../controllers/animal.controller";

const router = Router();

router.get("/", getAnimals);

export default router;
