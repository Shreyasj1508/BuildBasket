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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admin/dashboard/orders"
                                className="flex items-center text-gray-600 hover:text-primary transition-colors"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Orders
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                                <p className="text-gray-600">
                                    {order.orderNumber ? `Order #${order.orderNumber}` : `Order #${order._id?.substring(0, 8)}...`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FaPrint className="mr-2" />
                                Print
                            </button>
                            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                                <FaDownload className="mr-2" />
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
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Order ID:</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-mono text-sm">{order._id}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(order._id)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaCopy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            {order.orderNumber && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Order Number:</span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-primary">{order.orderNumber}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(order.orderNumber)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <FaCopy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {order.trackingNumber && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tracking Number:</span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-semibold text-blue-600">{order.trackingNumber}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(order.trackingNumber)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <FaCopy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Order Date:</span>
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                            {order.estimatedDelivery && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Est. Delivery:</span>
                                                    <span>{formatDate(order.estimatedDelivery)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Status Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Order Status:</span>
                                                {isEditingStatus ? (
                                                    <div className="flex items-center space-x-2">
                                                        <select
                                                            value={tempStatus}
                                                            onChange={(e) => setTempStatus(e.target.value)}
                                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <button
                                                            onClick={handleStatusSave}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            <FaSave className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={handleStatusCancel}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTimes className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                                            {status}
                                                        </span>
                                                        <button
                                                            onClick={handleStatusEdit}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <FaEdit className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Status:</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment_status)}`}>
                                                    {order.payment_status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Amount:</span>
                                                <span className="text-lg font-semibold text-primary">₹{order.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <FaUser className="text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.shippingInfo?.name}</p>
                                                    <p className="text-sm text-gray-600">Customer Name</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <FaEnvelope className="text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.shippingInfo?.email}</p>
                                                    <p className="text-sm text-gray-600">Email Address</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <FaPhone className="text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.shippingInfo?.phone}</p>
                                                    <p className="text-sm text-gray-600">Phone Number</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-3">Shipping Address</h3>
                                        <div className="flex items-start space-x-3">
                                            <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="font-medium text-gray-900">{order.shippingInfo?.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.shippingInfo?.address}<br />
                                                    {order.shippingInfo?.city}, {order.shippingInfo?.province}<br />
                                                    {order.shippingInfo?.area}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Products ({order.products?.length || 0})</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.products?.map((product, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                            <img
                                                src={product.images?.[0] || '/images/demo.jpg'}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                <p className="text-sm text-gray-600">Brand: {product.brand}</p>
                                                <p className="text-sm text-gray-600">Category: {product.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">Quantity: {product.quantity}</p>
                                                <p className="text-sm text-gray-600">₹{product.price}</p>
                                            </div>
                                        </div>
                                    ))}
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

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Order Actions</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                    <FaEdit className="mr-2" />
                                    Update Status
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    <FaTruck className="mr-2" />
                                    Track Shipment
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    <FaFileInvoice className="mr-2" />
                                    Generate Invoice
                                </button>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">₹{order.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-medium">₹{order.shipping_fee || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium">₹0</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total:</span>
                                        <span className="text-primary">₹{order.price + (order.shipping_fee || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Quick Info</h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FaShoppingCart className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{order.products?.length || 0} Items</p>
                                        <p className="text-xs text-gray-600">Total Products</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaStore className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{order.suborder?.length || 1} Seller(s)</p>
                                        <p className="text-xs text-gray-600">Different Sellers</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaShippingFast className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{order.delivery_status}</p>
                                        <p className="text-xs text-gray-600">Current Status</p>
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