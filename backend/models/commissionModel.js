const { Schema, model } = require("mongoose");

const commissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    fixedAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableTo: {
        type: String,
        enum: ['all', 'specific_categories', 'specific_products'],
        default: 'all'
    },
    categories: [{
        type: String
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }],
    effectiveFrom: {
        type: Date,
        default: Date.now
    },
    effectiveTo: {
        type: Date,
        default: null
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'admins'
    }
}, { timestamps: true });

module.exports = model('commissions', commissionSchema);
