const productModel = require('../models/productModel');
const { calculateCommissionSync } = require('./commissionUtils');

/**
 * Update commission for a single product
 * @param {String} productId - Product ID
 * @param {Number} basePrice - Base price of the product
 * @returns {Object} Result object with success status
 */
const updateSingleProductCommission = async (productId, basePrice) => {
    try {
        if (!productId || !basePrice) {
            return {
                success: false,
                message: 'Product ID and base price are required'
            };
        }

        // Calculate commission
        const commissionInfo = await calculateCommissionSync(basePrice);

        // Update product in database
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            {
                finalPrice: commissionInfo.finalPrice,
                commissionAmount: commissionInfo.commissionAmount,
                commissionType: commissionInfo.commissionType,
                lastCommissionUpdate: new Date()
            },
            { new: true }
        );

        if (!updatedProduct) {
            return {
                success: false,
                message: 'Product not found'
            };
        }

        return {
            success: true,
            message: 'Commission updated successfully',
            data: {
                productId: updatedProduct._id,
                basePrice: basePrice,
                finalPrice: commissionInfo.finalPrice,
                commissionAmount: commissionInfo.commissionAmount
            }
        };
    } catch (error) {
        console.error('Error updating product commission:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

/**
 * Update commission for all products
 * @returns {Object} Result object with count of updated products
 */
const updateAllProductsCommission = async () => {
    try {
        const products = await productModel.find({});
        let successCount = 0;
        let failCount = 0;

        for (const product of products) {
            const result = await updateSingleProductCommission(product._id, product.price);
            if (result.success) {
                successCount++;
            } else {
                failCount++;
            }
        }

        return {
            success: true,
            message: `Updated ${successCount} products successfully, ${failCount} failed`,
            data: {
                totalProducts: products.length,
                successCount,
                failCount
            }
        };
    } catch (error) {
        console.error('Error updating all products commission:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    updateSingleProductCommission,
    updateAllProductsCommission
};

