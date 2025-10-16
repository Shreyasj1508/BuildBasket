import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    FaCheckCircle, 
    FaTimesCircle, 
    FaEye, 
    FaClock, 
    FaUser, 
    FaBox, 
    FaRupeeSign,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaStore,
    FaFilePdf,
    FaDownload
} from 'react-icons/fa';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';
import api from '../../api/api';

const OrderApproval = () => {
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        dateRange: 'all'
    });

    useEffect(() => {
        fetchPendingOrders();
    }, [filters]);

    const fetchPendingOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                status: filters.status === 'all' ? 'pending' : filters.status,
                search: filters.search,
                dateRange: filters.dateRange
            });
            
            const response = await api.get(`/admin/purchase-tracking?${params}`);
            
            if (response.data.success) {
                // Filter orders that need admin approval
                const pendingApprovalOrders = response.data.orders.filter(order => 
                    order.adminApproval?.status === 'pending' || !order.adminApproval
                );
                setOrders(pendingApprovalOrders);
            }
        } catch (error) {
            console.error('Error fetching pending orders:', error);
            toast.error('Failed to fetch pending orders');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOrder = async (orderId, approved = true, rejectionReason = '') => {
        try {
            const response = await api.put(`/admin/approve-order/${orderId}`, {
                approved,
                rejectionReason: approved ? '' : rejectionReason
            });

            if (response.data.success) {
                toast.success(`Order ${approved ? 'approved' : 'rejected'} successfully`);
                fetchPendingOrders();
                setShowModal(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error('Error updating order approval:', error);
            toast.error('Failed to update order approval');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-success/20 text-success border-success/30';
            case 'processing':
                return 'bg-info/20 text-info border-info/30';
            case 'shipped':
                return 'bg-primary/20 text-primary border-primary/30';
            case 'pending':
                return 'bg-warning/20 text-warning border-warning/30';
            case 'cancelled':
                return 'bg-danger/20 text-danger border-danger/30';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/30 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading pending orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/30 to-orange-100">
            <div className="px-2 lg:px-7 py-5">
                <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg">
                                <FaCheckCircle className="text-white text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-gradient">Order Approval</h2>
                                <p className="text-gray-600 text-lg">Review and approve pending orders</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-primary">{orders.length}</p>
                            <p className="text-gray-600">Pending Orders</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            />
                        </div>
                        <div>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <FaCheckCircle className="text-gray-400 text-6xl mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Orders</h3>
                                <p className="text-gray-500">All orders have been reviewed</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        
                                        {/* Order Info */}
                                        <div className="lg:col-span-2">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    Order #{order.orderNumber || order._id?.substring(0, 8)}...
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.delivery_status)}`}>
                                                    {order.delivery_status?.toUpperCase()}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <FaUser className="text-primary" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{order.shippingInfo?.name || order.customerId?.name}</p>
                                                        <p className="text-sm text-gray-600">Customer</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <FaCalendarAlt className="text-primary" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                                                        <p className="text-sm text-gray-600">Order Date</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <FaRupeeSign className="text-primary" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">₹{order.price}</p>
                                                        <p className="text-sm text-gray-600">Total Amount</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products Preview */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <FaBox className="text-primary" />
                                                Products ({order.products?.length || 0})
                                            </h4>
                                            <div className="space-y-2">
                                                {order.products?.slice(0, 3).map((product, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                                                        <img
                                                            src={product.products?.[0]?.productInfo?.images?.[0] || '/images/demo.jpg'}
                                                            alt="Product"
                                                            className="w-8 h-8 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {product.products?.[0]?.productInfo?.name}
                                                            </p>
                                                            <p className="text-xs text-gray-600">{product.shopName}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.products?.length > 3 && (
                                                    <p className="text-sm text-gray-500">+{order.products.length - 3} more products</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowModal(true);
                                                }}
                                                className="btn-outline flex items-center justify-center gap-2"
                                            >
                                                <FaEye />
                                                View Details
                                            </button>
                                            
                                            <button
                                                onClick={() => handleApproveOrder(order._id, true)}
                                                className="btn-success flex items-center justify-center gap-2"
                                            >
                                                <FaCheckCircle />
                                                Approve
                                            </button>
                                            
                                            <button
                                                onClick={() => handleApproveOrder(order._id, false, 'Order rejected by admin')}
                                                className="btn-danger flex items-center justify-center gap-2"
                                            >
                                                <FaTimesCircle />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-primary to-primary-dark px-8 py-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-white">
                                    Order Details - #{selectedOrder.orderNumber || selectedOrder._id?.substring(0, 8)}...
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="text-white hover:text-gray-300 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaUser className="text-primary" />
                                    Customer Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="font-semibold text-gray-900">{selectedOrder.shippingInfo?.name || selectedOrder.customerId?.name}</p>
                                        <p className="text-sm text-gray-600">Customer Name</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="font-semibold text-gray-900">{selectedOrder.shippingInfo?.phone || selectedOrder.customerId?.phone}</p>
                                        <p className="text-sm text-gray-600">Phone Number</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="font-semibold text-gray-900">{selectedOrder.shippingInfo?.email || selectedOrder.customerId?.email}</p>
                                        <p className="text-sm text-gray-600">Email</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="font-semibold text-gray-900">{selectedOrder.shippingInfo?.address}</p>
                                        <p className="text-sm text-gray-600">Address</p>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaBox className="text-primary" />
                                    Products
                                </h4>
                                <div className="space-y-4">
                                    {selectedOrder.products?.map((productGroup, index) => (
                                        <div key={index} className="p-4 bg-primary/5 rounded-xl">
                                            <h5 className="font-semibold text-gray-900 mb-3">{productGroup.shopName}</h5>
                                            <div className="space-y-2">
                                                {productGroup.products?.map((product, pIndex) => (
                                                    <div key={pIndex} className="flex items-center gap-3">
                                                        <img
                                                            src={product.productInfo?.images?.[0] || '/images/demo.jpg'}
                                                            alt="Product"
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{product.productInfo?.name}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {product.productQuantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-primary">₹{product.productInfo?.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaRupeeSign className="text-primary" />
                                    Order Summary
                                </h4>
                                <div className="p-4 bg-primary/5 rounded-xl space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold">₹{selectedOrder.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-semibold">₹{selectedOrder.shipping_fee || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary">₹{selectedOrder.price + (selectedOrder.shipping_fee || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => handleApproveOrder(selectedOrder._id, true)}
                                    className="btn-success flex items-center gap-2 flex-1"
                                >
                                    <FaCheckCircle />
                                    Approve Order
                                </button>
                                <button
                                    onClick={() => handleApproveOrder(selectedOrder._id, false, 'Order rejected by admin')}
                                    className="btn-danger flex items-center gap-2 flex-1"
                                >
                                    <FaTimesCircle />
                                    Reject Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderApproval;
