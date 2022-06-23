import { Schema, model } from "mongoose";
const BlogTable = new Schema({
    title: String,
    subtitle: String,
    category: String,
    content: String,
    tags: Array,
    banners: Array,
    likes: Array,
    createdAt: Date,
    updatedAt: Date,
    status: String,
    profile: Object
});
export default model("Blogs", BlogTable);
