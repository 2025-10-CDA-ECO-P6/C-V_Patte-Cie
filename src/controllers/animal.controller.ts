import { Request, Response } from "express";
import { fetchAllAnimals, fetchByIdAnimal, createAnimal } from "../services/animal.service";

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

export const createAnimalController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      species,
      breed,
      dateOfBirth,
      picture,
      weight,
      gender,
      ownerId,
    } = req.body;

    if (
      !name ||
      !species ||
      !breed ||
      !dateOfBirth ||
      !weight ||
      !gender ||
      !ownerId
    ) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    if (!["M", "F"].includes(gender)) {
      return res.status(400).json({ message: "Genre invalide" });
    }

    const animal = await createAnimal({
      name,
      species,
      breed,
      dateOfBirth: new Date(dateOfBirth),
      picture: picture ?? null,
      weight,
      gender,
      ownerId: Number(ownerId),
    });

    res.status(201).json(animal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};