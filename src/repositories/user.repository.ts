import { PrismaClient, user_role } from "@prisma/client";
const prisma = new PrismaClient();

//create
export const createUser = async (userData: {
  email: string;
  passwordHash: string;
  userRole: user_role;
  createdAt: Date;
}) => {
  return prisma.user.create({
    data: userData
  });
};

//read
export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      owner: true,
      veterinarian: true,
    },
  });
};

//read by ID
export const getByIdUser = async (userId: number) => {
  return prisma.user.findUnique({
    where: { userId: userId },
    include: {
      owner: true,
      veterinarian: true,
    },
  });
};

//read by email
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email: email },
  });
};

// update

// delete
export const deleteUser = async (userId: number) => {
  return prisma.$transaction(async (tx) => {
    const owner = await tx.owner.findUnique({
      where: { userId: userId },
      select: { ownerId: true }
    });
    if (owner) {
      await tx.animal.deleteMany({
        where: { ownerId: owner.ownerId }
      });
      await tx.owner.delete({
        where: { ownerId: owner.ownerId }
      });
    }

    const veterinarian = await tx.veterinarian.findUnique({
      where: { userId: userId },
      select: { veterinarianId: true }
    });
    if (veterinarian) {
      await tx.veterinarian.delete({
        where: { veterinarianId: veterinarian.veterinarianId }
      });
    }

    return tx.user.delete({
      where: { userId: userId }
    });
  });
};
