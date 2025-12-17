import { Request, Response } from "express";
import { fetchAllAnimals, fetchByIdAnimal, createAnimal, updateAnimal, deleteAnimal, AnimalInput } from "../services/animal.service";
import { Prisma } from "@prisma/client";
import { mapAnimal } from "../utils/animal.mapper";

export const getAnimals = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    const { animals, total } = await fetchAllAnimals(page, pageSize);

    const pageCount = Math.ceil(total / pageSize);

    res.status(200).json({
      data: animals.map(mapAnimal),
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount,
          total,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getByIdAnimalController = async (req: Request, res: Response) => {
  try {
    const animalId = Number(req.params.id);

    if (isNaN(animalId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const animal = await fetchByIdAnimal(animalId);

    res.status(200).json({
      data: mapAnimal(animal),
    });
  } catch (error) {
    if ((error as Error).message.includes("not found")) {
      return res.status(404).json({ message: "Animal not found" });
    }

    console.error(error);
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

export const updateAnimalController = async (req: Request, res: Response) => {
  try {
    const animalId = Number(req.params.id);
    if (isNaN(animalId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const existingAnimal = await fetchByIdAnimal(animalId);
    if (!existingAnimal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    const data: Partial<AnimalInput> = { ...req.body };

    if (isNaN(Number(data.weight))) {
  return res.status(400).json({ message: "Invalid weight" });
}

    if (data.dateOfBirth && typeof data.dateOfBirth === "string") {
      const parsedDate = new Date(data.dateOfBirth);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid dateOfBirth" });
      }
      data.dateOfBirth = parsedDate;
    }

    if (data.gender && !["M", "F"].includes(data.gender)) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    const updatedAnimal = await updateAnimal(animalId, data);

    res.status(200).json({
      data: {
        id: updatedAnimal.animalId,
        attributes: {
          name: updatedAnimal.name,
          species: updatedAnimal.species,
          breed: updatedAnimal.breed,
          dateOfBirth: updatedAnimal.dateOfBirth,
          picture: updatedAnimal.picture,
          weight: updatedAnimal.weight,
          gender: updatedAnimal.gender,
          owner: updatedAnimal.owner,
          vaccines: updatedAnimal.vaccines,
          visits: updatedAnimal.visits,
        },
      },
    });
  } catch (err) {
    console.error(err);
    if ((err as Error).message.includes("Foreign key constraint")) {
      return res.status(400).json({ message: "Invalid ownerId" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAnimalController = async (req: Request, res: Response) => {
  try {
    const animalId = Number(req.params.id);
    if (isNaN(animalId)) return res.status(400).json({ message: "Invalid ID" });

    await deleteAnimal(animalId);
    res.status(204).json();
  } catch (err) {
    console.error(err);
    if ((err as Error).message.includes("not found")) {
      return res.status(404).json({ message: (err as Error).message });
    }
    res.status(500).json({ message: "Server error" });
  }
};