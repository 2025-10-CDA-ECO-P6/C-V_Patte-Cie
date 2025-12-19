import { Router } from "express";
import animalRoutes from "./animal.routes";
import userRoutes from "./user.routes";
import visitRoutes from "./visit.routes";
import vaccineRoutes from "./vaccine.routes";
import ownerRoutes from "./owner.routes";

const router = Router();

router.use("/animals", animalRoutes);
router.use("/users", userRoutes);
router.use("/visits", visitRoutes);
router.use("/vaccines", vaccineRoutes);
router.use("/owners", ownerRoutes);

export default router;
