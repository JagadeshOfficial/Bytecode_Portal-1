const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://BytecodeTrainings:Bytecode%401354@bytecodetrainings.4nosy2u.mongodb.net/user-db?retryWrites=true&w=majority&appName=BytecodeTrainings";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('user-db');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const users = await db.collection('users').find({}).limit(5).toArray();
        console.log('Sample Users:', JSON.stringify(users, null, 2));

        const employees = await db.collection('employees').find({}).limit(5).toArray();
        console.log('Sample Employees:', JSON.stringify(employees, null, 2));

    } finally {
        await client.close();
    }
}

main().catch(console.error);
