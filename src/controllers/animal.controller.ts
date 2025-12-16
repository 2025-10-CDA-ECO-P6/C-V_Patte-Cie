// src/controllers/animal.controller.ts
import { Request, Response } from "express";
import { fetchAllAnimals } from "../services/animal.service";

export const getAnimals = async (req: Request, res: Response) => {
  try {
    const animals = await fetchAllAnimals();
    res.status(200).json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
