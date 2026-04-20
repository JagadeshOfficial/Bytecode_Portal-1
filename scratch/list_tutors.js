const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://BytecodeTrainings:Bytecode%401354@bytecodetrainings.4nosy2u.mongodb.net/user-db?retryWrites=true&w=majority&appName=BytecodeTrainings";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db('user-db');
        const users = database.collection('users');
        
        const tutors = await users.find({ role: { $in: ['TUTOR', 'TRAINER', 'tutor', 'trainer'] } }).toArray();
        console.log("Tutors found:", tutors.length);
        tutors.forEach(u => {
            console.log(JSON.stringify(u, null, 2));
        });
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
