import express from 'express';
import { login } from '../controllers/users';
const router = express.Router();

router.post("/", login)

export default router;