import express from "express";
import { AuthGuard } from "../middlewares/AuthGuard";
import { addNewAnswer } from "../controllers/question";
const router = express.Router();

router.post("/:id", [AuthGuard], addNewAnswer);

export default router;
