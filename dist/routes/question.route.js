"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthGuard_1 = require("../middlewares/AuthGuard");
const question_1 = require("../controllers/question");
const router = express_1.default.Router();
router.post("/", [AuthGuard_1.AuthGuard], question_1.addNewQuestion);
router.get("/", question_1.getAllQuestions);
router.get("/:id", question_1.getQuestionById);
router.post("/:id", [AuthGuard_1.AuthGuard], question_1.addNewAnswer);
router.post("/vote/:id", [AuthGuard_1.AuthGuard], question_1.voteQuestion);
exports.default = router;
//# sourceMappingURL=question.route.js.map