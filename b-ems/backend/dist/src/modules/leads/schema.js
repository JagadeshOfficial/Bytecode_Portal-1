"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadSchema = void 0;
const zod_1 = require("zod");
exports.leadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string(),
    email: zod_1.z.string().email().optional().nullable(),
    source: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    assignedToId: zod_1.z.string().optional().nullable(),
    courseInterest: zod_1.z.string().optional(),
    branchId: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional(),
    followUpAt: zod_1.z.string().optional().nullable(),
});
