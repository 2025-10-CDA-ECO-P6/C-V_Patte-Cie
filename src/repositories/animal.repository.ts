import { PrismaClient } from "@prisma/client";
import { AnimalInput, AnimalUpdateInput } from "../types";

const prisma = new PrismaClient();

export const getAllAnimals = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;

  // Using a transaction to ensure `findMany` and `count` are executed on the same database snapshot
  // This prevents pagination inconsistencies if data changes between queries
  // Prisma docs: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
  const [animals, total] = await prisma.$transaction([
    prisma.animal.findMany({
      skip,
      take: pageSize,
      include: {
        owner: true,
        vaccines: true,
        visits: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.animal.count(),
  ]);

  return { animals, total };
};

export const getByIdAnimal = async (animalId: string) => {
  return prisma.animal.findFirst({
    where: { animalId: animalId },
    include: {
       owner: true,
      vaccines: true,
      visits: true,
    },
  });
};

export const createAnimal = async (data: AnimalInput) => {
  return prisma.animal.create({
    data: {
      name: data.name,
      species: data.species,
      breed: data.breed,
      dateOfBirth: data.dateOfBirth,
      picture: data.picture ?? null,
      weight: data.weight,
      gender: data.gender,
      owner: {
        connect: { ownerId: data.ownerId },
      },
    },
    include: {
      owner: true,
      vaccines: true,
      visits: true,
    },
  });
};

export const updateAnimal = async (
  animalId: string,
  data: AnimalUpdateInput
) => {
  const { ownerId, ...otherData } = data;

  return prisma.animal.update({
    where: { animalId },
    data: {
      ...otherData,
      ...(ownerId !== undefined ? { owner: { connect: { ownerId } } } : {}),
    },
    include: {
      owner: true,
      vaccines: true,
      visits: true,
    },
  });
};

export const deleteAnimal = async (animalId: string) => {
  return prisma.animal.delete({
    where: { animalId },
  });
};

export default prisma;
