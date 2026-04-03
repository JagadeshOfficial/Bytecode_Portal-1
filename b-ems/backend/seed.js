const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Lead = require('./models/Lead');
const LeadHistory = require('./models/LeadHistory');
const Employee = require('./models/Employee');
const Campaign = require('./models/Campaign');
const Student = require('./models/Student');
const Company = require('./models/Company');

dotenv.config();

const users = [
    { name: 'Jagadesh CEO', email: 'ceo@bytecode.com', password: 'password123', role: 'CEO' },
    { name: 'Sarah Manager', email: 'manager@bytecode.com', password: 'password123', role: 'MANAGER' },
    { name: 'Emma Counsellor', email: 'counsellor@bytecode.com', password: 'password123', role: 'COUNSELLOR' },
    { name: 'Chris SEO', email: 'seo@bytecode.com', password: 'password123', role: 'SEO_TEAM' },
    { name: 'Alex Marketing', email: 'marketing@bytecode.com', password: 'password123', role: 'MARKETING_LEAD' },
    { name: 'John Placement', email: 'placement@bytecode.com', password: 'password123', role: 'PLACEMENT_OFFICER' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/b_ems');
        
        // Clear existing data
        await User.deleteMany();
        await Lead.deleteMany();
        await LeadHistory.deleteMany();
        await Employee.deleteMany();
        await Campaign.deleteMany();
        await Student.deleteMany();
        await Company.deleteMany();

        // Create Users
        const createdUsers = await User.create(users);
        const counsellor = createdUsers.find(u => u.role === 'COUNSELLOR');
        const manager = createdUsers.find(u => u.role === 'MANAGER');
        const marketing = createdUsers.find(u => u.role === 'MARKETING_LEAD');

        // Create Employees
        await Employee.create([
            { userId: counsellor._id, employeeId: 'BC-C01', performanceScore: 85 },
            { userId: marketing._id, employeeId: 'BC-M01', performanceScore: 92 },
        ]);

        // Create Campaigns
        await Campaign.create([
            { name: 'Summer Intake 2026', source: 'FACEBOOK', status: 'LIVE', budget: 5000, spent: 1200, createdBy: marketing._id },
            { name: 'Google Search Promo', source: 'GOOGLE', status: 'LIVE', budget: 3000, spent: 800, createdBy: marketing._id },
        ]);

        // Create Students
        await Student.create([
            { name: 'Alice Johnson', email: 'alice.j@example.com', phone: '9988776655', course: 'Full Stack', batch: '2026-A', cgpa: 9.2, placementStatus: 'PENDING' },
            { name: 'Bob Smith', email: 'bob.s@example.com', phone: '8877665544', course: 'Data Science', batch: '2026-A', cgpa: 8.5, placementStatus: 'PLACED' },
            { name: 'Charlie Dave', email: 'charlie.d@example.com', phone: '7766554433', course: 'UI/UX', batch: '2026-B', cgpa: 7.8, placementStatus: 'UNPLACED' },
        ]);

        // Create Companies
        await Company.create([
            { name: 'Google', industry: 'Tech', website: 'google.com', contactPerson: 'Sundar', contactEmail: 'hr@google.com' },
            { name: 'Meta', industry: 'Social', website: 'meta.com', contactPerson: 'Mark', contactEmail: 'hr@meta.com' },
        ]);


        // Create Leads
        const leadsData = [
            { name: 'John Smith', email: 'john@example.com', phone: '9876543210', course: 'Full Stack Web Dev', status: 'NEW', priority: 'HIGH', source: 'GOOGLE' },
            { name: 'Alice Brown', email: 'alice@example.com', phone: '8765432109', course: 'Data Science', status: 'CONTACTED', priority: 'MEDIUM', assignedTo: counsellor._id, source: 'FACEBOOK' },
            { name: 'Bob Wilson', email: 'bob@example.com', phone: '7654321098', course: 'UI/UX Design', status: 'FOLLOW-UP', priority: 'URGENT', assignedTo: counsellor._id, source: 'GOOGLE' },
            { name: 'Charlie Davis', email: 'charlie@example.com', phone: '6543210987', course: 'Full Stack Web Dev', status: 'CONVERTED', priority: 'MEDIUM', assignedTo: counsellor._id, source: 'FACEBOOK' },
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

        console.log('B-EMS Database Seeded Successfully with Campaigns and Employees!');
        console.log('Login with: ceo@bytecode.com / password123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();


