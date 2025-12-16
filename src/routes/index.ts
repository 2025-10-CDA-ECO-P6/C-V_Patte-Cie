import { Router } from "express";
import animalRoutes from "./animal.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/animals", animalRoutes);
router.use("/users", userRoutes);

export default router;
