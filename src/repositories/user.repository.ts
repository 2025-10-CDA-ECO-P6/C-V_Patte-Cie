import { PrismaClient } from "@prisma/client";
import { CreateUserDTO } from "../types/user.types";
const prisma = new PrismaClient();

//create
export const createUser = async (userData: CreateUserDTO) => {
  return prisma.user.create({
    data: userData,
    include: {
      owner: true,
      veterinarian: true,
    },
  });
};

//read
export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      owner: true,
      veterinarian: true,
    },
  });
};

//read by ID
export const getByIdUser = async (userId: number) => {
  return prisma.user.findFirst({
    where: { userId: userId },
    include: {
      owner: true,
      veterinarian: true,
    },
  });
};

// update

// delete
