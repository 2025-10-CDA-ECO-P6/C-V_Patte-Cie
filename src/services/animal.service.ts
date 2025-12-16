import * as animalRepository from '../repositories/animal.repository';
import { Animal } from '@prisma/client';

export const getAllAnimals = async (): Promise<Animal[]> => {
  const animals = await animalRepository.getAllAnimals();
  return animals;
};
