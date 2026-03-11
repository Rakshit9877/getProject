const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const adminAuth = require('../middleware/auth');
const { sendStatusUpdateEmail, sendRefundNotification } = require('../utils/emailService');
const Razorpay = require('razorpay');

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

// POST /api/admin/login
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: 'Password is required.' });
        if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Invalid password.' });

        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Login failed.' });
    }
});

// ─── ORDER MANAGEMENT ───────────────────────────────────

const validStatuses = ['pending_verification', 'collaborator_verified', 'in_progress', 'review_testing', 'completed', 'refunded'];

// GET /api/admin/orders
router.get('/orders', adminAuth, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status && validStatuses.includes(status)) filter.status = status;

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders.' });
    }
});

// GET /api/admin/orders/:id
router.get('/orders/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        res.json(order);
    } catch (error) {
        console.error('Fetch order error:', error);
        res.status(500).json({ message: 'Failed to fetch order.' });
    }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status, statusMessage } = req.body;
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });

        order.status = status;
        if (statusMessage !== undefined) order.statusMessage = statusMessage;
        order.statusUpdatedAt = new Date();
        await order.save();

        // Send status update email (non-blocking)
        sendStatusUpdateEmail(order);

        res.json({ message: 'Order status updated.', order });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Failed to update order status.' });
    }
});

// POST /api/admin/orders/:id/refund
router.post('/orders/:id/refund', adminAuth, async (req, res) => {
    try {
        const { refundAmount, refundReason } = req.body;
        if (!refundAmount || refundAmount <= 0) return res.status(400).json({ message: 'Invalid refund amount.' });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });

        if (order.paymentStatus === 'refunded') {
            return res.status(400).json({ message: 'Order is already refunded.' });
        }
        if (!order.paymentId) {
            return res.status(400).json({ message: 'Cannot refund: no Razorpay payment ID on record.' });
        }

        // Process refund via Razorpay API (amount in paise)
        const refundResponse = await getRazorpay().payments.refund(order.paymentId, {
            amount: refundAmount * 100,
            notes: {
                reason: refundReason || 'Customer requested'
            }
        });

        // Update DB
        order.status = 'refunded';
        order.paymentStatus = 'refunded';
        order.refundId = refundResponse.id;
        order.refundAmount = refundResponse.amount / 100;
        order.refundReason = refundReason || 'Customer requested';
        order.refundInitiatedAt = new Date();
        order.refundCompletedAt = new Date();
        
        await order.save();

        // Send email notification non-blocking
        sendRefundNotification(order);

        res.json({ message: 'Refund processed successfully', order });
    } catch (error) {
        console.error('Refund processing error:', error);
        res.status(500).json({ message: error.error?.description || 'Failed to process refund.' });
    }
});

// ─── COUPON MANAGEMENT ──────────────────────────────────

// GET /api/admin/coupons
router.get('/coupons', adminAuth, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.error('Fetch coupons error:', error);
        res.status(500).json({ message: 'Failed to fetch coupons.' });
    }
});

// POST /api/admin/coupons
router.post('/coupons', adminAuth, async (req, res) => {
    try {
        const { code, discountType, discountValue, setsFixedPrice, fixedPrice, maxUses, expiresAt, isActive } = req.body;

        if (!code) return res.status(400).json({ message: 'Coupon code is required.' });

        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) return res.status(400).json({ message: 'A coupon with this code already exists.' });

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountType: setsFixedPrice ? 'flat' : (discountType || 'percentage'),
            discountValue: discountValue || 0,
            setsFixedPrice: setsFixedPrice || false,
            fixedPrice: fixedPrice || null,
            maxUses: maxUses || null,
            expiresAt: expiresAt || null,
            isActive: isActive !== false,
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ message: 'Failed to create coupon.' });
    }
});

// PATCH /api/admin/coupons/:id
router.patch('/coupons/:id', adminAuth, async (req, res) => {
    try {
        const updates = {};
        const { isActive, discountType, discountValue, setsFixedPrice, fixedPrice, maxUses, expiresAt } = req.body;

        if (isActive !== undefined) updates.isActive = isActive;
        if (discountType) updates.discountType = discountType;
        if (discountValue !== undefined) updates.discountValue = discountValue;
        if (setsFixedPrice !== undefined) updates.setsFixedPrice = setsFixedPrice;
        if (fixedPrice !== undefined) updates.fixedPrice = fixedPrice;
        if (maxUses !== undefined) updates.maxUses = maxUses;
        if (expiresAt !== undefined) updates.expiresAt = expiresAt;

        const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });

        res.json(coupon);
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ message: 'Failed to update coupon.' });
    }
});

module.exports = router;
