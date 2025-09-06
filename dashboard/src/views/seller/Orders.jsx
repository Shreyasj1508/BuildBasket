import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import moment from 'moment';

const Orders = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:5000/api/order/seller/orders/${userInfo?._id}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (response.ok) {
                setOrders(data.orders || []);
            } else {
                setError(data.error || 'Failed to fetch orders');
            }
        } catch (err) {
            setError('Failed to fetch orders');
            console.error('Orders fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/order/seller/order-status/update/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ delivery_status: status })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update the order in local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId 
                            ? { ...order, delivery_status: status }
                            : order
                    )
                );
                alert('Order status updated successfully!');
            } else {
                alert(data.error || 'Failed to update order status');
            }
        } catch (err) {
            alert('Failed to update order status');
            console.error('Update order error:', err);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-500', icon: MdPendingActions },
            processing: { color: 'bg-blue-500', icon: FaTruck },
            delivered: { color: 'bg-green-500', icon: FaCheckCircle },
            cancelled: { color: 'bg-red-500', icon: FaTimesCircle }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <span className={`${config.color} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                <Icon className='text-xs' />
                {status}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const color = status === 'paid' ? 'bg-green-500' : 'bg-yellow-500';
        return (
            <span className={`${color} text-white px-2 py-1 rounded text-xs`}>
                {status}
            </span>
        );
    };

    // Filter orders based on status
    const filteredOrders = orders.filter(order => 
        filterStatus === 'all' || order.delivery_status === filterStatus
    );

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold'>Orders</h2>
                        <div className='h-8 w-32 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                    <div className='space-y-4'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className='bg-gray-100 rounded-lg p-4 animate-pulse'>
                                <div className='h-4 bg-gray-200 rounded mb-2'></div>
                                <div className='h-3 bg-gray-200 rounded mb-2'></div>
                                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='px-2 md:px-7 py-5'>
            <div className='w-full bg-white rounded-md p-4'>
                {/* Header */}
                <div className='flex justify-between items-center mb-6'>
                    <div className='flex items-center gap-2'>
                        <FaTruck className='text-2xl text-blue-600' />
                        <h2 className='text-xl font-semibold'>My Orders</h2>
                        <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>
                            {filteredOrders.length} orders
                        </span>
                    </div>
                </div>

                {/* Filter */}
                <div className='flex gap-2 mb-6'>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Error Message */}
                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        <strong className='font-bold'>Error: </strong>
                        <span className='block sm:inline'>{error}</span>
                        <button 
                            onClick={fetchOrders} 
                            className='mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className='space-y-4'>
                        {filteredOrders.map((order) => (
                            <div key={order._id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                                {/* Order Header */}
                                <div className='flex justify-between items-start mb-4'>
                                    <div>
                                        <h3 className='font-semibold text-gray-800'>Order #{order._id.substring(0, 8)}...</h3>
                                        <p className='text-sm text-gray-600'>
                                            {moment(order.createdAt).format('MMMM Do YYYY, h:mm a')}
                                        </p>
                                    </div>
                                    <div className='flex gap-2'>
                                        {getStatusBadge(order.delivery_status)}
                                        {getPaymentStatusBadge(order.payment_status)}
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                    <div>
                                        <h4 className='font-medium text-gray-700 mb-1'>Customer</h4>
                                        <p className='text-sm text-gray-600'>{order.customerInfo?.name || 'N/A'}</p>
                                        <p className='text-sm text-gray-600'>{order.customerInfo?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className='font-medium text-gray-700 mb-1'>Shipping Address</h4>
                                        <p className='text-sm text-gray-600'>
                                            {order.shippingInfo?.address || 'N/A'}
                                        </p>
                                        <p className='text-sm text-gray-600'>
                                            {order.shippingInfo?.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className='font-medium text-gray-700 mb-1'>Order Summary</h4>
                                        <p className='text-sm text-gray-600'>Items: {order.products?.length || 0}</p>
                                        <p className='text-sm text-gray-600'>Total: ${order.price?.toFixed(2) || '0.00'}</p>
                                    </div>
                                </div>

                                {/* Products */}
                                <div className='mb-4'>
                                    <h4 className='font-medium text-gray-700 mb-2'>Products</h4>
                                    <div className='space-y-2'>
                                        {order.products?.map((product, index) => (
                                            <div key={index} className='flex items-center gap-3 p-2 bg-gray-50 rounded'>
                                                <img 
                                                    src={product.images?.[0] || '/images/placeholder.jpg'} 
                                                    alt={product.name}
                                                    className='w-12 h-12 object-cover rounded'
                                                />
                                                <div className='flex-1'>
                                                    <p className='font-medium text-sm'>{product.name}</p>
                                                    <p className='text-xs text-gray-600'>Qty: {product.quantity}</p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='font-medium text-sm'>${product.price?.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-2'>
                                    <Link
                                        to={`/seller/dashboard/order/details/${order._id}`}
                                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors'
                                    >
                                        <FaEye className='text-xs' />
                                        View Details
                                    </Link>
                                    
                                    {order.delivery_status === 'pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'processing')}
                                            className='bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors'
                                        >
                                            <FaTruck className='text-xs' />
                                            Start Processing
                                        </button>
                                    )}
                                    
                                    {order.delivery_status === 'processing' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'delivered')}
                                            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors'
                                        >
                                            <FaCheckCircle className='text-xs' />
                                            Mark Delivered
                                        </button>
                                    )}
                                    
                                    {(order.delivery_status === 'pending' || order.delivery_status === 'processing') && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                                    updateOrderStatus(order._id, 'cancelled');
                                                }
                                            }}
                                            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors'
                                        >
                                            <FaTimesCircle className='text-xs' />
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-12'>
                        <FaTruck className='text-6xl text-gray-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>No orders found</h3>
                        <p className='text-gray-500'>
                            {filterStatus !== 'all' 
                                ? `No ${filterStatus} orders available`
                                : 'You haven\'t received any orders yet'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;