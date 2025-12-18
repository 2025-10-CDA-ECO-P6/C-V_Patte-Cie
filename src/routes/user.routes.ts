import { Router } from "express";
import { getUsers, getByIdUser, postUser, patchUser, postLogin, deleteUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getByIdUser);
router.post("/", postUser);
router.patch("/:id", patchUser); // PATCH pour partial update (convention REST)
router.post("/login", postLogin);
router.delete("/:id", deleteUser);


export default router;
