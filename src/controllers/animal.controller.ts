import { Request, Response } from "express";
import { fetchAllAnimals, fetchByIdAnimal } from "../services/animal.service";

export const getAnimals = async (req: Request, res: Response) => {
  try {
    const animals = await fetchAllAnimals();
    res.status(200).json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getByIdAnimal = async (req: Request, res: Response) => {
  try {
    const animalId = Number.parseInt(req.params.id);
    const animal = await fetchByIdAnimal(animalId);
    res.status(200).json(animal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};