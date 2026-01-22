import { PrismaClient, visit_status } from "@prisma/client";
import { randomUUID } from "crypto";
import { VisitInput, VisitUpdateInput } from "../types";

const prisma = new PrismaClient();

export const getAllVisits = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;

  const [visits, total] = await prisma.$transaction([
    prisma.visit.findMany({
      skip,
      take: pageSize,
      include: {
        animal: true,
        veterinarian: true,
      },
      orderBy: {
        date: "desc",
      },
    }),
    prisma.visit.count(),
  ]);

  return { visits, total };
};


export const getByIdVisit = async (visitId: string) => {
  return prisma.visit.findUnique({
    where: { visitId },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};

export const createVisit = async (data: VisitInput) => {
  return prisma.visit.create({
    data: {
      visitId: randomUUID(),
      date: data.date,
      reason: data.reason,
      visitStatus: data.visitStatus as visit_status,
      observation: data.observation ?? null,
      animal: {
        connect: { animalId: data.animalId },
      },
      veterinarian: {
        connect: { veterinarianId: data.veterinarianId },
      },
    },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};

export const updateVisit = async (
  visitId: string,
  data: VisitUpdateInput
) => {
  const { animalId, veterinarianId, ...otherData } = data;

  return prisma.visit.update({
    where: { visitId },
    data: {
      ...otherData,
      ...(animalId !== undefined && {
        animal: { connect: { animalId } },
      }),
      ...(veterinarianId !== undefined && {
        veterinarian: { connect: { veterinarianId } },
      }),
    },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};

export const deleteVisit = async (visitId: string) => {
  return prisma.visit.delete({
    where: { visitId },
  });
};

export default prisma;
