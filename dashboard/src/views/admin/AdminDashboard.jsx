import React, { useState, useEffect } from 'react';
import { 
    FaTachometerAlt, 
    FaBoxes, 
    FaUsers, 
    FaFileExcel, 
    FaChartBar, 
    FaCog,
    FaBars,
    FaSignOutAlt,
    FaBell,
    FaSearch,
    FaUpload,
    FaCheckCircle,
    FaArrowUp,
    FaArrowDown,
    FaCreditCard,
    FaShoppingCart,
    FaUserCheck,
    FaUserClock,
    FaTimes,
    FaChevronRight,
    FaSpinner,
    FaCrown,
    FaShieldAlt,
    FaTrendingUp,
    FaCalendarAlt,
    FaFilter,
    FaDownload,
    FaEye,
    FaEdit,
    FaPlus,
    FaHome,
    FaBuilding,
    FaGlobe,
    FaCog as FaSettings,
    FaListUl,
    FaUserTie,
    FaMoneyBillWave,
    FaUserSlash,
    FaComments,
    FaClipboardList,
    FaTag,
    FaUserFriends
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentUser] = useState({
        name: 'Admin User',
        email: 'admin@almamate.com',
        avatar: '/images/admin-avatar.png'
    });
    const [dashboardData, setDashboardData] = useState({
        quickStats: {
            totalSellers: 0,
            totalBuyers: 0,
            pendingVerifications: 0,
            monthlyRevenue: 0,
            sellerGrowth: 0,
            buyerGrowth: 0,
            pendingGrowth: 0,
            revenueGrowth: 0
        },
        recentActivities: [],
        sellerStats: { total: 0, verified: 0, pending: 0, growth: 0 },
        buyerStats: { total: 0, active: 0, new: 0, growth: 0 }
    });

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch dashboard overview with growth data
            const dashboardResponse = await api.get('/admin/dashboard');
            const activitiesResponse = await api.get('/admin/activities');

            if (dashboardResponse.data.success) {
                const dashboard = dashboardResponse.data.dashboard;
                setDashboardData(prev => ({
                    ...prev,
                    quickStats: {
                        totalSellers: dashboard.sellerStats?.total || 0,
                        totalBuyers: dashboard.buyerStats?.total || 0,
                        pendingVerifications: dashboard.pendingStats?.total || 0,
                        monthlyRevenue: dashboard.revenueStats?.monthlyRevenue || 0,
                        sellerGrowth: dashboard.sellerStats?.growth || 0,
                        buyerGrowth: dashboard.buyerStats?.growth || 0,
                        pendingGrowth: dashboard.pendingStats?.growth || 0,
                        revenueGrowth: dashboard.revenueStats?.growth || 0
                    },
                    sellerStats: dashboard.sellerStats || { total: 0, verified: 0, pending: 0, growth: 0 },
                    buyerStats: dashboard.buyerStats || { total: 0, active: 0, new: 0, growth: 0 }
                }));
            }

            if (activitiesResponse.data.success) {
                setDashboardData(prev => ({
                    ...prev,
                    recentActivities: activitiesResponse.data.activities || []
                }));
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const quickStats = [
        {
            title: 'Total Sellers',
            value: dashboardData.quickStats.totalSellers,
            change: `${dashboardData.quickStats.sellerGrowth >= 0 ? '+' : ''}${dashboardData.quickStats.sellerGrowth}%`,
            changeType: dashboardData.quickStats.sellerGrowth >= 0 ? 'positive' : 'negative',
            icon: FaUsers,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            lightBg: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Total Buyers',
            value: dashboardData.quickStats.totalBuyers,
            change: `${dashboardData.quickStats.buyerGrowth >= 0 ? '+' : ''}${dashboardData.quickStats.buyerGrowth}%`,
            changeType: dashboardData.quickStats.buyerGrowth >= 0 ? 'positive' : 'negative',
            icon: FaUserFriends,
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            lightBg: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Pending Verifications',
            value: dashboardData.quickStats.pendingVerifications,
            change: `${dashboardData.quickStats.pendingGrowth >= 0 ? '+' : ''}${dashboardData.quickStats.pendingGrowth}%`,
            changeType: dashboardData.quickStats.pendingGrowth >= 0 ? 'positive' : 'negative',
            icon: FaUserClock,
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            lightBg: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            title: 'Monthly Revenue',
            value: `₹${dashboardData.quickStats.monthlyRevenue.toLocaleString()}`,
            change: `${dashboardData.quickStats.revenueGrowth >= 0 ? '+' : ''}${dashboardData.quickStats.revenueGrowth}%`,
            changeType: dashboardData.quickStats.revenueGrowth >= 0 ? 'positive' : 'negative',
            icon: FaMoneyBillWave,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            lightBg: 'bg-purple-50',
            textColor: 'text-purple-600'
        }
    ];

    const recentActivities = dashboardData.recentActivities.length > 0 
        ? dashboardData.recentActivities.slice(0, 5)
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Professional Header */}
            <header className="bg-white shadow-lg border-b border-gray-200 z-10 backdrop-blur-sm bg-white/95">
                <div className="px-8 py-5">
                    <div className="flex items-center justify-between">
                        {/* Enhanced Search Bar */}
                        <div className="flex-1 max-w-2xl">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Search users, products, orders..."
                                    className="w-full pl-14 pr-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-500"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-lg">Ctrl+K</span>
                                </div>
                            </div> 
                        </div>

                        {/* Professional Right Section */}
                        <div className="flex items-center gap-6 ml-8">
                            {/* Enhanced Notifications */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-4 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all duration-300 hover:shadow-lg group"
                                >
                                    <FaBell className="text-xl group-hover:text-blue-600 transition-colors" />
                                    <span className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
                                </button>
                                
                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-50 animate-fadeInUp backdrop-blur-sm">
                                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="font-bold text-gray-800 text-lg">Notifications</h3>
                                            <button 
                                                onClick={() => setShowNotifications(false)}
                                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                            >
                                                <FaTimes className="text-gray-400 hover:text-gray-600" />
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {recentActivities.slice(0, 3).map((activity, index) => (
                                                <div key={index} className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer border-b border-gray-50 transition-all">
                                                    <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                                                    <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-6 py-3 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                                            <Link to="/admin/dashboard/activities" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                                                View all notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Professional User Menu */}
                            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">Super Administrator</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    {currentUser.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Professional Dashboard Content */}
            <div className="p-8">
                {/* Professional Welcome Section */}
                <div className="mb-10 animate-fadeInUp">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-3">
                                Welcome back, <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Admin</span>! 👋
                            </h1>
                            <p className="text-gray-600 text-lg">Here's your comprehensive platform overview for today.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-gray-700">System Online</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">{new Date().toLocaleDateString('en-IN', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {quickStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 animate-fadeInUp relative overflow-hidden"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`${stat.lightBg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <Icon className={`text-3xl ${stat.textColor}`} />
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold shadow-sm ${
                                            stat.changeType === 'positive' 
                                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                                                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                                        }`}>
                                            {stat.changeType === 'positive' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">{stat.title}</p>
                                        <p className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full transition-all duration-1000 ${
                                                stat.changeType === 'positive' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                                            }`} style={{ width: `${Math.min(100, Math.abs(stat.change || 0) * 10)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
                                <Link to="/admin/dashboard/activities" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : recentActivities.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivities.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                activity.status === 'pending' 
                                                    ? 'bg-orange-100 text-orange-600' 
                                                    : 'bg-green-100 text-green-600'
                                            }`}>
                                                {activity.status === 'pending' ? <FaUserClock /> : <FaUserCheck />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 font-medium mb-1">{activity.message}</p>
                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaBell className="text-2xl text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">No recent activities</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fadeInUp">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <Link
                                to="/admin/dashboard/commodity-management"
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all hover-lift group"
                            >
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <FaUpload className="text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm">Upload Commodities</p>
                                    <p className="text-xs text-gray-600">Manage via Excel</p>
                                </div>
                                <FaChevronRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
                            </Link>

                            <Link
                                to="/admin/dashboard/user-verification"
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all hover-lift group"
                            >
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <FaCheckCircle className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm">Verify Users</p>
                                    <p className="text-xs text-gray-600">Approve sellers & buyers</p>
                                </div>
                                <FaChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>

                            <Link
                                to="/admin/dashboard/reports-exports"
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl transition-all hover-lift group"
                            >
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <FaFileExcel className="text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm">Generate Reports</p>
                                    <p className="text-xs text-gray-600">Export to Excel</p>
                                </div>
                                <FaChevronRight className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                            </Link>

                            <Link
                                to="/admin/dashboard/analytics"
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all hover-lift group"
                            >
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <FaChartBar className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm">View Analytics</p>
                                    <p className="text-xs text-gray-600">Business insights</p>
                                </div>
                                <FaChevronRight className="text-gray-400 group-hover:text-purple-600 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;