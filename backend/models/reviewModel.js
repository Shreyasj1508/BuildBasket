const {Schema, model} = require("mongoose");

const reviewSchema = new Schema({
    productId: {
        type: Schema.ObjectId,
        required : true,
        ref: 'products'
    },
    userId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'customers'
    },
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default : 0,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required : true,
        maxlength: 1000
    },
    title: {
        type: String,
        maxlength: 100
    },
    date: {
        type: String,
        required : true
    },
    verifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpful: {
        type: Number,
        default: 0
    },
    images: [{
        type: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    sellerResponse: {
        message: String,
        date: String,
        sellerId: {
            type: Schema.ObjectId,
            ref: 'sellers'
        }
    }
},{ timestamps: true })

// Index for better performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

module.exports = model('reviews',reviewSchema)