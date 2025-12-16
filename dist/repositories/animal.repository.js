"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAnimals = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllAnimals = async () => {
    return prisma.animal.findMany({
        include: {
            owner: true,
            vaccines: true,
        },
    });
};
exports.getAllAnimals = getAllAnimals;
