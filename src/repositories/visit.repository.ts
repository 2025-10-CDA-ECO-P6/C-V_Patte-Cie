import { PrismaClient, VisitStatus, Visit } from "@prisma/client";
import { randomUUID } from "crypto";
import { VisitInput, VisitUpdateInput, VisitWithRelations } from "../types";

const prisma = new PrismaClient();

export const getAllVisits = async (
  page: number,
  pageSize: number
): Promise<{ visits: VisitWithRelations[]; total: number }> => {
  const skip = (page - 1) * pageSize;

  const [visits, total] = await prisma.$transaction([
    prisma.visit.findMany({
      skip,
      take: pageSize,
      include: {
        animal: true,
        veterinarian: true,
      },
      orderBy: { date: "desc" },
    }),
    prisma.visit.count(),
  ]);

  return { visits, total };
};

export const getByIdVisit = async (
  visitId: string
): Promise<VisitWithRelations | null> => {
  return prisma.visit.findUnique({
    where: { visitId },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};

export const createVisit = async (
  data: VisitInput
): Promise<VisitWithRelations> => {
  return prisma.visit.create({
    data: {
      visitId: randomUUID(),
      date: data.date,
      reason: data.reason,
      visitStatus: data.visitStatus as VisitStatus,
      observation: data.observation ?? null,
      animal: { connect: { animalId: data.animalId } },
      veterinarian: { connect: { veterinarianId: data.veterinarianId } },
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
): Promise<VisitWithRelations> => {
  const { animalId, veterinarianId, ...otherData } = data;

  return prisma.visit.update({
    where: { visitId },
    data: {
      ...otherData,
      ...(animalId && { animal: { connect: { animalId } } }),
      ...(veterinarianId && { veterinarian: { connect: { veterinarianId } } }),
    },
    include: {
      animal: true,
      veterinarian: true,
    },
  });
};


export const deleteVisit = async (visitId: string): Promise<void> => {
  await prisma.visit.delete({ where: { visitId } });
};

export default prisma;
