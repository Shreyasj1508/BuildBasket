import React, { useEffect, useState } from 'react';
import { 
    FaShoppingCart, 
    FaClock, 
    FaCheckCircle, 
    FaExclamationTriangle,
    FaEye,
    FaFilter,
    FaDownload,
    FaCalendarAlt,
    FaUser,
    FaStore,
    FaBox,
    FaTruck,
    FaMoneyBillWave,
    FaSearch,
    FaBell,
    FaChartLine
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import toast from 'react-hot-toast';

const PurchaseTracking = () => {
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [stats, setStats] = useState({
        totalPurchases: 0,
        pendingTasks: 0,
        completedTasks: 0,
        urgentTasks: 0,
        todayPurchases: 0
    });
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        search: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchPurchaseData();
    }, [currentPage, filters]);

    useEffect(() => {
        applyFilters();
    }, [purchases, filters]);

    const fetchPurchaseData = async () => {
        try {
            setLoading(true);
            
            // Fetch purchase tracking data with filters
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                status: filters.status,
                dateRange: filters.dateRange,
                search: filters.search
            });
            
            const response = await api.get(`/admin/purchase-tracking?${params}`);
            
            if (response.data.success) {
                const { orders, stats: apiStats } = response.data;
                
                // Transform orders into purchase tracking format
                const purchaseData = orders.map(order => ({
                    id: order._id,
                    orderNumber: order.orderNumber || order._id.substring(0, 8),
                    customerName: order.shippingInfo?.name || order.customerId?.name || 'N/A',
                    customerEmail: order.shippingInfo?.email || order.customerId?.email || 'N/A',
                    customerPhone: order.shippingInfo?.phone || order.customerId?.phone || 'N/A',
                    totalAmount: order.price || 0,
                    paymentStatus: order.payment_status || 'pending',
                    deliveryStatus: order.delivery_status || 'pending',
                    orderDate: order.createdAt || new Date().toISOString(),
                    products: order.products || [],
                    sellers: extractSellersFromOrder(order),
                    trackingNumber: order.trackingNumber,
                    estimatedDelivery: order.estimatedDelivery,
                    tasks: generateTasksForOrder(order),
                    priority: calculatePriority(order),
                    notes: order.notes || '',
                    adminApproval: order.adminApproval,
                    sellerConfirmation: order.sellerConfirmation
                }));

                setPurchases(purchaseData);
                setStats(apiStats);
            }
        } catch (error) {
            console.error('Error fetching purchase data:', error);
            toast.error('Failed to fetch purchase data');
        } finally {
            setLoading(false);
        }
    };

    const extractSellersFromOrder = (order) => {
        const sellers = new Map();
        
        if (order.suborder) {
            order.suborder.forEach(sub => {
                if (sub.sellerId) {
                    sellers.set(sub.sellerId, {
                        id: sub.sellerId,
                        shopName: sub.shopName || 'Unknown Shop',
                        status: sub.delivery_status || 'pending',
                        amount: sub.price || 0
                    });
                }
            });
        }
        
        return Array.from(sellers.values());
    };

    const generateTasksForOrder = (order) => {
        const tasks = [];
        
        // Payment verification task
        if (order.payment_status === 'pending') {
            tasks.push({
                id: 'payment_verification',
                title: 'Verify Payment',
                description: 'Confirm payment has been received',
                type: 'payment',
                priority: 'high',
                completed: order.payment_status === 'paid',
                assignedTo: 'admin',
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            });
        }
        
        // Admin approval task
        if (order.adminApproval?.status === 'pending') {
            tasks.push({
                id: 'admin_approval',
                title: 'Admin Approval Required',
                description: 'Review and approve this order',
                type: 'approval',
                priority: 'high',
                completed: order.adminApproval?.status === 'approved',
                assignedTo: 'admin',
                dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
            });
        }
        
        // Seller confirmation task
        if (order.sellerConfirmation?.status === 'pending') {
            tasks.push({
                id: 'seller_confirmation',
                title: 'Seller Confirmation',
                description: 'Seller needs to confirm product availability',
                type: 'inventory',
                priority: 'medium',
                completed: order.sellerConfirmation?.status === 'confirmed',
                assignedTo: 'seller',
                dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
            });
        }
        
        // Shipping preparation task
        if (order.payment_status === 'paid' && order.adminApproval?.status === 'approved') {
            tasks.push({
                id: 'shipping_prep',
                title: 'Prepare for Shipping',
                description: 'Package products and prepare shipping labels',
                type: 'shipping',
                priority: 'medium',
                completed: order.delivery_status === 'processing' || order.delivery_status === 'shipped',
                assignedTo: 'seller',
                dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours
            });
        }
        
        // Customer communication task
        tasks.push({
            id: 'customer_communication',
            title: 'Send Order Confirmation',
            description: 'Send order confirmation and tracking details to customer',
            type: 'communication',
            priority: 'low',
            completed: order.delivery_status === 'processing' || order.delivery_status === 'shipped',
            assignedTo: 'admin',
            dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
        });
        
        return tasks;
    };

    const calculatePriority = (order) => {
        const now = new Date();
        const orderDate = new Date(order.createdAt || order.date);
        const daysSinceOrder = (now - orderDate) / (1000 * 60 * 60 * 24);
        
        if (daysSinceOrder > 7 || order.payment_status === 'failed' || order.adminApproval?.status === 'pending') {
            return 'high';
        } else if (daysSinceOrder > 3 || order.payment_status === 'pending' || order.sellerConfirmation?.status === 'pending') {
            return 'medium';
        } else {
            return 'low';
        }
    };

    const applyFilters = () => {
        let filtered = [...purchases];
        
        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(p => {
                if (filters.status === 'pending_tasks') {
                    return p.tasks.some(t => !t.completed);
                } else if (filters.status === 'completed_tasks') {
                    return p.tasks.every(t => t.completed);
                } else if (filters.status === 'urgent') {
                    return p.priority === 'high';
                }
                return p.deliveryStatus === filters.status;
            });
        }
        
        // Date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            filtered = filtered.filter(p => {
                const orderDate = new Date(p.orderDate);
                
                switch (filters.dateRange) {
                    case 'today':
                        return orderDate >= today;
                    case 'week':
                        return orderDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    case 'month':
                        return orderDate >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    default:
                        return true;
                }
            });
        }
        
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.orderNumber.toLowerCase().includes(searchLower) ||
                p.customerName.toLowerCase().includes(searchLower) ||
                p.customerEmail.toLowerCase().includes(searchLower) ||
                p.sellers.some(s => s.shopName.toLowerCase().includes(searchLower))
            );
        }
        
        setFilteredPurchases(filtered);
    };

    const updateTaskStatus = async (purchaseId, taskId, completed) => {
        try {
            const response = await api.put('/admin/update-task-status', {
                orderId: purchaseId,
                taskId,
                completed
            });
            
            if (response.data.message) {
                // Update local state
                setPurchases(prev => prev.map(p => 
                    p.id === purchaseId 
                        ? {
                            ...p,
                            tasks: p.tasks.map(t => 
                                t.id === taskId ? { ...t, completed } : t
                            )
                        }
                        : p
                ));
                
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Failed to update task status');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'from-danger/20 to-danger/30';
            case 'medium': return 'from-warning/20 to-warning/30';
            case 'low': return 'from-success/20 to-success/30';
            default: return 'from-gray-200 to-gray-300';
        }
    };

    const getTaskIcon = (type) => {
        switch (type) {
            case 'payment': return <FaMoneyBillWave />;
            case 'inventory': return <FaBox />;
            case 'shipping': return <FaTruck />;
            case 'communication': return <FaBell />;
            case 'approval': return <FaCheckCircle />;
            default: return <FaCheckCircle />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className='px-2 lg:px-7 py-5 min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/30 to-orange-100'>
            <div className='w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30'>
                
                {/* Header */}
                <div className='flex items-center gap-4 mb-8'>
                    <div className='p-4 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg'>
                        <FaShoppingCart className='text-white text-3xl' />
                    </div>
                    <div>
                        <h2 className='text-4xl font-bold text-gradient'>
                            Purchase Tracking
                        </h2>
                        <p className='text-gray-600 text-lg font-medium'>Monitor and manage all customer purchases and tasks</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-5 gap-6 mb-8'>
                    <div className='bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm'>
                                <FaShoppingCart className='text-primary text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-gray-700 uppercase tracking-wide'>
                                Total Purchases
                            </h3>
                            <p className='text-3xl font-bold text-primary'>{stats.totalPurchases}</p>
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-danger/20 to-danger/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm'>
                                <FaExclamationTriangle className='text-danger text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-gray-700 uppercase tracking-wide'>
                                Pending Tasks
                            </h3>
                            <p className='text-3xl font-bold text-danger'>{stats.pendingTasks}</p>
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-success/20 to-success/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm'>
                                <FaCheckCircle className='text-success text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-gray-700 uppercase tracking-wide'>
                                Completed Tasks
                            </h3>
                            <p className='text-3xl font-bold text-success'>{stats.completedTasks}</p>
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-warning/20 to-warning/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm'>
                                <FaClock className='text-warning text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-gray-700 uppercase tracking-wide'>
                                Urgent Tasks
                            </h3>
                            <p className='text-3xl font-bold text-warning'>{stats.urgentTasks}</p>
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-info/20 to-info/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm'>
                                <FaCalendarAlt className='text-info text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-gray-700 uppercase tracking-wide'>
                                Today's Purchases
                            </h3>
                            <p className='text-3xl font-bold text-info'>{stats.todayPurchases}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                    <div className='flex items-center gap-4 flex-wrap'>
                        <select 
                            value={filters.status} 
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className='px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'
                        >
                            <option value="all">All Status</option>
                            <option value="pending_tasks">Pending Tasks</option>
                            <option value="completed_tasks">Completed Tasks</option>
                            <option value="urgent">Urgent</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        
                        <select 
                            value={filters.dateRange} 
                            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                            className='px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        
                        <div className='relative'>
                            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input 
                                type="text"
                                placeholder="Search purchases..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className='pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 placeholder-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 font-medium'
                            />
                        </div>
                    </div>
                    
                    <button className='btn-primary flex items-center gap-2'>
                        <FaDownload className='text-lg' />
                        Export Data
                    </button>
                </div>

                {/* Purchases List */}
                <div className='space-y-6'>
                    {filteredPurchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((purchase, index) => (
                        <div key={purchase.id} className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30'>
                            
                            {/* Purchase Header */}
                            <div className='flex items-center justify-between mb-4'>
                                <div className='flex items-center gap-4'>
                                    <div className={`p-3 bg-gradient-to-r ${getPriorityColor(purchase.priority)} rounded-xl shadow-lg`}>
                                        <FaShoppingCart className='text-gray-800 text-xl' />
                                    </div>
                                    <div>
                                        <h3 className='text-xl font-bold text-gray-800'>Order #{purchase.orderNumber}</h3>
                                        <p className='text-gray-600'>Customer: {purchase.customerName}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        purchase.paymentStatus === 'paid' 
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {purchase.paymentStatus}
                                    </span>
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                        purchase.deliveryStatus === 'delivered' 
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : purchase.deliveryStatus === 'processing'
                                            ? 'bg-indigo-100 text-indigo-800'
                                            : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {purchase.deliveryStatus}
                                    </span>
                                    <span className='text-2xl font-bold text-primary'>₹{purchase.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                <div className='flex items-center gap-3 p-3 bg-primary/5 rounded-xl'>
                                    <FaUser className='text-primary text-lg' />
                                    <div>
                                        <p className='font-semibold text-gray-800'>{purchase.customerName}</p>
                                        <p className='text-sm text-gray-600'>{purchase.customerEmail}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 p-3 bg-primary/5 rounded-xl'>
                                    <FaStore className='text-primary text-lg' />
                                    <div>
                                        <p className='font-semibold text-gray-800'>{purchase.sellers.length} Seller(s)</p>
                                        <p className='text-sm text-gray-600'>{purchase.sellers.map(s => s.shopName).join(', ')}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 p-3 bg-primary/5 rounded-xl'>
                                    <FaCalendarAlt className='text-primary text-lg' />
                                    <div>
                                        <p className='font-semibold text-gray-800'>{new Date(purchase.orderDate).toLocaleDateString()}</p>
                                        <p className='text-sm text-gray-600'>{purchase.products.length} Product(s)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tasks Section */}
                            <div className='mb-4'>
                                <h4 className='text-lg font-bold text-gray-800 mb-3 flex items-center gap-2'>
                                    <FaCheckCircle className='text-primary' />
                                    Tasks & Actions Required
                                </h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    {purchase.tasks.map((task, taskIndex) => (
                                        <div key={task.id} className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                            task.completed 
                                                ? 'bg-success/10 border-success/20' 
                                                : task.priority === 'high'
                                                ? 'bg-danger/10 border-danger/20'
                                                : 'bg-warning/10 border-warning/20'
                                        }`}>
                                            <div className='flex items-center justify-between mb-2'>
                                                <div className='flex items-center gap-3'>
                                                    <div className={`p-2 rounded-lg ${
                                                        task.completed 
                                                            ? 'bg-success text-white' 
                                                            : task.priority === 'high'
                                                            ? 'bg-danger text-white'
                                                            : 'bg-warning text-white'
                                                    }`}>
                                                        {getTaskIcon(task.type)}
                                                    </div>
                                                    <div>
                                                        <h5 className='font-semibold text-gray-800'>{task.title}</h5>
                                                        <p className='text-sm text-gray-600'>{task.description}</p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        task.priority === 'high' 
                                                            ? 'bg-danger/20 text-danger'
                                                            : task.priority === 'medium'
                                                            ? 'bg-warning/20 text-warning'
                                                            : 'bg-success/20 text-success'
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                    <button
                                                        onClick={() => updateTaskStatus(purchase.id, task.id, !task.completed)}
                                                        className={`p-2 rounded-lg transition-all duration-300 ${
                                                            task.completed 
                                                                ? 'bg-success text-white hover:bg-success/80'
                                                                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                                                        }`}
                                                    >
                                                        <FaCheckCircle className='text-sm' />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='flex items-center justify-between text-sm text-gray-600'>
                                                <span>Assigned to: {task.assignedTo}</span>
                                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                                <div className='flex items-center gap-3'>
                                    <Link 
                                        to={`/admin/dashboard/order/details/${purchase.id}`}
                                        className='px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-500 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'
                                    >
                                        <FaEye className='text-sm' />
                                        View Details
                                    </Link>
                                    <button className='px-4 py-2 bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'>
                                        <FaChartLine className='text-sm' />
                                        Track Progress
                                    </button>
                                </div>
                                <div className='text-sm text-gray-600'>
                                    {purchase.trackingNumber && `Tracking: ${purchase.trackingNumber}`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {filteredPurchases.length > itemsPerPage && (
                    <div className='flex justify-center mt-8'>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className='px-4 py-2 bg-gray-300 text-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-all duration-300'
                            >
                                Previous
                            </button>
                            <span className='px-4 py-2 bg-sky-500 text-white rounded-lg font-semibold'>
                                Page {currentPage} of {Math.ceil(filteredPurchases.length / itemsPerPage)}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredPurchases.length / itemsPerPage), prev + 1))}
                                disabled={currentPage === Math.ceil(filteredPurchases.length / itemsPerPage)}
                                className='px-4 py-2 bg-gray-300 text-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-all duration-300'
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredPurchases.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                            <FaShoppingCart className='text-3xl text-gray-400' />
                        </div>
                        <h3 className='text-xl font-semibold text-gray-700 mb-2'>No purchases found</h3>
                        <p className='text-gray-500'>No purchases match your current filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseTracking;
