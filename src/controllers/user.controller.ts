import { Request, Response } from "express";
import { fetchAllUsers } from "../services/user.service";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
