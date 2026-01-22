import * as vetRepo from "../repositories/veterinarian.repository";
import * as userRepo from "../repositories/user.repository";
import { UserRole } from "@prisma/client";

import {
  CreateVeterinarianDTO,
  UpdateVeterinarianDTO,
  PaginatedVets,
  VeterinarianWithRelations,
} from "../types/veterinarian.type";
import ErrorException from "../types/errorException";

// CREATE
export const createNewVet = async (vetData: CreateVeterinarianDTO) => {
  const user = await userRepo.getByIdUser(vetData.userId);
  if (!user) throw new ErrorException(404, "User not found");
  if (user.userRole !== "veterinarian") throw new ErrorException(400, "User role must be 'veterinarian'");

  const existingVet = await vetRepo.getVetByUserId(vetData.userId);
  if (existingVet) throw new ErrorException(409, "Veterinarian profile already exists for this user");

  // Créer le vétérinaire
  const createdVet = await vetRepo.createVet({
    userId: vetData.userId,
    name: vetData.name,
    phone: vetData.phone,
    createdAt: new Date(),
  });

  // Recharger avec 'user' complet
  const vetWithUser = await vetRepo.getByIdVet(createdVet.veterinarianId);
  return vetWithUser!;
};


// READ ALL
export const fetchAllVets = async (page = 1, pageSize = 25): Promise<PaginatedVets> => {
  const result = await vetRepo.getAllVets(page, pageSize);
  return result;
};

// READ BY ID
export const fetchByIdVet = async (vetId: string): Promise<VeterinarianWithRelations> => {
  const vet = await vetRepo.getByIdVet(vetId);
  if (!vet) throw new ErrorException(404, "Veterinarian not found");
  return vet;
};

// READ BY USER ID
export const fetchVetByUserId = async (userId: string): Promise<VeterinarianWithRelations> => {
  const vet = await vetRepo.getVetByUserId(userId);
  if (!vet) throw new ErrorException(404, "Veterinarian not found for this user");
  return vet;
};

// UPDATE
export const updateVetById = async (vetId: string, vetData: UpdateVeterinarianDTO) => {
  const existingVet = await vetRepo.getByIdVet(vetId);
  if (!existingVet) throw new ErrorException(404, "Veterinarian not found");

  await vetRepo.updateVet(vetId, vetData);

  // Recharger avec 'user' complet
  const updatedVet = await vetRepo.getByIdVet(vetId);
  return updatedVet!;
};


// DELETE
export const deleteVetById = async (vetId: string) => {
  const vet = await vetRepo.getByIdVet(vetId);
  if (!vet) throw new ErrorException(404, "Veterinarian not found");

  await vetRepo.deleteVet(vetId);
  return { message: "Veterinarian successfully deleted" };
};
