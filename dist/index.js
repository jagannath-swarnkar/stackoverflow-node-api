"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
require("./connections/db");
const routes_1 = __importDefault(require("./routes"));
const PORT = process.env.PORT || "8000";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.default);
app.listen(PORT, () => {
    console.log(`Application is running on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map