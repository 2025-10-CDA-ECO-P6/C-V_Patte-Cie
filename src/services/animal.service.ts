import * as animalRepo from "../repositories/animal.repository";

export const fetchAllAnimals = async () => {
  try {
    const animals = await animalRepo.getAllAnimals();
    return animals;
  } catch (error) {
    throw new Error("Error fetching animals: " + (error as Error).message);
  }
};
