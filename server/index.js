const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config(); // also check server dir for production
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { pricing, complexityDescriptions } = require('./config/pricing');

const app = express();

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        return callback(null, origin || true);
    },
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Public config endpoint (pricing + github username for the frontend)
app.get('/api/config', (req, res) => {
    res.json({
        pricing,
        complexityDescriptions,
        githubUsername: process.env.GITHUB_USERNAME,
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

// Validate required env vars
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

console.log(`🔧 Starting server on port ${PORT}...`);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
