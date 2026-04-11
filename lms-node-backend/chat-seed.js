const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Chat = require('./src/models/Chat');
const Message = require('./src/models/Message');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db');
        
        const users = await User.find().limit(5);
        if (users.length === 0) {
            console.log('No users found. Run lms-seed.js first.');
            process.exit(1);
        }

        const admin = users.find(u => u.role === 'SUPER_ADMIN') || users[0];
        const student = users[1] || users[0];

        // Create a Direct Chat
        const dm = await Chat.create({
            name: `${student.fullName || 'Student'} Chat`,
            type: 'DIRECT',
            participants: [admin._id, student._id],
            category: 'TEAM',
            description: '1-to-1 Technical Support'
        });

        // Create a Group Chat
        const group = await Chat.create({
            name: 'Batch PDA-86',
            type: 'GROUP',
            participants: users.map(u => u._id),
            category: 'CHANNELS',
            description: 'Official communication for PDA-86 cohort.'
        });

        // Add some messages
        await Message.create([
            {
                chat: dm._id,
                sender: student._id,
                text: 'Hello Admin, I have a doubt in Module 4.',
                type: 'TEXT'
            },
            {
                chat: dm._id,
                sender: admin._id,
                text: 'Sure, tell me what is the issue?',
                type: 'TEXT'
            },
            {
                chat: group._id,
                sender: admin._id,
                text: 'Welcome to PDA-86! Please find the syllabus in the assets section.',
                type: 'TEXT'
            }
        ]);

        console.log('Chat system seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
