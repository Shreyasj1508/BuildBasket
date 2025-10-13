import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    FaTimes,
    FaCrown,
    FaCalendarAlt,
    FaShieldAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProfessionalAdminLayout = ({ children, title, subtitle, showStats = false }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const currentUser = {
        name: 'Admin User',
        email: 'admin@almamate.com',
        avatar: '/images/admin-avatar.png'
    };

    const menuItems = [
        {
            name: 'Dashboard',
            icon: FaTachometerAlt,
            path: '/admin/dashboard',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-50',
            activeColor: 'bg-blue-100',
            description: 'Overview & Analytics'
        },
        {
            name: 'Commodity Management',
            icon: FaBoxes,
            path: '/admin/dashboard/commodity-management',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            hoverColor: 'hover:bg-emerald-50',
            activeColor: 'bg-emerald-100',
            description: 'Manage Products'
        },
        {
            name: 'User Verification',
            icon: FaUsers,
            path: '/admin/dashboard/user-verification',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-50',
            activeColor: 'bg-purple-100',
            description: 'Verify Users'
        },
        {
            name: 'Reports & Exports',
            icon: FaFileExcel,
            path: '/admin/dashboard/reports-exports',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            hoverColor: 'hover:bg-orange-50',
            activeColor: 'bg-orange-100',
            description: 'Generate Reports'
        },
        {
            name: 'Analytics Dashboard',
            icon: FaChartBar,
            path: '/admin/dashboard/analytics',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            hoverColor: 'hover:bg-indigo-50',
            activeColor: 'bg-indigo-100',
            description: 'Business Insights'
        },
        {
            name: 'Commission Settings',
            icon: FaCog,
            path: '/admin/dashboard/commission-settings',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            hoverColor: 'hover:bg-gray-50',
            activeColor: 'bg-gray-100',
            description: 'Platform Settings'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        toast.success('Logged out successfully');
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            {/* Professional Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transition-all duration-300 flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-hidden`}>
                {/* Professional Logo Section */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FaCrown className="text-white text-xl" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">AlmaMate</h1>
                                    <p className="text-xs text-slate-400 font-medium">Admin Portal</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-3 hover:bg-slate-700 rounded-xl transition-all duration-200 text-slate-300 hover:text-white"
                        >
                            <FaBars className="text-lg" />
                        </button>
                    </div> 
                </div>

                {/* Professional Menu Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 professional-scrollbar">
                    <div className="space-y-3">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    <div className={`p-3 rounded-xl transition-all duration-200 ${
                                        isActive 
                                            ? 'bg-white/20 backdrop-blur-sm' 
                                            : 'bg-slate-700/50 group-hover:bg-slate-600'
                                    }`}>
                                        <Icon className={`text-xl ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`} />
                                    </div>
                                    {sidebarOpen && (
                                        <div className="flex-1">
                                            <span className="font-semibold text-base">{item.name}</span>
                                            <p className={`text-xs mt-1 ${
                                                isActive ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-300'
                                            }`}>
                                                {item.description}
                                            </p>
                                        </div>
                                    )}
                                    {isActive && (
                                        <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Professional User Section */}
                {sidebarOpen && (
                    <div className="p-4 border-t border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 shadow-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-slate-300 truncate">{currentUser.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-slate-500 rounded-xl transition-colors text-slate-300 hover:text-white"
                                title="Logout"
                            >
                                <FaSignOutAlt className="text-sm" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-80' : 'ml-20'} transition-all duration-300`}>
                {/* Professional Header */}
                <header className="bg-white shadow-lg border-b border-gray-200 z-10 backdrop-blur-sm bg-white/95">
                    <div className="px-8 py-5">
                        <div className="flex items-center justify-between">
                            {/* Page Title */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FaShieldAlt className="text-white text-xl" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{title || 'Admin Dashboard'}</h1>
                                    <p className="text-sm text-gray-600">{subtitle || 'Manage your platform'}</p>
                                </div>
                            </div>

                            {/* Enhanced Search Bar */}
                            <div className="flex-1 max-w-2xl mx-8">
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
                            <div className="flex items-center gap-6">
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
                                            <div className="px-6 py-4">
                                                <p className="text-gray-500 text-center">No new notifications</p>
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

                {/* Professional Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="p-8">
                        {/* System Status Bar */}
                        <div className="flex items-center gap-3 mb-8">
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

                        {/* Page Content */}
                        <div className="animate-fadeInUp">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalAdminLayout;
