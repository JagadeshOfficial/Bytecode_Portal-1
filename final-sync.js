const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
    try {
        const localUri = 'mongodb://localhost:27017/lms_db';
        await mongoose.connect(localUri);
        console.log('📡 Syncing local database...');

        const userData = JSON.parse(fs.readFileSync('./all_users.json', 'utf8'));
        
        for (const user of userData) {
            // We ensure the _id is converted to an ObjectId if it exists as a string
            const id = user._id;
            delete user._id; 
            
            await mongoose.connection.db.collection('users').updateOne(
                { email: user.email },
                { $set: user },
                { upsert: true }
            );
            
            // If we have the ID, let's make sure it's the right one
            if (id) {
                await mongoose.connection.db.collection('users').updateOne(
                    { email: user.email },
                    { $set: { _id: new mongoose.Types.ObjectId(id) } }
                );
            }
        }

        console.log('✅ DATABASE SYNC COMPLETE! All users restored with correct IDs.');
        process.exit(0);
    } catch (e) {
        console.error('❌ Error:', e.message);
        process.exit(1);
    }
}
run();
