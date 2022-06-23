"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlots = exports.reservation = void 0;
const joi_1 = __importDefault(require("joi"));
const Bookings_1 = __importDefault(require("../models/Bookings"));
const constants_1 = require("../utils/constants");
const sendgrid_1 = require("../utils/sendgrid");
const reservation = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    const schema = joi_1.default.object({
        tableNumber: joi_1.default.number().required(),
        slots: joi_1.default.array().required(),
        date: joi_1.default.string().required(),
    });
    const schemaObj = schema.validate(_req.body);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    }
    else {
        payload = schemaObj.value;
    }
    payload = Object.assign(Object.assign({}, payload), { userId: _req.tokenData.userId, username: _req.tokenData.username || _req.tokenData.email, bookingTime: new Date(), updatedAt: new Date(), status: "BOOKED" });
    try {
        const result = yield Bookings_1.default.create(payload);
        const emailPayload = {
            to: _req.tokenData.email,
        };
        yield (0, sendgrid_1.sendMail)(emailPayload);
        return _res.status(201).json({
            status: 201,
            bookingId: result._id,
            message: "Success",
        });
    }
    catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
});
exports.reservation = reservation;
const getAvailableSlots = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    const schema = joi_1.default.object({
        tableNumber: joi_1.default.number().required(),
        date: joi_1.default.string().required(),
    });
    const schemaObj = schema.validate(_req.query);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    }
    else {
        query = schemaObj.value;
    }
    try {
        const result = yield Bookings_1.default.find(query).select("slots");
        const totalSlots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let availableSlots = [];
        let bookedSlots = [];
        if (result && result.length) {
            bookedSlots = result.reduce((a, n) => {
                return [...a, ...n.slots];
            }, []);
            availableSlots = totalSlots.filter((item) => !bookedSlots.includes(item));
        }
        else {
            availableSlots = totalSlots;
        }
        let slots = totalSlots.map((item) => {
            return {
                slotNumber: item,
                slot: constants_1.slotTiming[item],
                status: bookedSlots.includes(item) ? "BOOKED" : "AVAILABLE",
            };
        });
        return _res.status(200).json({
            status: 200,
            availableSlots,
            bookedSlots,
            slots,
            message: availableSlots.length ? "Success" : "No Slots Available!",
        });
    }
    catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
});
exports.getAvailableSlots = getAvailableSlots;
//# sourceMappingURL=tableBooking.js.map