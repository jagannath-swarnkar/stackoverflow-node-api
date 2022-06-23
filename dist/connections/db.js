"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
console.info("connecting to db..............");
mongoose_1.default.connect(process.env.DB_CONNECTION, {
    keepAlive: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
}, (err) => {
    if (err) {
        console.error("DB Error!", err);
    }
    else {
        console.info("DB connected!");
    }
});
//# sourceMappingURL=db.js.map