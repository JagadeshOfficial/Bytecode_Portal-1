const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://BytecodeTrainings:Bytecode%401354@bytecodetrainings.4nosy2u.mongodb.net/?retryWrites=true&w=majority&appName=BytecodeTrainings";
  const client = new MongoClient(uri);

  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully to server");
    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));
  } catch(err) {
    console.dir(err);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
