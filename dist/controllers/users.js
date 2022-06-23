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
exports.login = exports.getUserById = exports.getAllUsers = exports.registration = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = __importDefault(require("../models/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const global_1 = require("../utils/global");
const registration = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
        firstname: joi_1.default.string().required(),
        username: joi_1.default.string().required(),
        lastname: joi_1.default.string().optional().default(null),
        profilePic: joi_1.default.string().optional().default(null),
        dob: joi_1.default.string().optional().default(null),
        gender: joi_1.default.string().optional().default(null),
        referral: joi_1.default.string().optional().default(null),
        banner: joi_1.default.string().optional().default(null),
        phoneNumber: joi_1.default.string().optional().default(null),
        dialCode: joi_1.default.string().optional().default(null),
        bio: joi_1.default.string().optional().default(null),
        socialLinks: joi_1.default.object({
            instagram: joi_1.default.string().optional(),
            facebook: joi_1.default.string().optional(),
            github: joi_1.default.string().optional(),
        })
            .optional()
            .default(null),
        address: joi_1.default.object({
            address: joi_1.default.string().optional(),
            addressLine1: joi_1.default.string().optional(),
            addressLine2: joi_1.default.string().optional().allow("", null),
            city: joi_1.default.string().optional(),
            area: joi_1.default.string().optional(),
            state: joi_1.default.string().optional(),
            country: joi_1.default.string().optional(),
            countryCode: joi_1.default.string().optional(),
            postalCode: joi_1.default.string().optional(),
        })
            .optional()
            .default(null),
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
    try {
        // checking for duplicate
        const duplicateResult = yield Users_1.default.find({
            $or: [{ username: payload.username }, { email: payload.email }],
        });
        if (duplicateResult && duplicateResult.length) {
            return _res.status(409).json({
                message: "Duplicate Entry",
            });
        }
        // creating new user
        payload.createdAt = new Date();
        payload.updatedAt = new Date();
        payload.status = 1;
        payload.password = yield bcrypt_1.default.hash(payload.password, 10);
        const result = yield Users_1.default.create(payload);
        const response = {
            userId: result._id,
            username: result.username,
        };
        return _res.status(200).send({
            message: "success!",
            data: response,
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
exports.registration = registration;
const getAllUsers = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    const schema = joi_1.default.object({
        limit: joi_1.default.number().default(20).optional(),
        skip: joi_1.default.number().default(0).optional(),
        search: joi_1.default.string().optional(),
        id: joi_1.default.string().optional(),
        status: joi_1.default.string().default(1).optional(),
    });
    const schemaObj = schema.validate(_req.query);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    }
    else {
        payload = schemaObj.value;
    }
    try {
        let query = {
            status: payload.status,
        };
        if (payload.id) {
            query["_id"] = new mongoose_1.default.Types.ObjectId(payload.id);
        }
        if (payload.search) {
            query = Object.assign(Object.assign({}, query), { $or: [
                    { firstname: { $regex: payload.search } },
                    { lastname: { $regex: payload.search } },
                    { username: { $regex: payload.search } },
                    { email: { $regex: payload.search } },
                    { phoneNumber: { $regex: payload.search } },
                    { bio: { $regex: payload.search } },
                ] });
        }
        const count = yield Users_1.default.find(query).count();
        const result = yield Users_1.default.find(query).skip(payload.skip).limit(payload.limit)
            .select("firstname lastname username email profilePic");
        if (!result || !result.length) {
            return _res.status(204).json({
                message: "No Data Found!",
            });
        }
        return _res.status(200).json({
            message: "success!",
            data: result,
            count: count,
        });
    }
    catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            _id: new mongoose_1.default.Types.ObjectId(_req.params.id),
        };
        const result = yield Users_1.default.findOne(query).select("-__v -password");
        if (!result) {
            return _res.status(204).json({
                message: "No Data Found!",
            });
        }
        return _res.status(200).json({
            message: "success!",
            data: result,
        });
    }
    catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
        });
    }
});
exports.getUserById = getUserById;
const login = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    var validSchema = schema.validate(_req.body);
    // validating payload
    if (validSchema.error) {
        return _res.status(400).json({
            message: validSchema.error.message || "Bad Request",
            code: 400
        });
    }
    else {
        payload = validSchema.value;
    }
    try {
        // validating user
        const user = yield Users_1.default.findOne({ email: payload.email });
        if (!user) {
            return _res.status(404).send({
                message: "Incorrect usernamne or password!",
                code: 404
            });
        }
        // validating password
        const plainPass = yield bcrypt_1.default.compare(payload.password, user.password);
        if (!plainPass) {
            return _res.status(404).send({
                message: "Incorrect usernamne or password!",
                code: 404
            });
        }
        // generating jwt token;
        const tokenPayload = {
            email: user.email,
            userId: user._id,
            status: user.status,
            username: user.username || user.email
        };
        const token = yield (0, global_1.createToken)(tokenPayload);
        const response = {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            fullname: user.fullname,
            status: user.status,
            userId: user._id,
            email: user.email,
            username: user.username || user.email,
            profilePic: user.profilePic
        };
        return _res.status(200).send({
            message: "Login successfull!",
            data: response,
            status: 200
        });
    }
    catch (error) {
        console.log('error in creating token', error);
        return _res.status(500).json({
            message: 'Internal Server Error',
            status: 500
        });
    }
});
exports.login = login;
//# sourceMappingURL=users.js.map