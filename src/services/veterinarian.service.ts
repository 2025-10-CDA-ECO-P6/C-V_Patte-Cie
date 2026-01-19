import * as vetRepo from "../repositories/veterinarian.repository";
import * as userRepo from "../repositories/user.repository";
import { CreateVeterinarianDTO, UpdateVeterinarianDTO } from "../types/veterinarian.type";
import ErrorException from "../types/errorException";

export const createNewVet = async (vetData: CreateVeterinarianDTO) => {
  // Vérifier que l'utilisateur existe
  const user = await userRepo.getByIdUser(vetData.userId);
  if (!user) {
    throw new ErrorException(404, "User not found");
  }

  // Vérifier que l'utilisateur a le bon rôle
  if (user.userRole !== "veterinarian") {
    throw new ErrorException(400, "User role must be 'veterinarian'");
  }

  // Vérifier qu'il n'existe pas déjà un profil vétérinaire pour cet utilisateur
  const existingVet = await vetRepo.getVetByUserId(vetData.userId);
  if (existingVet) {
    throw new ErrorException(409, "Veterinarian profile already exists for this user");
  }

  // Les validations de format sont maintenant gérées par Joi
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

export const fetchByIdVet = async (vetId: string) => {
  const vet = await vetRepo.getByIdVet(vetId);

  if (!vet) {
    throw new ErrorException(404, "Veterinarian not found");
  }

  return vet;
};

export const fetchVetByUserId = async (userId: string) => {
  const vet = await vetRepo.getVetByUserId(userId);

  if (!vet) {
    throw new ErrorException(404, "Veterinarian not found for this user");
  }

  return vet;
};

export const updateVetById = async (vetId: string, vetData: UpdateVeterinarianDTO) => {
  const existingVet = await vetRepo.getByIdVet(vetId);
  if (!existingVet) {
    throw new ErrorException(404, "Veterinarian not found");
  }

  // Les validations de format sont maintenant gérées par Joi
  const updatedVet = await vetRepo.updateVet(vetId, vetData);

  return updatedVet;
};

export const deleteVetById = async (vetId: string) => {
  const vet = await vetRepo.getByIdVet(vetId);

  if (!vet) {
    throw new ErrorException(404, "Veterinarian not found");
  }

  await vetRepo.deleteVet(vetId);

  return { message: "Veterinarian successfully deleted" };
};
