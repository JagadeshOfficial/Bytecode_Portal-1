const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Course = require('./src/models/Course');

dotenv.config();

const seedLMS = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db');
        
        await User.deleteMany();
        await Course.deleteMany();

        const admin = await User.create({
            fullName: 'Bytecode Trainings Admin',
            email: 'bytecodetrainings@gmail.com',
            password: 'Bytecode@1354',
            role: 'SUPER_ADMIN'
        });

        await Course.create([
            { title: 'Full Stack Java', tech: 'Java', price: 500, mentor: 'Dr. Smith' },
            { title: 'Data Science Bootcamp', tech: 'Python', price: 750, mentor: 'Prof. X' }
        ]);

        console.log('LMS Node Backend Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedLMS();
