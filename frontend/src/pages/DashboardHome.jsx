import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_customer_dashboard_data } from '../store/reducers/orderReducer';
import { useAuthState } from '../hooks/useSafeSelector';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaEye, FaHeart } from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';

const DashboardHome = () => {
    const dispatch = useDispatch();
    const { userInfo } = useAuthState();
    const { dashboardData, loader } = useSelector(state => state.order);
    
    // Provide default values to prevent undefined errors
    const safeDashboardData = {
        recentOrders: dashboardData?.recentOrders || [],
        pendingOrder: dashboardData?.pendingOrder || 0,
        totalOrder: dashboardData?.totalOrder || 0,
        cancelledOrder: dashboardData?.cancelledOrder || 0
    };

    useEffect(() => {
        console.log('DashboardHome - userInfo:', userInfo);
        if (userInfo?.id) {
            console.log('Fetching dashboard data for userId:', userInfo.id);
            dispatch(get_customer_dashboard_data(userInfo.id));
        }
    }, [userInfo, dispatch]);

    // Add error handling for dashboard data
    const { errorMessage } = useSelector(state => state.order);
    
    useEffect(() => {
        if (errorMessage) {
            console.error('Dashboard data error:', errorMessage);
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

    if (loader) {
        return (
            <div className='flex justify-center items-center h-64'>
                <FadeLoader />
            </div>
        );
    }

    // Show error state if there's an error and no data
    if (errorMessage && !dashboardData) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-red-500 text-6xl mb-4'>⚠️</div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Unable to Load Dashboard</h2>
                    <p className='text-gray-600 mb-4'>There was an error loading your dashboard data.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className='btn-primary'
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Welcome Section */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            Welcome back, {userInfo?.name}!
                        </h1>
                        <p className='text-gray-600 mt-1'>
                            Here's what's happening with your orders
                        </p>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm text-gray-500'>Member since</p>
                        <p className='font-semibold text-gray-800'>
                            {new Date(userInfo?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-gray-600'>Total Orders</p>
                            <p className='text-2xl font-bold text-gray-900'>{safeDashboardData.totalOrder}</p>
                        </div>
                        <div className='p-3 bg-blue-100 rounded-full'>
                            <FaShoppingCart className='text-blue-600 text-xl' />
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-gray-600'>Pending Orders</p>
                            <p className='text-2xl font-bold text-yellow-600'>{safeDashboardData.pendingOrder}</p>
                        </div>
                        <div className='p-3 bg-yellow-100 rounded-full'>
                            <FaClock className='text-yellow-600 text-xl' />
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-gray-600'>Delivered Orders</p>
                            <p className='text-2xl font-bold text-green-600'>
                                {safeDashboardData.totalOrder - safeDashboardData.pendingOrder - safeDashboardData.cancelledOrder}
                            </p>
                        </div>
                        <div className='p-3 bg-green-100 rounded-full'>
                            <FaCheckCircle className='text-green-600 text-xl' />
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-gray-600'>Cancelled Orders</p>
                            <p className='text-2xl font-bold text-red-600'>{safeDashboardData.cancelledOrder}</p>
                        </div>
                        <div className='p-3 bg-red-100 rounded-full'>
                            <FaTimesCircle className='text-red-600 text-xl' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className='bg-white rounded-lg shadow-sm'>
                <div className='p-6 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-bold text-gray-800'>Recent Orders</h2>
                        <Link 
                            to='/dashboard/my-orders' 
                            className='text-primary hover:text-primary-dark font-medium'
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>

                <div className='p-6'>
                    {safeDashboardData.recentOrders && safeDashboardData.recentOrders.length > 0 ? (
                        <div className='space-y-4'>
                            {safeDashboardData.recentOrders.map((order, index) => (
                                <div key={order._id} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                                    <div className='flex items-center gap-4'>
                                        <div className='p-2 bg-white rounded-full'>
                                            {getStatusIcon(order.delivery_status)}
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-gray-800'>
                                                Order #{order._id.slice(-8)}
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                {new Date(order.date).toLocaleDateString()}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                ${order.price}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(order.delivery_status)}`}>
                                            {order.delivery_status}
                                        </span>
                                        <Link
                                            to={`/track-order?orderId=${order._id}`}
                                            className='p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors'
                                        >
                                            <FaEye className='text-sm' />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-8'>
                            <FaShoppingCart className='text-gray-400 text-4xl mx-auto mb-4' />
                            <h3 className='text-lg font-medium text-gray-600 mb-2'>No orders yet</h3>
                            <p className='text-gray-500 mb-4'>Start shopping to see your orders here</p>
                            <Link
                                to='/'
                                className='btn-primary'
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className='mt-8 bg-white rounded-lg shadow-sm'>
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-xl font-bold text-gray-800'>Quick Actions</h2>
                </div>
                <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <Link
                            to='/'
                            className='flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
                        >
                            <FaShoppingCart className='text-blue-600 text-xl' />
                            <div>
                                <h3 className='font-semibold text-gray-800'>Continue Shopping</h3>
                                <p className='text-sm text-gray-600'>Browse our products</p>
                            </div>
                        </Link>

                        <Link
                            to='/dashboard/my-orders'
                            className='flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors'
                        >
                            <FaTruck className='text-green-600 text-xl' />
                            <div>
                                <h3 className='font-semibold text-gray-800'>Track Orders</h3>
                                <p className='text-sm text-gray-600'>View all your orders</p>
                            </div>
                        </Link>

                        <Link
                            to='/dashboard/my-wishlist'
                            className='flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors'
                        >
                            <FaHeart className='text-purple-600 text-xl' />
                            <div>
                                <h3 className='font-semibold text-gray-800'>My Wishlist</h3>
                                <p className='text-sm text-gray-600'>Saved items</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
