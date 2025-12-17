import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//create

export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      owner: true,
      veterinarian: true,
    },
  });
};

export const getByIdUser = async (userId: number) => {
  return prisma.user.findFirst({
    where: { userId: userId },
    include: {
      owner: true,
      veterinarian: true,
    },
  });
};