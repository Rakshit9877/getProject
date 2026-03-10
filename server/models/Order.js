const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    university: { type: String, required: true },
    yearOfStudy: { type: String, required: true },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String, required: true },
    selectedFeatures: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    complexityLevel: { type: String, required: true, enum: ['Basic', 'Standard', 'Advanced'] },
    featureCount: { type: String, required: true },
    featureList: { type: String },
    deadlinePreference: { type: String, required: true },
    referenceWebsites: { type: String },
    githubRepoUrl: { type: String, required: true },
    collaboratorConfirmed: { type: Boolean, default: false },
    couponCode: { type: String },
    discountApplied: { type: Number, default: 0 },
    finalAmountPaid: { type: Number },
    status: {
        type: String,
        enum: ['pending_verification', 'collaborator_verified', 'in_progress', 'review_testing', 'completed', 'refunded'],
        default: 'pending_verification',
    },
    statusMessage: { type: String },
    statusUpdatedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
