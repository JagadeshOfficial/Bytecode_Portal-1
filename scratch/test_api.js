const axios = require('axios');

async function test() {
    try {
        const id = '698cb02cc71948c3567e76b8';
        console.log(`Testing GET http://localhost:8080/api/users/${id}`);
        const res = await axios.get(`http://localhost:8080/api/users/${id}`);
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Response Data:', e.response.data);
        }
    }
}

test();
