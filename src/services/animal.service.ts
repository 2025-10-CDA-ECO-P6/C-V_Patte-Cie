import * as animalRepo from "../repositories/animal.repository";
import { Prisma } from "@prisma/client";


export interface AnimalInput {
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  picture?: string | null;
  weight: string;
  gender: "M" | "F";
  ownerId: number;
}

export const fetchAllAnimals = async (
  page: number,
  pageSize: number
) => {
  return animalRepo.getAllAnimals(page, pageSize);
};

export const fetchByIdAnimal = async (animalId: number) => {
  try {
    const animal = await animalRepo.getByIdAnimal(animalId);
    return animal;
  } catch (error) {
    throw new Error("Error fetching animal: " + (error as Error).message);
  }
};

export const createAnimal = async (data: AnimalInput) => {
  try {
    return await animalRepo.createAnimal(data);
  } catch (error) {
    throw new Error("Error creating the animal: " + (error as Error).message);
  }
};

export const updateAnimal = async (animalId: number, data: Partial<AnimalInput>) => {
  try {
    return await animalRepo.updateAnimal(animalId, data);
  } catch (error) {
    throw new Error("Error updating the animal: " + (error as Error).message);
  }
};

export const deleteAnimal = async (animalId: number) => {
  try {
    return await animalRepo.deleteAnimal(animalId);
  } catch (error) {
    throw new Error("Error deleting the animal: " + (error as Error).message);
  }
};