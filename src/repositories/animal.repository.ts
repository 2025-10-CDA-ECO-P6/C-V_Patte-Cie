import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllAnimals = async () => {
  return prisma.animal.findMany({
    include: {
      owner: true,
      vaccines: true,
      visits: true,
    },
  });
};

export const getByIdAnimal = async (animalId: number) => {
  return prisma.animal.findFirst({
    where: { animalId: animalId },
    include: {
       owner: true,
      vaccines: true,
      visits: true,
    },
  });
};

export default prisma;
