import * as ownerRepo from "../repositories/owner.repository";
import * as userRepo from "../repositories/user.repository";
import { CreateOwnerDTO, UpdateOwnerDTO } from "../types/owner.types";
import ErrorException from "../types/errorException";
import { UserRole } from "@prisma/client";

export const createNewOwner = async (ownerData: CreateOwnerDTO) => {
  const user = await userRepo.getByIdUser(ownerData.userId);

  if (!user) {
    throw new ErrorException(404, "User not found");
  }

  if (user.userRole !== UserRole.owner) {
    throw new ErrorException(400, "User role must be 'owner'");
  }

  const existingOwner = await ownerRepo.getOwnerByUserId(ownerData.userId);
  if (existingOwner) {
    throw new ErrorException(409, "Owner profile already exists for this user");
  }

  if (!ownerData.name || ownerData.name.trim().length === 0) {
    throw new ErrorException(400, "Name is required");
  }

  if (!ownerData.phone || ownerData.phone.trim().length === 0) {
    throw new ErrorException(400, "Phone is required");
  }

  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(ownerData.phone)) {
    throw new ErrorException(400, "Invalid phone format");
  }

  if (!ownerData.address || ownerData.address.trim().length === 0) {
    throw new ErrorException(400, "Address is required");
  }

  const owner = await ownerRepo.createOwner({
    userId: ownerData.userId,
    name: ownerData.name,
    phone: ownerData.phone,
    address: ownerData.address,
    createdAt: new Date(),
  });

  return owner;
};

export const fetchAllOwners = async (page: number = 1, pageSize: number = 25) => {
  try {
    const result = await ownerRepo.getAllOwners(page, pageSize);
    return result;
  } catch (error) {
    throw new ErrorException(500, "Error fetching owners: " + (error as Error).message);
  }
};

export const fetchByIdOwner = async (ownerId: string) => {
  const owner = await ownerRepo.getByIdOwner(ownerId);

  if (!owner) {
    throw new ErrorException(404, "Owner not found");
  }

  return owner;
};

export const fetchOwnerByUserId = async (userId: string) => {
  const owner = await ownerRepo.getOwnerByUserId(userId);

  if (!owner) {
    throw new ErrorException(404, "Owner not found for this user");
  }

  return owner;
};

export const updateOwnerById = async (ownerId: string, ownerData: UpdateOwnerDTO) => {
  const existingOwner = await ownerRepo.getByIdOwner(ownerId);
  if (!existingOwner) {
    throw new ErrorException(404, "Owner not found");
  }

  const updateData: {
    name?: string;
    phone?: string;
    address?: string;
  } = {};

  if (ownerData.name !== undefined) {
    if (ownerData.name.trim().length === 0) {
      throw new ErrorException(400, "Name cannot be empty");
    }
    updateData.name = ownerData.name;
  }

  if (ownerData.phone !== undefined) {
    if (ownerData.phone.trim().length === 0) {
      throw new ErrorException(400, "Phone cannot be empty");
    }
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(ownerData.phone)) {
      throw new ErrorException(400, "Invalid phone format");
    }
    updateData.phone = ownerData.phone;
  }

  if (ownerData.address !== undefined) {
    if (ownerData.address.trim().length === 0) {
      throw new ErrorException(400, "Address cannot be empty");
    }
    updateData.address = ownerData.address;
  }

  const updatedOwner = await ownerRepo.updateOwner(ownerId, updateData);

  return updatedOwner;
};

export const deleteOwnerById = async (ownerId: string) => {
  const owner = await ownerRepo.getByIdOwner(ownerId);

  if (!owner) {
    throw new ErrorException(404, "Owner not found");
  }

  await ownerRepo.deleteOwner(ownerId);

  return { message: "Owner successfully deleted" };
};
