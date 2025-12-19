import { Router } from "express";
import { getOwners, getByIdOwner, postOwner, patchOwner, deleteOwner } from "../controllers/owner.controller";

const router = Router();

router.get("/", getOwners);
router.get("/:id", getByIdOwner);
router.post("/", postOwner);
router.patch("/:id", patchOwner);
router.delete("/:id", deleteOwner);


export default router;
