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
        <div className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
                    <p className='text-3xl font-bold text-gray-900 mb-2'>{value}</p>
                    {subtitle && <p className='text-sm text-gray-500 mb-2'>{subtitle}</p>}
                    {growth && (
                        <p className={`text-sm font-semibold ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growth > 0 ? '+' : ''}{growth}% from last period
                        </p>
                    )}
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className={`text-white text-2xl`} />
                </div>
            </div>
        </div>
    );

    const TopListCard = ({ title, data, icon: Icon, color, onExport }) => (
        <div className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100'>
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                    <div className={`w-10 h-10 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-lg flex items-center justify-center`}>
                        <Icon className={`text-white text-lg`} />
                    </div>
                    <h3 className='text-xl font-bold text-gray-800'>{title}</h3>
                </div>
                <button
                    onClick={() => onExport(title.toLowerCase().replace(' ', '_'))}
                    className='flex items-center gap-2 px-4 py-2 text-sm text-[#eb8f34] hover:text-white hover:bg-[#eb8f34] rounded-lg transition-all duration-300 font-semibold border border-[#eb8f34] hover:border-transparent'
                >
                    <FaDownload />
                    Export
                </button>
            </div>
            <div className='space-y-3'>
                {data.length > 0 ? data.map((item, index) => (
                    <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200'>
                        <div className='flex items-center gap-4'>
                            <div className={`w-10 h-10 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                {index + 1}
                            </div>
                            <div>
                                <p className='font-semibold text-gray-900 text-lg'>{item.name}</p>
                                {item.sales && <p className='text-sm text-gray-600'>{item.sales} sales</p>}
                                {item.orders && <p className='text-sm text-gray-600'>{item.orders} orders</p>}
                                {item.users && <p className='text-sm text-gray-600'>{item.users} users</p>}
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='font-bold text-gray-900 text-lg'>₹{item.revenue?.toLocaleString() || item.amount?.toLocaleString()}</p>
                            {item.growth && (
                                <p className={`text-sm font-semibold ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.growth > 0 ? '+' : ''}{item.growth}%
                                </p>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className='text-center py-8 text-gray-500'>
                        <p className='text-lg font-medium'>No data available</p>
                        <p className='text-sm'>Data will appear here once available</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className='px-4 py-6'>
            {/* Header */}
            <div className='bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-xl shadow-xl p-6 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white'>
                            <FaChartBar className='text-xl' />
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-white'>Analytics Dashboard</h1>
                            <p className='text-white/90 mt-1'>Comprehensive insights and statistics</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className='px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb8f34] focus:border-[#eb8f34] font-medium shadow-md hover:shadow-lg transition-all duration-300'
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
                <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb8f34] mx-auto'></div>
                    <p className='text-gray-600 mt-4 font-medium'>Loading analytics...</p>
                </div>
            ) : (
                <>
                    {/* Stats Overview */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
                        <StatCard
                            title='Total Sellers'
                            value={analytics.sellerStats?.total || 0}
                            icon={FaUsers}
                            color='blue'
                            subtitle={`${analytics.sellerStats?.verified || 0} verified, ${analytics.sellerStats?.pending || 0} pending`}
                        />
                        <StatCard
                            title='Total Buyers'
                            value={analytics.buyerStats?.total || 0}
                            icon={FaUsers}
                            color='green'
                            subtitle={`${analytics.buyerStats?.active || 0} active, ${analytics.buyerStats?.new || 0} new`}
                        />
                        <StatCard
                            title='Transaction Volume'
                            value={`₹${(analytics.transactionVolume?.total || 0).toLocaleString()}`}
                            icon={FaShoppingCart}
                            color='purple'
                            subtitle={`${analytics.transactionVolume?.thisMonth || 0} this month`}
                            growth={analytics.transactionVolume?.growth || 0}
                        />
                        <StatCard
                            title='New Users (30 days)'
                            value={analytics.newUsers?.last30Days || 0}
                            icon={FaCalendarAlt}
                            color='orange'
                            growth={analytics.newUsers?.growth || 0}
                        />
                    </div>

                    {/* Top Lists */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                        <TopListCard
                            title='Top Commodities'
                            data={analytics.topCommodities || []}
                            icon={FaTrophy}
                            color='yellow'
                            onExport={exportReport}
                        />
                        <TopListCard
                            title='Top Regions'
                            data={analytics.topRegions || []}
                            icon={FaMapMarkerAlt}
                            color='red'
                            onExport={exportReport}
                        />
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <TopListCard
                            title='Top Buyers'
                            data={analytics.topBuyers || []}
                            icon={FaUsers}
                            color='green'
                            onExport={exportReport}
                        />
                        <TopListCard
                            title='Top Sellers'
                            data={analytics.topSellers || []}
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