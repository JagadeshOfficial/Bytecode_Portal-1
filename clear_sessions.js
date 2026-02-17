const axios = require('axios');

const SESSIONS_API = 'http://localhost:8088/api/academic/sessions';

async function clearSessions() {
    try {
        console.log("Fetching existing sessions...");
        const response = await axios.get(SESSIONS_API);
        const sessions = response.data;

        console.log(`Found ${sessions.length} sessions. Deleting...`);

        for (const session of sessions) {
            try {
                await axios.delete(`${SESSIONS_API}/${session.id}`);
                console.log(`Deleted session: ${session.title} (${session.id})`);
            } catch (err) {
                console.error(`Failed to delete session ${session.id}:`, err.message);
            }
        }

        console.log("Cleanup complete!");
    } catch (error) {
        console.error("Failed to fetch sessions:", error.message);
    }
}

clearSessions();
