const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://BytecodeTrainings:Bytecode%401354@bytecodetrainings.4nosy2u.mongodb.net/user-db?retryWrites=true&w=majority&appName=BytecodeTrainings";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db("user-db");
        const collections = await database.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const usersCollection = database.collection("users");
        const users = await usersCollection.find({}).toArray();
        console.log("Users from DB:", JSON.stringify(users, null, 2));

    } catch (e) {
        console.error("Error connecting to DB:", e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
