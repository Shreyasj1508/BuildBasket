import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuthState } from '../hooks/useSafeSelector';
import { 
    FaShoppingCart, 
    FaDownload, 
    FaEye, 
    FaClock, 
    FaCheckCircle, 
    FaTruck, 
    FaBox,
    FaTimesCircle,
    FaRupeeSign,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaFilePdf,
    FaReceipt,
    FaStore,
    FaUser,
    FaPhone,
    FaEnvelope
} from 'react-icons/fa';
import api from '../api/api';
import toast from 'react-hot-toast';

const CustomerOrderDashboard = () => {
    const { userInfo } = useAuthState();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (userInfo?.id) {
            fetchCustomerOrders();
        }
    }, [userInfo]);

    const fetchCustomerOrders = async () => {
        try {
            setLoading(true);
            if (!userInfo || !userInfo.id) {
                console.error('User not authenticated');
                return;
            }
            
            const response = await api.get(`/home/customer/get-orders/${userInfo.id}/all`);

            if (response.data.success) {
                setOrders(response.data.orders || []);
            } else {
                console.error('Failed to fetch orders');
                toast.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (orderId, type = 'receipt') => {
        try {
            const response = await api.get(`/home/order/generate-pdf/${orderId}/${type}`, {
                responseType: 'blob'
            });

            // Create blob and download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type === 'receipt' ? 'Order-Receipt' : 'Official-Bill'}-${orderId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`${type === 'receipt' ? 'Order Receipt' : 'Official Bill'} downloaded successfully!`);
        } catch (error) {
            console.error('PDF generation error:', error);
            if (error.response?.status === 403) {
                if (type === 'bill') {
                    toast.error('Official Bill can only be downloaded after admin approval');
                } else {
                    toast.error('Order Receipt can only be downloaded after payment confirmation');
                }
            } else {
                toast.error(`Failed to generate ${type === 'bill' ? 'Official Bill' : 'Order Receipt'}. Please try again.`);
            }
        }
    };

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Helper functions to determine PDF availability
    const canDownloadReceipt = (order) => {
        return order.payment_status === 'paid' || order.payment_status === 'processing';
    };

    const canDownloadBill = (order) => {
        return order.adminApproval?.status === 'approved';
    };

    const getStatusIcon = (status) => {
        const statusConfig = {
            pending: { icon: FaClock, color: 'text-yellow-500' },
            confirmed: { icon: FaCheckCircle, color: 'text-blue-500' },
            processing: { icon: FaBox, color: 'text-purple-500' },
            shipped: { icon: FaTruck, color: 'text-indigo-500' },
            delivered: { icon: FaCheckCircle, color: 'text-green-500' },
            cancelled: { icon: FaTimesCircle, color: 'text-red-500' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return <Icon className={`w-5 h-5 ${config.color}`} />;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status] || statusConfig.pending}`}>
                {getStatusIcon(status)}
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Ccircle cx='15' cy='15' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>
            
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Enhanced Compact Header */}
                <div className="relative overflow-hidden rounded-xl shadow-xl mb-6 border-2 border-primary/20">
                    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/30 p-2 rounded-lg shadow-lg">
                                    <FaShoppingCart className="text-xl text-white drop-shadow-sm" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-white drop-shadow-lg">My Orders</h1>
                                    <p className="text-white/95 text-xs font-medium">Track and manage your orders</p>
                                </div>
                            </div>
                            <div className="bg-white/30 px-3 py-2 rounded-lg shadow-lg border border-white/20">
                                <span className="text-xl font-black text-white drop-shadow-sm block">{orders.length}</span>
                                <p className="text-white/95 text-xs font-bold">Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <FaShoppingCart className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                            <p className="text-gray-600 mb-4">Start shopping to see your orders here!</p>
                            <div className="bg-gray-50 rounded-lg p-4 inline-block">
                                <p className="text-gray-700 font-medium">Explore our amazing products and place your first order!</p>
                            </div>
                        </div>
                    ) : (
                        orders.map((order, index) => (
                            <div 
                                key={order._id} 
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary/30 transform hover:-translate-y-1"
                            >
                                <div className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-primary/20 p-2 rounded-lg shadow-sm">
                                                        <FaShoppingCart className="text-base text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            Order #{order.orderNumber}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <FaCalendarAlt className="w-3 h-3 text-primary" />
                                                            <span className="text-xs font-medium">{new Date(order.date).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-4 items-end">
                                                <div className="flex gap-3 items-center">
                                                    {getAdminApprovalBadge(order.adminApproval)}
                                                    {getStatusBadge(order.delivery_status)}
                                                </div>
                                                
                                                {/* Enhanced PDF Availability Indicators */}
                                                <div className="flex gap-3 flex-wrap justify-end">
                                                    {canDownloadReceipt(order) && (
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                                            <FaReceipt className="w-4 h-4" />
                                                            Receipt Ready
                                                        </span>
                                                    )}
                                                    {canDownloadBill(order) && (
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                                            <FaFilePdf className="w-4 h-4" />
                                                            Official Bill Ready
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                                        {/* Order Summary */}
                                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/30 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-primary/30 p-1.5 rounded-md">
                                                    <FaRupeeSign className="text-primary text-sm" />
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-xs">Total Amount</h4>
                                            </div>
                                            <p className="text-lg font-bold text-primary mb-1">₹{order.price}</p>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                order.payment_status === 'paid' 
                                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                                    : order.payment_status === 'processing'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                            }`}>
                                                {order.payment_status.toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-300 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-blue-300 p-1.5 rounded-md">
                                                    <FaCalendarAlt className="text-blue-700 text-sm" />
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-xs">Order Details</h4>
                                            </div>
                                            <p className="text-xs text-gray-700 font-bold mb-1">
                                                #{order.orderNumber}
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium">
                                                {order.trackingNumber ? `Tracking: ${order.trackingNumber}` : 'No tracking yet'}
                                            </p>
                                            {order.estimatedDelivery && (
                                                <p className="text-xs text-blue-600 font-medium">
                                                    ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>

                                        {/* Products */}
                                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-300 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-green-300 p-1.5 rounded-md">
                                                    <FaShoppingCart className="text-green-700 text-sm" />
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-xs">Products</h4>
                                            </div>
                                            <p className="text-base font-bold text-gray-900 mb-1">
                                                {order.products?.length || 0} Seller(s)
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium mb-2">
                                                {order.products?.reduce((total, sellerGroup) => 
                                                    total + (sellerGroup.products?.length || 0), 0
                                                )} Item(s) Total
                                            </p>
                                            
                                            {/* Download Final Bill Button */}
                                            {canDownloadBill(order) ? (
                                                <button
                                                    onClick={() => handleDownloadPDF(order._id, 'bill')}
                                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-2 py-1.5 rounded-md transition-all duration-300 flex items-center justify-center gap-1.5 font-medium text-xs shadow-md hover:shadow-lg transform hover:scale-105"
                                                >
                                                    <FaFilePdf className="text-xs" />
                                                    Download Final Bill
                                                </button>
                                            ) : order.adminApproval?.status === 'pending' ? (
                                                <button
                                                    disabled
                                                    className="w-full bg-gray-300 text-gray-500 px-2 py-1.5 rounded-md cursor-not-allowed flex items-center justify-center gap-1.5 font-medium text-xs"
                                                >
                                                    <FaClock className="text-xs" />
                                                    Final Bill Pending
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full bg-gray-300 text-gray-500 px-2 py-1.5 rounded-md cursor-not-allowed flex items-center justify-center gap-1.5 font-medium text-xs"
                                                >
                                                    <FaFilePdf className="text-xs" />
                                                    Final Bill Not Available
                                                </button>
                                            )}
                                        </div>

                                        {/* Shipping */}
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-300 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-blue-300 p-1.5 rounded-md">
                                                    <FaMapMarkerAlt className="text-blue-700 text-sm" />
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-xs">Shipping To</h4>
                                            </div>
                                            <p className="text-xs text-gray-700 font-bold mb-1">
                                                {order.shippingInfo?.city}, {order.shippingInfo?.state}
                                            </p>
                                            <p className="text-xs text-gray-600 font-medium">
                                                Pincode: {order.shippingInfo?.pincode}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Compact Actions */}
                                    <div className="pt-4 border-t border-gray-200">
                                        {/* Official Bill Status */}
                                        {canDownloadBill(order) ? (
                                            <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FaFilePdf className="text-primary text-lg" />
                                                        <span className="font-medium text-gray-900">Official Bill Ready</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDownloadPDF(order._id, 'bill')}
                                                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium text-sm"
                                                    >
                                                        <FaFilePdf className="text-sm" />
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        ) : order.adminApproval?.status === 'pending' ? (
                                            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FaClock className="text-yellow-600 text-lg" />
                                                        <span className="font-medium text-gray-900">Official Bill Pending</span>
                                                    </div>
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2 font-medium text-sm"
                                                    >
                                                        <FaFilePdf className="text-sm" />
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FaFilePdf className="text-gray-500 text-lg" />
                                                        <span className="font-medium text-gray-900">Official Bill Not Available</span>
                                                    </div>
                                                    <button
                                                        disabled
                                                        className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2 font-medium text-sm"
                                                    >
                                                        <FaFilePdf className="text-sm" />
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => openOrderModal(order)}
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1.5 font-medium text-xs shadow-md hover:shadow-lg"
                                            >
                                                <FaEye className="text-xs" />
                                                View Details
                                            </button>
                                            
                                            {canDownloadReceipt(order) && (
                                                <button
                                                    onClick={() => handleDownloadPDF(order._id, 'receipt')}
                                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1.5 font-medium text-xs shadow-md hover:shadow-lg"
                                                >
                                                    <FaReceipt className="text-xs" />
                                                    Download Receipt
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Enhanced Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
                        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-t-3xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                    <FaShoppingCart className="text-3xl" />
                                    Order #{selectedOrder.orderNumber}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300"
                                >
                                    <FaTimesCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Enhanced Order Status */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <FaCheckCircle className="text-primary text-2xl" />
                                    Order Status & Tracking
                                </h3>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-semibold text-gray-700">Delivery Status:</span>
                                        {getStatusBadge(selectedOrder.delivery_status)}
                                    </div>
                                    {getAdminApprovalBadge(selectedOrder.adminApproval) && (
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xl font-semibold text-gray-700">Admin Approval:</span>
                                            {getAdminApprovalBadge(selectedOrder.adminApproval)}
                                        </div>
                                    )}
                                    
                                    {/* Order Number & Tracking */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-gray-800 mb-2">Order Information</h4>
                                            <p className="text-gray-600 mb-1"><strong>Order Number:</strong> #{selectedOrder.orderNumber}</p>
                                            <p className="text-gray-600 mb-1"><strong>Order Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                                            {selectedOrder.trackingNumber && (
                                                <p className="text-gray-600 mb-1"><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                                            )}
                                            {selectedOrder.estimatedDelivery && (
                                                <p className="text-gray-600"><strong>Estimated Delivery:</strong> {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                        
                                        {selectedOrder.courierInfo && (
                                            <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-2">Courier Information</h4>
                                                {selectedOrder.courierInfo.name && (
                                                    <p className="text-gray-600 mb-1"><strong>Courier:</strong> {selectedOrder.courierInfo.name}</p>
                                                )}
                                                {selectedOrder.courierInfo.contact && (
                                                    <p className="text-gray-600 mb-1"><strong>Contact:</strong> {selectedOrder.courierInfo.contact}</p>
                                                )}
                                                {selectedOrder.courierInfo.trackingUrl && (
                                                    <a href={selectedOrder.courierInfo.trackingUrl} target="_blank" rel="noopener noreferrer" 
                                                       className="text-primary hover:text-primary-dark font-medium">
                                                        Track Package
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Tracking History */}
                                    {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 && (
                                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-gray-800 mb-4">Order Progress</h4>
                                            <div className="space-y-3">
                                                {selectedOrder.trackingHistory.map((track, index) => (
                                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="bg-primary/20 p-2 rounded-full mt-1">
                                                            <FaCheckCircle className="text-primary text-sm" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-800">{track.description}</p>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <FaClock className="text-xs" />
                                                                <span>{new Date(track.timestamp).toLocaleString()}</span>
                                                                {track.location && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <FaMapMarkerAlt className="text-xs" />
                                                                        <span>{track.location}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Products */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                        <FaShoppingCart className="text-primary text-2xl" />
                                        Products
                                    </h3>
                                    
                                    {/* Download Final Bill Button in Products Section */}
                                    {canDownloadBill(selectedOrder) ? (
                                        <button
                                            onClick={() => handleDownloadPDF(selectedOrder._id, 'bill')}
                                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            <FaFilePdf className="text-lg" />
                                            Download Final Bill
                                        </button>
                                    ) : selectedOrder.adminApproval?.status === 'pending' ? (
                                        <button
                                            disabled
                                            className="bg-gray-300 text-gray-500 px-6 py-3 rounded-xl cursor-not-allowed flex items-center gap-3 font-bold text-lg"
                                        >
                                            <FaClock className="text-lg" />
                                            Final Bill Pending
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="bg-gray-300 text-gray-500 px-6 py-3 rounded-xl cursor-not-allowed flex items-center gap-3 font-bold text-lg"
                                        >
                                            <FaFilePdf className="text-lg" />
                                            Final Bill Not Available
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    {selectedOrder.products?.map((sellerGroup, index) => (
                                        <div key={index} className="bg-gradient-to-br from-primary/5 to-primary-dark/10 rounded-2xl p-6 border border-primary/20">
                                            <h4 className="font-bold text-primary text-xl mb-4 flex items-center gap-2">
                                                <FaStore className="text-primary" />
                                                {sellerGroup.shopName}
                                            </h4>
                                            <div className="space-y-3">
                                                {sellerGroup.products?.map((item, itemIndex) => (
                                                    <div key={itemIndex} className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-lg">{item.productInfo?.name}</p>
                                                            <p className="text-gray-600 font-medium">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-bold text-primary text-xl">₹{item.productInfo?.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Customer & Shipping Information */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <FaUser className="text-primary text-2xl" />
                                    Customer & Shipping Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Customer Details */}
                                    <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-6 border border-success/20">
                                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <FaUser className="text-success" />
                                            Customer Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <FaUser className="text-success text-sm" />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{selectedOrder.shippingInfo?.name}</p>
                                                    <p className="text-sm text-gray-600">Customer Name</p>
                                                </div>
                                            </div>
                                            {selectedOrder.shippingInfo?.phone && (
                                                <div className="flex items-center gap-3">
                                                    <FaPhone className="text-success text-sm" />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{selectedOrder.shippingInfo.phone}</p>
                                                        <p className="text-sm text-gray-600">Phone Number</p>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedOrder.shippingInfo?.email && (
                                                <div className="flex items-center gap-3">
                                                    <FaEnvelope className="text-success text-sm" />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{selectedOrder.shippingInfo.email}</p>
                                                        <p className="text-sm text-gray-600">Email Address</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-gradient-to-br from-info/5 to-info/10 rounded-2xl p-6 border border-info/20">
                                        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-info" />
                                            Shipping Address
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="text-gray-800 font-medium text-lg">{selectedOrder.shippingInfo?.address}</p>
                                            <p className="text-gray-700 font-medium">{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state}</p>
                                            <p className="text-gray-600">Pincode: {selectedOrder.shippingInfo?.pincode}</p>
                                            {selectedOrder.shippingInfo?.landmark && (
                                                <p className="text-gray-600">Landmark: {selectedOrder.shippingInfo.landmark}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Order Summary */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                    <FaRupeeSign className="text-primary text-2xl" />
                                    Order Summary
                                </h3>
                                <div className="bg-gradient-to-br from-primary/5 to-primary-dark/10 rounded-2xl p-6 border border-primary/20">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-bold text-gray-700">Total Amount:</span>
                                        <span className="text-3xl font-bold text-primary">₹{selectedOrder.price}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-700">Payment Status:</span>
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                            selectedOrder.payment_status === 'paid' 
                                                ? 'bg-green-100 text-green-800' 
                                                : selectedOrder.payment_status === 'processing'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedOrder.payment_status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced PDF Downloads with Prominent Official Bill */}
                            <div className="space-y-6">
                                {/* Primary Official Bill Download Section */}
                                {canDownloadBill(selectedOrder) ? (
                                    <div className="bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-2xl p-6 border-2 border-primary/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary/20 p-4 rounded-2xl">
                                                    <FaFilePdf className="text-3xl text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Official Bill Ready</h3>
                                                    <p className="text-gray-600 font-semibold">Admin has approved your order</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadPDF(selectedOrder._id, 'bill')}
                                                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-10 py-5 rounded-xl transition-all duration-300 flex items-center gap-4 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110"
                                            >
                                                <FaFilePdf className="text-2xl" />
                                                Download Official Bill
                                            </button>
                                        </div>
                                    </div>
                                ) : selectedOrder.adminApproval?.status === 'pending' ? (
                                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-yellow-200 p-4 rounded-2xl">
                                                    <FaClock className="text-3xl text-yellow-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Official Bill Pending</h3>
                                                    <p className="text-gray-600 font-semibold">Waiting for admin approval</p>
                                                </div>
                                            </div>
                                            <button
                                                disabled
                                                className="bg-gray-300 text-gray-500 px-10 py-5 rounded-xl cursor-not-allowed flex items-center gap-4 font-bold text-xl"
                                            >
                                                <FaFilePdf className="text-2xl" />
                                                Download Official Bill
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-200 p-4 rounded-2xl">
                                                    <FaFilePdf className="text-3xl text-gray-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Official Bill Not Available</h3>
                                                    <p className="text-gray-600 font-semibold">Complete payment to request admin approval</p>
                                                </div>
                                            </div>
                                            <button
                                                disabled
                                                className="bg-gray-300 text-gray-500 px-10 py-5 rounded-xl cursor-not-allowed flex items-center gap-4 font-bold text-xl"
                                            >
                                                <FaFilePdf className="text-2xl" />
                                                Download Official Bill
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Secondary Receipt Download */}
                                {canDownloadReceipt(selectedOrder) && (
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-green-200 p-4 rounded-2xl">
                                                    <FaReceipt className="text-3xl text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Order Receipt</h3>
                                                    <p className="text-gray-600">Available after payment</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadPDF(selectedOrder._id, 'receipt')}
                                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <FaReceipt className="text-xl" />
                                                Download Receipt
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerOrderDashboard;
