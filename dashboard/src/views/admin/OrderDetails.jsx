import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { 
    FaArrowLeft, 
    FaUser, 
    FaMapMarkerAlt, 
    FaPhone, 
    FaEnvelope, 
    FaCreditCard, 
    FaTruck, 
    FaBox, 
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
    FaEdit,
    FaSave,
    FaTimes,
    FaCopy,
    FaPrint,
    FaDownload,
    FaEye,
    FaTag,
    FaRupeeSign,
    FaShoppingCart,
    FaStore,
    FaShippingFast,
    FaClipboardList,
    FaFileInvoice,
    FaQrcode,
    FaBarcode
} from 'react-icons/fa';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [tempStatus, setTempStatus] = useState('');
    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    useEffect(() => {
        setStatus(order?.delivery_status);
        setTempStatus(order?.delivery_status);
    }, [order]);

    useEffect(() => {
        dispatch(get_admin_order(orderId));
    }, [orderId, dispatch]);

    const status_update = (e) => {
        dispatch(admin_order_status_update({ orderId, info: { status: e.target.value } }));
        setStatus(e.target.value);
    };

    const handleStatusEdit = () => {
        setIsEditingStatus(true);
        setTempStatus(status);
    };

    const handleStatusSave = () => {
        dispatch(admin_order_status_update({ orderId, info: { status: tempStatus } }));
        setStatus(tempStatus);
        setIsEditingStatus(false);
        toast.success('Order status updated successfully');
    };

    const handleStatusCancel = () => {
        setTempStatus(status);
        setIsEditingStatus(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
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

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-success/20 text-success border-success/30';
            case 'pending':
                return 'bg-warning/20 text-warning border-warning/30';
            case 'failed':
                return 'bg-danger/20 text-danger border-danger/30';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/30 to-orange-100">
            {/* Enhanced Header */}
            <div className="bg-white/90 backdrop-blur-sm border-b border-white/30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link
                                to="/admin/dashboard/orders"
                                className="flex items-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-300 font-medium"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Orders
                            </Link>
                            <div className="h-8 w-px bg-primary/20"></div>
                            <div>
                                <h1 className="text-3xl font-bold text-gradient">Order Details</h1>
                                <p className="text-gray-600 text-lg">
                                    {order.orderNumber ? `Order #${order.orderNumber}` : `Order #${order._id?.substring(0, 8)}...`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => window.print()}
                                className="btn-primary flex items-center gap-2"
                            >
                                <FaPrint />
                                Print
                            </button>
                            <button className="btn-outline flex items-center gap-2">
                                <FaDownload />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Products Section - Moved to Top */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                            <div className="bg-gradient-to-r from-success to-success/80 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <FaBox className="text-2xl" />
                                    Products ({order.products?.length || 0})
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    {order.products?.map((product, index) => (
                                        <div key={index} className="flex items-center space-x-6 p-6 bg-success/5 rounded-2xl border border-success/20 hover:shadow-lg transition-all duration-300">
                                            <div className="relative">
                                                <img
                                                    src={product.images?.[0] || product.productInfo?.images?.[0] || '/images/demo.jpg'}
                                                    alt={product.name || product.productInfo?.name}
                                                    className="w-20 h-20 object-cover rounded-xl border-2 border-success/20 shadow-md"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {product.quantity || product.productQuantity || 1}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 text-lg mb-2">{product.name || product.productInfo?.name || 'Product Name'}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <p><span className="font-semibold">Brand:</span> {product.brand || product.productInfo?.brand || 'N/A'}</p>
                                                    <p><span className="font-semibold">Category:</span> {product.category || product.productInfo?.category || 'N/A'}</p>
                                                    {product.sellerId && (
                                                        <p><span className="font-semibold">Seller:</span> {product.sellerId}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 mb-1">Unit Price</p>
                                                <p className="text-xl font-bold text-primary">₹{product.price || product.productInfo?.price || 0}</p>
                                                <p className="text-sm text-gray-600 mt-2">Total: ₹{(product.price || product.productInfo?.price || 0) * (product.quantity || product.productQuantity || 1)}</p>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Sub Orders */}
                                    {order.suborder && order.suborder.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <FaStore className="text-success" />
                                                Sub Orders ({order.suborder.length})
                                            </h3>
                                            <div className="space-y-4">
                                                {order.suborder.map((subOrder, index) => (
                                                    <div key={index} className="p-6 bg-warning/5 rounded-2xl border border-warning/20">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">Sub Order #{subOrder._id?.substring(0, 8)}...</h4>
                                                                <p className="text-sm text-gray-600">Shop: {subOrder.shopName || 'Unknown Shop'}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-warning">₹{subOrder.price}</p>
                                                                <p className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                                                    subOrder.delivery_status === 'delivered' ? 'bg-success/20 text-success' :
                                                                    subOrder.delivery_status === 'processing' ? 'bg-info/20 text-info' :
                                                                    'bg-warning/20 text-warning'
                                                                }`}>
                                                                    {subOrder.delivery_status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Simplified Customer Information - Only Name and Address */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                            <div className="bg-gradient-to-r from-info to-info/80 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <FaUser className="text-2xl" />
                                    Customer Information
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <FaUser className="text-info" />
                                                Customer Name
                                            </h3>
                                            <div className="p-6 bg-info/5 rounded-xl border border-info/20">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-info/10 rounded-full">
                                                        <FaUser className="text-info text-lg" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-xl">{order.shippingInfo?.name || order.customerId?.name || 'N/A'}</p>
                                                        <p className="text-sm text-gray-600">Customer Name</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-info" />
                                                Shipping Address
                                            </h3>
                                            <div className="p-6 bg-info/5 rounded-xl border border-info/20">
                                                <div className="flex items-start space-x-4">
                                                    <div className="p-3 bg-info/10 rounded-full">
                                                        <FaMapMarkerAlt className="text-info text-lg mt-1" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-900 text-lg mb-2">{order.shippingInfo?.name || 'N/A'}</p>
                                                        <div className="text-gray-700 space-y-1">
                                                            <p>{order.shippingInfo?.address || 'Address not available'}</p>
                                                            <p>{order.shippingInfo?.city || ''}, {order.shippingInfo?.province || ''}</p>
                                                            <p>{order.shippingInfo?.area || ''}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracking History */}
                        {order.trackingHistory && order.trackingHistory.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Tracking History</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.trackingHistory.map((tracking, index) => (
                                            <div key={index} className="flex items-start space-x-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    index === order.trackingHistory.length - 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    <FaCheckCircle className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{tracking.description}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {tracking.location && `${tracking.location} • `}
                                                        {formatDate(tracking.timestamp)}
                                                    </p>
                                                    {tracking.updatedBy && (
                                                        <p className="text-xs text-gray-500">Updated by: {tracking.updatedBy}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Simplified Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaRupeeSign className="text-lg" />
                                    Order Summary
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl">
                                    <span className="text-gray-600 font-medium">Subtotal:</span>
                                    <span className="font-bold text-lg">₹{order.price}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl">
                                    <span className="text-gray-600 font-medium">Shipping:</span>
                                    <span className="font-bold">₹{order.shipping_fee || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl">
                                    <span className="text-gray-600 font-medium">Tax:</span>
                                    <span className="font-bold">₹0</span>
                                </div>
                                <div className="border-t-2 border-primary/20 pt-4">
                                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl">
                                        <span className="text-lg font-bold text-gray-800">Total:</span>
                                        <span className="text-2xl font-bold text-primary">₹{order.price + (order.shipping_fee || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Status */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                            <div className="bg-gradient-to-r from-info to-info/80 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaCheckCircle className="text-lg" />
                                    Order Status
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-info/5 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600 font-medium">Status:</span>
                                        {isEditingStatus ? (
                                            <div className="flex items-center space-x-2">
                                                <select
                                                    value={tempStatus}
                                                    onChange={(e) => setTempStatus(e.target.value)}
                                                    className="px-3 py-2 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    onClick={handleStatusSave}
                                                    className="text-success hover:text-success/80 p-2 rounded-lg hover:bg-success/10"
                                                >
                                                    <FaSave className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleStatusCancel}
                                                    className="text-danger hover:text-danger/80 p-2 rounded-lg hover:bg-danger/10"
                                                >
                                                    <FaTimes className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(status)}`}>
                                                    {status?.toUpperCase()}
                                                </span>
                                                <button
                                                    onClick={handleStatusEdit}
                                                    className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-colors"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-info/5 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Payment:</span>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getPaymentStatusColor(order.payment_status)}`}>
                                            {order.payment_status?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;