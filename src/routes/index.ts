import { Router } from "express";
import animalRoutes from "./animal.routes";
import userRoutes from "./user.routes";
import visitRoutes from "./visit.routes";
import vaccineRoutes from "./vaccine.routes";

const router = Router();

router.use("/animals", animalRoutes);
router.use("/users", userRoutes);
router.use("/visits", visitRoutes);
router.use("/vaccines", vaccineRoutes);

export default router;
