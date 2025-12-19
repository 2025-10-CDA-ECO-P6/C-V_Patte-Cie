import { PrismaClient } from "@prisma/client";
import { VaccineInput, VaccineUpdateInput } from "../types";


const prisma = new PrismaClient();

export const getAllVaccines = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;

  const [vaccines, total] = await prisma.$transaction([
    prisma.vaccine.findMany({
      skip,
      take: pageSize,
      include: {
        animal: true,
        veterinarian: true,
      },
    }),
    prisma.vaccine.count(),
  ]);

  return { vaccines, total };
};

export const getByIdVaccine = async (vaccineId: string) => {
  return prisma.vaccine.findUnique({
    where: { vaccineId },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};

export const createVaccine = async (data: VaccineInput) => {
  return prisma.vaccine.create({
    data,
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};

export const updateVaccine = async (
  vaccineId: string,
  data: VaccineUpdateInput
) => {
 const updatedVaccine = await prisma.vaccine.update({
    where: { vaccineId },
    data: {
      ...data,
      administrationDate: data.administrationDate ?? null,
      animalId: data.animalId ?? null,
      veterinarianId: data.veterinarianId ?? null,
    },
    include: { animal: true, veterinarian: true },
  });

  return updatedVaccine;
};

export const deleteVaccine = async (vaccineId: string) => {
  return prisma.vaccine.delete({
    where: { vaccineId },
  });
};