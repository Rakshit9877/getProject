const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const adminAuth = require('../middleware/auth');
const { sendStatusUpdate } = require('../services/emailService');

// POST /api/admin/login — Admin login
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required.' });
        }

        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Login failed.' });
    }
});

// GET /api/admin/orders — Get all orders (supports ?status= filter)
router.get('/orders', adminAuth, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status && ['paid', 'in_progress', 'completed', 'refunded'].includes(status)) {
            filter.status = status;
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ message: 'Failed to fetch orders.' });
    }
});

// GET /api/admin/orders/:id — Get single order
router.get('/orders/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.json(order);
    } catch (error) {
        console.error('Fetch order error:', error);
        res.status(500).json({ message: 'Failed to fetch order.' });
    }
});

// PATCH /api/admin/orders/:id/status — Update order status
router.patch('/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['paid', 'in_progress', 'completed', 'refunded'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        order.status = status;
        await order.save();

        // Send status update email to customer
        try {
            await sendStatusUpdate(order);
        } catch (emailError) {
            console.error('Status update email error:', emailError);
        }

        res.json({ message: 'Order status updated.', order });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Failed to update order status.' });
    }
});

module.exports = router;
