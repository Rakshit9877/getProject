const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
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

        const amount = pricing[complexityLevel];
        if (!amount) {
            return res.status(400).json({ message: 'Invalid complexity level.' });
        }

        const order = new Order({
            name, email, university, yearOfStudy,
            projectTitle, projectDescription, techStack,
            complexityLevel, featureCount, featureList,
            deadlinePreference, referenceWebsites,
            githubRepoUrl, collaboratorConfirmed,
            amount,
            status: 'pending',
        });

        await order.save();
        res.status(201).json({ orderId: order._id, amount });
    } catch (error) {
        console.error('Order initiation error:', error);
        res.status(500).json({ message: 'Failed to initiate order.' });
    }
});

module.exports = router;
