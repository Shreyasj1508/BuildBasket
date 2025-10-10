const { responseReturn } = require('../../utiles/response');
const { calculateCommissionSync } = require('../../utiles/commissionUtils');
const commissionModel = require('../../models/commissionModel');

class commissionController {
    
    /**
     * Get current commission rate and details
     */
    get_commission = async (req, res) => {
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

            if (activeCommission) {
                responseReturn(res, 200, { 
                    commission: {
                        rate: activeCommission.rate,
                        type: activeCommission.type,
                        description: activeCommission.description,
                        fixedAmount: activeCommission.fixedAmount
                    }
                });
            } else {
                // Fallback to default if no commission found
                const defaultCommission = {
                    rate: 5,
                    type: 'percentage',
                    description: 'Default platform commission',
                    fixedAmount: 0
                };
                
                responseReturn(res, 200, { commission: defaultCommission });
            }
        } catch (error) {
            console.error('Error fetching commission:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }

    /**
     * Calculate commission for a given price
     */
    calculate_commission = async (req, res) => {
        try {
            const { price } = req.body || req.query;
            
            if (!price || isNaN(price)) {
                return responseReturn(res, 400, { error: 'Valid price is required' });
            }
            
            const commissionInfo = calculateCommissionSync(parseFloat(price));
            
            responseReturn(res, 200, { commission: commissionInfo });
        } catch (error) {
            console.error('Error calculating commission:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new commissionController();

