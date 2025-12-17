import { Request, Response } from "express";
import { fetchAllAnimals, fetchByIdAnimal, createAnimal, AnimalInput } from "../services/animal.service";

export const getAnimals = async (req: Request, res: Response) => {
  try {
    const animals = await fetchAllAnimals();
    res.status(200).json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getByIdAnimal = async (req: Request, res: Response) => {
  try {
    const animalId = Number.parseInt(req.params.id);
    const animal = await fetchByIdAnimal(animalId);
    res.status(200).json(animal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAnimalController = async (req: Request, res: Response) => {
  try {
    const { name, species, breed, dateOfBirth, picture, weight, gender, ownerId } = req.body;

    if (!name || !species || !breed || !dateOfBirth || !weight || !gender || !ownerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["M", "F"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    const animalData: AnimalInput = {
      name,
      species,
      breed,
      dateOfBirth: new Date(dateOfBirth),
      picture: picture ?? null,
      weight,
      gender,
      ownerId: Number(ownerId),
    };

    const animal = await createAnimal(animalData);

    res.status(201).json({
      data: {
        id: animal.animalId,
        attributes: {
          name: animal.name,
          species: animal.species,
          breed: animal.breed,
          dateOfBirth: animal.dateOfBirth,
          picture: animal.picture,
          weight: animal.weight,
          gender: animal.gender,
          owner: animal.owner,
          vaccines: animal.vaccines,
          visits: animal.visits,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};