import express from "express";
import { getAvailableSlots, reservation } from "../controllers/tableBooking";
import { AuthGuard } from "../middlewares/AuthGuard";
// import { BasicAuth } from '../middlewares/BasicAuth';
const router = express.Router();

router.post("/", AuthGuard, reservation);
router.get("/slots", AuthGuard, getAvailableSlots);

export default router;
