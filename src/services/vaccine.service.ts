import * as vaccineRepo from "../repositories/vaccine.repository";
import * as animalRepo from "../repositories/animal.repository";

import { VaccineInput, VaccineUpdateInput, VaccineWithRelations } from "../types";

export const fetchAllVaccines = async (page: number, pageSize: number) => {
  try {
    return await vaccineRepo.getAllVaccines(page, pageSize);
  } catch (error) {
    throw new Error("Erreur lors de la récupération des vaccins");
  }
};

export const fetchByIdVaccine = async (vaccineId: string) => {
  const vaccine = await vaccineRepo.getByIdVaccine(vaccineId);

  if (!vaccine) {
    throw new Error("Vaccin non trouvé");
  }

  return vaccine;
};

export const createVaccineService = async (data: VaccineInput) => {
  if (data.animalId) {
    const animal = await animalRepo.getByIdAnimal(data.animalId);
    if (!animal) {
      throw new Error("Animal non trouvé");
    }
  }

  // -> quand crud vet existera
  // if (data.veterinarianId) {
  //   const vet = await veterinarianRepo.getByIdVeterinarian(data.veterinarianId);
  //   if (!vet) {
  //     throw new Error("Véterinaire non trouvé");
  //   }
  // }

  return vaccineRepo.createVaccine(data);
};

export const updateVaccineService = async (
  vaccineId: string,
  data: VaccineUpdateInput
): Promise<VaccineWithRelations> => {
  await fetchByIdVaccine(vaccineId); // Ensure vaccine exists

   if (data.animalId) {
    const animal = await animalRepo.getByIdAnimal(data.animalId);
    if (!animal) {
      throw new Error("Animal non trouvé");
    }
  }

  // -> quand crud vet existera
  // if (data.veterinarianId) {
  //   const vet = await veterinarianRepo.getByIdVeterinarian(data.veterinarianId);
  //   if (!vet) {
  //     throw new Error("Veterinarian non trouvé");
  //   }
  // }
  return vaccineRepo.updateVaccine(vaccineId, data);
};

export const deleteVaccine = async (vaccineId: string): Promise<void> => {
  await fetchByIdVaccine(vaccineId); // Ensure vaccine exists
  await vaccineRepo.deleteVaccine(vaccineId);
};
