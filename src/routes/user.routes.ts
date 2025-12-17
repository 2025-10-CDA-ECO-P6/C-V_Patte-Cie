import { Router } from "express";
import { getUsers, getByIdUser, postUser, postLogin } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getByIdUser);
router.post("/", postUser);
router.post("/login", postLogin);

export default router;
