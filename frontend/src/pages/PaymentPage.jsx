import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    FaCreditCard, 
    FaFilePdf, 
    FaCheckCircle, 
    FaClock, 
    FaDownload,
    FaRupeeSign,
    FaBox,
    FaUser,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaStore,
    FaReceipt
} from 'react-icons/fa';
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/api';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('pending');
    const [orderDetails, setOrderDetails] = useState(null);
    
    // Get order data from location state
    const { price, products, shipping_fee, items, shippingInfo, userId, orderId } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            toast.error('No order data found. Please try again.');
            navigate('/');
            return;
        }

        // Fetch order details if orderId exists
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId, location.state, navigate]);

    const fetchOrderDetails = async (currentOrderId = orderId) => {
        try {
            if (!currentOrderId) {
                console.log('No order ID available for fetching details');
                return;
            }
            const response = await api.get(`/home/order/get-order/${currentOrderId}`);
            if (response.data.success) {
                setOrderDetails(response.data.order);
                setOrderStatus(response.data.order.delivery_status || 'pending');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Create order first if it doesn't exist
            let currentOrderId = orderId;
            if (!currentOrderId) {
                const orderResponse = await api.post('/home/order/place-order', {
                    price,
                    products,
                    shipping_fee,
                    items,
                    shippingInfo,
                    userId
                });
                
                if (orderResponse.data.success) {
                    currentOrderId = orderResponse.data.orderId;
                    setOrderDetails(orderResponse.data);
                }
            }

            // Process payment
            const paymentResponse = await api.post('/home/order/process-payment', {
                orderId: currentOrderId,
                amount: price + shipping_fee,
                paymentMethod: 'online'
            });

            if (paymentResponse.data.success) {
                toast.success('Payment processed successfully!');
                setOrderStatus('processing');
                
                // Update order status
                await api.put(`/home/order/update-status/${currentOrderId}`, {
                    status: 'processing',
                    payment_status: 'paid'
                });

                // Refresh order details
                fetchOrderDetails();
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoPayment = async () => {
        setLoading(true);
        try {
            console.log('🧪 TEST: Creating order and confirming payment...');
            
            // Show confirmation message
            toast.loading('🧪 Creating order and confirming payment...', { duration: 2000 });
            
            // First, create the order if it doesn't exist
            let currentOrderId = orderId;
            
            if (!currentOrderId) {
                console.log('📝 Creating new order...');
                const orderData = {
                    price,
                    shipping_fee,
                    products,
                    shippingInfo,
                    userId,
                    payment_method: 'online',
                    payment_status: 'pending'
                };
                
                const orderResponse = await api.post('/home/order/place-order', orderData);
                currentOrderId = orderResponse.data.orderId;
                console.log('✅ Order created:', currentOrderId);
            }
            
            // Simulate payment confirmation delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Now confirm the payment
            console.log('💳 Confirming payment for order:', currentOrderId);
            const paymentResponse = await api.post('/home/order/process-payment', {
                orderId: currentOrderId,
                paymentMethod: 'online',
                paymentStatus: 'paid',
                paymentReference: `TEST-${Date.now()}`
            });
            
            console.log('✅ Payment confirmed:', paymentResponse.data);
            
            // Fetch updated order details
            await fetchOrderDetails(currentOrderId);
            
            // Show success confirmation
            toast.success('✅ Payment confirmed! Order created and payment processed successfully.', { 
                duration: 5000,
                style: {
                    background: '#10B981',
                    color: 'white',
                    fontSize: '16px',
                    padding: '16px'
                }
            });

            // Update UI to show payment is confirmed
            setOrderStatus('processing');
            
            console.log('✅ Payment confirmation test completed successfully');

        } catch (error) {
            console.error('🧪 Payment confirmation test error:', error);
            
            toast.error('🧪 Payment confirmation failed: ' + (error.response?.data?.message || error.message), {
                duration: 5000,
                style: {
                    background: '#DC2626',
                    color: 'white',
                    fontSize: '16px',
                    padding: '16px'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePDF = async (type = 'receipt') => {
        const currentOrderId = orderDetails?._id || orderId;
        
        if (!currentOrderId) {
            toast.error('No order found to generate PDF. Please confirm payment first.');
            return;
        }

        try {
            const response = await api.get(`/home/order/generate-pdf/${currentOrderId}/${type}`, {
                responseType: 'blob'
            });

            // Create blob and download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type === 'receipt' ? 'Order-Receipt' : 'Order-Bill'}-${currentOrderId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`${type === 'receipt' ? 'Order Receipt' : 'Official Bill'} downloaded successfully!`);
        } catch (error) {
            console.error('PDF generation error:', error);
            if (error.response?.status === 403) {
                if (type === 'bill') {
                    toast.error('Official Bill can only be generated after admin approval');
                } else {
                    toast.error('Order Receipt can only be generated after payment confirmation');
                }
            } else {
                toast.error(`Failed to generate ${type === 'bill' ? 'Official Bill' : 'Order Receipt'}. Please try again.`);
            }
        }
    };

    const canGenerateBill = orderDetails?.adminApproval?.status === 'approved';
    const canGenerateReceipt = orderStatus === 'processing' || orderStatus === 'delivered' || orderStatus === 'confirmed';

    return (
        <div>
            <Header />
            
            {/* Banner Section */}
            <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
                <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                    <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                        <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                            <h2 className='text-3xl font-bold'>Payment & Order Confirmation</h2>
                            <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                                <Link to='/'>Home</Link>
                                <span className='pt-1'><IoIosArrowForward /></span>
                                <span>Payment</span>
                            </div>
                        </div> 
                    </div> 
                </div> 
            </section>

            <section className='bg-gradient-to-br from-orange-50 via-orange-50/30 to-orange-100 min-h-screen py-16'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        
                        {/* Main Payment Section */}
                        <div className='lg:col-span-2 space-y-6'>
                            
                            {/* Payment Options */}
                            <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden'>
                                <div className='bg-gradient-to-r from-primary to-primary-dark px-8 py-6'>
                                    <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                                        <FaCreditCard className='text-2xl' />
                                        Payment Options
                                    </h2>
                                </div>
                                <div className='p-8'>
                                    <div className='space-y-6'>
                                        {/* Automatic Payment - Main Option */}
                                        <div className='p-8 bg-gradient-to-r from-success/10 to-success/20 rounded-3xl border-2 border-success/30 shadow-2xl'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-6'>
                                                    <div className='p-6 bg-success/20 rounded-2xl shadow-lg'>
                                                        <FaCheckCircle className='text-success text-4xl' />
                                                    </div>
                                                    <div>
                                                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>🧪 Confirm Payment</h3>
                                                    <p className='text-gray-600 text-lg'>Create order and confirm payment (Test Mode)</p>
                                                    <p className='text-sm text-success font-semibold mt-1'>✓ Creates real order and enables PDF downloads</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleAutoPayment}
                                                    disabled={loading}
                                                    className='bg-gradient-to-r from-success to-success/80 hover:from-success/80 hover:to-success text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg'
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                                                            Confirming...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCheckCircle className='text-xl' />
                                                            CONFIRM PAYMENT
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Manual Online Payment */}
                                        <div className='p-6 bg-primary/5 rounded-2xl border border-primary/20'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='p-4 bg-primary/10 rounded-full'>
                                                        <FaCreditCard className='text-primary text-2xl' />
                                                    </div>
                                                    <div>
                                                        <h3 className='text-xl font-bold text-gray-900'>Manual Online Payment</h3>
                                                        <p className='text-gray-600'>Pay securely with your credit/debit card</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={loading}
                                                    className='btn-primary px-8 py-3 flex items-center gap-2'
                                                >
                                                    {loading ? (
                                                        <>
                                                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCreditCard />
                                                            Pay Now
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Cash on Delivery */}
                                        <div className='p-6 bg-warning/5 rounded-2xl border border-warning/20'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='p-4 bg-warning/10 rounded-full'>
                                                        <FaClock className='text-warning text-2xl' />
                                                    </div>
                                                    <div>
                                                        <h3 className='text-xl font-bold text-gray-900'>Cash on Delivery</h3>
                                                        <p className='text-gray-600'>Pay when your order is delivered</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        toast.info('COD option will be available soon!');
                                                    }}
                                                    disabled={true}
                                                    className='px-8 py-3 flex items-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed rounded-xl'
                                                >
                                                    <FaClock />
                                                    Coming Soon
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden'>
                                <div className='bg-gradient-to-r from-success to-success/80 px-8 py-6'>
                                    <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                                        <FaBox className='text-2xl' />
                                        Order Summary
                                    </h2>
                                </div>
                                <div className='p-8'>
                                    <div className='space-y-4'>
                                        {products?.map((product, index) => (
                                            <div key={index} className='flex items-center space-x-4 p-4 bg-success/5 rounded-xl border border-success/20'>
                                                <img
                                                    src={product.products?.[0]?.productInfo?.images?.[0] || '/images/demo.jpg'}
                                                    alt="Product"
                                                    className='w-16 h-16 object-cover rounded-lg'
                                                />
                                                <div className='flex-1'>
                                                    <h4 className='font-semibold text-gray-900'>{product.products?.[0]?.productInfo?.name}</h4>
                                                    <p className='text-sm text-gray-600'>Shop: {product.shopName}</p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='font-bold text-primary'>₹{product.products?.[0]?.productInfo?.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className='space-y-6'>
                            
                            {/* Order Status */}
                            <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden'>
                                <div className='bg-gradient-to-r from-info to-info/80 px-6 py-4'>
                                    <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                                        <FaCheckCircle className='text-lg' />
                                        Order Status
                                    </h2>
                                </div>
                                <div className='p-6 space-y-4'>
                                    <div className='flex items-center justify-between p-4 bg-info/5 rounded-xl'>
                                        <span className='text-gray-600 font-medium'>Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            orderStatus === 'delivered' ? 'bg-success/20 text-success' :
                                            orderStatus === 'processing' ? 'bg-info/20 text-info' :
                                            orderStatus === 'shipped' ? 'bg-primary/20 text-primary' :
                                            'bg-warning/20 text-warning'
                                        }`}>
                                            {orderStatus?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className='flex items-center justify-between p-4 bg-info/5 rounded-xl'>
                                        <span className='text-gray-600 font-medium'>Payment:</span>
                                        <span className='px-3 py-1 rounded-full text-sm font-semibold bg-success/20 text-success'>
                                            PENDING
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden'>
                                <div className='bg-gradient-to-r from-primary to-primary-dark px-6 py-4'>
                                    <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                                        <FaRupeeSign className='text-lg' />
                                        Payment Summary
                                    </h2>
                                </div>
                                <div className='p-6 space-y-4'>
                                    <div className='flex justify-between items-center p-3 bg-primary/5 rounded-xl'>
                                        <span className='text-gray-600 font-medium'>Subtotal:</span>
                                        <span className='font-bold text-lg'>₹{price}</span>
                                    </div>
                                    <div className='flex justify-between items-center p-3 bg-primary/5 rounded-xl'>
                                        <span className='text-gray-600 font-medium'>Shipping:</span>
                                        <span className='font-bold'>₹{shipping_fee || 0}</span>
                                    </div>
                                    <div className='border-t-2 border-primary/20 pt-4'>
                                        <div className='flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl'>
                                            <span className='text-lg font-bold text-gray-800'>Total:</span>
                                            <span className='text-2xl font-bold text-primary'>₹{price + (shipping_fee || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden'>
                                <div className='bg-gradient-to-r from-success to-success/80 px-6 py-4'>
                                    <h2 className='text-xl font-bold text-white flex items-center gap-2'>
                                        <FaUser className='text-lg' />
                                        Customer Info
                                    </h2>
                                </div>
                                <div className='p-6 space-y-4'>
                                    <div className='flex items-center gap-3 p-3 bg-success/5 rounded-xl'>
                                        <FaUser className='text-success' />
                                        <div>
                                            <p className='font-semibold text-gray-900'>{shippingInfo?.name}</p>
                                            <p className='text-sm text-gray-600'>Customer Name</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3 p-3 bg-success/5 rounded-xl'>
                                        <FaPhone className='text-success' />
                                        <div>
                                            <p className='font-semibold text-gray-900'>{shippingInfo?.phone}</p>
                                            <p className='text-sm text-gray-600'>Phone Number</p>
                                        </div>
                                    </div>
                                    <div className='flex items-start gap-3 p-3 bg-success/5 rounded-xl'>
                                        <FaMapMarkerAlt className='text-success mt-1' />
                                        <div>
                                            <p className='font-semibold text-gray-900'>{shippingInfo?.address}</p>
                                            <p className='text-sm text-gray-600'>{shippingInfo?.city}, {shippingInfo?.province}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PDF Generation Section */}
                    <div className='mt-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden'>
                        <div className='bg-gradient-to-r from-warning to-warning/80 px-8 py-6'>
                            <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                                <FaFilePdf className='text-2xl' />
                                Download Documents
                            </h2>
                        </div>
                        <div className='p-8'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                {/* Order Receipt */}
                                <div className={`p-8 rounded-3xl border-2 shadow-xl transition-all duration-500 ${
                                    canGenerateReceipt 
                                        ? 'bg-gradient-to-br from-success/10 to-success/20 border-success/30' 
                                        : 'bg-gray-100 border-gray-200'
                                }`}>
                                    <div className='flex flex-col gap-6'>
                                        <div className='flex items-center gap-6'>
                                            <div className={`p-6 rounded-2xl shadow-lg ${
                                                canGenerateReceipt ? 'bg-success/20' : 'bg-gray-200'
                                            }`}>
                                                <FaReceipt className={`text-4xl ${
                                                    canGenerateReceipt ? 'text-success' : 'text-gray-400'
                                                }`} />
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='text-2xl font-bold text-gray-900 mb-2'>📄 Order Receipt</h3>
                                                <p className='text-gray-600 text-lg'>
                                                    {canGenerateReceipt 
                                                        ? '✅ Available for download' 
                                                        : '⏳ Will be available after payment confirmation'
                                                    }
                                                </p>
                                                {canGenerateReceipt && (
                                                    <p className='text-sm text-success font-semibold mt-2 flex items-center gap-2'>
                                                        🎉 Payment confirmed! Download your order receipt now.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleGeneratePDF('receipt')}
                                            disabled={!canGenerateReceipt}
                                            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                                                canGenerateReceipt 
                                                    ? 'bg-gradient-to-r from-success to-success/80 hover:from-success/80 hover:to-success text-white shadow-xl hover:shadow-2xl transform hover:scale-105' 
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            <FaDownload className='text-xl' />
                                            {canGenerateReceipt ? 'Download Order Receipt' : 'Confirm Payment First'}
                                        </button>
                                    </div>
                                </div>

                                {/* Official Bill */}
                                <div className={`p-8 rounded-3xl border-2 shadow-xl transition-all duration-500 ${
                                    canGenerateBill 
                                        ? 'bg-gradient-to-br from-warning/10 to-warning/20 border-warning/30' 
                                        : 'bg-gray-100 border-gray-200'
                                }`}>
                                    <div className='flex flex-col gap-6'>
                                        <div className='flex items-center gap-6'>
                                            <div className={`p-6 rounded-2xl shadow-lg ${
                                                canGenerateBill ? 'bg-warning/20' : 'bg-gray-200'
                                            }`}>
                                                <FaFilePdf className={`text-4xl ${
                                                    canGenerateBill ? 'text-warning' : 'text-gray-400'
                                                }`} />
                                            </div>
                                            <div className='flex-1'>
                                                <h3 className='text-2xl font-bold text-gray-900 mb-2'>📋 Official Bill</h3>
                                                <p className='text-gray-600 text-lg'>
                                                    {canGenerateBill 
                                                        ? '✅ Available for download' 
                                                        : '⏳ Pending admin approval'
                                                    }
                                                </p>
                                                {canGenerateBill ? (
                                                    <p className='text-sm text-warning font-semibold mt-2 flex items-center gap-2'>
                                                        🎉 Admin approved! Download your official bill.
                                                    </p>
                                                ) : (
                                                    <p className='text-sm text-gray-500 font-semibold mt-2 flex items-center gap-2'>
                                                        🔍 Admin will review and approve your order for official billing
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleGeneratePDF('bill')}
                                            disabled={!canGenerateBill}
                                            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                                                canGenerateBill 
                                                    ? 'bg-gradient-to-r from-warning to-warning/80 hover:from-warning/80 hover:to-warning text-white shadow-xl hover:shadow-2xl transform hover:scale-105' 
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            <FaDownload className='text-xl' />
                                            {canGenerateBill ? 'Download Official Bill' : 'Pending Admin Approval'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PaymentPage;
