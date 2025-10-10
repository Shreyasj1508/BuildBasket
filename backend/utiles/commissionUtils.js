/**
 * Commission Utilities
 * Provides commission calculation using real database data
 */

const commissionModel = require('../models/commissionModel');

/**
 * Calculate commission synchronously for a product price using database
 * @param {Number} basePrice - The base price of the product
 * @returns {Object} Commission information
 */
const calculateCommissionSync = async (basePrice) => {
    try {
        // Get active commission from database
        const activeCommission = await commissionModel.findOne({ 
            isActive: true,
            effectiveFrom: { $lte: new Date() },
            $or: [
                { effectiveTo: null },
                { effectiveTo: { $gte: new Date() } }
            ]
        }).sort({ createdAt: -1 });

        let commissionRate, commissionType, commissionAmount;

        if (activeCommission) {
            commissionType = activeCommission.type;
            if (activeCommission.type === 'percentage') {
                commissionRate = activeCommission.rate / 100;
                commissionAmount = basePrice * commissionRate;
            } else {
                commissionAmount = activeCommission.fixedAmount || 0;
                commissionRate = activeCommission.fixedAmount || 0;
            }
        } else {
            // Fallback to default
            commissionRate = 0.05; // 5%
            commissionType = 'percentage';
            commissionAmount = basePrice * commissionRate;
        }

        const finalPrice = basePrice + commissionAmount;

        return {
            basePrice: basePrice,
            commissionAmount: parseFloat(commissionAmount.toFixed(2)),
            finalPrice: parseFloat(finalPrice.toFixed(2)),
            commissionType: commissionType,
            commissionRate: commissionRate
        };
    } catch (error) {
        console.error('Error calculating commission:', error);
        // Fallback to default calculation
        const commissionRate = 0.05;
        const commissionType = 'percentage';
        const commissionAmount = basePrice * commissionRate;
        const finalPrice = basePrice + commissionAmount;

        return {
            basePrice: basePrice,
            commissionAmount: parseFloat(commissionAmount.toFixed(2)),
            finalPrice: parseFloat(finalPrice.toFixed(2)),
            commissionType: commissionType,
            commissionRate: commissionRate
        };
    }
};

/**
 * Synchronous version for backward compatibility (uses default rate)
 * @param {Number} basePrice - The base price of the product
 * @returns {Object} Commission information
 */
const calculateCommissionSyncSync = (basePrice) => {
    const commissionRate = 0.05;
    const commissionType = 'percentage';
    const commissionAmount = basePrice * commissionRate;
    const finalPrice = basePrice + commissionAmount;

    return {
        basePrice: basePrice,
        commissionAmount: parseFloat(commissionAmount.toFixed(2)),
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        commissionType: commissionType,
        commissionRate: commissionRate
    };
};

/**
 * Calculate commission with custom rate
 * @param {Number} basePrice - The base price of the product
 * @param {Number} rate - Custom commission rate (e.g., 0.05 for 5%)
 * @param {String} type - Commission type ('percentage' or 'fixed')
 * @returns {Object} Commission information
 */
const calculateCustomCommission = (basePrice, rate, type = 'percentage') => {
    let commissionAmount;
    let finalPrice;
    
    if (type === 'fixed') {
        commissionAmount = rate;
        finalPrice = basePrice + rate;
    } else {
        commissionAmount = basePrice * rate;
        finalPrice = basePrice + commissionAmount;
    }
    
    return {
        basePrice: basePrice,
        commissionAmount: commissionAmount,
        finalPrice: finalPrice,
        commissionType: type,
        commissionRate: rate
    };
};

module.exports = {
    calculateCommissionSync,
    calculateCommissionSyncSync,
    calculateCustomCommission
};

