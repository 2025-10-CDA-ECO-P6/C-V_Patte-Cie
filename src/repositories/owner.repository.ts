import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOwner = async (ownerData: {
  userId: number;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
}) => {
  return prisma.owner.create({
    data: ownerData,
  });
};

export const getAllOwners = async (page: number = 1, pageSize: number = 25) => {
  const skip = (page - 1) * pageSize;

  const [owners, total] = await Promise.all([
    prisma.owner.findMany({
      skip,
      take: pageSize,
      select: {
        ownerId: true,
        userId: true,
        name: true,
        phone: true,
        address: true,
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
    prisma.owner.count(),
  ]);

  return {
    data: owners,
    total,
  };
};

export const getByIdOwner = async (ownerId: number) => {
  return prisma.owner.findUnique({
    where: { ownerId },
    select: {
      ownerId: true,
      userId: true,
      name: true,
      phone: true,
      address: true,
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

export const getOwnerByUserId = async (userId: number) => {
  return prisma.owner.findUnique({
    where: { userId },
    select: {
      ownerId: true,
      userId: true,
      name: true,
      phone: true,
      address: true,
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

export const updateOwner = async (
  ownerId: number,
  data: {
    name?: string;
    phone?: string;
    address?: string;
  }
) => {
  return prisma.owner.update({
    where: { ownerId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    select: {
      ownerId: true,
      userId: true,
      name: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteOwner = async (ownerId: number) => {
  return prisma.$transaction(async (tx) => {
    await tx.animal.deleteMany({
      where: { ownerId },
    });

    return tx.owner.delete({
      where: { ownerId },
    });
  });
};
