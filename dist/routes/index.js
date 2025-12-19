"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const animal_routes_1 = __importDefault(require("./animal.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const visit_routes_1 = __importDefault(require("./visit.routes"));
const vaccine_routes_1 = __importDefault(require("./vaccine.routes"));
const router = (0, express_1.Router)();
router.use("/animals", animal_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/visits", visit_routes_1.default);
router.use("/vaccines", vaccine_routes_1.default);
exports.default = router;
