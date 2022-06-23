"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// type BookingStatus = "BOOKED" | "CANCELLED" | "COMPLETED" | "REJECTED" | "EXPIRED"
const BookingTable = new mongoose_1.Schema({
    tableNumber: Number,
    date: Date,
    bookingTime: Date,
    updatedAt: Date,
    userId: String,
    username: String,
    slots: Array,
    status: String
});
exports.default = (0, mongoose_1.model)("Bookings", BookingTable);
//# sourceMappingURL=Bookings.js.map