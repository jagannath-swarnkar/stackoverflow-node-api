"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    firstname: String,
    lastname: String,
    profilePic: String,
    dob: String,
    gender: String,
    referral: String,
    banner: String,
    password: String,
    dialCode: String,
    bio: String,
    socialLinks: {
        instagram: String,
        facebook: String,
        github: String,
    },
    address: {
        address: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        area: String,
        state: String,
        country: String,
        countryCode: String,
        postalCode: String,
    },
    status: Number,
    createdAt: Date,
    updatedAt: Date,
});
exports.default = (0, mongoose_1.model)("Users", UserSchema);
//# sourceMappingURL=Users.js.map