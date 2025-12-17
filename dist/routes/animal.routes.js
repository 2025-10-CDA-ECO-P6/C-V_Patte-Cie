"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const animal_controller_1 = require("../controllers/animal.controller");
const router = (0, express_1.Router)();
router.get("/", animal_controller_1.getAnimals);
router.get("/:id", animal_controller_1.getByIdAnimal);
router.post("/", animal_controller_1.createAnimalController);
exports.default = router;
