"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnimal = exports.fetchByIdAnimal = exports.fetchAllAnimals = void 0;
const animalRepo = __importStar(require("../repositories/animal.repository"));
const fetchAllAnimals = async () => {
    try {
        const animals = await animalRepo.getAllAnimals();
        return animals;
    }
    catch (error) {
        throw new Error("Error fetching animals: " + error.message);
    }
};
exports.fetchAllAnimals = fetchAllAnimals;
const fetchByIdAnimal = async (animalId) => {
    try {
        const animal = await animalRepo.getByIdAnimal(animalId);
        return animal;
    }
    catch (error) {
        throw new Error("Error fetching animal: " + error.message);
    }
};
exports.fetchByIdAnimal = fetchByIdAnimal;
const createAnimal = async (data) => {
    try {
        return await animalRepo.createAnimal(data);
    }
    catch (error) {
        throw new Error("Error creating the animal: " + error.message);
    }
};
exports.createAnimal = createAnimal;
