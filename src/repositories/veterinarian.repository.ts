import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export const createVet = async (vetData: {
  userId: string; // UUID
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

export const getAllVets = async (page: number = 1, pageSize: number = 25) => {
  const skip = (page - 1) * pageSize;

  const [vets, total] = await Promise.all([
    prisma.veterinarian.findMany({
      skip,
      take: pageSize,
      select: {
        veterinarianId: true,
        userId: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
            userRole: true,
          },
        },
      },
    }),
    prisma.veterinarian.count(),
  ]);

  return {
    data: vets,
    total,
  };
};

export const getByIdVet = async (veterinarianId: string) => {
  return prisma.veterinarian.findUnique({
    where: { veterinarianId },
    select: {
      veterinarianId: true,
      userId: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
          userRole: true,
        },
      },
    },
  });
};

export const getVetByUserId = async (userId: string) => {
  return prisma.veterinarian.findUnique({
    where: { userId },
    select: {
      veterinarianId: true,
      userId: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          email: true,
          userRole: true,
        },
      },
    },
  });
};

export const updateVet = async (
  veterinarianId: string,
  data: {
    name?: string;
    phone?: string;
  }
) => {
  return prisma.veterinarian.update({
    where: { veterinarianId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    select: {
      veterinarianId: true,
      userId: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteVet = async (veterinarianId: string) => {
  return prisma.veterinarian.delete({
    where: { veterinarianId },
  });
};
