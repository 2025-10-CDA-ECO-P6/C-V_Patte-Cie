import * as animalRepo from "../repositories/animal.repository";

export const fetchAllAnimals = async () => {
  try {
    const animals = await animalRepo.getAllAnimals();
    return animals;
  } catch (error) {
    throw new Error("Error fetching animals: " + (error as Error).message);
  }
};

export const fetchByIdAnimal = async (animalId: number) => {
  try {
    const animal = await animalRepo.getByIdAnimal(animalId);
    return animal;
  } catch (error) {
    throw new Error("Error fetching animal: " + (error as Error).message);
  }
};