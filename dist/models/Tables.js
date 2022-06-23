"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// type BookingStatus = "BOOKED" | "CANCELLED" | "COMPLETED" | "REJECTED" | "EXPIRED"
const TableSchema = new mongoose_1.Schema({
    tableNumber: Number,
    date: Date,
    bookingTime: Date,
    userId: String,
    username: String,
    slots: Array,
    status: "BOOKED" || "CANCELLED" || "COMPLETED" || "REJECTED" || "EXPIRED"
});
exports.default = (0, mongoose_1.model)("Tables", TableSchema);
//# sourceMappingURL=Tables.js.map