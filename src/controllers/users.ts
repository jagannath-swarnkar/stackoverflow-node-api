import Joi from "joi";
import mongoose from "mongoose";
import Users from "../models/Users";
import { IUserSchema } from "../utils/types";
import bcrypt from 'bcrypt';
import { createToken } from "../utils/global";

export const registration = async (_req: any, _res: any) => {
    let payload: IUserSchema;
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        firstname: Joi.string().required(),
        username: Joi.string().required(),
        lastname: Joi.string().optional().default(null),
        profilePic: Joi.string().optional().default(null),
        dob: Joi.string().optional().default(null),
        gender: Joi.string().optional().default(null),
        referral: Joi.string().optional().default(null),
        banner: Joi.string().optional().default(null),
        phoneNumber: Joi.string().optional().default(null),
        dialCode: Joi.string().optional().default(null),
        bio: Joi.string().optional().default(null),
        socialLinks: Joi.object({
            instagram: Joi.string().optional(),
            facebook: Joi.string().optional(),
            github: Joi.string().optional(),
        })
            .optional()
            .default(null),
        address: Joi.object({
            address: Joi.string().optional(),
            addressLine1: Joi.string().optional(),
            addressLine2: Joi.string().optional().allow("", null),
            city: Joi.string().optional(),
            area: Joi.string().optional(),
            state: Joi.string().optional(),
            country: Joi.string().optional(),
            countryCode: Joi.string().optional(),
            postalCode: Joi.string().optional(),
        })
            .optional()
            .default(null),
    });

    const schemaObj = schema.validate(_req.body);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    } else {
        payload = schemaObj.value;
    }

    try {
        // checking for duplicate
        const duplicateResult = await Users.find({
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
        payload.password = await bcrypt.hash(payload.password, 10);
        const result = await Users.create(payload);
        const response = {
            userId: result._id,
            username: result.username,
        };
        return _res.status(200).send({
            message: "success!",
            data: response,
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
};

export const getAllUsers = async (_req: any, _res: any) => {
    let payload: any = {};
    const schema = Joi.object({
        limit: Joi.number().default(20).optional(),
        skip: Joi.number().default(0).optional(),
        search: Joi.string().optional(),
        id: Joi.string().optional(),
        status: Joi.string().default(1).optional(),
    });

    const schemaObj = schema.validate(_req.query);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    } else {
        payload = schemaObj.value;
    }

    try {
        let query: any = {
            status: payload.status,
        };
        if (payload.id) {
            query["_id"] = new mongoose.Types.ObjectId(payload.id);
        }
        if (payload.search) {
            query = {
                ...query,
                $or: [
                    { firstname: { $regex: payload.search } },
                    { lastname: { $regex: payload.search } },
                    { username: { $regex: payload.search } },
                    { email: { $regex: payload.search } },
                    { phoneNumber: { $regex: payload.search } },
                    { bio: { $regex: payload.search } },
                ],
            };
        }
        const count = await Users.find(query).count();
        const result = await Users.find(query).skip(payload.skip).limit(payload.limit)
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
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
        });
    }
};

export const getUserById = async (_req: any, _res: any) => {
    try {
        let query = {
            _id: new mongoose.Types.ObjectId(_req.params.id),
        };

        const result = await Users.findOne(query).select("-__v -password");
        if (!result) {
            return _res.status(204).json({
                message: "No Data Found!",
            });
        }
        return _res.status(200).json({
            message: "success!",
            data: result,
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
        });
    }
};

type ILoginPayload = {
    email: string,
    password: string
}
export const login = async(_req:any, _res:any) =>{
    let payload: ILoginPayload;
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });


    var validSchema = schema.validate(_req.body);
    
    // validating payload
    if(validSchema.error){
        return _res.status(400).json({
            message: validSchema.error.message || "Bad Request",
            code: 400
        })
    }else{
        payload = validSchema.value;
    }

    try{
        // validating user
        const user = await Users.findOne({email: payload.email})
        if(!user){
            return _res.status(404).send({
                message: "Incorrect usernamne or password!",
                code: 404
            });
        }

        // validating password
        const plainPass = await bcrypt.compare(payload.password, user.password);
        if(!plainPass){
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
        }
        const token = await createToken(tokenPayload);
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
        }
        return _res.status(200).send({
            message: "Login successfull!",
            data: response,
            status: 200
        })
    } catch (error) {
        console.log('error in creating token', error)
        return _res.status(500).json({
            message: 'Internal Server Error', 
            status: 500
        })
    }
}
