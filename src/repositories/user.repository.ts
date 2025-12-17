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
    data: userData,
    include: {
      owner: true,
      veterinarian: true,
    },
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
