import * as vetRepo from "../repositories/owner.repository";
import * as userRepo from "../repositories/user.repository";
import { CreateVetDTO, UpdateVetDTO } from "../types/veterinarian.type";
import "../types/errorException";

export const createNewVet = async (vetData: CreateVetDTO) => {
  const user = await userRepo.getByIdUser(vetData.userId);
  if (!user) {
    throw new ErrorException(404, "User not found");
  }

  if (user.userRole !== "veterinarian") {
    throw new ErrorException(400,"User role must be 'veterinarian'");
  }

  const existingVet = await vetRepo.getVetByUserId(vetData.userId);
  if (existingVet) {
    throw new ErrorException(409, "Veterinarian profile already exists for this user");
  }

  if (!vetData.name || vetData.name.trim().length === 0) {
    throw new ErrorException(400, "Name is required");
  }

  if (!vetData.phone || vetData.phone.trim().length === 0) {
    throw new ErrorException(400, "Phone is required");
  }

  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(vetData.phone)) {
    throw new ErrorException(400, "Invalid phone format");
  }

  const vet = await vetRepo.createVet({
    userId: vetData.userId,
    name: vetData.name,
    phone: vetData.phone,
    createdAt: new Date(),
  });

  return vet;
};

export const fetchAllVets = async (page: number = 1, pageSize: number = 25) => {
  try {
    const result = await vetRepo.getAllVets(page, pageSize);
    return result;
  } catch (error) {
    throw new ErrorException(500, "Error fetching veterinarians: " + (error as Error).message);
  }
};

export const fetchByIdVet = async (vetId: number) => {
  const vet = await vetRepo.getByIdVet(vetId);

  if (!vet) {
    throw new ErrorException(404, "Veterinarian not found");
  }

  return vet;
};

export const fetchVetByUserId = async (userId: number) => {
  const vet = await vetRepo.getVetByUserId(userId);

  if (!vet) {
    throw new ErrorException(404, "Veterinarian not found for this user");
  }

  return vet;
};

export const updateVetById = async (vetId: number, vetData: UpdateVetDTO) => {
  const existingVet = await vetRepo.getByIdVet(vetId);
  if (!existingVet) {
    throw new ErrorException(404, "Veterinarian not found");
  }

  const updateData: {
    name?: string;
    phone?: string;
  } = {};

  if (vetData.name !== undefined) {
    if (vetData.name.trim().length === 0) {
      throw new ErrorException(400, "Name cannot be empty");
    }
    updateData.name = vetData.name;
  }

  if (vetData.phone !== undefined) {
    if (vetData.phone.trim().length === 0) {
      throw new ErrorException(400, "Phone cannot be empty");
    }
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(vetData.phone)) {
      throw new ErrorException(400, "Invalid phone format");
    }
    updateData.phone = vetData.phone;
  }

  const updatedVet = await vetRepo.updateVet(vetId, updateData);

  return updatedVet;
};

export const deleteVetById = async (vetId: number) => {
  const vet = await vetRepo.getByIdVet(vetId);

  if (!vet) {
    throw new ErrorException(404, "Veterinarian not found");
  }

  await vetRepo.deleteVet(vetId);

  return { message: "Veterinarian successfully deleted" };
};
