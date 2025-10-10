const { responseReturn } = require('../../utiles/response');
const sellerModel = require('../../models/sellerModel');
const buyerModel = require('../../models/buyerModel');
const customerOrder = require('../../models/customerOrder');
const productModel = require('../../models/productModel');

class adminActivitiesController {
    
    // Get recent admin activities
    getRecentActivities = async (req, res) => {
        try {
            // Get recent seller registrations
            const recentSellers = await sellerModel.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email status createdAt');

            // Get recent buyer registrations
            const recentBuyers = await buyerModel.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('name email status createdAt');

            // Get recent orders
            const recentOrders = await customerOrder.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('orderId customerId totalAmount status createdAt');

            // Format activities
            const activities = [];

            // Add seller activities
            recentSellers.forEach(seller => {
                if (seller.status === 'pending') {
                    activities.push({
                        id: `seller_${seller._id}`,
                        type: 'seller_verification',
                        message: `New seller "${seller.name}" needs verification`,
                        time: this.getTimeAgo(seller.createdAt),
                        status: 'pending',
                        createdAt: seller.createdAt
                    });
                }
            });

            // Add buyer activities
            recentBuyers.forEach(buyer => {
                activities.push({
                    id: `buyer_${buyer._id}`,
                    type: 'buyer_registration',
                    message: `New buyer "${buyer.name}" registered`,
                    time: this.getTimeAgo(buyer.createdAt),
                    status: 'completed',
                    createdAt: buyer.createdAt
                });
            });

            // Add order activities
            recentOrders.forEach(order => {
                activities.push({
                    id: `order_${order._id}`,
                    type: 'new_order',
                    message: `New order ${order.orderId} placed (₹${order.totalAmount})`,
                    time: this.getTimeAgo(order.createdAt),
                    status: 'completed',
                    createdAt: order.createdAt
                });
            });

            // Sort by creation date
            activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            responseReturn(res, 200, {
                success: true,
                activities: activities.slice(0, 10) // Return top 10 activities
            });

        } catch (error) {
            console.error('Error fetching recent activities:', error);
            responseReturn(res, 500, { 
                success: false,
                message: 'Error fetching activities',
                error: error.message 
            });
        }
    };

    // Get admin dashboard overview
    getDashboardOverview = async (req, res) => {
        try {
            const now = new Date();
            const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

            // Get seller stats
            const totalSellers = await sellerModel.countDocuments();
            const verifiedSellers = await sellerModel.countDocuments({ status: 'active', isVerified: true });
            const pendingSellers = await sellerModel.countDocuments({ status: 'pending' });
            
            // Calculate seller growth
            const sellersLast30Days = await sellerModel.countDocuments({ createdAt: { $gte: last30Days } });
            const sellersPrevious30Days = await sellerModel.countDocuments({ 
                createdAt: { $gte: previous30Days, $lt: last30Days } 
            });
            const sellerGrowth = sellersPrevious30Days > 0 
                ? ((sellersLast30Days - sellersPrevious30Days) / sellersPrevious30Days * 100).toFixed(1)
                : sellersLast30Days > 0 ? 100 : 0;

            // Get buyer stats
            const totalBuyers = await buyerModel.countDocuments();
            const activeBuyers = await buyerModel.countDocuments({ status: 'active' });
            const newBuyers = await buyerModel.countDocuments({ createdAt: { $gte: last30Days } });
            
            // Calculate buyer growth
            const buyersLast30Days = await buyerModel.countDocuments({ createdAt: { $gte: last30Days } });
            const buyersPrevious30Days = await buyerModel.countDocuments({ 
                createdAt: { $gte: previous30Days, $lt: last30Days } 
            });
            const buyerGrowth = buyersPrevious30Days > 0 
                ? ((buyersLast30Days - buyersPrevious30Days) / buyersPrevious30Days * 100).toFixed(1)
                : buyersLast30Days > 0 ? 100 : 0;

            // Calculate pending verifications growth
            const pendingLast30Days = await sellerModel.countDocuments({ 
                status: 'pending',
                createdAt: { $gte: last30Days } 
            });
            const pendingPrevious30Days = await sellerModel.countDocuments({ 
                status: 'pending',
                createdAt: { $gte: previous30Days, $lt: last30Days } 
            });
            const pendingGrowth = pendingPrevious30Days > 0 
                ? ((pendingLast30Days - pendingPrevious30Days) / pendingPrevious30Days * 100).toFixed(1)
                : pendingLast30Days > 0 ? 100 : 0;

            // Get revenue stats
            const monthlyRevenue = await customerOrder.aggregate([
                {
                    $match: {
                        createdAt: { $gte: last30Days },
                        status: { $in: ['delivered', 'completed'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmount' }
                    }
                }
            ]);

            // Get previous month revenue for growth calculation
            const previousMonthRevenue = await customerOrder.aggregate([
                {
                    $match: {
                        createdAt: { $gte: previous30Days, $lt: last30Days },
                        status: { $in: ['delivered', 'completed'] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmount' }
                    }
                }
            ]);

            const currentRevenue = monthlyRevenue[0]?.total || 0;
            const previousRevenue = previousMonthRevenue[0]?.total || 0;
            const revenueGrowth = previousRevenue > 0 
                ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
                : currentRevenue > 0 ? 100 : 0;

            const dashboardData = {
                sellerStats: {
                    total: totalSellers,
                    verified: verifiedSellers,
                    pending: pendingSellers,
                    growth: parseFloat(sellerGrowth)
                },
                buyerStats: {
                    total: totalBuyers,
                    active: activeBuyers,
                    new: newBuyers,
                    growth: parseFloat(buyerGrowth)
                },
                pendingStats: {
                    total: pendingSellers,
                    growth: parseFloat(pendingGrowth)
                },
                revenueStats: {
                    monthlyRevenue: currentRevenue,
                    growth: parseFloat(revenueGrowth)
                },
                lastUpdated: new Date()
            };

            responseReturn(res, 200, {
                success: true,
                dashboard: dashboardData
            });

        } catch (error) {
            console.error('Error fetching dashboard overview:', error);
            responseReturn(res, 500, { 
                success: false,
                message: 'Error fetching dashboard data',
                error: error.message 
            });
        }
    };

    // Helper function to get time ago
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return date.toLocaleDateString();
    }
}

module.exports = new adminActivitiesController();
