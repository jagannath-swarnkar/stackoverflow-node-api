"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BlogTable = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Blogs", BlogTable);
//# sourceMappingURL=Blogs.js.map