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
export const getAllUsers = async (page: number = 1, pageSize: number = 25) => {
  const skip = (page - 1) * pageSize;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      select: {
        userId: true,
        email: true,
        userRole: true,
        createdAt: true,
        updatedAt: true,
        owner: true,
        veterinarian: true,
      },
    }),
    prisma.user.count(),
  ]);

  return {
    data: users,
    total,
  };
};

//read by ID
export const getByIdUser = async (userId: number) => {
  return prisma.user.findUnique({
    where: { userId: userId },
    select: {
      userId: true,
      email: true,
      userRole: true,
      createdAt: true,
      updatedAt: true,
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
export const updateUser = async (
  userId: number,
  data: {
    email?: string;
    passwordHash?: string | undefined;
    userRole?: user_role;
  }
) => {
  return prisma.user.update({
    where: { userId },
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      userRole: data.userRole,
      updatedAt: new Date(), // Mise à jour automatique du timestamp
    },
    select: {
      userId: true,
      email: true,
      userRole: true,
      createdAt: true,
      updatedAt: true,
      owner: true,
      veterinarian: true,
    },
  });
};

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
