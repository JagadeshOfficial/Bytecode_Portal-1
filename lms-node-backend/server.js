const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

let IS_DB_LIVE = false;

// --- DB CONNECTION WITH FAILOVER ---
// Using a dedicated local DB for Games to ensure it works even if Atlas is flaky
const MONGO_URI = 'mongodb://localhost:27017/bytecode_games';

console.log('📡 Attempting Database Connection...');
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
        console.log('🛡️ Intelligence Arena Sovereign Backend (V5.5) Connected to MongoDB');
        IS_DB_LIVE = true;
    })
    .catch(err => {
        console.error('⚠️ MONGODB OFFLINE - Sovereignty Compromised');
    });

const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    course: { type: String },
    batch: { type: String },
    active: { type: Boolean, default: true }
});

const Game = mongoose.model('Game', GameSchema);

const ActivitySchema = new mongoose.Schema({
    user: { type: String, default: 'System' },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ScoreSchema = new mongoose.Schema({
    user_id: String,
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', ActivitySchema);
const Score = mongoose.model('Score', ScoreSchema);



// --- API ROUTES (CONTEXT AWARE) ---

app.get('/api/courses', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('course-db');
        const data = await db.collection('courses').find().toArray();
        res.json(data.map(c => ({ ...c, name: c.title || c.name })));
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch live courses' });
    }
});

app.get('/api/batches', async (req, res) => {
    try {
        const db = mongoose.connection.useDb('course-db');
        const data = await db.collection('batches').find().toArray();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch live batches' });
    }
});

app.get('/api/games', async (req, res) => {
    if (IS_DB_LIVE) return res.json(await Game.find());
    res.json([]);
});

app.post('/api/admin/games/create', async (req, res) => {
    if (IS_DB_LIVE) {
        const game = new Game(req.body);
        await game.save();
        await Activity.create({ user: 'Admin', action: `Created new game: ${game.title}` });
        return res.json(game);
    }
    res.status(503).json({ error: 'Database offline' });
});

app.get('/api/admin/system-activity', async (req, res) => {
    try {
        const logs = await Activity.find().sort({ timestamp: -1 }).limit(10).lean();
        const scores = await Score.find().sort({ timestamp: -1 }).limit(10).populate('game_id').lean();
        
        const combined = [
            ...logs.map(l => ({ user: l.user, action: l.action, timestamp: l.timestamp })),
            ...scores.map(s => ({ user: s.user_id, action: `Completed ${s.game_id?.title || 'Game'}`, timestamp: s.timestamp }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
        
        res.json(combined);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/leaderboard/global', async (req, res) => {
    if (IS_DB_LIVE) {
        const lb = await Score.aggregate([
            { $group: { _id: '$user_id', totalScore: { $sum: '$score' } } },
            { $sort: { totalScore: -1 } },
            { $limit: 10 }
        ]);
        return res.json(lb);
    }
    res.json([]);
});

app.get('/api/admin/system-stats', async (req, res) => {
    if (IS_DB_LIVE) {
        const acadDb = mongoose.connection.useDb('course-db');
        res.json({
            total_games: await Game.countDocuments(),
            total_courses: await acadDb.collection('courses').countDocuments(),
            total_batches: await acadDb.collection('batches').countDocuments()
        });
    } else {
        res.json({
            total_games: 0,
            total_courses: SIM_COURSES.length,
            total_batches: SIM_BATCHES.length
        });
    }
});

// --- SERVER ---
const PORT = 8085;
app.listen(PORT, () => {
    console.log(`
🚀 BYTECODE MASTER BACKEND V5.5 LIVE
📍 PORT: 8085
🛡️ FAILOVER: ACTIVE
    `);
});
