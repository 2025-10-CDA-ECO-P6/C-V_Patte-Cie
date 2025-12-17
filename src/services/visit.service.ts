import * as visitRepo from "../repositories/visit.repository";
import { Prisma } from "@prisma/client";


// export interface AnimalInput {
//   name: string;
//   species: string;
//   breed: string;
//   dateOfBirth: Date;
//   picture?: string | null;
//   weight: string;
//   gender: "M" | "F";
//   ownerId: number;
// }

export const fetchAllVisits = async () => {
  try {
    return await visitRepo.getAllVisits();
  } catch (error) {
    throw new Error("Error fetching visits");
  }
};

export const fetchByIdVisit = async (visitId: number) => {
  const visit = await visitRepo.getByIdVisit(visitId);

  if (!visit) {
    throw new Error("Visit not found");
  }

  return visit;
};

// export const createAnimal = async (data: AnimalInput) => {
//   try {
//     return await animalRepo.createAnimal(data);
//   } catch (error) {
//     throw new Error("Error creating the animal: " + (error as Error).message);
//   }
// };

// export const updateAnimal = async (animalId: number, data: Partial<AnimalInput>) => {
//   try {
//     return await animalRepo.updateAnimal(animalId, data);
//   } catch (error) {
//     throw new Error("Error updating the animal: " + (error as Error).message);
//   }
// };

// export const deleteAnimal = async (animalId: number) => {
//   try {
//     return await animalRepo.deleteAnimal(animalId);
//   } catch (error) {
//     throw new Error("Error deleting the animal: " + (error as Error).message);
//   }
// };