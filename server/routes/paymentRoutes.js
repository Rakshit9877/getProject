const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { sendCustomerConfirmation, sendAdminNotification } = require('../services/emailService');

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
        const { amount, orderId } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({ message: 'Amount and order ID are required.' });
        }

        // Verify the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const razorpayOrder = await getRazorpay().orders.create({
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: orderId,
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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            return res.status(400).json({ message: 'Missing payment verification data.' });
        }

        // Verify signature using HMAC SHA256
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
        }

        // Update order with payment details
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        order.paymentId = razorpay_payment_id;
        order.status = 'paid';
        await order.save();

        // Send emails truly non-blocking — don't await so we respond to the client immediately
        Promise.all([
            sendCustomerConfirmation(order),
            sendAdminNotification(order),
        ]).catch((emailError) => {
            console.error('Email sending error:', emailError);
        });

        res.json({
            message: 'Payment verified successfully.',
            order: {
                id: order._id,
                projectTitle: order.projectTitle,
                status: order.status,
                amount: order.amount,
                paymentId: order.paymentId,
            },
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Payment verification failed.' });
    }
});

module.exports = router;
