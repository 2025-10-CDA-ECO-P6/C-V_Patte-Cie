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

export const getByIdVaccine = async (vaccineId: number) => {
  return prisma.vaccine.findUnique({
    where: { vaccineId },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};