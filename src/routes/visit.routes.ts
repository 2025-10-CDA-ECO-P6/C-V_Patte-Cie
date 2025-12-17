import { Router } from "express";
import { 
  getVisits, 
  // getByIdVisit, 
  // // createVisitController, 
  // // updateVisitController, 
  // // deleteVisitController 
} from "../controllers/visit.controller";

const router = Router();

router.get("/", getVisits);
// router.get("/:id", getByIdVisit);
// router.post("/", createVisitController);
// router.put("/:id", updateVisitController);
// router.delete("/:id", deleteVisitController);

export default router;
