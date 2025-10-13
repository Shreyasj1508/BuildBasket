const { responseReturn } = require('../../utiles/response');
const { calculateCommissionSync } = require('../../utiles/commissionUtils');
const { updateAllProductsCommission, updateSingleProductCommission } = require('../../utiles/updateAllProductsCommission');
const commissionModel = require('../../models/commissionModel');

class commissionController {
    
    /**
     * Get current commission configuration
     */
    get_commission_config = async (req, res) => {
        try {
            // Get the latest active commission from database
            const activeCommission = await commissionModel.findOne({ isActive: true })
                .sort({ createdAt: -1 });
            
            if (activeCommission) {
                const config = {
                    rate: activeCommission.rate,
                    type: activeCommission.type,
                    description: activeCommission.description || 'Platform commission applied to all products',
                    fixedAmount: activeCommission.fixedAmount || 0,
                    effectiveFrom: activeCommission.effectiveFrom,
                    _id: activeCommission._id
                };
                
                responseReturn(res, 200, { success: true, config });
            } else {
                // Return default if no commission found
                const config = {
                    rate: 0.05, // 5%
                    type: 'percentage',
                    description: 'Platform commission applied to all products',
                    fixedAmount: 0
                };
                
                responseReturn(res, 200, { success: true, config });
            }
        } catch (error) {
            console.error('Error fetching commission config:', error);
            responseReturn(res, 500, { success: false, error: error.message });
        }
    }

    /**
     * Update commission configuration
     */
    update_commission_config = async (req, res) => {
        try {
            const { rate, type, description, fixedAmount } = req.body;
            
            // Validate input
            if (!type || !['percentage', 'fixed'].includes(type)) {
                return responseReturn(res, 400, { 
                    success: false, 
                    error: 'Valid commission type is required (percentage or fixed)' 
                });
            }

            if (type === 'percentage' && (!rate || rate <= 0 || rate > 100)) {
                return responseReturn(res, 400, { 
                    success: false, 
                    error: 'For percentage type, rate must be between 0 and 100' 
                });
            }

            if (type === 'fixed' && (!fixedAmount || fixedAmount <= 0)) {
                return responseReturn(res, 400, { 
                    success: false, 
                    error: 'For fixed type, fixed amount must be greater than 0' 
                });
            }

            // Deactivate all previous commissions
            await commissionModel.updateMany(
                { isActive: true },
                { 
                    isActive: false,
                    effectiveTo: new Date()
                }
            );

            // Create new commission
            const newCommission = new commissionModel({
                rate: type === 'percentage' ? parseFloat(rate) : 0,
                type: type,
                fixedAmount: type === 'fixed' ? parseFloat(fixedAmount) : 0,
                description: description || 'Platform commission applied to all products',
                isActive: true,
                effectiveFrom: new Date()
            });

            await newCommission.save();

            responseReturn(res, 200, { 
                success: true, 
                message: 'Commission configuration updated successfully',
                commission: newCommission
            });
        } catch (error) {
            console.error('Error updating commission config:', error);
            responseReturn(res, 500, { 
                success: false, 
                error: error.message 
            });
        }
    }

    /**
     * Get commission history
     */
    get_commission_history = async (req, res) => {
        try {
            const history = await commissionModel.find()
                .sort({ createdAt: -1 })
                .limit(20);
            
            responseReturn(res, 200, { 
                success: true, 
                history 
            });
        } catch (error) {
            console.error('Error fetching commission history:', error);
            responseReturn(res, 500, { 
                success: false, 
                error: error.message 
            });
        }
    }

    /**
     * Update commission for all products
     */
    update_all_products_commission = async (req, res) => {
        try {
            const result = await updateAllProductsCommission();
            
            if (result.success) {
                responseReturn(res, 200, result);
            } else {
                responseReturn(res, 500, result);
            }
        } catch (error) {
            console.error('Error updating all products commission:', error);
            responseReturn(res, 500, { 
                success: false, 
                error: error.message 
            });
        }
    }

    /**
     * Update commission for a single product
     */
    update_product_commission = async (req, res) => {
        try {
            const { productId, price } = req.body;
            
            if (!productId || !price) {
                return responseReturn(res, 400, { 
                    success: false, 
                    error: 'Product ID and price are required' 
                });
            }
            
            const result = await updateSingleProductCommission(productId, price);
            
            if (result.success) {
                responseReturn(res, 200, result);
            } else {
                responseReturn(res, 500, result);
            }
        } catch (error) {
            console.error('Error updating product commission:', error);
            responseReturn(res, 500, { 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = new commissionController();
