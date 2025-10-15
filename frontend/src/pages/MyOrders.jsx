import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_orders } from '../store/reducers/orderReducer';
import { useAuthState } from '../hooks/useSafeSelector';
import { Link } from 'react-router-dom';
import { FaEye, FaTruck, FaClock, FaCheckCircle, FaTimesCircle, FaShoppingCart } from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const { userInfo } = useAuthState();
    const { myOrders, loader, errorMessage } = useSelector(state => state.order);

    useEffect(() => {
        console.log('MyOrders - userInfo:', userInfo);
        if (userInfo?.id) {
            console.log('Fetching orders for customerId:', userInfo.id);
            dispatch(get_orders({ customerId: userInfo.id, status: statusFilter }));
        }
    }, [userInfo, statusFilter, dispatch]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

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
                return <FaClock className="text-yellow-600" />;
            case 'processing':
                return <FaTruck className="text-blue-600" />;
            case 'shipped':
                return <FaTruck className="text-purple-600" />;
            case 'delivered':
                return <FaCheckCircle className="text-green-600" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-600" />;
            default:
                return <FaShoppingCart className="text-gray-600" />;
        }
    };

    const filteredOrders = myOrders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.delivery_status.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const ordersPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    if (loader) {
        return (
            <div className='flex justify-center items-center h-64'>
                <FadeLoader />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>My Orders</h1>
                        <p className='text-gray-600 mt-1'>
                            Track and manage all your orders
                        </p>
                    </div>
                    <Link
                        to='/'
                        className='btn-primary'
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex-1'>
                        <input
                            type="text"
                            placeholder="Search orders by ID or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className='bg-white rounded-lg shadow-sm'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Orders ({filteredOrders.length})
                    </h2>
                </div>

                <div className='p-6'>
                    {currentOrders.length > 0 ? (
                        <div className='space-y-4'>
                            {currentOrders.map((order) => (
                                <div key={order._id} className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <div className='flex items-center gap-4'>
                                            <div className='p-3 bg-gray-100 rounded-full'>
                                                {getStatusIcon(order.delivery_status)}
                                            </div>
                                            <div>
                                                <h3 className='font-semibold text-gray-800'>
                                                    {order.orderNumber ? `Order #${order.orderNumber}` : `Order #${order._id.slice(-8)}`}
                                                </h3>
                                                <p className='text-sm text-gray-600'>
                                                    Placed on {new Date(order.date).toLocaleDateString()}
                                                </p>
                                                {order.trackingNumber && (
                                                    <p className='text-xs text-blue-600 font-medium'>
                                                        Tracking: {order.trackingNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-2xl font-bold text-primary'>
                                                ${order.price}
                                            </p>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(order.delivery_status)}`}>
                                                {order.delivery_status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                        <div>
                                            <h4 className='font-semibold text-gray-700 mb-2'>Payment Status</h4>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                                order.payment_status === 'paid' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {order.payment_status === 'paid' ? '✅ Paid' : '❌ Unpaid'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className='font-semibold text-gray-700 mb-2'>Items</h4>
                                            <p className='text-sm text-gray-600'>
                                                {order.products?.length || 0} items
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className='font-semibold text-gray-700 mb-2'>Order Details</h4>
                                            <div className='text-sm text-gray-600'>
                                                {order.orderNumber && (
                                                    <p className='font-medium text-blue-600'>
                                                        Order #: {order.orderNumber}
                                                    </p>
                                                )}
                                                {order.trackingNumber && (
                                                    <p className='font-medium text-green-600'>
                                                        Tracking: {order.trackingNumber}
                                                    </p>
                                                )}
                                                <p className='font-mono text-xs text-gray-500'>
                                                    ID: {order._id.slice(-8)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products Preview */}
                                    {order.products && order.products.length > 0 && (
                                        <div className='mb-4'>
                                            <h4 className='font-semibold text-gray-700 mb-2'>Products</h4>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                                {order.products.slice(0, 3).map((product, index) => (
                                                    <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                                        <div className='w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center'>
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
                                                            <h5 className='font-medium text-gray-800 text-sm'>{product.name}</h5>
                                                            <p className='text-xs text-gray-600'>Qty: {product.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.products.length > 3 && (
                                                    <div className='flex items-center justify-center p-3 bg-gray-50 rounded-lg'>
                                                        <span className='text-sm text-gray-600'>
                                                            +{order.products.length - 3} more items
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                                        <div className='flex gap-2'>
                                            <Link
                                                to={`/track-order?orderId=${order.orderNumber || order._id}`}
                                                className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors'
                                            >
                                                <FaTruck />
                                                Track Order
                                            </Link>
                                            <Link
                                                to={`/dashboard/order-details/${order._id}`}
                                                className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <FaShoppingCart className='text-gray-400 text-6xl mx-auto mb-4' />
                            <h3 className='text-xl font-medium text-gray-600 mb-2'>No orders found</h3>
                            <p className='text-gray-500 mb-6'>
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Start shopping to see your orders here'
                                }
                            </p>
                            <Link
                                to='/'
                                className='btn-primary'
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='p-6 border-t border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <p className='text-sm text-gray-600'>
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                            </p>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className='px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                >
                                    Previous
                                </button>
                                <span className='px-3 py-2 text-gray-700'>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className='px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
