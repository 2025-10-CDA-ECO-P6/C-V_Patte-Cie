"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimal = exports.getByIdAnimal = exports.getAllAnimals = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllAnimals = async () => {
    return prisma.animal.findMany({
        include: {
            owner: true,
            vaccines: true,
            visits: true,
        },
    });
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
exports.default = prisma;
