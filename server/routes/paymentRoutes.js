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

// POST /api/payment/create-order — Create Razorpay order (NO DB SAVE)
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        if (amount === undefined) {
            return res.status(400).json({ message: 'Amount is required.' });
        }

        // Razorpay minimum is 100 paise (₹1)
        const amountInPaise = Math.max(amount * 100, 100);

        const razorpayOrder = await getRazorpay().orders.create({
            amount: amountInPaise,
            currency: 'INR',
            // No receipt ID since order isn't saved yet
            notes: {
                message: "Order initiated. Pending verification & save."
            },
        });

        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ message: 'Failed to create payment order.' });
    }
});

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

// POST /api/payment/verify — Verify Razorpay payment signature and SAVE the exact paid order
router.post('/verify', async (req, res) => {
    try {
        const { 
            razorpay_order_id, razorpay_payment_id, razorpay_signature, 
            name, email, university, yearOfStudy, projectTitle, projectDescription,
            selectedFeatures, complexityLevel, featureCount, featureList,
            deadlinePreference, referenceWebsites, githubRepoUrl, collaboratorConfirmed,
            couponCode, discountApplied, originalAmount 
        } = req.body;

        // Verify Razorpay signature
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment verification data.' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        // Idempotency check: prevent duplicate saves on retry
        const existing = await Order.findOne({ orderId: razorpay_order_id });
        if (existing) {
            return res.json({ success: true, orderId: existing.orderId, projectTitle: existing.projectTitle });
        }

        // Fetch actual payment to get the actual amount paid
        const payment = await getRazorpay().payments.fetch(razorpay_payment_id);
        const amountPaid = payment.amount / 100; // convert paise to rupees

        // Only NOW save to MongoDB
        const techStack = deriveTechStack(selectedFeatures);

        const order = new Order({
            // Payment Info
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentStatus: 'captured',
            finalAmountPaid: amountPaid,
            originalAmount: originalAmount,
            couponCode: couponCode,
            discountApplied: discountApplied,
            status: 'pending_verification',

            // Customer Info
            name, email, university, yearOfStudy,
            
            // Project Info
            projectTitle, projectDescription,
            selectedFeatures: selectedFeatures || [],
            techStack,
            complexityLevel, featureCount: featureCount || '1-3', featureList,
            deadlinePreference, referenceWebsites,
            
            // GitHub
            githubRepoUrl: githubRepoUrl?.trim(),
            collaboratorConfirmed,
        });

        await order.save();

        // Increment coupon usage if one was used
        if (order.couponCode) {
            Coupon.findOneAndUpdate(
                { code: order.couponCode },
                { $inc: { usedCount: 1 } }
            ).catch(err => console.error('Coupon usage increment error:', err));
        }

        // Send emails 
        try {
            sendCustomerConfirmation(order);
            sendAdminNotification(order);
        } catch(e) {
            console.error('Failed to send confirmation emails (non-blocking):', e);
        }

        res.json({
            success: true,
            orderId: order.orderId,
            projectTitle: order.projectTitle,
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed.' });
    }
});

module.exports = router;
