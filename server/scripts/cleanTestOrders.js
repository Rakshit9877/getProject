const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../../.env' }); // Load root .env
const Order = require('../models/Order');

async function cleanTestOrders() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // Find orders that are likely to be abandoned test orders from the old lifecycle
        // Criteria: No paymentId OR paymentStatus is not captured OR status is pending_verification and older than 1 hour
        
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const query = {
            $or: [
                { paymentId: { $exists: false } },
                { paymentId: null },
                { paymentId: '' },
                { 
                    status: 'pending_verification',
                    createdAt: { $lt: oneHourAgo },
                    paymentId: { $exists: false }
                }
            ]
        };

        const ghostOrders = await Order.find(query);
        
        if (ghostOrders.length === 0) {
            console.log('No ghost orders found. Database is clean!');
            process.exit(0);
        }

        console.log(`Found ${ghostOrders.length} ghost/abandoned orders matching criteria.`);
        ghostOrders.forEach(o => {
            console.log(`- ID: ${o._id} | Name: ${o.name} | Created: ${o.createdAt}`);
        });

        const result = await Order.deleteMany(query);
        console.log(`\nSuccessfully deleted ${result.deletedCount} ghost orders.`);

    } catch (error) {
        console.error('Error cleaning test orders:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    }
}

cleanTestOrders();
