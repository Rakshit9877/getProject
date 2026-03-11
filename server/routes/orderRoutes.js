const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { pricing } = require('../config/pricing');

// POST /api/orders/initiate has been entirely removed to prevent pre-payment DB saves.
// Pre-payment calculations and Razorpay initialization are now handled securely by /api/payment/create-order.


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
