import { Request, Response } from "express";
import { fetchAllUsers, fetchByIdUser, createNewUser } from "../services/user.service";
import { CreateUserDTO } from "../types/user.types";


// create
export const postUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;
    const newUser = await createNewUser(userData);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// read
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//read by ID
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

// update

// delete