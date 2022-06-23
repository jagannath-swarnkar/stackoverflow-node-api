"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tableBooking_1 = require("../controllers/tableBooking");
const AuthGuard_1 = require("../middlewares/AuthGuard");
// import { BasicAuth } from '../middlewares/BasicAuth';
const router = express_1.default.Router();
router.post("/", AuthGuard_1.AuthGuard, tableBooking_1.reservation);
router.get("/slots", AuthGuard_1.AuthGuard, tableBooking_1.getAvailableSlots);
exports.default = router;
//# sourceMappingURL=tableBooking.js.map