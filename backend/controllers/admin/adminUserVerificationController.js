const { responseReturn } = require('../../utiles/response');
const sellerModel = require('../../models/sellerModel');
const buyerModel = require('../../models/buyerModel');

class adminUserVerificationController {
    // Get all sellers
    get_all_sellers = async (req, res) => {
        try {
            const sellers = await sellerModel.find({})
                .select('-password')
                .sort({ createdAt: -1 });

            responseReturn(res, 200, {
                success: true,
                sellers
            });
        } catch (error) {
            console.error('Error fetching sellers:', error);
            responseReturn(res, 500, { error: 'Failed to fetch sellers' });
        }
    };

    // Get all buyers
    get_all_buyers = async (req, res) => {
        try {
            const buyers = await buyerModel.find({})
                .select('-password')
                .sort({ createdAt: -1 });

            responseReturn(res, 200, {
                success: true,
                buyers
            });
        } catch (error) {
            console.error('Error fetching buyers:', error);
            responseReturn(res, 500, { error: 'Failed to fetch buyers' });
        }
    };

    // Verify seller
    verify_seller = async (req, res) => {
        try {
            const { userId, status } = req.body;

            if (!userId || !status) {
                return responseReturn(res, 400, { error: 'User ID and status are required' });
            }

            const updateData = {};
            if (status === 'approved') {
                updateData.isVerified = true;
                updateData.isRejected = false;
            } else if (status === 'rejected') {
                updateData.isVerified = false;
                updateData.isRejected = true;
            }

            const seller = await sellerModel.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!seller) {
                return responseReturn(res, 404, { error: 'Seller not found' });
            }

            responseReturn(res, 200, {
                success: true,
                message: `Seller ${status} successfully`,
                seller
            });
        } catch (error) {
            console.error('Error verifying seller:', error);
            responseReturn(res, 500, { error: 'Failed to verify seller' });
        }
    };

    // Verify buyer
    verify_buyer = async (req, res) => {
        try {
            const { userId, status } = req.body;

            if (!userId || !status) {
                return responseReturn(res, 400, { error: 'User ID and status are required' });
            }

            const updateData = {};
            if (status === 'approved') {
                updateData.isVerified = true;
                updateData.isRejected = false;
            } else if (status === 'rejected') {
                updateData.isVerified = false;
                updateData.isRejected = true;
            }

            const buyer = await buyerModel.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!buyer) {
                return responseReturn(res, 404, { error: 'Buyer not found' });
            }

            responseReturn(res, 200, {
                success: true,
                message: `Buyer ${status} successfully`,
                buyer
            });
        } catch (error) {
            console.error('Error verifying buyer:', error);
            responseReturn(res, 500, { error: 'Failed to verify buyer' });
        }
    };

    // Add new buyer
    add_buyer = async (req, res) => {
        try {
            const { name, email, phone, company, creditLimit } = req.body;

            if (!name || !email) {
                return responseReturn(res, 400, { error: 'Name and email are required' });
            }

            // Check if buyer already exists
            const existingBuyer = await buyerModel.findOne({ email });
            if (existingBuyer) {
                return responseReturn(res, 400, { error: 'Buyer with this email already exists' });
            }

            const buyer = await buyerModel.create({
                name,
                email,
                phone,
                company,
                creditLimit: parseFloat(creditLimit) || 0,
                creditUsed: 0,
                creditStatus: 'active',
                isVerified: true
            });

            responseReturn(res, 201, {
                success: true,
                message: 'Buyer added successfully',
                buyer
            });
        } catch (error) {
            console.error('Error adding buyer:', error);
            responseReturn(res, 500, { error: 'Failed to add buyer' });
        }
    };

    // Update buyer credit
    update_buyer_credit = async (req, res) => {
        try {
            const { buyerId, creditLimit, creditUsed, status } = req.body;

            if (!buyerId) {
                return responseReturn(res, 400, { error: 'Buyer ID is required' });
            }

            const updateData = {};
            if (creditLimit !== undefined) updateData.creditLimit = parseFloat(creditLimit);
            if (creditUsed !== undefined) updateData.creditUsed = parseFloat(creditUsed);
            if (status) updateData.creditStatus = status;

            const buyer = await buyerModel.findByIdAndUpdate(
                buyerId,
                updateData,
                { new: true, runValidators: true }
            );

            if (!buyer) {
                return responseReturn(res, 404, { error: 'Buyer not found' });
            }

            responseReturn(res, 200, {
                success: true,
                message: 'Buyer credit updated successfully',
                buyer
            });
        } catch (error) {
            console.error('Error updating buyer credit:', error);
            responseReturn(res, 500, { error: 'Failed to update buyer credit' });
        }
    };
}

module.exports = new adminUserVerificationController();
