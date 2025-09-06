import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { track_order, clearTrackedOrder } from '../store/reducers/orderReducer';
import { useAuthState } from '../hooks/useSafeSelector';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaTruck, FaClock, FaCheckCircle, FaTimesCircle, FaShoppingCart, FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const TrackOrder = () => {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState('');
    const [isTracking, setIsTracking] = useState(false);

    const dispatch = useDispatch();
    const { userInfo } = useAuthState();
    const { trackedOrder, loader, errorMessage } = useSelector(state => state.order);

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
            toast.error('Please enter an order ID');
            return;
        }

        setIsTracking(true);
        dispatch(track_order(id));
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '⏳';
            case 'processing':
                return '🔄';
            case 'shipped':
                return '🚚';
            case 'delivered':
                return '✅';
            case 'cancelled':
                return '❌';
            default:
                return '📦';
        }
    };

    const getStatusStep = (status) => {
        const steps = [
            { name: 'Order Placed', status: 'completed' },
            { name: 'Processing', status: status === 'pending' ? 'current' : status === 'processing' || status === 'shipped' || status === 'delivered' ? 'completed' : 'pending' },
            { name: 'Shipped', status: status === 'shipped' ? 'current' : status === 'delivered' ? 'completed' : 'pending' },
            { name: 'Delivered', status: status === 'delivered' ? 'completed' : 'pending' }
        ];
        return steps;
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />
            
            {/* Hero Section */}
            <div className='bg-gradient-to-r from-primary to-primary-dark py-16'>
                <div className='w-[85%] mx-auto text-center'>
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                        Track Your Order
                    </h1>
                    <p className='text-xl text-white/90 max-w-3xl mx-auto'>
                        Enter your order ID to get real-time updates on your shipment
                    </p>
                </div>
            </div>

            {/* Track Order Form */}
            <div className='w-[85%] mx-auto py-16'>
                <div className='max-w-2xl mx-auto'>
                    <div className='bg-white p-8 rounded-lg shadow-lg mb-8'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
                            Order Tracking
                        </h2>
                        
                        <div className='flex gap-4 mb-6'>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter your order ID"
                                className='input-field text-lg'
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
                                <p className='text-gray-600 mb-2'>
                                    Logged in as: <span className='font-semibold'>{userInfo.name}</span>
                                </p>
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className='text-primary hover:text-primary-dark font-medium'
                                >
                                    View all your orders in dashboard
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Details */}
                    {trackedOrder && (
                        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                            {/* Order Header */}
                            <div className='bg-primary text-white p-6'>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <h3 className='text-2xl font-bold'>Order #{trackedOrder._id}</h3>
                                        <p className='text-white/90'>Placed on {trackedOrder.date}</p>
                                    </div>
                                    <div className='text-right'>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(trackedOrder.delivery_status)}`}>
                                            <span>{getStatusIcon(trackedOrder.delivery_status)}</span>
                                            <span className='font-semibold capitalize'>{trackedOrder.delivery_status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Progress */}
                            <div className='p-6 border-b border-gray-200'>
                                <h4 className='text-lg font-bold text-gray-800 mb-4'>Order Progress</h4>
                                <div className='relative'>
                                    <div className='flex items-center justify-between'>
                                        {getStatusStep(trackedOrder.delivery_status).map((step, index) => (
                                            <div key={index} className='flex flex-col items-center'>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    step.status === 'completed' ? 'bg-green-500 text-white' :
                                                    step.status === 'current' ? 'bg-blue-500 text-white' :
                                                    'bg-gray-300 text-gray-600'
                                                }`}>
                                                    {step.status === 'completed' ? '✓' : index + 1}
                                                </div>
                                                <p className={`text-xs mt-2 text-center ${
                                                    step.status === 'completed' ? 'text-green-600' :
                                                    step.status === 'current' ? 'text-blue-600' :
                                                    'text-gray-500'
                                                }`}>
                                                    {step.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='absolute top-4 left-4 right-4 h-0.5 bg-gray-300 -z-10'></div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className='p-6 border-b border-gray-200'>
                                <h4 className='text-lg font-bold text-gray-800 mb-4'>Order Summary</h4>
                                <div className='grid md:grid-cols-2 gap-6'>
                                    <div>
                                        <h5 className='font-semibold text-gray-700 mb-2'>Payment Status</h5>
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                                            trackedOrder.payment_status === 'paid' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {trackedOrder.payment_status === 'paid' ? '✅ Paid' : '❌ Unpaid'}
                                        </span>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold text-gray-700 mb-2'>Total Amount</h5>
                                        <p className='text-2xl font-bold text-primary'>${trackedOrder.price}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            {trackedOrder.shippingInfo && (
                                <div className='p-6 border-b border-gray-200'>
                                    <h4 className='text-lg font-bold text-gray-800 mb-4'>Shipping Information</h4>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <div className='flex items-start gap-3'>
                                            <FaMapMarkerAlt className='text-primary mt-1' />
                                            <div>
                                                <p className='font-semibold'>{trackedOrder.shippingInfo.name}</p>
                                                <p>{trackedOrder.shippingInfo.address}</p>
                                                <p>{trackedOrder.shippingInfo.city}, {trackedOrder.shippingInfo.state} {trackedOrder.shippingInfo.zipCode}</p>
                                                <p className='flex items-center gap-2 mt-2'>
                                                    <FaPhone className='text-gray-500' />
                                                    {trackedOrder.shippingInfo.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Products */}
                            <div className='p-6'>
                                <h4 className='text-lg font-bold text-gray-800 mb-4'>Products Ordered</h4>
                                <div className='space-y-4'>
                                    {trackedOrder.products?.map((product, index) => (
                                        <div key={index} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                                            <div className='w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center'>
                                                {product.images && product.images[0] ? (
                                                    <img 
                                                        src={product.images[0]} 
                                                        alt={product.name}
                                                        className='w-full h-full object-cover rounded-lg'
                                                    />
                                                ) : (
                                                    <span className='text-gray-400 text-xs'>No Image</span>
                                                )}
                                            </div>
                                            <div className='flex-1'>
                                                <h5 className='font-semibold text-gray-800'>{product.name}</h5>
                                                <p className='text-sm text-gray-600'>Category: {product.category}</p>
                                                <p className='text-sm text-gray-600'>Brand: {product.brand}</p>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-semibold text-gray-800'>Qty: {product.quantity}</p>
                                                <p className='text-primary font-bold'>
                                                    ${product.price - Math.floor((product.price * product.discount) / 100)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className='max-w-4xl mx-auto mt-16'>
                    <div className='bg-white p-8 rounded-lg shadow-lg'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
                            Need Help Tracking Your Order?
                        </h2>
                        
                        <div className='grid md:grid-cols-3 gap-8'>
                            <div className='text-center'>
                                <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <FaEnvelope className='text-white text-2xl' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800 mb-2'>Email Support</h3>
                                <p className='text-gray-600 mb-2'>support@buildbasket.com</p>
                                <p className='text-sm text-gray-500'>We'll respond within 24 hours</p>
                            </div>
                            
                            <div className='text-center'>
                                <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <FaPhone className='text-white text-2xl' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800 mb-2'>Phone Support</h3>
                                <p className='text-gray-600 mb-2'>+(123) 3243 343</p>
                                <p className='text-sm text-gray-500'>Mon-Fri 9AM-6PM</p>
                            </div>
                            
                            <div className='text-center'>
                                <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <FaTruck className='text-white text-2xl' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800 mb-2'>Live Chat</h3>
                                <p className='text-gray-600 mb-2'>Available 24/7</p>
                                <p className='text-sm text-gray-500'>Get instant help</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TrackOrder;
