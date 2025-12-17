import { Router } from "express";
import { getUsers, getByIdUser, postUser, postLogin, deleteUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getByIdUser);
router.post("/", postUser);
router.post("/login", postLogin);
router.delete("/:id", deleteUser);


export default router;
