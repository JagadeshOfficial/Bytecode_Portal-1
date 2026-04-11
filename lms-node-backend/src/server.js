const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '1024mb' }));
app.use(express.urlencoded({ limit: '1024mb', extended: true }));

// Static folder
app.use('/uploads', express.static('src/public'));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.use(require('./middleware/errorMiddleware'));

app.get('/', (req, res) => {
    res.send('LMS Node Backend API is running...');
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`LMS Node Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
