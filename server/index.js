const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const couponRoutes = require('./routes/couponRoutes');
const { pricing, pricingLabels, complexityDescriptions, pricingFeatures } = require('./config/pricing');

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        return callback(null, origin || true);
    },
    credentials: true,
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);

// Public config endpoint
app.get('/api/config', (req, res) => {
    res.json({
        pricing,
        pricingLabels,
        complexityDescriptions,
        pricingFeatures,
        githubUsername: process.env.GITHUB_USERNAME,
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    console.error(`[ERROR] Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

console.log(`[INFO] Starting server on port ${PORT}...`);

// Seed default coupons
async function seedCoupons() {
    const Coupon = require('./models/Coupon');
    const defaults = [
        { code: 'TEST_COUPON', discountType: 'percentage', discountValue: 100, setsFixedPrice: false, maxUses: null, isActive: true },
        { code: 'NEW_USER', discountType: 'flat', discountValue: 0, setsFixedPrice: true, fixedPrice: 1, maxUses: 50, isActive: true },
    ];
    for (const c of defaults) {
        const exists = await Coupon.findOne({ code: c.code });
        if (!exists) {
            await Coupon.create(c);
            console.log(`[INFO] Seeded ${c.code}`);
        }
    }
}

mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('[OK] Connected to MongoDB');
        await seedCoupons();
        app.listen(PORT, () => {
            console.log(`[OK] Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('[ERROR] MongoDB connection error:', err.message);
        process.exit(1);
    });
