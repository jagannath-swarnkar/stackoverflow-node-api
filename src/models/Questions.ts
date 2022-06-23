import { Schema, model } from "mongoose";
const QuestionTable = new Schema({
    title: String,
    body: String,
    tags: Array,
    questionBy: {
        profilePic: String,
        username: String,
        name: String,
        userId: String,
    },
    answers: Array,
    votes: Array,
    createdAt: Date,
    updatedAt: Date,
    status: String,
});
export default model("Questions", QuestionTable);
