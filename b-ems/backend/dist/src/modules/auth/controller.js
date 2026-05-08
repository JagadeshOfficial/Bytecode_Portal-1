"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("@/prisma"));
const schema_1 = require("./schema");
const login = async (req, res) => {
    try {
        const { email, password } = schema_1.loginSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role || 'USER' }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role || 'USER',
            },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { name, email, password, role } = schema_1.registerSchema.parse(req.body);
        const userExists = await prisma_1.default.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await prisma_1.default.user.create({
            data: {
                fullName: name,
                email,
                password: hashedPassword,
                role: role || 'COUNSELLOR',
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role || 'COUNSELLOR' }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role || 'COUNSELLOR',
            },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.register = register;
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role || 'USER',
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getMe = getMe;
