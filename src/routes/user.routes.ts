import { Router } from "express";
import { getUsers, getByIdUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getByIdUser);

export default router;
