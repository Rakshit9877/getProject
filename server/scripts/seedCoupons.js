const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');

const coupons = [
    {
        code: 'TEST_COUPON',
        discountType: 'percentage',
        discountValue: 100,
        setsFixedPrice: false,
        maxUses: null,
        isActive: true,
    },
    {
        code: 'NEW_USER',
        discountType: 'flat',
        discountValue: 0,
        setsFixedPrice: true,
        fixedPrice: 1,
        maxUses: 50,
        usedCount: 0,
        expiresAt: null,
        isActive: true,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const coupon of coupons) {
            const existing = await Coupon.findOne({ code: coupon.code });
            if (existing) {
                await Coupon.findByIdAndUpdate(existing._id, coupon);
                console.log(`Updated: ${coupon.code}`);
            } else {
                await Coupon.create(coupon);
                console.log(`Created: ${coupon.code}`);
            }
        }

        console.log('Coupons seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
