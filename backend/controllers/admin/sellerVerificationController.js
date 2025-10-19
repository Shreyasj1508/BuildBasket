const sellerModel = require('../../models/sellerModel');
const { responseReturn } = require('../../utiles/response');
const emailService = require('../../utiles/emailService');

class sellerVerificationController {
    
    getPendingSellers = async (req, res) => {
        try {
            const pendingSellers = await sellerModel.find({ status: 'pending' })
                .select('-password')
                .sort({ createdAt: -1 });

            responseReturn(res, 200, {
                success: true,
                sellers: pendingSellers,
                count: pendingSellers.length
            });
        } catch (error) {
            console.error('Error fetching pending sellers:', error);
            responseReturn(res, 500, { error: 'Failed to fetch pending sellers' });
        }
    };

    verifySeller = async (req, res) => {
        try {
            const { sellerId } = req.params;
            const { status, reason } = req.body;

            if (!['active', 'rejected'].includes(status)) {
                return responseReturn(res, 400, { error: 'Invalid status. Must be "active" or "rejected"' });
            }

            const seller = await sellerModel.findById(sellerId);
            if (!seller) {
                return responseReturn(res, 404, { error: 'Seller not found' });
            }

            if (seller.status !== 'pending') {
                return responseReturn(res, 400, { error: 'Seller is not in pending status' });
            }

            seller.status = status;
            if (reason) {
                seller.verificationReason = reason;
            }
            seller.verifiedAt = new Date();
            seller.verifiedBy = req.id;

            await seller.save();

            try {
                await emailService.sendSellerVerificationEmail(seller, status);
            } catch (emailError) {
                console.error('Email notification error:', emailError);
            }

            responseReturn(res, 200, {
                success: true,
                message: `Seller ${status === 'active' ? 'approved' : 'rejected'} successfully`,
                seller: {
                    id: seller._id,
                    name: seller.name,
                    email: seller.email,
                    status: seller.status,
                    verifiedAt: seller.verifiedAt
                }
            });

        } catch (error) {
            console.error('Error verifying seller:', error);
            responseReturn(res, 500, { error: 'Failed to verify seller' });
        }
    };

    getVerificationStats = async (req, res) => {
        try {
            const stats = await sellerModel.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const formattedStats = {
                pending: 0,
                active: 0,
                rejected: 0,
                total: 0
            };

            stats.forEach(stat => {
                formattedStats[stat._id] = stat.count;
                formattedStats.total += stat.count;
            });

            responseReturn(res, 200, {
                success: true,
                stats: formattedStats
            });

        } catch (error) {
            console.error('Error fetching verification stats:', error);
            responseReturn(res, 500, { error: 'Failed to fetch verification statistics' });
        }
    };

    bulkVerifySellers = async (req, res) => {
        try {
            const { sellerIds, status, reason } = req.body;

            if (!Array.isArray(sellerIds) || sellerIds.length === 0) {
                return responseReturn(res, 400, { error: 'Invalid seller IDs' });
            }

            if (!['active', 'rejected'].includes(status)) {
                return responseReturn(res, 400, { error: 'Invalid status. Must be "active" or "rejected"' });
            }

            const results = {
                success: 0,
                failed: 0,
                details: []
            };

            for (const sellerId of sellerIds) {
                try {
                    const seller = await sellerModel.findById(sellerId);
                    if (!seller || seller.status !== 'pending') {
                        results.failed++;
                        results.details.push(`Seller ${sellerId}: Not found or not pending`);
                        continue;
                    }

                    seller.status = status;
                    if (reason) {
                        seller.verificationReason = reason;
                    }
                    seller.verifiedAt = new Date();
                    seller.verifiedBy = req.id;

                    await seller.save();

                    try {
                        await emailService.sendSellerVerificationEmail(seller, status);
                    } catch (emailError) {
                        console.error('Email notification error for seller:', sellerId, emailError);
                    }

                    results.success++;
                    results.details.push(`Seller ${seller.name}: ${status === 'active' ? 'Approved' : 'Rejected'}`);

                } catch (error) {
                    results.failed++;
                    results.details.push(`Seller ${sellerId}: Error - ${error.message}`);
                }
            }

            responseReturn(res, 200, {
                success: true,
                message: `Bulk verification completed`,
                results
            });

        } catch (error) {
            console.error('Error in bulk verification:', error);
            responseReturn(res, 500, { error: 'Failed to perform bulk verification' });
        }
    };

    getVerificationHistory = async (req, res) => {
        try {
            const { page = 1, limit = 10, status } = req.query;
            const skip = (page - 1) * limit;

            let query = {};
            if (status && ['pending', 'active', 'rejected'].includes(status)) {
                query.status = status;
            }

            const sellers = await sellerModel.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await sellerModel.countDocuments(query);

            responseReturn(res, 200, {
                success: true,
                sellers,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            });

        } catch (error) {
            console.error('Error fetching verification history:', error);
            responseReturn(res, 500, { error: 'Failed to fetch verification history' });
        }
    };
}

module.exports = new sellerVerificationController();
