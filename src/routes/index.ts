import { Router } from "express";
import animalRoutes from "./animal.routes";
import userRoutes from "./user.routes";
import visitRoutes from "./visit.routes";

const router = Router();

router.use("/animals", animalRoutes);
router.use("/users", userRoutes);
router.use("/visits", visitRoutes);

export default router;
