import { Schema, model } from "mongoose";

const UserSchema = new Schema({
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
export default model("Users", UserSchema);
