const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, required: true, enum: ['percentage', 'flat'] },
    discountValue: { type: Number, required: true },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coupon', couponSchema);
