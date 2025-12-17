import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllVisits = async () => {
  return prisma.visit.findMany({
    include: {
      animal: true,
      veterinarian: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};


export const getByIdVisit = async (visitId: number) => {
  return prisma.visit.findUnique({
    where: { visitId },
     include: {
      animal: true,
      veterinarian: true,
    },
  });
};

// export const createvisit = async (data: {
//   name: string;
//   species: string;
//   breed: string;
//   dateOfBirth: Date;
//   picture?: string | null;
//   weight: string;
//   gender: "M" | "F";
//   ownerId: number;
// }) => {
//   return prisma.visit.create({
//     data: {
//       name: data.name,
//       species: data.species,
//       breed: data.breed,
//       dateOfBirth: data.dateOfBirth,
//       picture: data.picture ?? null,
//       weight: data.weight,
//       gender: data.gender,
//       owner: {
//         connect: { ownerId: data.ownerId },
//       },
//     },
//     include: {
//       owner: true,
//       vaccines: true,
//       visits: true,
//     },
//   });
// };

// export const updatevisit = async (
//   visitId: number,
//   data: Partial<{
//     name: string;
//     species: string;
//     breed: string;
//     dateOfBirth: Date;
//     picture?: string | null;
//     weight: string;
//     gender: "M" | "F";
//     ownerId: number;
//   }>
// ) => {
//   const { ownerId, ...otherData } = data;

//   return prisma.visit.update({
//     where: { visitId },
//     data: {
//       ...otherData,
//       ...(ownerId !== undefined ? { owner: { connect: { ownerId } } } : {}),
//     },
//     include: {
//       owner: true,
//       vaccines: true,
//       visits: true,
//     },
//   });
// };

// export const deletevisit = async (visitId: number) => {
//   return prisma.visit.delete({
//     where: { visitId },
//   });
// };

export default prisma;
