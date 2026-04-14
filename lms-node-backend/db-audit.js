const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/bytecode_games';

async function checkDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        const Course = mongoose.model('Course', new mongoose.Schema({ name: String }));
        const Batch = mongoose.model('Batch', new mongoose.Schema({ name: String, courseId: mongoose.Schema.Types.ObjectId }));
        
        const courses = await Course.find();
        const batches = await Batch.find();
        
        console.log('--- DATABASE AUDIT ---');
        console.log('Total Courses:', courses.length);
        courses.forEach(c => console.log(' - Course:', c.name));
        
        console.log('Total Batches:', batches.length);
        batches.forEach(b => console.log(' - Batch:', b.name));
        
        mongoose.disconnect();
    } catch (e) {
        console.error('❌ DB Audit Failed:', e.message);
    }
}

checkDB();
