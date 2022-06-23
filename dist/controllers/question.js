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
exports.voteQuestion = exports.addNewAnswer = exports.getQuestionById = exports.getAllQuestions = exports.addNewQuestion = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const Questions_1 = __importDefault(require("../models/Questions"));
const addNewQuestion = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    const schema = joi_1.default.object({
        title: joi_1.default.string().required(),
        body: joi_1.default.string().required(),
        tags: joi_1.default.array().items(joi_1.default.string()).min(5),
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
    payload = Object.assign(Object.assign({}, payload), { questionBy: {
            profilePic: null,
            username: _req.tokenData.username,
            name: _req.tokenData.username,
            userId: _req.tokenData.userId,
        }, answers: [], votes: [], createdAt: new Date(), updatedAt: new Date(), status: "ACTIVE" });
    try {
        const result = yield Questions_1.default.create(payload);
        return _res.status(201).json({
            status: 201,
            questionId: result._id,
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
exports.addNewQuestion = addNewQuestion;
const getAllQuestions = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload = {};
    const schema = joi_1.default.object({
        limit: joi_1.default.number().default(20).optional(),
        skip: joi_1.default.number().default(0).optional(),
        search: joi_1.default.string().optional(),
        id: joi_1.default.string().optional(),
        status: joi_1.default.string().default("ACTIVE").optional(),
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
            query = Object.assign(Object.assign({}, query), { $or: [{ title: { $regex: payload.search } }, { body: { $regex: payload.search } }, { tags: { $regex: payload.search } }] });
        }
        const count = yield Questions_1.default.find(query).count();
        const result = yield Questions_1.default.find(query).skip(payload.skip).limit(payload.limit).select("-__v");
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
exports.getAllQuestions = getAllQuestions;
const getQuestionById = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            _id: new mongoose_1.default.Types.ObjectId(_req.params.id),
        };
        const result = yield Questions_1.default.findOne(query).select("-__v");
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
exports.getQuestionById = getQuestionById;
const addNewAnswer = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    let questionId = new mongoose_1.default.Types.ObjectId(_req.params.id);
    let answerId = new mongoose_1.default.Types.ObjectId();
    const schema = joi_1.default.object({
        answer: joi_1.default.string().required()
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
    payload = Object.assign(Object.assign({}, payload), { _id: answerId, user: {
            profilePic: null,
            username: _req.tokenData.username,
            name: _req.tokenData.username,
            userId: _req.tokenData.userId,
        }, votes: [], isCorrectAns: false, createdAt: new Date(), updatedAt: new Date() });
    try {
        // getting question details
        const question = yield Questions_1.default.findOne({ _id: questionId }).select("-__v");
        if (!question) {
            return _res.status(204).json({
                message: "Question not found with this ID!",
            });
        }
        const updatedQuestion = Object.assign({}, question._doc);
        updatedQuestion.answers.push(payload);
        yield Questions_1.default.updateOne({ _id: questionId }, updatedQuestion);
        return _res.status(201).json({
            status: 201,
            questionId: updatedQuestion._id,
            answerId: answerId,
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
exports.addNewAnswer = addNewAnswer;
const voteQuestion = (_req, _res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    let questionId = new mongoose_1.default.Types.ObjectId(_req.params.id);
    const schema = joi_1.default.object({
        vote: joi_1.default.string().required().allow("UP", "DOWN")
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
        // getting question details
        const question = yield Questions_1.default.findOne({ _id: questionId }).select("-__v");
        if (!question) {
            return _res.status(204).json({
                message: "Question not found with this ID!",
            });
        }
        const updatedQuestion = Object.assign({}, question._doc);
        // console.log('updatedQuestion', updatedQuestion)
        let payloadData = {
            // ...payload,
            votes: updatedQuestion.votes
        };
        const index = payloadData.votes.findIndex((item) => item == _req.tokenData.userId);
        console.log('index', index);
        if (index >= 0) {
            payloadData.votes.splice(index, 1);
        }
        else {
            payloadData.votes.push(_req.tokenData.userId);
        }
        yield Questions_1.default.updateOne({ _id: questionId }, Object.assign({}, payloadData));
        return _res.status(201).json({
            status: 201,
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
exports.voteQuestion = voteQuestion;
//# sourceMappingURL=question.js.map