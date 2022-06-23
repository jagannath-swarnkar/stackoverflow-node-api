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
exports.likeDislikeBlog = exports.updateBlog = exports.deleteBlog = exports.getBlogDetails = exports.getLatestBlogs = exports.addNewBlog = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const Blogs_1 = __importDefault(require("../models/Blogs"));
const constants_1 = require("../utils/constants");
const addNewBlog = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        subtitle: joi_1.default.string().optional(),
        banners: joi_1.default.array().items(joi_1.default.string()).min(1).max(6).required(),
        content: joi_1.default.string().required(),
        tags: joi_1.default.array().items(joi_1.default.string()).min(5).error(new Error("You need to add at least 5 tags!")),
        category: joi_1.default.string().required(),
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
    payload = Object.assign(Object.assign({}, payload), { profile: {
            profilePic: null,
            username: _req.tokenData.username,
            name: _req.tokenData.username,
            userId: _req.tokenData.userId,
        }, likes: [], createdAt: new Date(), updatedAt: new Date(), status: "ACTIVE" });
    try {
        const result = yield Blogs_1.default.create(payload);
        return _res.status(201).json({
            status: 201,
            blogId: result._id,
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
exports.addNewBlog = addNewBlog;
const getLatestBlogs = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    const schema = joi_1.default.object({
        limit: joi_1.default.number().default(20).optional(),
        skip: joi_1.default.number().default(0).optional(),
        search: joi_1.default.string().optional(),
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
        let query = {};
        if (payload.search) {
            query = Object.assign(Object.assign({}, query), { $or: [
                    { title: { $regex: payload.search } },
                    { content: { $regex: payload.search } },
                    { subtitle: { $regex: payload.search } },
                    { tags: { $regex: payload.search } },
                ] });
        }
        const count = yield Blogs_1.default.find(query).count();
        const result = yield Blogs_1.default.find(query).skip(payload.skip).limit(payload.limit).select("title subtitle profile");
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
exports.getLatestBlogs = getLatestBlogs;
const getBlogDetails = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            _id: new mongoose_1.default.Types.ObjectId(_req.params.id),
        };
        const result = yield Blogs_1.default.findOne(query).select("-__v");
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
exports.getBlogDetails = getBlogDetails;
const deleteBlog = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            _id: new mongoose_1.default.Types.ObjectId(_req.params.id),
        };
        let payload = {
            status: constants_1.BlogStatus.DELETED,
        };
        const result = yield Blogs_1.default.updateOne(query, payload);
        if (!result) {
            return _res.status(204).json({
                message: "No Data Found!",
            });
        }
        return _res.status(201).json({
            message: "success!",
        });
    }
    catch (error) {
        console.error("console error: ", error);
        return _res.status(500).send({
            message: error.message || "Internal Server Error!",
        });
    }
});
exports.deleteBlog = deleteBlog;
const updateBlog = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let blogId = new mongoose_1.default.Types.ObjectId(_req.params.id);
    let payload;
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        subtitle: joi_1.default.string().optional(),
        banners: joi_1.default.array().items(joi_1.default.string()).min(1).max(6).required(),
        content: joi_1.default.string().required(),
        tags: joi_1.default.array().items(joi_1.default.string()).min(5).error(new Error("You need to add at least 5 tags!")),
        category: joi_1.default.string().required(),
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
    payload = Object.assign(Object.assign({}, payload), { updatedAt: new Date(), status: "ACTIVE" });
    try {
        const result = yield Blogs_1.default.updateOne({ _id: blogId }, payload);
        return _res.status(201).json({
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
exports.updateBlog = updateBlog;
const likeDislikeBlog = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let blogId = new mongoose_1.default.Types.ObjectId(_req.params.id);
    try {
        const blog = yield Blogs_1.default.findOne({ _id: blogId }).select("-__v");
        if (!blog) {
            return _res.status(204).json({
                message: "Blog not found with this ID!",
            });
        }
        const updatedBlog = Object.assign({}, blog._doc);
        let payloadData = {
            likes: updatedBlog.likes,
        };
        const index = payloadData.likes.findIndex((item) => item == _req.tokenData.userId);
        if (index >= 0) {
            payloadData.likes.splice(index, 1);
        }
        else {
            payloadData.likes.push(_req.tokenData.userId);
        }
        yield Blogs_1.default.updateOne({ _id: blogId }, payloadData);
        return _res.status(201).json({
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
exports.likeDislikeBlog = likeDislikeBlog;
//# sourceMappingURL=blogs.js.map