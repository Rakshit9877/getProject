const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { pricing } = require('../config/pricing');

// Map selected features → tech stack
function deriveTechStack(selectedFeatures) {
    const stack = new Set(['React Frontend']);
    const featureMap = {
        'User registration & login': 'Authentication',
        'Role-based access (admin vs regular user)': 'Authentication',
        'Store and display data (database needed)': ['MongoDB', 'REST API'],
        'File / image uploads': 'File Upload',
        'Payment integration': 'Payment Gateway',
        'Admin panel / dashboard': 'Admin Panel',
        'Search and filter functionality': 'MongoDB',
        'Email notifications': 'Email Integration',
        'Charts and data visualization': 'Data Visualization',
        'REST API / connect to external service': 'REST API',
    };

    let needsBackend = false;
    for (const feature of selectedFeatures || []) {
        const mapped = featureMap[feature];
        if (mapped) {
            if (Array.isArray(mapped)) mapped.forEach(m => stack.add(m));
            else stack.add(mapped);
            needsBackend = true;
        }
        // Any data/backend-related feature
        if (['Store and display data (database needed)', 'User registration & login',
            'Role-based access (admin vs regular user)', 'File / image uploads',
            'Payment integration', 'Search and filter functionality',
            'Email notifications', 'REST API / connect to external service'].includes(feature)) {
            needsBackend = true;
        }
    }
    if (needsBackend) stack.add('Express/Node.js Backend');
    return [...stack];
}

// POST /api/orders/initiate — Save partial order before payment
router.post('/initiate', async (req, res) => {
    try {
        const {
            name, email, university, yearOfStudy,
            projectTitle, projectDescription, selectedFeatures,
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

        const originalPrice = pricing[complexityLevel];
        if (!originalPrice) {
            return res.status(400).json({ message: 'Invalid complexity level.' });
        }

        let finalAmount = originalPrice;
        let discountApplied = 0;
        let validCouponCode = null;

        // Validate and apply coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon && coupon.isActive &&
                (!coupon.expiresAt || new Date() <= coupon.expiresAt) &&
                (coupon.maxUses === null || coupon.usedCount < coupon.maxUses)) {

                if (coupon.setsFixedPrice) {
                    finalAmount = coupon.fixedPrice;
                    discountApplied = originalPrice - finalAmount;
                } else if (coupon.discountType === 'percentage') {
                    discountApplied = Math.round((originalPrice * coupon.discountValue) / 100);
                    discountApplied = Math.min(discountApplied, originalPrice);
                    finalAmount = originalPrice - discountApplied;
                } else {
                    discountApplied = Math.min(coupon.discountValue, originalPrice);
                    finalAmount = originalPrice - discountApplied;
                }
                finalAmount = Math.max(finalAmount, 0);
                validCouponCode = coupon.code;
            }
        }

        const techStack = deriveTechStack(selectedFeatures);

        const order = new Order({
            orderId: 'pending', // will be set after Razorpay order creation
            name, email, university, yearOfStudy,
            projectTitle, projectDescription,
            selectedFeatures: selectedFeatures || [],
            techStack,
            complexityLevel, featureCount, featureList,
            deadlinePreference, referenceWebsites,
            githubRepoUrl, collaboratorConfirmed,
            finalAmountPaid: finalAmount,
            couponCode: validCouponCode,
            discountApplied,
            status: 'pending_verification',
        });

        await order.save();
        res.status(201).json({ mongoId: order._id, amount: finalAmount });
    } catch (error) {
        console.error('Order initiation error:', error);
        res.status(500).json({ message: 'Failed to initiate order.' });
    }
});

// GET /api/orders/track/:orderId — Public order tracking (by Razorpay orderId)
router.get('/track/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).select(
            'orderId projectTitle complexityLevel createdAt status statusMessage statusUpdatedAt githubRepoUrl deadlinePreference'
        );

        if (!order) {
            return res.status(404).json({ message: 'No order found with this ID. Please check and try again.' });
        }

        res.json(order);
    } catch (error) {
        console.error('Order tracking error:', error);
        res.status(500).json({ message: 'Failed to track order.' });
    }
});

module.exports = router;
