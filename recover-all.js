const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Models (Loading directly from LMS Node Backend structure)
const User = require('./lms-node-backend/src/models/User');
const Course = require('./lms-node-backend/src/models/Course');

dotenv.config({ path: './lms-node-backend/.env' });

const recoverData = async () => {
    try {
        console.log('📡 Connecting to MongoDB Atlas for recovery...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 20000, // Wait 20 seconds for Atlas
        });
        console.log('✅ Connected to Atlas.');

        // 1. Recover Users from all_users.json
        const userData = JSON.parse(fs.readFileSync('./all_users.json', 'utf8'));
        console.log(`📦 Found ${userData.length} users in backup.`);

        // Clean current users and insert backups
        console.log('🧹 Cleaning current data...');
        await User.deleteMany({});
        console.log('✨ Cleaned users.');
        
        await Course.deleteMany({});
        console.log('✨ Cleaned courses.');

        // Insert backups
        console.log('📥 Restoring users...');
        await User.insertMany(userData);
        console.log('✅ Users restored successfully.');

        // 2. Restore Demo Courses
        await Course.deleteMany({});
        await Course.insertMany([
            { title: 'Full Stack Java', tech: 'Java', price: 500, mentor: 'Dr. Smith' },
            { title: 'Data Science Bootcamp', tech: 'Python', price: 750, mentor: 'Prof. X' },
            { title: 'AI & Machine Learning', tech: 'Python', price: 1200, mentor: 'Dr. Aris' },
            { title: 'Cloud & DevOps', tech: 'AWS/Azure', price: 900, mentor: 'Sarah Connor' }
        ]);
        console.log('✅ Courses restored successfully.');

        console.log('\n🎉 RECOVERY COMPLETE! Your previous data is now back in Atlas.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Recovery Failed:', err.message);
        process.exit(1);
    }
};

recoverData();
