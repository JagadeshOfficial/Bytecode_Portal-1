const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('B-EMS API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/leads', require('./routes/leadRoutes'));
// app.use('/api/employees', require('./routes/employeeRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`B-EMS Server running on port ${PORT}`);
});
