import * as vaccineRepo from "../repositories/vaccine.repository";
import { VaccineInput, VaccineUpdateInput, VaccineWithRelations } from "../types";
import prisma from "../repositories/animal.repository";

export const fetchAllVaccines = async ( page: number, pageSize: number) => {
  try {
    return await vaccineRepo.getAllVaccines(page, pageSize);
  } catch (error) {
    throw new Error("Error fetching vaccines");
  }
};

export const fetchByIdVaccine = async (vaccineId: number) => {
  const vaccine = await vaccineRepo.getByIdVaccine(vaccineId);

  if (!vaccine) {
    throw new Error("Vaccine not found");
  }

  return vaccine;
};

export const createVaccineService = async (data: VaccineInput) => {
  if (data.animalId) {
    const animal = await prisma.animal.findUnique({
      where: { animalId: data.animalId },
    });
    if (!animal) {
      throw new Error("Animal not found");
    }
  }

  if (data.veterinarianId) {
    const vet = await prisma.veterinarian.findUnique({
      where: { veterinarianId: data.veterinarianId },
    });
    if (!vet) {
      throw new Error("Veterinarian not found");
    }
  }

  return vaccineRepo.createVaccine(data);
};

export const updateVaccineService = async (
  vaccineId: number,
  data: VaccineUpdateInput
): Promise<VaccineWithRelations> => {

  await fetchByIdVaccine(vaccineId); // Ensure vaccine exists
 
  return vaccineRepo.updateVaccine(vaccineId, data);
};

export const deleteVaccine = async (vaccineId: number): Promise<void> => {
  
  await fetchByIdVaccine(vaccineId); // Ensure vaccine exists
  await prisma.vaccine.delete({ where: { vaccineId } });
}