const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    { name: 'John CEO', email: 'ceo@bytecode.com', password: 'password123', role: 'CEO' },
    { name: 'Sarah Manager', email: 'manager@bytecode.com', password: 'password123', role: 'MANAGER' },
    { name: 'Mike Counsellor Lead', email: 'clead@bytecode.com', password: 'password123', role: 'COUNSELLOR_LEAD' },
    { name: 'Emma Counsellor', email: 'counsellor@bytecode.com', password: 'password123', role: 'COUNSELLOR' },
    { name: 'Alex Marketing Lead', email: 'mlead@bytecode.com', password: 'password123', role: 'MARKETING_LEAD' },
    { name: 'Chris SEO', email: 'seo@bytecode.com', password: 'password123', role: 'SEO_TEAM' },
    { name: 'Jane Placement', email: 'placement@bytecode.com', password: 'password123', role: 'PLACEMENT_OFFICER' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/b_ems');
        await User.deleteMany();
        await User.insertMany(users);
        console.log('B-EMS Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
