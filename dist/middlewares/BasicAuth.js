"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAuth = void 0;
const atob_1 = __importDefault(require("atob"));
const BasicAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = "";
        if (!req.headers.authorization) {
            return res.status(401).send({
                message: "Unauthorized!",
                status: 401,
            });
        }
        if (req.headers.authorization.startsWith("Basic")) {
            token = req.headers.authorization.split(" ")[1];
        }
        else {
            token = req.headers.authorization;
        }
        const decoded = (0, atob_1.default)(token);
        const tokenData = {
            username: decoded.split(":")[0],
            password: decoded.split(":")[1],
        };
        req.tokenData = tokenData;
        next();
    }
    catch (error) {
        console.log("error", error);
        return res.status(401).json({
            message: "Unauthorized!",
            status: 401,
        });
    }
});
exports.BasicAuth = BasicAuth;
//# sourceMappingURL=BasicAuth.js.map