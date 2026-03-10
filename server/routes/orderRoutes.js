const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { pricing } = require('../config/pricing');

// POST /api/orders/initiate — Save partial order before payment
router.post('/initiate', async (req, res) => {
    try {
        const {
            name, email, university, yearOfStudy,
            projectTitle, projectDescription, techStack,
            complexityLevel, featureCount, featureList,
            deadlinePreference, referenceWebsites,
            githubRepoUrl, collaboratorConfirmed,
            couponCode,
        } = req.body;

        // Validation
        if (!name || !email || !university || !yearOfStudy) {
            return res.status(400).json({ message: 'Personal details are required.' });
        }
        if (!projectTitle || !projectDescription || !complexityLevel || !featureCount || !deadlinePreference) {
            return res.status(400).json({ message: 'Project details are required.' });
        }
        if (!githubRepoUrl || !collaboratorConfirmed) {
            return res.status(400).json({ message: 'GitHub details are required and collaborator must be confirmed.' });
        }

        let amount = pricing[complexityLevel];
        if (!amount) {
            return res.status(400).json({ message: 'Invalid complexity level.' });
        }

        let discountApplied = 0;
        let validCouponCode = null;

        // Validate and apply coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon && coupon.isActive &&
                (!coupon.expiresAt || new Date() <= coupon.expiresAt) &&
                (coupon.maxUses === null || coupon.usedCount < coupon.maxUses)) {
                
                if (coupon.discountType === 'percentage') {
                    discountApplied = Math.round((amount * coupon.discountValue) / 100);
                } else {
                    discountApplied = coupon.discountValue;
                }
                discountApplied = Math.min(discountApplied, amount);
                amount = amount - discountApplied;
                validCouponCode = coupon.code;
            }
        }

        const order = new Order({
            name, email, university, yearOfStudy,
            projectTitle, projectDescription, techStack,
            complexityLevel, featureCount, featureList,
            deadlinePreference, referenceWebsites,
            githubRepoUrl, collaboratorConfirmed,
            amount,
            couponCode: validCouponCode,
            discountApplied,
            status: 'pending',
        });

        await order.save();
        res.status(201).json({ orderId: order._id, amount });
    } catch (error) {
        console.error('Order initiation error:', error);
        res.status(500).json({ message: 'Failed to initiate order.' });
    }
});

// GET /api/orders/track/:orderId — Public order tracking
router.get('/track/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).select(
            'projectTitle complexityLevel createdAt status statusMessage statusUpdatedAt githubRepoUrl deadlinePreference'
        );

        if (!order) {
            return res.status(404).json({ message: 'No order found with this ID. Please check and try again.' });
        }

        res.json(order);
    } catch (error) {
        // Handle invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'No order found with this ID. Please check and try again.' });
        }
        console.error('Order tracking error:', error);
        res.status(500).json({ message: 'Failed to track order.' });
    }
});

module.exports = router;
