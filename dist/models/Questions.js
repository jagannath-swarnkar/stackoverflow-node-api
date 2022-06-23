"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const QuestionTable = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Questions", QuestionTable);
//# sourceMappingURL=Questions.js.map