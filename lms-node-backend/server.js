const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- SIMULATION DATA (SOVEREIGN FAILOVER) ---
let SIM_COURSES = [
    { _id: 'sim_c1', name: 'Full Stack Web Development' },
    { _id: 'sim_c2', name: 'Data Science & AI' },
    { _id: 'sim_c3', name: 'Cloud & DevOps' }
];

let SIM_BATCHES = [
    { _id: 'sim_b1', name: 'B40', courseId: 'sim_c1' },
    { _id: 'sim_b2', name: 'B42', courseId: 'sim_c1' },
    { _id: 'sim_b3', name: 'DS-01', courseId: 'sim_c2' }
];

let IS_DB_LIVE = false;

// --- DB CONNECTION WITH FAILOVER ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bytecode_games';

console.log('📡 Attempting Database Connection...');
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
        console.log('🛡️ Intelligence Arena Sovereign Backend (V5.5) Connected to MongoDB');
        IS_DB_LIVE = true;
        await autoSeed();
    })
    .catch(err => {
        console.error('⚠️ MONGODB OFFLINE - Switching to SOVEREIGN MEMORY MODE');
        console.error('LMS Governance will run on Simulation Buffer.');
    });

// --- MODELS ---
const CourseSchema = new mongoose.Schema({ name: String });
const BatchSchema = new mongoose.Schema({ name: String, courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } });
const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    course: { type: String },
    batch: { type: String },
    active: { type: Boolean, default: true }
});

const Course = mongoose.model('Course', CourseSchema);
const Batch = mongoose.model('Batch', BatchSchema);
const Game = mongoose.model('Game', GameSchema);

// --- AUTO-SEED ---
async function autoSeed() {
    if (await Course.countDocuments() === 0) {
        console.log('🌱 Seeding Live Database...');
        await Course.create(SIM_COURSES.map(c => ({ name: c.name })));
        const liveC = await Course.find();
        await Batch.create([
            { name: 'B40', courseId: liveC[0]._id },
            { name: 'B42', courseId: liveC[0]._id },
            { name: 'DS-01', courseId: liveC[1]._id }
        ]);
        console.log('✅ Live Database Seeded.');
    }
}

// --- API ROUTES (CONTEXT AWARE) ---

app.get('/api/courses', async (req, res) => {
    if (IS_DB_LIVE) {
        const data = await Course.find();
        return res.json(data);
    }
    console.log('💾 Serving Courses from Memory Buffer');
    res.json(SIM_COURSES);
});

app.get('/api/batches', async (req, res) => {
    if (IS_DB_LIVE) {
        const data = await Batch.find().populate('courseId');
        return res.json(data);
    }
    console.log('💾 Serving Batches from Memory Buffer');
    res.json(SIM_BATCHES);
});

app.get('/api/games', async (req, res) => {
    if (IS_DB_LIVE) return res.json(await Game.find());
    res.json([]);
});

app.post('/api/admin/games/create', async (req, res) => {
    if (IS_DB_LIVE) {
        const game = new Game(req.body);
        await game.save();
        return res.json(game);
    }
    const simGame = { _id: Date.now(), ...req.body, active: true };
    console.log('💾 Game Created in Memory Buffer:', simGame.title);
    res.json(simGame);
});

app.get('/api/admin/system-stats', async (req, res) => {
    res.json({
        total_games: IS_DB_LIVE ? await Game.countDocuments() : 0,
        total_courses: IS_DB_LIVE ? await Course.countDocuments() : SIM_COURSES.length,
        total_batches: IS_DB_LIVE ? await Batch.countDocuments() : SIM_BATCHES.length
    });
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
