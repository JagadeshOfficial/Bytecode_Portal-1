"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const routes_1 = __importDefault(require("./modules/auth/routes"));
const routes_2 = __importDefault(require("./modules/leads/routes"));
// Load env vars
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
exports.io = io;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/v1/auth', routes_1.default);
app.use('/api/v1/leads', routes_2.default);
// Static folder
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Basic route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'ByteCode Trainings API v1' });
});
// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process_1.default.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    });
});
const PORT = process_1.default.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running in ${process_1.default.env.NODE_ENV} mode on port ${PORT}`);
});
