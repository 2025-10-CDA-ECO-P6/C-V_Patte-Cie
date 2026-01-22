"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnimalController = exports.updateAnimalController = exports.createAnimalController = exports.getByIdAnimalController = exports.getAnimals = void 0;
const uuid_1 = require("../utils/uuid");
const animal_service_1 = require("../services/animal.service");
const formatAnimalResponse = (animal) => ({
    id: animal.animalId,
    attributes: {
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        dateOfBirth: animal.dateOfBirth,
        picture: animal.picture,
        weight: animal.weight,
        gender: animal.gender,
        owner: animal.owner,
        vaccines: animal.vaccines,
        visits: animal.visits,
        createdAt: animal.createdAt,
        updatedAt: animal.updatedAt,
    },
});
const getAnimals = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        if (page <= 0 || pageSize <= 0) {
            return res.status(400).json({ message: "Invalid pagination parameters" });
        }
        const { animals, total } = await (0, animal_service_1.fetchAllAnimals)(page, pageSize);
        const pageCount = Math.ceil(total / pageSize);
        res.status(200).json({
            data: animals.map(formatAnimalResponse),
            meta: {
                pagination: {
                    page,
                    pageSize,
                    pageCount,
                    total,
                },
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAnimals = getAnimals;
const getByIdAnimalController = async (req, res) => {
    try {
        const animalId = req.params.id;
        if (!(0, uuid_1.isValidUUID)(animalId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const animal = await (0, animal_service_1.fetchByIdAnimal)(animalId);
        if (!animal) {
            return res.status(404).json({ message: "Animal not found" });
        }
        res.status(200).json({
            data: formatAnimalResponse(animal),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getByIdAnimalController = getByIdAnimalController;
const createAnimalController = async (req, res) => {
    try {
        const { name, species, breed, dateOfBirth, picture, weight, gender, ownerId, } = req.body;
        if (!name ||
            !species ||
            !breed ||
            !dateOfBirth ||
            !weight ||
            !gender ||
            !ownerId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!["M", "F"].includes(gender)) {
            return res.status(400).json({ message: "Invalid gender" });
        }
        // Il faudra vérifier que l'owner existe quand le crud owner sera fait
        // const owner = await fetchByIdOwner(Number(ownerId));
        // if (!owner) {
        //   return res.status(404).json({ message: `Owner with id ${ownerId} not found` });
        // }
        const animalData = {
            name,
            species,
            breed,
            dateOfBirth: new Date(dateOfBirth),
            picture: picture ?? null,
            weight,
            gender,
            ownerId: ownerId,
        };
        const animal = await (0, animal_service_1.createAnimal)(animalData);
        res.status(201).json({
            data: formatAnimalResponse(animal),
        });
    }
    catch (error) {
        console.error(error);
        if (error.message.includes("Foreign key constraint")) {
            return res.status(400).json({ message: "Invalid ownerId" });
        }
        res.status(500).json({ message: "Server error" });
    }
};
exports.createAnimalController = createAnimalController;
const updateAnimalController = async (req, res) => {
    try {
        const animalId = req.params.id;
        if (!(0, uuid_1.isValidUUID)(animalId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const existingAnimal = await (0, animal_service_1.fetchByIdAnimal)(animalId);
        if (!existingAnimal) {
            return res.status(404).json({ message: "Animal not found" });
        }
        const data = { ...req.body };
        if (data.weight && isNaN(Number(data.weight))) {
            return res.status(400).json({ message: "Invalid weight" });
        }
        if (data.dateOfBirth && typeof data.dateOfBirth === "string") {
            const parsedDate = new Date(data.dateOfBirth);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: "Invalid dateOfBirth" });
            }
            data.dateOfBirth = parsedDate;
        }
        if (data.gender && !["M", "F"].includes(data.gender)) {
            return res.status(400).json({ message: "Invalid gender" });
        }
        const updatedAnimal = await (0, animal_service_1.updateAnimal)(animalId, data);
        res.status(200).json({
            data: formatAnimalResponse(updatedAnimal),
        });
    }
    catch (error) {
        console.error(error);
        if (error.message.includes("Foreign key constraint")) {
            return res.status(400).json({ message: "Invalid ownerId" });
        }
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateAnimalController = updateAnimalController;
const deleteAnimalController = async (req, res) => {
    try {
        const animalId = req.params.id;
        if (!(0, uuid_1.isValidUUID)(animalId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        await (0, animal_service_1.deleteAnimal)(animalId);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        if (error.message.includes("not found")) {
            return res.status(404).json({ message: "Animal not found" });
        }
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteAnimalController = deleteAnimalController;
