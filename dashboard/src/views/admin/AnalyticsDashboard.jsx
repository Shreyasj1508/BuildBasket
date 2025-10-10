import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaShoppingCart, FaMapMarkerAlt, FaTrophy, FaChartLine, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import api from '../../api/api';
import toast from 'react-hot-toast';

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState({
        sellerStats: { total: 0, verified: 0, pending: 0 },
        buyerStats: { total: 0, active: 0, new: 0 },
        topCommodities: [],
        topRegions: [],
        topBuyers: [],
        topSellers: [],
        transactionVolume: { total: 0, thisMonth: 0, growth: 0 },
        newUsers: { last30Days: 0, growth: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30days');

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/analytics?range=${dateRange}`);
            
            if (response.data.success) {
                setAnalytics(response.data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics data');
            // Set empty data structure instead of mock data
            setAnalytics({
                sellerStats: { total: 0, verified: 0, pending: 0 },
                buyerStats: { total: 0, active: 0, new: 0 },
                topCommodities: [],
                topRegions: [],
                topBuyers: [],
                topSellers: [],
                transactionVolume: { total: 0, thisMonth: 0, growth: 0 },
                newUsers: { last30Days: 0, growth: 0 }
            });
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (type) => {
        try {
            const response = await api.post('/admin/analytics/export', {
                type,
                range: dateRange
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(`${type} report exported successfully`);
        } catch (error) {
            console.error('Error exporting report:', error);
            toast.error('Failed to export report');
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, subtitle, growth }) => (
        <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm font-medium text-gray-600'>{title}</p>
                    <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
                    {subtitle && <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>}
                    {growth && (
                        <p className={`text-sm mt-1 ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growth > 0 ? '+' : ''}{growth}% from last period
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`text-${color}-600 text-xl`} />
                </div>
            </div>
        </div>
    );

    const TopListCard = ({ title, data, icon: Icon, color, onExport }) => (
        <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                    <Icon className={`text-${color}-600`} />
                    <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
                </div>
                <button
                    onClick={() => onExport(title.toLowerCase().replace(' ', '_'))}
                    className='flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors'
                >
                    <FaDownload />
                    Export
                </button>
            </div>
            <div className='space-y-3'>
                {data.map((item, index) => (
                    <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                        <div className='flex items-center gap-3'>
                            <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600 font-semibold text-sm`}>
                                {index + 1}
                            </div>
                            <div>
                                <p className='font-medium text-gray-900'>{item.name}</p>
                                {item.sales && <p className='text-sm text-gray-600'>{item.sales} sales</p>}
                                {item.orders && <p className='text-sm text-gray-600'>{item.orders} orders</p>}
                                {item.users && <p className='text-sm text-gray-600'>{item.users} users</p>}
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='font-semibold text-gray-900'>₹{item.revenue?.toLocaleString() || item.amount?.toLocaleString()}</p>
                            {item.growth && (
                                <p className={`text-sm ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.growth > 0 ? '+' : ''}{item.growth}%
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className='px-4 py-6'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white'>
                            <FaChartBar className='text-xl' />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800'>Analytics Dashboard</h1>
                            <p className='text-gray-600 mt-1'>Comprehensive insights and statistics</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value='7days'>Last 7 days</option>
                            <option value='30days'>Last 30 days</option>
                            <option value='90days'>Last 90 days</option>
                            <option value='1year'>Last year</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                    <p className='text-gray-500 mt-4'>Loading analytics...</p>
                </div>
            ) : (
                <>
                    {/* Stats Overview */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
                        <StatCard
                            title='Total Sellers'
                            value={analytics.sellerStats.total}
                            icon={FaUsers}
                            color='blue'
                            subtitle={`${analytics.sellerStats.verified} verified, ${analytics.sellerStats.pending} pending`}
                        />
                        <StatCard
                            title='Total Buyers'
                            value={analytics.buyerStats.total}
                            icon={FaUsers}
                            color='green'
                            subtitle={`${analytics.buyerStats.active} active, ${analytics.buyerStats.new} new`}
                        />
                        <StatCard
                            title='Transaction Volume'
                            value={`₹${analytics.transactionVolume.total.toLocaleString()}`}
                            icon={FaShoppingCart}
                            color='purple'
                            subtitle={`${analytics.transactionVolume.thisMonth} this month`}
                            growth={analytics.transactionVolume.growth}
                        />
                        <StatCard
                            title='New Users (30 days)'
                            value={analytics.newUsers.last30Days}
                            icon={FaCalendarAlt}
                            color='orange'
                            growth={analytics.newUsers.growth}
                        />
                    </div>

                    {/* Top Lists */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                        <TopListCard
                            title='Top Commodities'
                            data={analytics.topCommodities}
                            icon={FaTrophy}
                            color='yellow'
                            onExport={exportReport}
                        />
                        <TopListCard
                            title='Top Regions'
                            data={analytics.topRegions}
                            icon={FaMapMarkerAlt}
                            color='red'
                            onExport={exportReport}
                        />
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <TopListCard
                            title='Top Buyers'
                            data={analytics.topBuyers}
                            icon={FaUsers}
                            color='green'
                            onExport={exportReport}
                        />
                        <TopListCard
                            title='Top Sellers'
                            data={analytics.topSellers}
                            icon={FaChartLine}
                            color='blue'
                            onExport={exportReport}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsDashboard;