import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createVet = async (vetData: {
  userId: number;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
}) => {
  return prisma.veterinarian.create({
    data: vetData,
  });
};

export const getAllVets = async (page: number = 1, pageSize: number = 25) => {
  const skip = (page - 1) * pageSize;

  const [vets, total] = await Promise.all([
    prisma.veterinarian.findMany({
      skip,
      take: pageSize,
      select: {
        vetId : true,
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
        animals: true,
      },
    }),
    prisma.veterinarian.count(),
  ]);

  return {
    data: vets,
    total,
  };
};

export const getByIdVet = async (vetId: number) => {
  return prisma.veterinarian.findUnique({
    where: { vetId },
    select: {
      vetId: true,
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
      animals: true,
    },
  });
};

export const getVetByUserId = async (userId: number) => {
  return prisma.veterinarian.findUnique({
    where: { userId },
    select: {
      vetId: true,
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
      animals: true,
    },
  });
};

export const updateVet = async (
  vetId: number,
  data: {
    name?: string;
    phone?: string;
  }
) => {
  return prisma.veterinarian.update({
    where: { vetId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    select: {
      vetId: true,
      userId: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteVet = async (vetId: number) => {
  return prisma.$transaction(async (tx) => {
    await tx.animal.deleteMany({
      where: { vetId },
    });

    return tx.veterinarian.delete({
      where: { vetId },
    });
  });
};
