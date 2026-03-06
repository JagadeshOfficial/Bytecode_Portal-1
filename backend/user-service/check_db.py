from pymongo import MongoClient
import json

uri = "mongodb+srv://bytecodetrainings_db_user:Bytecode%401354@bytecodetrainings.4nosy2u.mongodb.net/user-db?appName=BytecodeTrainings"
client = MongoClient(uri)
db = client['user-db']

collections = db.list_collection_names()
results = {}
for coll_name in collections:
    results[coll_name] = db[coll_name].count_documents({})

print(json.dumps(results, indent=2))
