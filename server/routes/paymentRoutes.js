const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { sendCustomerConfirmation, sendAdminNotification } = require('../utils/emailService');

let razorpay;
function getRazorpay() {
    if (!razorpay) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpay;
}

// POST /api/payment/create-order — Create Razorpay order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, mongoId } = req.body;

        if (amount === undefined || !mongoId) {
            return res.status(400).json({ message: 'Amount and order ID are required.' });
        }

        const order = await Order.findById(mongoId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Razorpay minimum is 100 paise (₹1)
        const amountInPaise = Math.max(amount * 100, 100);

        const razorpayOrder = await getRazorpay().orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: mongoId,
            notes: {
                projectTitle: order.projectTitle,
                customerEmail: order.email,
            },
        });

        // Store the Razorpay order ID on our order
        order.orderId = razorpayOrder.id;
        await order.save();

        res.json({
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ message: 'Failed to create payment order.' });
    }
});

// POST /api/payment/verify — Verify Razorpay payment signature
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mongoId } = req.body;

        if (!mongoId) {
            return res.status(400).json({ message: 'Missing order ID.' });
        }

        const order = await Order.findById(mongoId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Standard Razorpay verification
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment verification data.' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
        }

        order.paymentId = razorpay_payment_id;
        order.status = 'pending_verification';
        await order.save();

        // Increment coupon usage if one was used
        if (order.couponCode) {
            Coupon.findOneAndUpdate(
                { code: order.couponCode },
                { $inc: { usedCount: 1 } }
            ).catch(err => console.error('Coupon usage increment error:', err));
        }

        // Send emails non-blocking
        sendCustomerConfirmation(order);
        sendAdminNotification(order);

        res.json({
            success: true,
            orderId: order.orderId,
            projectTitle: order.projectTitle,
            message: 'Payment successful',
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Payment verification failed.' });
    }
});

module.exports = router;
