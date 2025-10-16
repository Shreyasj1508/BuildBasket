import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
    FaCheckCircle, 
    FaTimesCircle, 
    FaEye, 
    FaClock,
    FaUser,
    FaShoppingCart,
    FaRupeeSign,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaBox,
    FaTruck
} from 'react-icons/fa';

const SellerOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [sellerNotes, setSellerNotes] = useState('');
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const fetchSellerOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/seller/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            } else {
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOrder = async (orderId, status) => {
        try {
            const response = await fetch(`/api/seller/confirm-order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
                },
                body: JSON.stringify({ 
                    status: status,
                    sellerNotes: sellerNotes
                })
            });

            if (response.ok) {
                toast.success(`Order ${status} successfully`);
                fetchSellerOrders();
                setShowModal(false);
                setSellerNotes('');
                setActionType('');
            } else {
                toast.error(`Failed to ${status} order`);
            }
        } catch (error) {
            console.error(`Error ${actionType} order:`, error);
            toast.error(`Error ${actionType} order`);
        }
    };

    const openOrderModal = (order, action) => {
        setSelectedOrder(order);
        setActionType(action);
        setShowModal(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock },
            confirmed: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
            rejected: { color: 'bg-red-100 text-red-800', icon: FaTimesCircle },
            processing: { color: 'bg-purple-100 text-purple-800', icon: FaBox },
            shipped: { color: 'bg-indigo-100 text-indigo-800', icon: FaTruck },
            delivered: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getAdminApprovalBadge = (adminApproval) => {
        if (!adminApproval) return null;

        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Approval' },
            approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
        };

        const config = statusConfig[adminApproval.status] || statusConfig.pending;

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
                            <p className="text-gray-600">Manage and confirm customer orders</p>
                        </div>
                        <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl">
                            <span className="text-2xl font-bold">{orders.length}</span>
                            <p className="text-sm">Total Orders</p>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Your Orders</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <FaShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                            <p className="text-gray-500">You haven't received any orders yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Order #{order.orderNumber}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                        <FaCalendarAlt className="w-4 h-4" />
                                                        {new Date(order.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {getAdminApprovalBadge(order.adminApproval)}
                                                    {getStatusBadge(order.delivery_status)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Customer Info */}
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <FaUser className="text-primary" />
                                                        <h4 className="font-semibold text-gray-800">Customer</h4>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <FaEnvelope className="w-3 h-3 text-gray-500" />
                                                            {order.customerId?.email}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaPhone className="w-3 h-3 text-gray-500" />
                                                            {order.customerId?.phone}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Details */}
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <FaShoppingCart className="text-primary" />
                                                        <h4 className="font-semibold text-gray-800">Order Details</h4>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <FaRupeeSign className="w-3 h-3 text-gray-500" />
                                                            Total: ₹{order.price}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaShoppingCart className="w-3 h-3 text-gray-500" />
                                                            {order.products?.length || 0} Seller(s)
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Shipping Address */}
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <FaMapMarkerAlt className="text-primary" />
                                                        <h4 className="font-semibold text-gray-800">Shipping</h4>
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {order.shippingInfo?.address}
                                                        <br />
                                                        {order.shippingInfo?.city}, {order.shippingInfo?.state}
                                                        <br />
                                                        {order.shippingInfo?.pincode}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 ml-6">
                                            <button
                                                onClick={() => openOrderModal(order, 'view')}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <FaEye />
                                                View Details
                                            </button>
                                            
                                            {order.sellerConfirmation?.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => openOrderModal(order, 'confirm')}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                                    >
                                                        <FaCheckCircle />
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => openOrderModal(order, 'reject')}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                                    >
                                                        <FaTimesCircle />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Order #{selectedOrder.orderNumber}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSellerNotes('');
                                        setActionType('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimesCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Customer Information */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium">{selectedOrder.customerId?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{selectedOrder.customerId?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{selectedOrder.customerId?.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Order Date</p>
                                            <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Products</h3>
                                <div className="space-y-4">
                                    {selectedOrder.products?.map((sellerGroup, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                                            <h4 className="font-semibold text-primary mb-3">{sellerGroup.shopName}</h4>
                                            <div className="space-y-2">
                                                {sellerGroup.products?.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="flex justify-between items-center bg-white rounded-lg p-3">
                                                        <div>
                                                            <p className="font-medium">{item.productInfo?.name}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-semibold">₹{item.productInfo?.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h3>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p>{selectedOrder.shippingInfo?.address}</p>
                                    <p>{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state}</p>
                                    <p>Pincode: {selectedOrder.shippingInfo?.pincode}</p>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium">Total Amount:</span>
                                        <span className="text-xl font-bold text-primary">₹{selectedOrder.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span>Payment Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            selectedOrder.payment_status === 'paid' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedOrder.payment_status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {actionType === 'view' ? (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setActionType('');
                                        }}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {actionType === 'confirm' ? 'Confirmation Notes (Optional)' : 'Reason for Rejection'}
                                        </label>
                                        <textarea
                                            value={sellerNotes}
                                            onChange={(e) => setSellerNotes(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            rows="3"
                                            placeholder={actionType === 'confirm' 
                                                ? 'Add any notes about this order confirmation...' 
                                                : 'Please provide a reason for rejecting this order...'
                                            }
                                        />
                                    </div>
                                    
                                    <div className="flex gap-4 justify-end">
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                setSellerNotes('');
                                                setActionType('');
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleConfirmOrder(
                                                selectedOrder._id, 
                                                actionType === 'confirm' ? 'confirmed' : 'rejected'
                                            )}
                                            className={`${
                                                actionType === 'confirm' 
                                                    ? 'bg-green-500 hover:bg-green-600' 
                                                    : 'bg-red-500 hover:bg-red-600'
                                            } text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2`}
                                        >
                                            {actionType === 'confirm' ? (
                                                <>
                                                    <FaCheckCircle />
                                                    Confirm Order
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimesCircle />
                                                    Reject Order
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrderManagement;
