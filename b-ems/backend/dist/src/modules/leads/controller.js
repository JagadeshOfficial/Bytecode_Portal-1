"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeads = void 0;
const prisma_1 = __importDefault(require("@/prisma"));
const schema_1 = require("./schema");
const server_1 = require("@/server");
const getLeads = async (req, res) => {
    try {
        const leads = await prisma_1.default.lead.findMany({
            include: { assignedTo: true, branch: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: leads });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getLeads = getLeads;
const createLead = async (req, res) => {
    try {
        const data = schema_1.leadSchema.parse(req.body);
        const lead = await prisma_1.default.lead.create({
            data: {
                ...data,
                followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
            },
            include: { assignedTo: true },
        });
        // Notify via socket
        server_1.io.emit('new_lead', lead);
        res.status(201).json({ success: true, data: lead });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.createLead = createLead;
const updateLead = async (req, res) => {
    try {
        const id = req.params.id;
        const data = schema_1.leadSchema.partial().parse(req.body);
        const lead = await prisma_1.default.lead.update({
            where: { id },
            data: {
                ...data,
                followUpAt: data.followUpAt ? new Date(data.followUpAt) : undefined,
            },
        });
        res.json({ success: true, data: lead });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.default.lead.delete({ where: { id } });
        res.json({ success: true, message: 'Lead deleted' });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.deleteLead = deleteLead;
