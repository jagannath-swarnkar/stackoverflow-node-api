import express from "express";
import { AuthGuard } from "../middlewares/AuthGuard";
import { addNewBlog, deleteBlog, getBlogCategories, getBlogDetails, getLatestBlogs, likeDislikeBlog, updateBlog } from "../controllers/blogs";
const router = express.Router();

router.post("/", [AuthGuard], addNewBlog);
router.get("/", getLatestBlogs);
router.get("/:id", getBlogDetails);
router.patch("/:id", [AuthGuard], updateBlog);
router.delete("/:id", [AuthGuard], deleteBlog);
router.post("/likeDislike/:id", [AuthGuard], likeDislikeBlog);
export default router;
