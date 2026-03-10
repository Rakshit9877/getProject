const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String },
    paymentId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    university: { type: String, required: true },
    yearOfStudy: { type: String, required: true },
    projectTitle: { type: String, required: true },
    projectDescription: { type: String, required: true },
    techStack: { type: [String], default: [] },
    complexityLevel: { type: String, required: true, enum: ['Basic', 'Standard', 'Advanced'] },
    featureCount: { type: String, required: true },
    featureList: { type: String },
    deadlinePreference: { type: String, required: true },
    referenceWebsites: { type: String },
    githubRepoUrl: { type: String, required: true },
    collaboratorConfirmed: { type: Boolean, default: false },
    amount: { type: Number },
    status: {
        type: String,
        enum: ['pending', 'paid', 'in_progress', 'completed', 'refunded'],
        default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
