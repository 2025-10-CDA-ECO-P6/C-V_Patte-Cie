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

export const createAnimal = async (data: {
  name: string;
  species: string;
  breed: string;
  dateOfBirth: Date;
  picture?: string | null;
  weight: string;
  gender: "M" | "F";
  ownerId: number;
}) => {
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
  animalId: number,
  data: Partial<{
    name: string;
    species: string;
    breed: string;
    dateOfBirth: Date;
    picture?: string | null;
    weight: string;
    gender: "M" | "F";
    ownerId: number;
  }>
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

export const deleteAnimal = async (animalId: number) => {
  return prisma.animal.delete({
    where: { animalId },
  });
};

export default prisma;
