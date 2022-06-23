import express from 'express';
const router = express.Router();
// import EmailService from './emailService';
import UserRoute from './userRoute';
import RegistrationRoute from './registration';
import BookingRoute from './tableBooking';
import LoginRoute from './login';
import QuestionRoute from './question.route';
import AnswerRoute from './answer.route';
import BlogRoute from './blogs.route';
import { getBlogCategories } from '../controllers/blogs';

// router.use("/email", EmailService);
router.use("/users", UserRoute);
router.use("/registration", RegistrationRoute);
router.use("/login", LoginRoute)
router.use("/booking", BookingRoute)
router.use("/questions", QuestionRoute)
router.use("/answer", AnswerRoute)
router.use("/blogs", BlogRoute)

router.get("/categories", getBlogCategories)

export default router;