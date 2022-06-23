import { Schema, model } from "mongoose";
// type BookingStatus = "BOOKED" | "CANCELLED" | "COMPLETED" | "REJECTED" | "EXPIRED"
const BookingTable = new Schema({
    tableNumber: Number,
    date: Date,
    bookingTime: Date,
    updatedAt: Date,
    userId: String,
    username: String,
    slots: Array,
    status:  String
})
export default model("Bookings", BookingTable)