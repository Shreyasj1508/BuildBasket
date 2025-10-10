const { responseReturn } = require('../../utiles/response');
const sellerModel = require('../../models/sellerModel');
const buyerModel = require('../../models/buyerModel');
const orderModel = require('../../models/customerOrder');
const productModel = require('../../models/productModel');
const commodityModel = require('../../models/commodityModel');

class adminAnalyticsController {
    // Get analytics dashboard data
    get_analytics = async (req, res) => {
        try {
            const { range = '30days' } = req.query;
            
            // Calculate date range
            const now = new Date();
            let startDate;
            
            switch (range) {
                case '7days':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30days':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case '90days':
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                case '1year':
                    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }

            // Seller Statistics
            const totalSellers = await sellerModel.countDocuments();
            const verifiedSellers = await sellerModel.countDocuments({ isVerified: true });
            const pendingSellers = await sellerModel.countDocuments({ 
                isVerified: { $ne: true }, 
                isRejected: { $ne: true } 
            });

            // Buyer Statistics
            const totalBuyers = await buyerModel.countDocuments();
            const activeBuyers = await buyerModel.countDocuments({ creditStatus: 'active' });
            const newBuyers = await buyerModel.countDocuments({ 
                createdAt: { $gte: startDate } 
            });

            // Transaction Volume
            const totalTransactions = await orderModel.countDocuments();
            const monthlyTransactions = await orderModel.countDocuments({
                createdAt: { 
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                }
            });

            // Calculate total revenue
            const revenuePipeline = [
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' }
                    }
                }
            ];
            const revenueResult = await orderModel.aggregate(revenuePipeline);
            const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

            // Top Commodities (based on products)
            const topCommoditiesPipeline = [
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $unwind: '$productDetails'
                },
                {
                    $group: {
                        _id: '$productDetails.category',
                        sales: { $sum: '$products.quantity' },
                        revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ];
            const topCommodities = await orderModel.aggregate(topCommoditiesPipeline);

            // Top Regions - Real data from products
            const topRegionsPipeline = [
                {
                    $group: {
                        _id: '$location.city',
                        state: { $first: '$location.state' },
                        region: { $first: '$location.region' },
                        productCount: { $sum: 1 },
                        totalRevenue: { $sum: '$finalPrice' }
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        name: '$_id',
                        state: { $first: '$state' },
                        region: { $first: '$region' },
                        users: { $sum: '$productCount' },
                        revenue: { $sum: '$totalRevenue' }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ];
            const topRegions = await productModel.aggregate(topRegionsPipeline);

            // Top Buyers
            const topBuyersPipeline = [
                {
                    $lookup: {
                        from: 'buyers',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: 'buyerDetails'
                    }
                },
                {
                    $unwind: '$buyerDetails'
                },
                {
                    $group: {
                        _id: '$customerId',
                        name: { $first: '$buyerDetails.name' },
                        orders: { $sum: 1 },
                        amount: { $sum: '$totalPrice' }
                    }
                },
                { $sort: { amount: -1 } },
                { $limit: 5 }
            ];
            const topBuyers = await orderModel.aggregate(topBuyersPipeline);

            // Top Sellers
            const topSellersPipeline = [
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $unwind: '$productDetails'
                },
                {
                    $lookup: {
                        from: 'sellers',
                        localField: 'productDetails.sellerId',
                        foreignField: '_id',
                        as: 'sellerDetails'
                    }
                },
                {
                    $unwind: '$sellerDetails'
                },
                {
                    $group: {
                        _id: '$productDetails.sellerId',
                        name: { $first: '$sellerDetails.name' },
                        sales: { $sum: '$products.quantity' },
                        revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ];
            const topSellers = await orderModel.aggregate(topSellersPipeline);

            // New Users (last 30 days)
            const newUsersLast30Days = await buyerModel.countDocuments({
                createdAt: { $gte: startDate }
            });

            // Calculate growth rates - Previous period transactions
            const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
            const previousMonthTransactions = await orderModel.countDocuments({
                createdAt: { 
                    $gte: previousMonthStart,
                    $lt: previousMonthEnd
                }
            });

            // Calculate transaction growth
            let transactionGrowth = 0;
            if (previousMonthTransactions > 0) {
                transactionGrowth = ((monthlyTransactions - previousMonthTransactions) / previousMonthTransactions) * 100;
            } else if (monthlyTransactions > 0) {
                transactionGrowth = 100; // 100% growth if there were no previous transactions
            }

            // Calculate new users growth - Previous 30 days
            const previous30DaysStart = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            const newUsersPrevious30Days = await buyerModel.countDocuments({
                createdAt: { 
                    $gte: previous30DaysStart,
                    $lt: startDate
                }
            });

            // Calculate new users growth
            let newUsersGrowth = 0;
            if (newUsersPrevious30Days > 0) {
                newUsersGrowth = ((newUsersLast30Days - newUsersPrevious30Days) / newUsersPrevious30Days) * 100;
            } else if (newUsersLast30Days > 0) {
                newUsersGrowth = 100; // 100% growth if there were no previous new users
            }

            const analytics = {
                sellerStats: {
                    total: totalSellers,
                    verified: verifiedSellers,
                    pending: pendingSellers
                },
                buyerStats: {
                    total: totalBuyers,
                    active: activeBuyers,
                    new: newBuyers
                },
                topCommodities: topCommodities.map(item => ({
                    name: item._id,
                    sales: item.sales,
                    revenue: item.revenue
                })),
                topRegions,
                topBuyers: topBuyers.map(item => ({
                    name: item.name,
                    orders: item.orders,
                    amount: item.amount
                })),
                topSellers: topSellers.map(item => ({
                    name: item.name,
                    sales: item.sales,
                    revenue: item.revenue
                })),
                transactionVolume: {
                    total: totalRevenue,
                    thisMonth: monthlyTransactions,
                    growth: parseFloat(transactionGrowth.toFixed(2)) // Real growth percentage
                },
                newUsers: {
                    last30Days: newUsersLast30Days,
                    growth: parseFloat(newUsersGrowth.toFixed(2)) // Real growth percentage
                }
            };

            responseReturn(res, 200, {
                success: true,
                analytics
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            responseReturn(res, 500, { error: 'Failed to fetch analytics' });
        }
    };

    // Export analytics report
    export_analytics = async (req, res) => {
        try {
            const { type, range } = req.body;
            
            // Get analytics data first
            const analyticsResponse = await this.get_analytics({ query: { range } }, { 
                json: (data) => data 
            });
            
            const analytics = analyticsResponse.analytics;

            // Create Excel workbook based on type
            const workbook = XLSX.utils.book_new();
            let worksheetData = [];
            let filename = '';

            switch (type) {
                case 'top_commodities':
                    worksheetData = [
                        ['Rank', 'Commodity', 'Sales', 'Revenue']
                    ];
                    analytics.topCommodities.forEach((item, index) => {
                        worksheetData.push([
                            index + 1,
                            item.name,
                            item.sales,
                            item.revenue
                        ]);
                    });
                    filename = 'top_commodities_report.xlsx';
                    break;

                case 'top_regions':
                    worksheetData = [
                        ['Rank', 'Region', 'Users', 'Revenue']
                    ];
                    analytics.topRegions.forEach((item, index) => {
                        worksheetData.push([
                            index + 1,
                            item.name,
                            item.users,
                            item.revenue
                        ]);
                    });
                    filename = 'top_regions_report.xlsx';
                    break;

                case 'top_buyers':
                    worksheetData = [
                        ['Rank', 'Buyer', 'Orders', 'Amount']
                    ];
                    analytics.topBuyers.forEach((item, index) => {
                        worksheetData.push([
                            index + 1,
                            item.name,
                            item.orders,
                            item.amount
                        ]);
                    });
                    filename = 'top_buyers_report.xlsx';
                    break;

                case 'top_sellers':
                    worksheetData = [
                        ['Rank', 'Seller', 'Sales', 'Revenue']
                    ];
                    analytics.topSellers.forEach((item, index) => {
                        worksheetData.push([
                            index + 1,
                            item.name,
                            item.sales,
                            item.revenue
                        ]);
                    });
                    filename = 'top_sellers_report.xlsx';
                    break;

                default:
                    return responseReturn(res, 400, { error: 'Invalid report type' });
            }

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics');

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.send(buffer);
        } catch (error) {
            console.error('Error exporting analytics:', error);
            responseReturn(res, 500, { error: 'Failed to export analytics report' });
        }
    };
}

module.exports = new adminAnalyticsController();
