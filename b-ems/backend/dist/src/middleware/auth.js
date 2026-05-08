"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("@/prisma"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = await prisma_1.default.user.findUnique({ where: { id: decoded.id } });
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return async (req, res, next) => {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user || !user.role || !roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${user?.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
exports.authorize = authorize;
