"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimalController = exports.getByIdAnimal = exports.getAnimals = void 0;
const animal_service_1 = require("../services/animal.service");
const getAnimals = async (req, res) => {
    try {
        const animals = await (0, animal_service_1.fetchAllAnimals)();
        res.status(200).json(animals);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAnimals = getAnimals;
const getByIdAnimal = async (req, res) => {
    try {
        const animalId = Number.parseInt(req.params.id);
        const animal = await (0, animal_service_1.fetchByIdAnimal)(animalId);
        res.status(200).json(animal);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getByIdAnimal = getByIdAnimal;
const createAnimalController = async (req, res) => {
    try {
        const { name, species, breed, dateOfBirth, picture, weight, gender, ownerId } = req.body;
        if (!name || !species || !breed || !dateOfBirth || !weight || !gender || !ownerId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!["M", "F"].includes(gender)) {
            return res.status(400).json({ message: "Invalid gender" });
        }
        const animalData = {
            name,
            species,
            breed,
            dateOfBirth: new Date(dateOfBirth),
            picture: picture ?? null,
            weight,
            gender,
            ownerId: Number(ownerId),
        };
        const animal = await (0, animal_service_1.createAnimal)(animalData);
        res.status(201).json({
            data: {
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
                },
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createAnimalController = createAnimalController;
