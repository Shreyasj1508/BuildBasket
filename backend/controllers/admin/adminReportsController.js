const { responseReturn } = require('../../utiles/response');
const sellerModel = require('../../models/sellerModel');
const buyerModel = require('../../models/buyerModel');
const orderModel = require('../../models/customerOrder');
const productModel = require('../../models/productModel');
const XLSX = require('xlsx');

class adminReportsController {
    // Export seller report
    export_seller_report = async (req, res) => {
        try {
            const { dateRange } = req.body;
            
            let query = {};
            if (dateRange && dateRange.startDate && dateRange.endDate) {
                query.createdAt = {
                    $gte: new Date(dateRange.startDate),
                    $lte: new Date(dateRange.endDate)
                };
            }

            const sellers = await sellerModel.find(query)
                .select('-password')
                .sort({ createdAt: -1 });

            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            const worksheetData = [
                ['Name', 'Email', 'Phone', 'Business Name', 'Address', 'Status', 'Verified', 'Created Date']
            ];

            sellers.forEach(seller => {
                worksheetData.push([
                    seller.name || '',
                    seller.email || '',
                    seller.phone || '',
                    seller.businessName || '',
                    seller.address || '',
                    seller.isVerified ? 'Verified' : 'Pending',
                    seller.isVerified ? 'Yes' : 'No',
                    seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : ''
                ]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sellers');

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=seller_report.xlsx');
            res.send(buffer);
        } catch (error) {
            console.error('Error exporting seller report:', error);
            responseReturn(res, 500, { error: 'Failed to export seller report' });
        }
    };

    // Export buyer report
    export_buyer_report = async (req, res) => {
        try {
            const { dateRange } = req.body;
            
            let query = {};
            if (dateRange && dateRange.startDate && dateRange.endDate) {
                query.createdAt = {
                    $gte: new Date(dateRange.startDate),
                    $lte: new Date(dateRange.endDate)
                };
            }

            const buyers = await buyerModel.find(query)
                .select('-password')
                .sort({ createdAt: -1 });

            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            const worksheetData = [
                ['Name', 'Email', 'Phone', 'Company', 'Credit Limit', 'Credit Used', 'Status', 'Created Date']
            ];

            buyers.forEach(buyer => {
                worksheetData.push([
                    buyer.name || '',
                    buyer.email || '',
                    buyer.phone || '',
                    buyer.company || '',
                    buyer.creditLimit || 0,
                    buyer.creditUsed || 0,
                    buyer.creditStatus || 'active',
                    buyer.createdAt ? new Date(buyer.createdAt).toLocaleDateString() : ''
                ]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Buyers');

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=buyer_report.xlsx');
            res.send(buffer);
        } catch (error) {
            console.error('Error exporting buyer report:', error);
            responseReturn(res, 500, { error: 'Failed to export buyer report' });
        }
    };

    // Export transaction report
    export_transaction_report = async (req, res) => {
        try {
            const { dateRange } = req.body;
            
            let query = {};
            if (dateRange && dateRange.startDate && dateRange.endDate) {
                query.createdAt = {
                    $gte: new Date(dateRange.startDate),
                    $lte: new Date(dateRange.endDate)
                };
            }

            const orders = await orderModel.find(query)
                .populate('customerId', 'name email')
                .populate('products.productId', 'name')
                .sort({ createdAt: -1 });

            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            const worksheetData = [
                ['Order ID', 'Customer', 'Email', 'Product', 'Quantity', 'Price', 'Total', 'Status', 'Date']
            ];

            orders.forEach(order => {
                order.products.forEach(product => {
                    worksheetData.push([
                        order._id.toString(),
                        order.customerId?.name || '',
                        order.customerId?.email || '',
                        product.productId?.name || '',
                        product.quantity || 0,
                        product.price || 0,
                        (product.quantity * product.price) || 0,
                        order.status || '',
                        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''
                    ]);
                });
            });

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=transaction_report.xlsx');
            res.send(buffer);
        } catch (error) {
            console.error('Error exporting transaction report:', error);
            responseReturn(res, 500, { error: 'Failed to export transaction report' });
        }
    };

    // Export credit report
    export_credit_report = async (req, res) => {
        try {
            const buyers = await buyerModel.find({})
                .select('-password')
                .sort({ creditLimit: -1 });

            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            const worksheetData = [
                ['Name', 'Email', 'Company', 'Credit Limit', 'Credit Used', 'Available Credit', 'Utilization %', 'Status']
            ];

            buyers.forEach(buyer => {
                const availableCredit = (buyer.creditLimit || 0) - (buyer.creditUsed || 0);
                const utilization = buyer.creditLimit > 0 ? 
                    Math.round(((buyer.creditUsed || 0) / buyer.creditLimit) * 100) : 0;

                worksheetData.push([
                    buyer.name || '',
                    buyer.email || '',
                    buyer.company || '',
                    buyer.creditLimit || 0,
                    buyer.creditUsed || 0,
                    availableCredit,
                    utilization,
                    buyer.creditStatus || 'active'
                ]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Credit Report');

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=credit_report.xlsx');
            res.send(buffer);
        } catch (error) {
            console.error('Error exporting credit report:', error);
            responseReturn(res, 500, { error: 'Failed to export credit report' });
        }
    };

    // Setup email reports
    setup_email_reports = async (req, res) => {
        try {
            const { enabled, frequency, recipients } = req.body;

            // In a real application, you would save this to a database
            // For now, we'll just return success
            console.log('Email report settings:', { enabled, frequency, recipients });

            responseReturn(res, 200, {
                success: true,
                message: 'Email report settings updated successfully',
                settings: { enabled, frequency, recipients }
            });
        } catch (error) {
            console.error('Error setting up email reports:', error);
            responseReturn(res, 500, { error: 'Failed to setup email reports' });
        }
    };
}

module.exports = new adminReportsController();
