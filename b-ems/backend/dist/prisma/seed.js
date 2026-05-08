"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const process_1 = __importDefault(require("process"));
const prisma = new client_1.PrismaClient();
async function main() {
    const salt = await bcryptjs_1.default.genSalt(10);
    const passwordHash = await bcryptjs_1.default.hash('Demo@123', salt);
    // 1. Create Branches
    const hydBranch = await prisma.branch.create({
        data: { name: 'Hyderabad Main', address: 'Madhapur, Hyderabad' },
    });
    const blrBranch = await prisma.branch.create({
        data: { name: 'Bangalore Hub', address: 'Indiranagar, Bangalore' },
    });
    // 2. Create Demo Users
    await prisma.user.upsert({
        where: { email: 'super@bytecode.dev' },
        update: {},
        create: {
            fullName: 'Super Admin',
            email: 'super@bytecode.dev',
            password: passwordHash,
            role: 'SUPER_ADMIN',
            branchId: hydBranch.id,
            status: 'ACTIVE',
        },
    });
    await prisma.user.upsert({
        where: { email: 'ceo@bytecode.dev' },
        update: {},
        create: {
            fullName: 'CEO Jagadesh',
            email: 'ceo@bytecode.dev',
            password: passwordHash,
            role: 'CEO',
            branchId: hydBranch.id,
            status: 'ACTIVE',
        },
    });
    console.log('Seeding completed successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process_1.default.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
