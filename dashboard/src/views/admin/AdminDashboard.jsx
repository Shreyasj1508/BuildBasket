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
    FaChevronRight
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

    const menuItems = [
        {
            name: 'Dashboard',
            icon: FaTachometerAlt,
            path: '/admin/dashboard',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            name: 'Commodity Management',
            icon: FaBoxes,
            path: '/admin/dashboard/commodity-management',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            name: 'User Verification',
            icon: FaUsers,
            path: '/admin/dashboard/user-verification',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            name: 'Reports & Exports',
            icon: FaFileExcel,
            path: '/admin/dashboard/reports-exports',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            name: 'Analytics Dashboard',
            icon: FaChartBar,
            path: '/admin/dashboard/analytics',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
        },
        {
            name: 'Settings',
            icon: FaCog,
            path: '/admin/dashboard/commission-settings',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50'
        }
    ];

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
            icon: FaShoppingCart,
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
            value: `₹${(dashboardData.quickStats.monthlyRevenue / 1000).toFixed(1)}K`,
            change: `${dashboardData.quickStats.revenueGrowth >= 0 ? '+' : ''}${dashboardData.quickStats.revenueGrowth}%`,
            changeType: dashboardData.quickStats.revenueGrowth >= 0 ? 'positive' : 'negative',
            icon: FaCreditCard,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            lightBg: 'bg-purple-50',
            textColor: 'text-purple-600'
        }
    ];

    const recentActivities = dashboardData.recentActivities.length > 0 
        ? dashboardData.recentActivities.slice(0, 5)
        : [];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col border-r border-gray-200 fixed left-0 top-0 bottom-0 z-40 overflow-hidden`}>
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">A</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">AlmaMate</h1>
                                    <p className="text-xs text-gray-500">Admin Panel</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaBars className="text-gray-600" />
                        </button>
                    </div> 
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 sidebar-scroll">
                    <div className="space-y-2">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                                        isActive
                                            ? `${item.bgColor} ${item.color} shadow-sm`
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}>
                                        <Icon className="text-xl" />
                                    </div>
                                    {sidebarOpen && (
                                        <span className="font-medium text-sm">{item.name}</span>
                                    )}
                                    {sidebarOpen && isActive && (
                                        <FaChevronRight className="ml-auto text-sm" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* User Section */}
                {sidebarOpen && (
                    <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
                                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div> 
                </div>
                    </div>
                )}
                    </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 z-10">
                    <div className="px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Search Bar */}
                            <div className="flex-1 max-w-2xl">
                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search anything..."
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                    </div> 
                </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-4 ml-6">
                                {/* Notifications */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all hover:shadow-sm"
                                    >
                                        <FaBell className="text-xl" />
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    </button>
                                    
                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeInUp">
                                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                                <button onClick={() => setShowNotifications(false)}>
                                                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                                                </button>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {recentActivities.slice(0, 3).map((activity, index) => (
                                                    <div key={index} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                                                        <p className="text-sm text-gray-800">{activity.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="px-4 py-2 border-t border-gray-100">
                                                <Link to="/admin/dashboard/activities" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                                    View all notifications
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Menu */}
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500">Administrator</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                                        {currentUser.name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-8">
                        {/* Welcome Section */}
                        <div className="mb-8 animate-fadeInUp">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Welcome back, <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin</span>! 👋
                            </h1>
                            <p className="text-gray-600">Here's what's happening with your platform today.</p>
                    </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {quickStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover-lift animate-fadeInUp"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`${stat.lightBg} p-3 rounded-xl`}>
                                                <Icon className={`text-2xl ${stat.textColor}`} />
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                stat.changeType === 'positive' 
                                                    ? 'bg-green-50 text-green-600' 
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                                {stat.changeType === 'positive' ? <FaArrowUp /> : <FaArrowDown />}
                                                {stat.change}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
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

                        {/* Feature Cards */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Admin Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems.slice(1, 5).map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={index}
                                            to={item.path}
                                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-gray-200 hover-lift group animate-fadeInUp"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <Icon className={`text-2xl ${item.color}`} />
                                            </div>
                                            <h4 className="font-bold text-gray-800 mb-2 text-lg">{item.name}</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {item.name === 'Commodity Management' && 'Upload & manage commodities via Excel'}
                                                {item.name === 'User Verification' && 'Verify sellers and manage buyer credit limits'}
                                                {item.name === 'Reports & Exports' && 'Export reports and automated email reports'}
                                                {item.name === 'Analytics Dashboard' && 'Comprehensive business analytics and insights'}
                                            </p>
                                            <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                                <span>Learn more</span>
                                                <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
               </div>
    </div>
        </div>
        </div>
    );
};

export default AdminDashboard;
