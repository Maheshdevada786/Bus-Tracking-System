const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  runSimulation();
});

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allows all origins. For better security, you can replace '*' with your frontend URL later.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const alertRoutes = require('./routes/alertRoutes');
const statsRoutes = require('./routes/statsRoutes');
const runSimulation = require('./simulation');

// Basic route removed to allow frontend serving on '/'

app.get('/api/status', (req, res) => {
  const isConnected = require('mongoose').connection.readyState === 1;
  res.json({ 
    dbConnected: isConnected, 
    message: isConnected ? "Client is Connected" : "Client is Not Connected" 
  });
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});


app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/stats', statsRoutes);



const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
