import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { track_order, clearTrackedOrder } from '../store/reducers/orderReducer';
import { useAuthState } from '../hooks/useSafeSelector';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    FaTruck, 
    FaClock, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaShoppingCart, 
    FaSearch, 
    FaMapMarkerAlt, 
    FaPhone, 
    FaEnvelope,
    FaBoxOpen,
    FaShippingFast,
    FaHome,
    FaUser,
    FaCalendarAlt,
    FaCopy,
    FaExternalLinkAlt,
    FaRupeeSign
} from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useCommission } from '../context/CommissionContext';

const TrackOrder = () => {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState('');
    const [isTracking, setIsTracking] = useState(false);
    const [productSearchTerm, setProductSearchTerm] = useState('');

    const dispatch = useDispatch();
    const { userInfo } = useAuthState();
    const { trackedOrder, loader, errorMessage } = useSelector(state => state.order);
    const { calculateCommission } = useCommission();

    // Check for orderId in URL params
    useEffect(() => {
        const urlOrderId = searchParams.get('orderId');
        if (urlOrderId) {
            setOrderId(urlOrderId);
            handleTrackOrder(urlOrderId);
        }
    }, [searchParams]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    const handleTrackOrder = async (id = orderId) => {
        if (!id.trim()) {
            toast.error('Please enter an order ID or order number');
            return;
        }

        setIsTracking(true);
        dispatch(track_order(id));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'processing': 'bg-purple-100 text-purple-800',
            'shipped': 'bg-indigo-100 text-indigo-800',
            'out_for_delivery': 'bg-orange-100 text-orange-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'returned': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'pending': <FaClock className="h-4 w-4" />,
            'confirmed': <FaCheckCircle className="h-4 w-4" />,
            'processing': <FaBoxOpen className="h-4 w-4" />,
            'shipped': <FaTruck className="h-4 w-4" />,
            'out_for_delivery': <FaShippingFast className="h-4 w-4" />,
            'delivered': <FaCheckCircle className="h-4 w-4" />,
            'cancelled': <FaTimesCircle className="h-4 w-4" />,
            'returned': <FaTruck className="h-4 w-4" />
        };
        return icons[status] || <FaClock className="h-4 w-4" />;
    };

    const getTrackingSteps = (trackingHistory) => {
        const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
        const currentStatus = getOrderData()?.status || 'pending';
        const currentIndex = allStatuses.indexOf(currentStatus);
        
        return allStatuses.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return {
                status,
                isCompleted,
                isCurrent,
                icon: getStatusIcon(status),
                title: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: getStatusDescription(status)
            };
        });
    };

    const getStatusDescription = (status) => {
        const descriptions = {
            'pending': 'Your order has been placed and is being processed',
            'confirmed': 'Your order has been confirmed and is being prepared',
            'processing': 'Your order is being processed and packed',
            'shipped': 'Your order has been shipped from our warehouse',
            'out_for_delivery': 'Your order is out for delivery',
            'delivered': 'Your order has been successfully delivered'
        };
        return descriptions[status] || 'Order status update';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Helper function to get order data from either response structure
    const getOrderData = () => {
        if (trackedOrder?.tracking) {
            return trackedOrder.tracking;
        } else if (trackedOrder?.order) {
            return {
                orderId: trackedOrder.order._id,
                orderNumber: trackedOrder.order.orderNumber,
                trackingNumber: trackedOrder.order.trackingNumber,
                status: trackedOrder.order.delivery_status,
                paymentStatus: trackedOrder.order.payment_status,
                estimatedDelivery: trackedOrder.order.estimatedDelivery,
                trackingHistory: trackedOrder.order.trackingHistory || [],
                courierInfo: trackedOrder.order.courierInfo || {},
                notes: trackedOrder.order.notes,
                customerInfo: trackedOrder.order.customerId,
                products: trackedOrder.order.products,
                shippingInfo: trackedOrder.order.shippingInfo,
                totalPrice: trackedOrder.order.price,
                createdAt: trackedOrder.order.createdAt,
                updatedAt: trackedOrder.order.updatedAt
            };
        }
        return null;
    };

    const orderData = getOrderData();

    // Filter products based on search term
    const filteredProducts = orderData?.products?.filter(product => {
        if (!productSearchTerm) return true;
        const productInfo = product.productInfo || product;
        const searchTerm = productSearchTerm.toLowerCase();
        return (
            productInfo.name?.toLowerCase().includes(searchTerm) ||
            productInfo.brand?.toLowerCase().includes(searchTerm) ||
            productInfo.category?.toLowerCase().includes(searchTerm) ||
            productInfo.description?.toLowerCase().includes(searchTerm)
        );
    }) || [];

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />
            
            {/* Hero Section */}
            <div className='bg-gradient-to-r from-primary to-primary-dark py-16'>
                <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                    <div className='text-center text-white'>
                        <h1 className='text-4xl md:text-5xl font-bold mb-6'>
                        Track Your Order
                    </h1>
                    <p className='text-xl text-white/90 max-w-3xl mx-auto'>
                            Enter your order ID or order number to get real-time updates on your shipment
                    </p>
                    </div>
                </div>
            </div>

            {/* Track Order Form */}
            <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto py-16'>
                <div className='max-w-2xl mx-auto'>
                    <div className='bg-white p-8 rounded-lg shadow-lg mb-8'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
                            Order Tracking
                        </h2>
                        
                        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter your order ID or order number"
                                className='input-field text-lg flex-1'
                                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                            />
                            <button
                                onClick={() => handleTrackOrder()}
                                disabled={loader}
                                className='btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loader ? <FadeLoader color="white" size={20} /> : (
                                    <>
                                        <FaSearch className="mr-2" />
                                        Track Order
                                    </>
                                )}
                            </button>
                        </div>

                        {userInfo && (
                            <div className='text-center'>
                                <p className='text-gray-600 mb-4'>
                                    Or view your recent orders
                                </p>
                                <button
                                    onClick={() => window.location.href = '/dashboard/my-orders'}
                                    className='text-primary hover:text-primary-dark font-medium'
                                >
                                    View My Orders
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Details */}
                    {orderData && (
                        <div className='space-y-8'>
                            {/* Order Header */}
                            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                            <div className='bg-primary text-white p-6'>
                                    <div className='flex justify-between items-center flex-wrap gap-4'>
                                    <div>
                                            <h3 className='text-2xl font-bold'>
                                                Order #{orderData.orderNumber}
                                            </h3>
                                            <p className='text-white/90'>
                                                Placed on {formatDate(orderData.createdAt)}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(orderData.status)}`}>
                                                <span>{getStatusIcon(orderData.status)}</span>
                                                <span className='font-semibold capitalize'>
                                                    {orderData.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            {orderData.estimatedDelivery && (
                                                <p className='text-white/90 text-sm mt-2 flex items-center gap-1'>
                                                    <FaCalendarAlt /> 
                                                    Est. Delivery: {formatDate(orderData.estimatedDelivery)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Info Cards */}
                                <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <FaRupeeSign className='text-primary h-5 w-5' />
                                            <h4 className='font-semibold text-gray-800'>Total Amount</h4>
                                        </div>
                                        <p className='text-2xl font-bold text-primary'>
                                            {formatPrice(orderData.totalPrice)}
                                        </p>
                                    </div>
                                    
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <FaCalendarAlt className='text-primary h-5 w-5' />
                                            <h4 className='font-semibold text-gray-800'>Estimated Delivery</h4>
                                        </div>
                                        <p className='text-lg font-semibold text-gray-700'>
                                            {formatDate(orderData.estimatedDelivery)}
                                        </p>
                                    </div>
                                    
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <FaTruck className='text-primary h-5 w-5' />
                                            <h4 className='font-semibold text-gray-800'>Tracking Number</h4>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <p className='text-lg font-semibold text-gray-700'>
                                                {orderData.trackingNumber}
                                            </p>
                                            <button
                                                onClick={() => copyToClipboard(orderData.trackingNumber)}
                                                className='text-gray-500 hover:text-primary'
                                            >
                                                <FaCopy className='h-4 w-4' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h3 className='text-xl font-bold text-gray-800 mb-6'>Order Progress</h3>
                                
                                <div className="space-y-4">
                                    {getTrackingSteps(orderData.trackingHistory).map((step, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                                step.isCompleted ? 'bg-primary' : 'bg-gray-300'
                                            }`}>
                                                {step.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-semibold ${
                                                    step.isCompleted ? 'text-gray-900' : 'text-gray-500'
                                                }`}>
                                                    {step.title}
                                                </h4>
                                                <p className={`text-sm ${
                                                    step.isCompleted ? 'text-gray-600' : 'text-gray-400'
                                                }`}>
                                                    {step.description}
                                                </p>
                                            </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Tracking History */}
                            {orderData.trackingHistory && orderData.trackingHistory.length > 0 && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h3 className='text-xl font-bold text-gray-800 mb-6'>Tracking History</h3>
                                    <div className="space-y-4">
                                        {orderData.trackingHistory
                                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                            .map((entry, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
                                                        {index < orderData.trackingHistory.length - 1 && (
                                                            <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                                                        )}
                                    </div>
                                    <div>
                                                        <p className="text-sm font-medium text-gray-800 capitalize">
                                                            {entry.status.replace(/_/g, ' ')}
                                                        </p>
                                                        <p className="text-xs text-gray-600">{entry.description}</p>
                                                        {entry.location && (
                                                            <p className="text-xs text-gray-500">Location: {entry.location}</p>
                                                        )}
                                                        <p className="text-xs text-gray-400">
                                                            {formatDate(entry.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Shipping Information */}
                            {orderData.shippingInfo && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h3 className='text-xl font-bold text-gray-800 mb-6'>Shipping Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Delivery Address</h4>
                                            <div className="text-gray-600">
                                                <p className="font-medium">{orderData.shippingInfo.name}</p>
                                                <p>{orderData.shippingInfo.address}</p>
                                                <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.area}</p>
                                                <p>{orderData.shippingInfo.province} - {orderData.shippingInfo.post}</p>
                                                <p className="mt-2 flex items-center gap-2">
                                                    <FaPhone className="h-4 w-4" />
                                                    {orderData.shippingInfo.phone}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {orderData.courierInfo && Object.keys(orderData.courierInfo).length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2">Courier Information</h4>
                                                <div className="text-gray-600">
                                                    {orderData.courierInfo.name && (
                                                        <p className="font-medium">{orderData.courierInfo.name}</p>
                                                    )}
                                                    {orderData.courierInfo.trackingUrl && (
                                                        <a 
                                                            href={orderData.courierInfo.trackingUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:text-primary-dark flex items-center gap-2 mt-2"
                                                        >
                                                            <FaExternalLinkAlt className="h-4 w-4" />
                                                            Track on Courier Website
                                                        </a>
                                                    )}
                                                    {orderData.courierInfo.contact && (
                                                        <p className="mt-2 flex items-center gap-2">
                                                            <FaPhone className="h-4 w-4" />
                                                            {orderData.courierInfo.contact}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Products in Order */}
                            {orderData.products && orderData.products.length > 0 && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className='text-xl font-bold text-gray-800'>Products in this Order</h3>
                                        <div className="text-sm text-gray-600">
                                            Showing {filteredProducts.length} of {orderData.products.length} products
                                        </div>
                                    </div>
                                    
                                    {/* Product Search */}
                                    <div className="mb-6">
                                        <input
                                            type="text"
                                            placeholder="Search products by name, brand, or category..."
                                            value={productSearchTerm}
                                            onChange={(e) => setProductSearchTerm(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {filteredProducts.map((product, index) => {
                                            const productInfo = product.productInfo || product;
                                            const productName = productInfo.name || product.name;
                                            const productPrice = productInfo.price || product.price;
                                            const productImages = productInfo.images || product.images;
                                            const productDescription = productInfo.description || product.description;
                                            const productBrand = productInfo.brand || product.brand;
                                            const productCategory = productInfo.category || product.category;
                                            
                                            return (
                                                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start gap-6">
                                                        {/* Product Image */}
                                                        <div className="flex-shrink-0">
                                                            <img 
                                                                src={productImages?.[0] || '/images/demo.jpg'} 
                                                                alt={productName} 
                                                                className="w-32 h-32 object-cover rounded-lg border border-gray-200" 
                                                            />
                                                        </div>
                                                        
                                                        {/* Product Details */}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-800 mb-1">
                                                                        {productName}
                                                                    </h4>
                                                                    {productBrand && (
                                                                        <p className="text-sm text-gray-600 mb-2">
                                                                            Brand: <span className="font-medium">{productBrand}</span>
                                                                        </p>
                                                                    )}
                                                                    {productCategory && (
                                                                        <p className="text-sm text-gray-600 mb-2">
                                                                            Category: <span className="font-medium">{productCategory}</span>
                                                                        </p>
                                                )}
                                            </div>
                                                                <div className="text-right">
                                                                    <p className="text-xl font-bold text-primary">
                                                                        ₹{productPrice}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600">
                                                                        Qty: {product.quantity}
                                                                    </p>
                                                                    <p className="text-sm font-semibold text-gray-800">
                                                                        Total: ₹{productPrice * product.quantity}
                                                </p>
                                            </div>
                                                            </div>
                                                            
                                                            {/* Product Description */}
                                                            {productDescription && (
                                                                <div className="mb-4">
                                                                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Description:</h5>
                                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                                        {productDescription}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Product Specifications */}
                                                            {productInfo.specifications && (
                                                                <div className="mb-4">
                                                                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Specifications:</h5>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {Object.entries(productInfo.specifications).map(([key, value]) => (
                                                                            <div key={key} className="flex justify-between text-sm">
                                                                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                                                <span className="font-medium text-gray-800">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                                                            )}
                                                            
                                                            {/* Additional Product Images */}
                                                            {productImages && productImages.length > 1 && (
                                                                <div className="mb-4">
                                                                    <h5 className="text-sm font-semibold text-gray-700 mb-2">More Images:</h5>
                                                                    <div className="flex gap-2">
                                                                        {productImages.slice(1, 4).map((image, imgIndex) => (
                                                                            <img 
                                                                                key={imgIndex}
                                                                                src={image} 
                                                                                alt={`${productName} ${imgIndex + 2}`}
                                                                                className="w-16 h-16 object-cover rounded border border-gray-200"
                                                                            />
                                                                        ))}
                                                                        {productImages.length > 4 && (
                                                                            <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                                                                <span className="text-xs text-gray-600">+{productImages.length - 4}</span>
                        </div>
                    )}
                </div>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Product Status */}
                                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-600">Status:</span>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                        orderData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                        orderData.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                        orderData.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {orderData.status.replace(/_/g, ' ')}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Item #{index + 1} of {orderData.products.length}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                </div>
                                            );
                                        })}
                                        
                                        {/* No products found message */}
                                        {filteredProducts.length === 0 && productSearchTerm && (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                                                <h4 className="text-lg font-medium text-gray-600 mb-2">No products found</h4>
                                                <p className="text-gray-500 mb-4">
                                                    No products match your search for "{productSearchTerm}"
                                                </p>
                                                <button
                                                    onClick={() => setProductSearchTerm('')}
                                                    className="text-primary hover:text-primary-dark font-medium"
                                                >
                                                    Clear search
                                                </button>
                                            </div>
                                        )}
                            </div>
                            
                                    {/* Order Summary */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Total Items:</span>
                                                    <span className="font-medium">{orderData.products.length}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Total Quantity:</span>
                                                    <span className="font-medium">
                                                        {orderData.products.reduce((sum, product) => sum + product.quantity, 0)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-lg font-semibold">
                                                    <span className="text-gray-800">Order Total:</span>
                                                    <span className="text-primary">₹{orderData.totalPrice}</span>
                                                </div>
                                            </div>
                                </div>
                            </div>
                                </div>
                            )}
                            </div>
                    )}

                    {/* No Order Found */}
                    {!loader && !orderData && orderId && (
                        <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Order Not Found</h3>
                            <p className="text-gray-600 mb-4">
                                We couldn't find an order with that ID or number. Please check your order details and try again.
                            </p>
                            <button
                                onClick={() => {
                                    setOrderId('');
                                    dispatch(clearTrackedOrder());
                                }}
                                className="text-primary hover:text-primary-dark font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TrackOrder;