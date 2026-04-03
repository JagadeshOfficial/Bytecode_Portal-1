const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Lead = require('./models/Lead');
const LeadHistory = require('./models/LeadHistory');

dotenv.config();

const users = [
    { name: 'Jagadesh CEO', email: 'ceo@bytecode.com', password: 'password123', role: 'CEO' },
    { name: 'Sarah Manager', email: 'manager@bytecode.com', password: 'password123', role: 'MANAGER' },
    { name: 'Emma Counsellor', email: 'counsellor@bytecode.com', password: 'password123', role: 'COUNSELLOR' },
    { name: 'Chris SEO', email: 'seo@bytecode.com', password: 'password123', role: 'SEO_TEAM' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/b_ems');
        
        // Clear existing data
        await User.deleteMany();
        await Lead.deleteMany();
        await LeadHistory.deleteMany();

        // Create Users
        const createdUsers = await User.create(users);
        const counsellor = createdUsers.find(u => u.role === 'COUNSELLOR');
        const manager = createdUsers.find(u => u.role === 'MANAGER');

        // Create Leads
        const leadsData = [
            { name: 'John Smith', email: 'john@example.com', phone: '9876543210', course: 'Full Stack Web Dev', status: 'NEW', priority: 'HIGH', source: 'GOOGLE' },
            { name: 'Alice Brown', email: 'alice@example.com', phone: '8765432109', course: 'Data Science', status: 'CONTACTED', priority: 'MEDIUM', assignedTo: counsellor._id, source: 'FACEBOOK' },
            { name: 'Bob Wilson', email: 'bob@example.com', phone: '7654321098', course: 'UI/UX Design', status: 'FOLLOW-UP', priority: 'URGENT', assignedTo: counsellor._id, source: 'INSTAGRAM' },
            { name: 'Charlie Davis', email: 'charlie@example.com', phone: '6543210987', course: 'Full Stack Web Dev', status: 'CONVERTED', priority: 'MEDIUM', assignedTo: counsellor._id, source: 'REFERRAL' },
            { name: 'Diana Prince', email: 'diana@example.com', phone: '5432109876', course: 'Data Science', status: 'DEMO', priority: 'HIGH', assignedTo: counsellor._id },
        ];

        const createdLeads = await Lead.create(leadsData);

        // Add history for one lead
        await LeadHistory.create({
            leadId: createdLeads[0]._id,
            action: 'CREATE',
            performedBy: manager._id,
            details: 'Lead captured from Website form'
        });

        console.log('B-EMS Database Seeded Successfully with Leads!');
        console.log('Login with: ceo@bytecode.com / password123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();

