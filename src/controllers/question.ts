import Joi, { string } from "joi";
import mongoose from "mongoose";
import Questions from "../models/Questions";

type IUser = {
    profilePic: string;
    username: string;
    name: string;
    userId: string;
};
type IVoteQuestion ={
    vote: "UP" | "DOWN",
}
export interface IAnswer {
    _id:  mongoose.Types.ObjectId,
    user: IUser;
    createdAt: Date;
    updatedAt: Date;
    answer: string;
    votes: string[];
    isCorrectAns: boolean;
}
export type IQuestionStatus = "ACTIVE" | "REJECTED" | "DELETED";
type IQuestionPayload = {
    title: string;
    body: string; // html
    tags: string[];

    questionBy: IUser;
    answers: IAnswer[];
    votes: string[];
    createdAt: Date | string;
    updatedAt: Date | string;
    status: IQuestionStatus;
};

export const addNewQuestion = async (_req: any, _res: any) => {
    let payload: IQuestionPayload;
    const schema = Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).min(5),
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
        questionBy: {
            profilePic: null,
            username: _req.tokenData.username,
            name: _req.tokenData.username,
            userId: _req.tokenData.userId,
        },
        answers: [],
        votes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "ACTIVE",
    };
    try {
        const result = await Questions.create(payload);
        return _res.status(201).json({
            status: 201,
            questionId: result._id,
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

export const getAllQuestions = async (_req: any, _res: any) => {
    let payload: any = {};
    const schema = Joi.object({
        limit: Joi.number().default(20).optional(),
        skip: Joi.number().default(0).optional(),
        search: Joi.string().optional(),
        id: Joi.string().optional(),
        status: Joi.string().default("ACTIVE").optional(),
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
                $or: [{ title: { $regex: payload.search } }, { body: { $regex: payload.search } }, { tags: { $regex: payload.search } }],
            };
        }
        const count = await Questions.find(query).count();
        const result = await Questions.find(query).skip(payload.skip).limit(payload.limit).select("-__v");
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

export const getQuestionById = async (_req: any, _res: any) => {
    try {
        let query = {
            _id: new mongoose.Types.ObjectId(_req.params.id),
        };

        const result = await Questions.findOne(query).select("-__v");
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

export const addNewAnswer = async(_req: any, _res: any) => {
    let payload: IAnswer;
    let questionId = new mongoose.Types.ObjectId(_req.params.id);
    let answerId = new mongoose.Types.ObjectId();
    const schema = Joi.object({
        answer: Joi.string().required()
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
        _id: answerId,
        user: {
            profilePic: null,
            username: _req.tokenData.username,
            name: _req.tokenData.username,
            userId: _req.tokenData.userId,
        },
        votes: [],
        isCorrectAns: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        // getting question details
        const question = await Questions.findOne({_id: questionId}).select("-__v")
        if (!question) {
            return _res.status(204).json({
                message: "Question not found with this ID!",
            });
        }
        const updatedQuestion = {...question._doc}
        updatedQuestion.answers.push(payload)
        await Questions.updateOne({_id: questionId}, updatedQuestion)
        return _res.status(201).json({
            status: 201,
            questionId: updatedQuestion._id,
            answerId: answerId,
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



export const voteQuestion = async(_req: any, _res: any) => {
    let payload: IVoteQuestion;
    let questionId = new mongoose.Types.ObjectId(_req.params.id);
    const schema = Joi.object({
        vote: Joi.string().required().allow("UP","DOWN")
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
        // getting question details
        const question = await Questions.findOne({_id: questionId}).select("-__v")
        
        if (!question) {
            return _res.status(204).json({
                message: "Question not found with this ID!",
            });
        }
        const updatedQuestion = {...question._doc}
        // console.log('updatedQuestion', updatedQuestion)
        let payloadData = {
            // ...payload,
            votes: updatedQuestion.votes
        };
        const index = payloadData.votes.findIndex((item: any)=> item == _req.tokenData.userId)
        console.log('index', index)
        if(index >= 0){
                payloadData.votes.splice(index,1)
        }else{
            payloadData.votes.push(_req.tokenData.userId)
        }
        await Questions.updateOne({_id: questionId}, {...payloadData})
        return _res.status(201).json({
            status: 201,
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
