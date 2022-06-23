import Joi from "joi";
import mongoose from "mongoose";
import Blogs from "../models/Blogs";
import { BlogStatus, IBlogStatus } from "../utils/constants";
type IUser = {
    profilePic: string;
    username: string;
    name: string;
    userId: string;
};
type IBlogPayload = {
    title: string;
    subtitle: string;
    category: string;
    content: string;
    tags: string[];
    banners: string[];
    createdAt: Date;
    updatedAt: Date;
    status: IBlogStatus;
    likes: string[];
    profile: IUser;
};
export const addNewBlog = async (_req: any, _res: any) => {
    let payload: IBlogPayload;
    const schema = Joi.object({
        title: Joi.string().required(),
        subtitle: Joi.string().optional(),
        banners: Joi.array().items(Joi.string()).min(1).max(6).required(),
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).min(5).error(new Error("You need to add at least 5 tags!")),
        category: Joi.string().required(),
    });
    const schemaObj = schema.validate(_req.body);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    } else {
        payload = schemaObj.value;
    }

    payload = {
        ...payload,
        profile: {
            profilePic: null,
            username: _req.tokenData.username,
            name: _req.tokenData.username,
            userId: _req.tokenData.userId,
        },
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "ACTIVE",
    };
    try {
        const result = await Blogs.create(payload);
        return _res.status(201).json({
            status: 201,
            blogId: result._id,
            message: "Success",
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
};

export const getLatestBlogs = async (_req: any, _res: any) => {
    let payload: any = {};
    const schema = Joi.object({
        limit: Joi.number().default(20).optional(),
        skip: Joi.number().default(0).optional(),
        search: Joi.string().optional(),
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
        let query: any = {};
        if (payload.search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: payload.search } },
                    { content: { $regex: payload.search } },
                    { subtitle: { $regex: payload.search } },
                    { tags: { $regex: payload.search } },
                ],
            };
        }
        const count = await Blogs.find(query).count();
        const result = await Blogs.find(query).skip(payload.skip).limit(payload.limit).select("title subtitle profile");
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

export const getBlogDetails = async (_req: any, _res: any) => {
    try {
        let query = {
            _id: new mongoose.Types.ObjectId(_req.params.id),
        };

        const result = await Blogs.findOne(query).select("-__v");
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

export const deleteBlog = async (_req: any, _res: any) => {
    try {
        let query = {
            _id: new mongoose.Types.ObjectId(_req.params.id),
        };
        let payload = {
            status: BlogStatus.DELETED,
        };

        const result = await Blogs.updateOne(query, payload);
        if (!result) {
            return _res.status(204).json({
                message: "No Data Found!",
            });
        }
        return _res.status(201).json({
            message: "success!",
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
        });
    }
};

export const updateBlog = async (_req: any, _res: any) => {
    let blogId = new mongoose.Types.ObjectId(_req.params.id);
    let payload: IBlogPayload;
    const schema = Joi.object({
        title: Joi.string().required(),
        subtitle: Joi.string().optional(),
        banners: Joi.array().items(Joi.string()).min(1).max(6).required(),
        content: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).min(5).error(new Error("You need to add at least 5 tags!")),
        category: Joi.string().required(),
    });
    const schemaObj = schema.validate(_req.body);
    if (schemaObj.error) {
        return _res.status(400).json({
            message: schemaObj.error.message || "Bad Request",
        });
    } else {
        payload = schemaObj.value;
    }

    payload = {
        ...payload,
        updatedAt: new Date(),
        status: "ACTIVE",
    };
    try {
        const result = await Blogs.updateOne({ _id: blogId }, payload);
        return _res.status(201).json({
            message: "Success",
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
};

export const likeDislikeBlog = async (_req: any, _res: any) => {
    let blogId = new mongoose.Types.ObjectId(_req.params.id);
    try {
        const blog = await Blogs.findOne({ _id: blogId }).select("-__v");

        if (!blog) {
            return _res.status(204).json({
                message: "Blog not found with this ID!",
            });
        }
        const updatedBlog = { ...blog._doc };
        let payloadData = {
            likes: updatedBlog.likes,
        };
        const index = payloadData.likes.findIndex((item: any) => item == _req.tokenData.userId);
        if (index >= 0) {
            payloadData.likes.splice(index, 1);
        } else {
            payloadData.likes.push(_req.tokenData.userId);
        }
        await Blogs.updateOne({ _id: blogId }, payloadData);
        return _res.status(201).json({
            message: "Success",
        });
    } catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
            code: 500,
        });
    }
};
