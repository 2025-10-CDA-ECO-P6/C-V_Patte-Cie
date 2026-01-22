import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// CREATE
export const createVet = async (vetData: {
  userId: string;
  name: string;
  phone: string;
  createdAt: Date;
}) => {
  return prisma.veterinarian.create({
    data: {
      veterinarianId: randomUUID(),
      ...vetData,
    },
  });
};

// READ ALL avec pagination
export const getAllVets = async (page = 1, pageSize = 25) => {
  const skip = (page - 1) * pageSize;

  const [vets, total] = await Promise.all([
    prisma.veterinarian.findMany({
      skip,
      take: pageSize,
      include: {
        user: true,
        },
      
    }),
    prisma.veterinarian.count(),
  ]);

  return { data: vets, total };
};

// READ BY ID
export const getByIdVet = async (veterinarianId: string) => {
  return prisma.veterinarian.findUnique({
    where: { veterinarianId },
     include: {
        user: true,
        },
    
  });
};

// READ BY USER ID
export const getVetByUserId = async (userId: string) => {
  return prisma.veterinarian.findUnique({
    where: { userId },
     include: {
        user: true,
        },
  });
};

// UPDATE
export const updateVet = async (
  veterinarianId: string,
  data: { name?: string; phone?: string }
) => {
  return prisma.veterinarian.update({
    where: { veterinarianId },
    data: { ...data, updatedAt: new Date() },
  });
};

// DELETE
export const deleteVet = async (veterinarianId: string) => {
  return prisma.$transaction(async (tx) => {
    await tx.vaccine.deleteMany({ where: { veterinarianId } });
    await tx.visit.deleteMany({ where: { veterinarianId } });
    return tx.veterinarian.delete({ where: { veterinarianId } });
  });
};
