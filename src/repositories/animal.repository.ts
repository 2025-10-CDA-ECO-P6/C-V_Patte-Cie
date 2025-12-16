import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAnimals = async () => {
  return prisma.animal.findMany({
    include: {
      owner: true, 
      vaccines: true,
    },
  });
};
