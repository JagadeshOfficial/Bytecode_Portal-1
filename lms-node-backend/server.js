const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- DB CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bytecode_games';

console.log('📡 Attempting Database Connection...');
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('🛡️ Intelligence Arena Sovereign Backend (V5.4) Connected');
        await autoSeed(); // AUTO-SEED ON STARTUP
    })
    .catch(err => {
        console.error('❌ DATABASE CONNECTION FAILURE. Is MongoDB running?');
        console.error('Error Details:', err.message);
    });

// --- MODELS ---
const CourseSchema = new mongoose.Schema({ name: String });
const BatchSchema = new mongoose.Schema({ name: String, courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } });
const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, default: 'MED' },
    course: { type: String, required: true },
    batch: { type: String, required: true },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
});
const ScoreSchema = new mongoose.Schema({
    user_id: String,
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    score: Number,
    cheating_detected: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', CourseSchema);
const Batch = mongoose.model('Batch', BatchSchema);
const Game = mongoose.model('Game', GameSchema);
const Score = mongoose.model('Score', ScoreSchema);

// --- AUTO-SEED LOGIC ---
async function autoSeed() {
    try {
        const coursesCount = await Course.countDocuments();
        if (coursesCount === 0) {
            console.log('🌱 Empty Database Detected. Initiating Sovereign Seeder...');
            const c1 = await Course.create({ name: 'Full Stack Web Development' });
            const c2 = await Course.create({ name: 'Data Science & AI' });
            const c3 = await Course.create({ name: 'Cloud & DevOps' });
            const c4 = await Course.create({ name: 'Cyber Security Elite' });
            
            await Batch.create({ name: 'B40', courseId: c1._id });
            await Batch.create({ name: 'B42', courseId: c1._id });
            await Batch.create({ name: 'DS-01', courseId: c2._id });
            await Batch.create({ name: 'DO-05', courseId: c3._id });
            await Batch.create({ name: 'CS-09', courseId: c4._id });
            
            console.log('✅ DATABASE SUCCESSFULLY SEEDED WITH 4 COURSES AND 5 BATCHES');
        } else {
            console.log('📊 Existing Metadata Detected. Academic Dataset: ACTIVE');
        }
    } catch (e) {
        console.error('❌ AUTO-SEEDING FAILED:', e.message);
    }
}

// --- API ROUTES ---

// Manual Setup Trigger
app.get('/api/admin/setup-data', async (req, res) => {
    await autoSeed();
    res.json({ message: 'Seeding Cycle Completed' });
});

app.get('/api/courses', async (req, res) => {
    const data = await Course.find();
    console.log(`📡 Fetch: Courses (${data.length} found)`);
    res.json(data);
});

app.get('/api/batches', async (req, res) => {
    const data = await Batch.find().populate('courseId');
    console.log(`📡 Fetch: Batches (${data.length} found)`);
    res.json(data);
});

app.get('/api/games', async (req, res) => res.json(await Game.find().sort({ created_at: -1 })));

app.post('/api/admin/games/create', async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        console.log(`🆕 Game Created: ${game.title} for ${game.course}`);
        res.status(201).json(game);
    } catch (e) { 
        console.error('❌ Game Creation Error:', e.message);
        res.status(400).json({ error: e.message }); 
    }
});

app.get('/api/admin/system-stats', async (req, res) => {
    res.json({
        total_games: await Game.countDocuments(),
        total_submissions: await Score.countDocuments(),
        cheating_incidents: await Score.countDocuments({ cheating_detected: true }),
        total_courses: await Course.countDocuments(),
        total_batches: await Batch.countDocuments()
    });
});

app.get('/api/leaderboard/global', async (req, res) => {
    const lb = await Score.aggregate([
        { $group: { _id: '$user_id', totalScore: { $sum: '$score' } } },
        { $sort: { totalScore: -1 } },
        { $limit: 10 }
    ]);
    res.json(lb);
});

// --- SERVER INITIALIZATION ---
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
    console.log(`
🚀 BYTECODE MASTER BACKEND V5.4 LIVE
📍 PORT: ${PORT}
⚡ STATUS: SOVEREIGN
    `);
});
