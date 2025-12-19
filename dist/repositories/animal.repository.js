"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnimal = exports.updateAnimal = exports.createAnimal = exports.getByIdAnimal = exports.getAllAnimals = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllAnimals = async (page, pageSize) => {
    const skip = (page - 1) * pageSize;
    // Using a transaction to ensure `findMany` and `count` are executed on the same database snapshot
    // This prevents pagination inconsistencies if data changes between queries
    // Prisma docs: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
    const [animals, total] = await prisma.$transaction([
        prisma.animal.findMany({
            skip,
            take: pageSize,
            include: {
                owner: true,
                vaccines: true,
                visits: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.animal.count(),
    ]);
    return { animals, total };
};
exports.getAllAnimals = getAllAnimals;
const getByIdAnimal = async (animalId) => {
    return prisma.animal.findFirst({
        where: { animalId: animalId },
        include: {
            owner: true,
            vaccines: true,
            visits: true,
        },
    });
};
exports.getByIdAnimal = getByIdAnimal;
const createAnimal = async (data) => {
    return prisma.animal.create({
        data: {
            name: data.name,
            species: data.species,
            breed: data.breed,
            dateOfBirth: data.dateOfBirth,
            picture: data.picture ?? null,
            weight: data.weight,
            gender: data.gender,
            owner: {
                connect: { ownerId: data.ownerId },
            },
        },
        include: {
            owner: true,
            vaccines: true,
            visits: true,
        },
    });
};
exports.createAnimal = createAnimal;
const updateAnimal = async (animalId, data) => {
    const { ownerId, ...otherData } = data;
    return prisma.animal.update({
        where: { animalId },
        data: {
            ...otherData,
            ...(ownerId !== undefined ? { owner: { connect: { ownerId } } } : {}),
        },
        include: {
            owner: true,
            vaccines: true,
            visits: true,
        },
    });
};
exports.updateAnimal = updateAnimal;
const deleteAnimal = async (animalId) => {
    return prisma.animal.delete({
        where: { animalId },
    });
};
exports.deleteAnimal = deleteAnimal;
exports.default = prisma;
