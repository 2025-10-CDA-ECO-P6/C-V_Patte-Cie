import * as vaccineRepo from "../repositories/vaccine.repository";
import { VaccineInput, VaccineUpdateInput, VaccineWithRelations } from "../types";

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
    throw new Error("vaccine not found");
  }

  return vaccine;
};
