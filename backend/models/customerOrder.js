const { Schema, model } = require('mongoose')

const customerOrder = new Schema({
    customerId : {
        type : Schema.ObjectId,
        required : true
    },
    products : {
        type : Array,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    payment_status : {
        type : String,
        required : true,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    shippingInfo : {
        type : Object,
        required : true
    },
    delivery_status : {
        type : String,
        required : true,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    date : {
        type : String,
        required : true
    },
    // Enhanced tracking fields
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    trackingNumber: {
        type: String,
        default: null
    },
    trackingHistory: [{
        status: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: String,
            default: null
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
            enum: ['system', 'admin', 'seller', 'courier'],
            default: 'system'
        }
    }],
    estimatedDelivery: {
        type: Date,
        default: null
    },
    courierInfo: {
        name: {
            type: String,
            default: null
        },
        trackingUrl: {
            type: String,
            default: null
        },
        contact: {
            type: String,
            default: null
        }
    },
    notes: {
        type: String,
        default: null
    },
    // Admin approval system
    adminApproval: {
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        approvedBy: {
            type: Schema.ObjectId,
            ref: 'admins',
            default: null
        },
        approvedAt: {
            type: Date,
            default: null
        },
        rejectionReason: {
            type: String,
            default: null
        }
    },
    // Seller confirmation system
    sellerConfirmation: {
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'rejected'],
            default: 'pending'
        },
        confirmedAt: {
            type: Date,
            default: null
        },
        sellerNotes: {
            type: String,
            default: null
        }
    },
    // PDF Receipt system
    receipt: {
        generated: {
            type: Boolean,
            default: false
        },
        downloadAllowed: {
            type: Boolean,
            default: false
        },
        pdfPath: {
            type: String,
            default: null
        },
        generatedAt: {
            type: Date,
            default: null
        }
    }
},{timestamps : true})

module.exports = model('customerOrders',customerOrder)