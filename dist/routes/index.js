"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import EmailService from './emailService';
const userRoute_1 = __importDefault(require("./userRoute"));
const registration_1 = __importDefault(require("./registration"));
const tableBooking_1 = __importDefault(require("./tableBooking"));
const login_1 = __importDefault(require("./login"));
const question_route_1 = __importDefault(require("./question.route"));
const answer_route_1 = __importDefault(require("./answer.route"));
const blogs_route_1 = __importDefault(require("./blogs.route"));
const blogs_1 = require("../controllers/blogs");
const question_1 = require("../controllers/question");
const question_2 = require("../controllers/question");
// router.use("/email", EmailService);
router.use("/users", userRoute_1.default);
router.use("/registration", registration_1.default);
router.use("/login", login_1.default);
router.use("/booking", tableBooking_1.default);
router.use("/questions", question_route_1.default);
router.use("/answer", answer_route_1.default);
router.use("/blogs", blogs_route_1.default);
router.get("/categories", blogs_1.getBlogCategories);
router.get("/search", question_1.searchQuestion);
router.get("/quickSearch", question_2.quickSearch);
exports.default = router;
//# sourceMappingURL=index.js.map