const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://BytecodeTrainings:Bytecode%401354@bytecodetrainings.4nosy2u.mongodb.net/user-db?retryWrites=true&w=majority&appName=BytecodeTrainings";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db('user-db');
        const users = database.collection('users');
        
        const allUsers = await users.find({}).toArray();
        console.log("Users found:", allUsers.length);
        allUsers.forEach(u => {
            console.log(`ID: ${u._id}, Name: ${u.fullName || u.name}, Email: ${u.email}, Role: ${u.role}`);
        });
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
