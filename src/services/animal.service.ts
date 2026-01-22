import * as animalRepo from "../repositories/animal.repository";
import { AnimalInput, AnimalUpdateInput, AnimalWithRelations } from "../types";
import { Prisma } from "@prisma/client";

export const fetchAllAnimals = async (
  page: number,
  pageSize: number
) => {
  return animalRepo.getAllAnimals(page, pageSize);
};

export const fetchByIdAnimal = async (animalId: string) => {
  try {
    const animal = await animalRepo.getByIdAnimal(animalId);
    return animal;
  } catch (error) {
    throw new Error("Error fetching animal: " + (error as Error).message);
  }
};

export const createAnimal = async (data: AnimalInput): Promise<AnimalWithRelations> => {
  try {
    return await animalRepo.createAnimal({
      ...data,
      weight: new Prisma.Decimal(data.weight), 
    });
  } catch (error) {
    throw new Error("Error creating the animal: " + (error as Error).message);
  }
};

export const updateAnimal = async (animalId: string, data: AnimalUpdateInput) => {
  try {
    const updateData = { ...data };

    // Si on met à jour le poids
    if (data.weight !== undefined) {
      updateData.weight = new Prisma.Decimal(data.weight);
    }

    return await animalRepo.updateAnimal(animalId, updateData);
  } catch (error) {
    throw new Error("Error updating the animal: " + (error as Error).message);
  }
};

export const deleteAnimal = async (animalId: string) => {
  try {
    return await animalRepo.deleteAnimal(animalId);
  } catch (error) {
    throw new Error("Error deleting the animal: " + (error as Error).message);
  }
};
