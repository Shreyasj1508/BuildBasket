import React, { useState, useEffect } from 'react';
import { 
    FaUsers, 
    FaShoppingCart, 
    FaCreditCard, 
    FaChartLine, 
    FaArrowUp, 
    FaArrowDown,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaRocket,
    FaStar,
    FaTrophy
} from 'react-icons/fa';
import { MdInventory, MdAnalytics, MdTrendingUp, MdInsights } from 'react-icons/md';
import Chart from 'react-apexcharts';
import api from '../../api/api';
import toast from 'react-hot-toast';

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y
    const [analytics, setAnalytics] = useState({
        overview: {},
        trends: {},
        regional: {},
        categories: {},
        performance: {}
    });

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/analytics?period=${timeRange}`);
            if (response.data.success) {
                setAnalytics(response.data.analytics);
            } else {
                toast.error('Failed to fetch analytics data');
                // Set empty analytics structure if API fails
                setAnalytics({
                    overview: {},
                    trends: {},
                    regional: [],
                    categories: [],
                    performance: { topSellers: [], topBuyers: [] }
                });
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to connect to analytics service');
            // Set empty analytics structure on error
            setAnalytics({
                overview: {},
                trends: {},
                regional: [],
                categories: [],
                performance: { topSellers: [], topBuyers: [] }
            });
        } finally {
            setLoading(false);
        }
    };

    const getChartOptions = (type, data) => {
        const baseOptions = {
            chart: {
                type: type,
                toolbar: { show: false },
                background: 'transparent'
            },
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            grid: { borderColor: '#E5E7EB' },
            xaxis: { 
                categories: data.categories || [],
                labels: { style: { colors: '#6B7280' } }
            },
            yaxis: { labels: { style: { colors: '#6B7280' } } },
            legend: { 
                position: 'bottom',
                labels: { colors: '#6B7280' }
            }
        };

        if (type === 'donut') {
            return {
                ...baseOptions,
                labels: data.labels || [],
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%'
                        }
                    }
                }
            };
        }

        return baseOptions;
    };

    const StatCard = ({ title, value, change, icon, color, delay = 0 }) => (
        <div 
            className={`${color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    {icon}
                </div>
                <div className="text-right">
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 text-sm font-semibold ${
                            change >= 0 ? 'text-green-200' : 'text-red-200'
                        }`}>
                            {change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-white text-opacity-90 uppercase tracking-wide">
                    {title}
                </h3>
                <p className="text-3xl font-bold text-white">
                    {value}
                </p>
            </div>
            <div className="mt-4 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white bg-opacity-60 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: '100%' }}
                ></div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='animate-pulse'>
                        <div className='h-8 bg-gray-200 rounded w-1/3 mb-6'></div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className='bg-gray-100 rounded-lg p-6 h-32'></div>
                            ))}
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            {[1, 2].map((i) => (
                                <div key={i} className='bg-gray-100 rounded-lg p-6 h-80'></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='px-2 md:px-7 py-5 min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100'>
            <div className='w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20'>
                {/* Enhanced Header */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fadeInUp'>
                    <div className='flex items-center gap-4'>
                        <div className='p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg'>
                            <MdAnalytics className='text-white text-3xl' />
                        </div>
                        <div>
                            <h2 className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'>
                                Analytics Dashboard
                            </h2>
                            <p className='text-gray-600 text-lg font-medium'>Platform insights and performance metrics</p>
                        </div>
                    </div>
                    
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-orange-200'>
                            <FaCalendarAlt className='text-orange-500 text-xl' />
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className='bg-transparent border-none outline-none text-gray-700 font-semibold focus:ring-0'
                            >
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                                <option value="90d">Last 90 Days</option>
                                <option value="1y">Last Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    <StatCard
                        title="Total Sellers"
                        value={analytics.overview.totalSellers?.toLocaleString() || '0'}
                        change={analytics.trends.sellersGrowth}
                        icon={<FaUsers className="text-white text-xl" />}
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        delay={100}
                    />
                    <StatCard
                        title="Total Buyers"
                        value={analytics.overview.totalBuyers?.toLocaleString() || '0'}
                        change={analytics.trends.buyersGrowth}
                        icon={<FaUsers className="text-white text-xl" />}
                        color="bg-gradient-to-br from-green-500 to-green-600"
                        delay={200}
                    />
                    <StatCard
                        title="Total Orders"
                        value={analytics.overview.totalOrders?.toLocaleString() || '0'}
                        change={analytics.trends.ordersGrowth}
                        icon={<FaShoppingCart className="text-white text-xl" />}
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                        delay={300}
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${(analytics.overview.totalRevenue || 0).toLocaleString()}`}
                        change={analytics.trends.revenueGrowth}
                        icon={<FaChartLine className="text-white text-xl" />}
                        color="bg-gradient-to-br from-orange-500 to-orange-600"
                        delay={400}
                    />
                </div>

                {/* Secondary Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <StatCard
                        title="Total Commodities"
                        value={analytics.overview.totalCommodities?.toLocaleString() || '0'}
                        icon={<MdInventory className="text-white text-xl" />}
                        color="bg-indigo-500"
                    />
                    <StatCard
                        title="Credit Applications"
                        value={analytics.overview.creditApplications?.toLocaleString() || '0'}
                        icon={<FaCreditCard className="text-white text-xl" />}
                        color="bg-red-500"
                    />
                    <StatCard
                        title="Approved Credit"
                        value={`₹${(analytics.overview.approvedCredit || 0).toLocaleString()}`}
                        icon={<MdTrendingUp className="text-white text-xl" />}
                        color="bg-teal-500"
                    />
                </div>

                {/* Charts Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                    {/* Regional Distribution */}
                    <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeInUp' style={{ animationDelay: '500ms' }}>
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg'>
                                <FaMapMarkerAlt className='text-white text-xl' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800'>Regional Distribution</h3>
                                <p className='text-gray-600'>Seller distribution across regions</p>
                            </div>
                        </div>
                        <Chart
                            options={getChartOptions('donut', {
                                labels: analytics.regional?.map(r => r.region) || []
                            })}
                            series={analytics.regional?.map(r => r.sellers) || []}
                            type="donut"
                            height={350}
                        />
                    </div>

                    {/* Category Performance */}
                    <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeInUp' style={{ animationDelay: '600ms' }}>
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg'>
                                <MdInventory className='text-white text-xl' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800'>Category Performance</h3>
                                <p className='text-gray-600'>Revenue by product category</p>
                            </div>
                        </div>
                        <Chart
                            options={getChartOptions('bar', {
                                categories: analytics.categories?.map(c => c.category) || []
                            })}
                            series={[{
                                name: 'Revenue',
                                data: analytics.categories?.map(c => c.revenue) || []
                            }]}
                            type="bar"
                            height={350}
                        />
                    </div>
                </div>

                {/* Performance Tables */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                    {/* Top Sellers */}
                    <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeInUp' style={{ animationDelay: '700ms' }}>
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg'>
                                <FaTrophy className='text-white text-xl' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800'>Top Sellers</h3>
                                <p className='text-gray-600'>Best performing sellers by revenue</p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            {analytics.performance.topSellers?.map((seller, index) => (
                                <div key={index} className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-orange-50 hover:to-orange-100 transition-all duration-300 transform hover:scale-[1.02]'>
                                    <div className='flex items-center gap-4'>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 
                                            index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 
                                            index === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className='font-semibold text-gray-900 text-lg'>{seller.name}</p>
                                            <p className='text-sm text-gray-600'>{seller.orders} orders</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold text-gray-900 text-lg'>₹{seller.revenue.toLocaleString()}</p>
                                        <p className='text-xs text-gray-500'>Revenue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Buyers */}
                    <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fadeInUp' style={{ animationDelay: '800ms' }}>
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg'>
                                <FaStar className='text-white text-xl' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800'>Top Buyers</h3>
                                <p className='text-gray-600'>Highest spending customers</p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            {analytics.performance.topBuyers?.map((buyer, index) => (
                                <div key={index} className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-green-50 hover:to-green-100 transition-all duration-300 transform hover:scale-[1.02]'>
                                    <div className='flex items-center gap-4'>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 
                                            index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 
                                            index === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-green-500 to-green-600'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className='font-semibold text-gray-900 text-lg'>{buyer.name}</p>
                                            <p className='text-sm text-gray-600'>{buyer.orders} orders</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='font-bold text-gray-900 text-lg'>₹{buyer.spent.toLocaleString()}</p>
                                        <p className='text-xs text-gray-500'>Spent</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Regional Performance Table */}
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fadeInUp' style={{ animationDelay: '900ms' }}>
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg'>
                            <MdInsights className='text-white text-xl' />
                        </div>
                        <div>
                            <h3 className='text-2xl font-bold text-gray-800'>Regional Performance</h3>
                            <p className='text-gray-600'>Detailed regional statistics and metrics</p>
                        </div>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left text-gray-500'>
                            <thead className='text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl'>
                                <tr>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Region</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Sellers</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Buyers</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Revenue</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Avg Revenue/Seller</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.regional?.map((region, index) => (
                                    <tr key={index} className='bg-white border-b hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-300'>
                                        <td className='px-6 py-4 font-semibold text-gray-900 text-lg'>{region.region}</td>
                                        <td className='px-6 py-4 text-lg'>{region.sellers}</td>
                                        <td className='px-6 py-4 text-lg'>{region.buyers.toLocaleString()}</td>
                                        <td className='px-6 py-4 font-bold text-lg text-orange-600'>₹{region.revenue.toLocaleString()}</td>
                                        <td className='px-6 py-4 font-semibold text-lg text-green-600'>₹{Math.round(region.revenue / region.sellers).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
