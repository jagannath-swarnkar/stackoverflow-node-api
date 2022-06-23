import express from "express";
import { AuthGuard } from "../middlewares/AuthGuard";
import { addNewAnswer, addNewQuestion, getAllQuestions, getQuestionById, voteQuestion } from "../controllers/question";
const router = express.Router();

router.post("/", [AuthGuard], addNewQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.post("/:id", [AuthGuard], addNewAnswer);
router.post("/vote/:id", [AuthGuard], voteQuestion);

export default router;
