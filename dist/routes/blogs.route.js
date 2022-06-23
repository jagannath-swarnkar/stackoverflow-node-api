"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthGuard_1 = require("../middlewares/AuthGuard");
const blogs_1 = require("../controllers/blogs");
const router = express_1.default.Router();
router.post("/", [AuthGuard_1.AuthGuard], blogs_1.addNewBlog);
router.get("/", blogs_1.getLatestBlogs);
router.get("/:id", blogs_1.getBlogDetails);
router.patch("/:id", [AuthGuard_1.AuthGuard], blogs_1.updateBlog);
router.delete("/:id", [AuthGuard_1.AuthGuard], blogs_1.deleteBlog);
router.post("/likeDislike/:id", [AuthGuard_1.AuthGuard], blogs_1.likeDislikeBlog);
exports.default = router;
//# sourceMappingURL=blogs.route.js.map