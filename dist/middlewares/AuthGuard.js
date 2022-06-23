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
exports.AuthGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = '';
        if (!req.headers.authorization) {
            return res.status(401).send({
                message: 'Token not found!',
                status: 401
            });
        }
        if (req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else {
            token = req.headers.authorization;
        }
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.SECRETE_KEY);
        // console.log('decoded', decoded)
        req.tokenData = decoded;
        next();
    }
    catch (error) {
        console.log('error', error);
        return res.status(401).json({
            message: 'Unauthorized!',
            status: 401
        });
    }
    ;
});
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=AuthGuard.js.map