import { PrismaClient, UserRole, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// CREATE
export const createUser = async (userData: {
  email: string;
  passwordHash: string;
  userRole: UserRole;
  createdAt: Date;
}) => {
  return prisma.user.create({
    data: { userId: randomUUID(), ...userData },
  });
};

// READ ALL + pagination
export const getAllUsers = async (page = 1, pageSize = 25) => {
  const skip = (page - 1) * pageSize;
  return prisma.user.findMany({
    skip,
    take: pageSize,
    include: { owner: true, veterinarian: true },
  });
};

export const countUsers = async () => prisma.user.count();

// READ by ID
export const getByIdUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { userId },
    include: { owner: true, veterinarian: true },
  });
};

// READ by Email
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

// UPDATE
export const updateUser = async (
  userId: string,
  data: { email?: string; passwordHash?: string }
) => {
  return prisma.user.update({
    where: { userId },
    data: { ...data, updatedAt: new Date() },
    include: { owner: true, veterinarian: true },
  });
};

// DELETE
export const deleteUser = async (userId: string) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const owner = await tx.owner.findUnique({ where: { userId }, select: { ownerId: true } });
    if (owner) {
      await tx.animal.deleteMany({ where: { ownerId: owner.ownerId } });
      await tx.owner.delete({ where: { ownerId: owner.ownerId } });
    }

    const veterinarian = await tx.veterinarian.findUnique({
      where: { userId },
      select: { veterinarianId: true },
    });
    if (veterinarian) {
      await tx.veterinarian.delete({ where: { veterinarianId: veterinarian.veterinarianId } });
    }

    return tx.user.delete({ where: { userId } });
  });
};
