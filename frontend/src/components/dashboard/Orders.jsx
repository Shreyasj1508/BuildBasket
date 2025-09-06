import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get_orders } from '../../store/reducers/orderReducer';
import { FaShoppingBag, FaEye, FaCreditCard, FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaBox } from 'react-icons/fa';

const Orders = () => {
    const [state, setState] = useState('all')

    const navigate = useNavigate()
    const dispatch = useDispatch() 
    const {userInfo} = useSelector(state => state.auth)
    const { myOrders } = useSelector(state => state.order)


    useEffect(() => {
        if (userInfo && userInfo.id) {
            dispatch(get_orders({status:state, customerId:userInfo.id}))
        }
    },[state, userInfo])

    const redirect = (ord) => {
        let items = 0;
        if (ord.products && ord.products.length > 0) {
            for (let i = 0; i < ord.products.length; i++) {
                items = ord.products[i].quantity + items; 
            }
        }
        navigate('/payment',{
            state: {
                price: ord.price,
                items,
                orderId: ord._id 
            }
        }) 
    }


    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <FaCheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <FaTimesCircle className="w-4 h-4" />;
            case 'pending':
                return <FaClock className="w-4 h-4" />;
            case 'warehouse':
                return <FaBox className="w-4 h-4" />;
            default:
                return <FaTruck className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'warehouse':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'unpaid':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-amber-100 text-amber-800 border-amber-200';
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6'>
            {/* Header Section */}
            <div className='mb-8'>
                <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
                    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg'>
                                <FaShoppingBag className='w-8 h-8 text-white' />
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Orders</h1>
                                <p className='text-gray-600 text-lg'>Track and manage your order history</p>
                            </div>
                        </div>
                        
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                            <div className='flex items-center gap-3'>
                                <span className='text-sm font-semibold text-gray-700'>Filter by status:</span>
                                <select 
                                    className='outline-none px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 bg-white shadow-sm hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium' 
                                    value={state} 
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <option value="all">All Orders</option>
                                    <option value="placed">Placed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="warehouse">Warehouse</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            {myOrders && myOrders.length > 0 ? (
                <div className='space-y-6'>
                    {myOrders.map((order, index) => (
                        <div key={order._id} className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'>
                            {/* Order Header */}
                            <div className='bg-gradient-to-r from-primary to-primary-dark p-6'>
                                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
                                            <span className='text-white font-bold text-lg'>#{index + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-white'>Order #{order._id.slice(-8)}</h3>
                                            <p className='text-white/80 text-sm'>Order ID: {order._id}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <div className='text-2xl font-bold text-white'>${order.price}</div>
                                        <p className='text-white/80 text-sm'>Total Amount</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className='p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                                    {/* Payment Status */}
                                    <div className='bg-gray-50 rounded-xl p-4'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <FaCreditCard className='w-5 h-5 text-gray-600' />
                                            <span className='font-semibold text-gray-700'>Payment Status</span>
                                        </div>
                                        <span className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border ${getPaymentStatusColor(order.payment_status)}`}>
                                            {order.payment_status === 'paid' ? <FaCheckCircle className="w-4 h-4" /> : <FaClock className="w-4 h-4" />}
                                            {order.payment_status}
                                        </span>
                                    </div>

                                    {/* Delivery Status */}
                                    <div className='bg-gray-50 rounded-xl p-4'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <FaTruck className='w-5 h-5 text-gray-600' />
                                            <span className='font-semibold text-gray-700'>Delivery Status</span>
                                        </div>
                                        <span className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border ${getStatusColor(order.delivery_status)}`}>
                                            {getStatusIcon(order.delivery_status)}
                                            {order.delivery_status}
                                        </span>
                                    </div>

                                    {/* Order Date */}
                                    <div className='bg-gray-50 rounded-xl p-4'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <FaClock className='w-5 h-5 text-gray-600' />
                                            <span className='font-semibold text-gray-700'>Order Date</span>
                                        </div>
                                        <p className='text-sm text-gray-600'>
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col sm:flex-row gap-3'>
                                    <Link to={`/dashboard/order/details/${order._id}`}>
                                        <button className='w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                                            <FaEye className='w-4 h-4' />
                                            View Details
                                        </button>
                                    </Link>
                                    
                                    {order.payment_status !== 'paid' && (
                                        <button 
                                            onClick={() => redirect(order)} 
                                            className='w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                        >
                                            <FaCreditCard className='w-4 h-4' />
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className='bg-white rounded-2xl shadow-lg p-12 text-center'>
                    <div className='w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center'>
                        <FaShoppingBag className='w-16 h-16 text-primary' />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-4'>No orders found</h3>
                    <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
                        You haven't placed any orders yet. Start shopping to see your orders here!
                    </p>
                    <Link to="/shops">
                        <button className='bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                            Start Shopping
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Orders;