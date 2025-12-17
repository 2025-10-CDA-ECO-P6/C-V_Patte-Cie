import { Router } from "express";
import { getUsers, getByIdUser, postUser  } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getByIdUser);
router.post("/", postUser);

export default router;
