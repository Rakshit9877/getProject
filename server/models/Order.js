const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Payment fields
    orderId: { type: String, required: true, unique: true, index: true },
    paymentId: { type: String, required: true },
    razorpaySignature: { type: String },
    paymentStatus: {
        type: String,
        enum: ['captured', 'refunded', 'failed'],
        default: 'captured'
    },
    finalAmountPaid: { type: Number, required: true },
    originalAmount: { type: Number },
    couponCode: { type: String },
    discountApplied: { type: Number, default: 0 },

    // Project status
    status: {
        type: String,
        enum: [
            'pending_verification',
            'collaborator_verified',
            'in_progress',
            'review_testing',
            'completed',
            'refund_requested',
            'refunded'
        ],
        default: 'pending_verification'
    },
    statusMessage: { type: String },
    statusUpdatedAt: { type: Date },

    // Refund tracking
    refundId: { type: String },
    refundAmount: { type: Number },
    refundReason: { type: String },
    refundInitiatedAt: { type: Date },
    refundCompletedAt: { type: Date },

    // All existing fields
    name: { type: String, required: true },
    email: { type: String, required: true },
    university: { type: String, required: true },
    yearOfStudy: { type: String, required: true },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String, required: true },
    selectedFeatures: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    complexityLevel: { type: String, required: true, enum: ['semi_built', 'basic', 'extended', 'Basic', 'Standard', 'Advanced'] },
    featureCount: { type: String, required: true },
    featureList: { type: String },
    deadlinePreference: { type: String, required: true },
    referenceWebsites: { type: String },
    githubRepoUrl: { type: String, required: true },
    collaboratorConfirmed: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
