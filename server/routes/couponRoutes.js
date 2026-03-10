const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { pricing } = require('../config/pricing');

// POST /api/coupons/validate — Public: validate a coupon code
router.post('/validate', async (req, res) => {
    try {
        const { code, complexityLevel } = req.body;

        if (!code || !complexityLevel) {
            return res.status(400).json({ valid: false, message: 'Coupon code and complexity level are required.' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(200).json({ valid: false, message: 'Invalid or expired coupon code.' });
        }

        if (!coupon.isActive) {
            return res.status(200).json({ valid: false, message: 'This coupon is no longer active.' });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return res.status(200).json({ valid: false, message: 'This coupon has expired.' });
        }

        if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
            return res.status(200).json({ valid: false, message: 'This coupon has reached its usage limit.' });
        }

        const originalPrice = pricing[complexityLevel];
        if (!originalPrice) {
            return res.status(400).json({ valid: false, message: 'Invalid complexity level.' });
        }

        let discountAmount;
        if (coupon.discountType === 'percentage') {
            discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
        } else {
            discountAmount = coupon.discountValue;
        }

        // Cap discount to the original price
        discountAmount = Math.min(discountAmount, originalPrice);
        const discountedPrice = originalPrice - discountAmount;

        res.json({
            valid: true,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
            discountedPrice,
            originalPrice,
        });
    } catch (error) {
        console.error('Coupon validation error:', error);
        res.status(500).json({ valid: false, message: 'Failed to validate coupon.' });
    }
});

module.exports = router;
