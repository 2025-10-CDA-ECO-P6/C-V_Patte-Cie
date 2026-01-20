import { Router } from "express";
import { 
  getVisits, 
  getByIdVisit, 
  createVisitController, 
  updateVisitController, 
  deleteVisitController 
} from "../controllers/visit.controller";

import { authorizeRoles, authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getVisits);
router.get("/:id", getByIdVisit);
router.post("/", authenticateToken, authorizeRoles("veterinarian"),createVisitController);
router.put("/:id", authenticateToken, authorizeRoles("veterinarian"), updateVisitController);
router.delete("/:id", authenticateToken, authorizeRoles("veterinarian"), deleteVisitController);

export default router;
