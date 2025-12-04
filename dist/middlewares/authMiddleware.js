"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*
@param req
@param res
@param next
*/
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            message: "Token inválido!",
        });
        return;
    }
    const [bearer, token] = authHeader.split(" ");
    if (!token || bearer.toLocaleLowerCase() !== "bearer") {
        res.status(401).json({
            message: "Token inválido ou expirado!",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Token inválido ou expirado!",
        });
        return;
    }
}
