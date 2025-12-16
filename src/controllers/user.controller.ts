import { Request, Response } from "express";
import { fetchAllUsers, fetchByIdUser } from "../services/user.service";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getByIdUser = async (req: Request, res: Response) => {
  try {
    const userId = Number.parseInt(req.params.id);
    const user = await fetchByIdUser(userId);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
