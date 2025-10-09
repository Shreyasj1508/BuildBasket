import React, { useState, useEffect } from 'react';
import { FaFileExcel, FaDownload, FaCalendarAlt, FaChartBar, FaUsers, FaShoppingCart, FaCreditCard, FaFileInvoiceDollar, FaRocket, FaStar } from 'react-icons/fa';
import { MdAnalytics, MdAssessment, MdReport } from 'react-icons/md';
import api from '../../api/api';
import toast from 'react-hot-toast';

const ReportsExports = () => {
    const [loading, setLoading] = useState(false);
    
    // Enhanced StatCard component
    const StatCard = ({ title, value, icon, color, delay = 0 }) => (
        <div 
            className={`${color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    {icon}
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
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [reportStats, setReportStats] = useState({});

    useEffect(() => {
        fetchReportStats();
    }, [dateRange]);

    const fetchReportStats = async () => {
        try {
            const response = await api.get(`/admin/reports/stats?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
            if (response.data.success) {
                setReportStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching report stats:', error);
        }
    };

    const exportReport = async (reportType) => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/reports/export/${reportType}`, {
                params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                },
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportType}_report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error(`Failed to export ${reportType} report`);
        } finally {
            setLoading(false);
        }
    };

    const reportTypes = [
        {
            id: 'sellers',
            title: 'Seller Report',
            description: 'Complete seller information, verification status, and performance metrics',
            icon: <FaUsers className="text-blue-500 text-2xl" />,
            color: 'blue',
            stats: reportStats.sellers || {}
        },
        {
            id: 'buyers',
            title: 'Buyer Report',
            description: 'Buyer details, registration info, and purchase history',
            icon: <FaUsers className="text-green-500 text-2xl" />,
            color: 'green',
            stats: reportStats.buyers || {}
        },
        {
            id: 'transactions',
            title: 'Transaction Report',
            description: 'All transactions, orders, payments, and financial data',
            icon: <FaShoppingCart className="text-purple-500 text-2xl" />,
            color: 'purple',
            stats: reportStats.transactions || {}
        },
        {
            id: 'credit',
            title: 'Credit Report',
            description: 'Credit applications, approvals, utilization, and payment history',
            icon: <FaCreditCard className="text-orange-500 text-2xl" />,
            color: 'orange',
            stats: reportStats.credit || {}
        },
        {
            id: 'commodities',
            title: 'Commodity Report',
            description: 'Commodity listings, categories, and market data',
            icon: <MdAnalytics className="text-indigo-500 text-2xl" />,
            color: 'indigo',
            stats: reportStats.commodities || {}
        },
        {
            id: 'analytics',
            title: 'Analytics Report',
            description: 'Platform analytics, user behavior, and performance insights',
            icon: <FaChartBar className="text-red-500 text-2xl" />,
            color: 'red',
            stats: reportStats.analytics || {}
        }
    ];

    const getColorClasses = (color) => {
        const colorMap = {
            blue: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                button: 'bg-blue-600 hover:bg-blue-700',
                text: 'text-blue-700'
            },
            green: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                button: 'bg-green-600 hover:bg-green-700',
                text: 'text-green-700'
            },
            purple: {
                bg: 'bg-purple-50',
                border: 'border-purple-200',
                button: 'bg-purple-600 hover:bg-purple-700',
                text: 'text-purple-700'
            },
            orange: {
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                button: 'bg-orange-600 hover:bg-orange-700',
                text: 'text-orange-700'
            },
            indigo: {
                bg: 'bg-indigo-50',
                border: 'border-indigo-200',
                button: 'bg-indigo-600 hover:bg-indigo-700',
                text: 'text-indigo-700'
            },
            red: {
                bg: 'bg-red-50',
                border: 'border-red-200',
                button: 'bg-red-600 hover:bg-red-700',
                text: 'text-red-700'
            }
        };
        return colorMap[color] || colorMap.blue;
    };

    const getGradientBg = (color) => {
        const gradientMap = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
            indigo: 'from-indigo-500 to-indigo-600',
            red: 'from-red-500 to-red-600'
        };
        return gradientMap[color] || gradientMap.blue;
    };

    const getGradientText = (color) => {
        const textMap = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
            indigo: 'from-indigo-500 to-indigo-600',
            red: 'from-red-500 to-red-600'
        };
        return textMap[color] || textMap.blue;
    };

    return (
        <div className='px-2 md:px-7 py-5 min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100'>
            <div className='w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20'>
                {/* Enhanced Header */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fadeInUp'>
                    <div className='flex items-center gap-4'>
                        <div className='p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg'>
                            <MdReport className='text-white text-3xl' />
                        </div>
                        <div>
                            <h2 className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'>
                                Reports & Exports
                            </h2>
                            <p className='text-gray-600 text-lg font-medium'>Generate comprehensive platform reports</p>
                            <span className='bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full mt-2 inline-block'>
                                Data Insights & Analytics
                            </span>
                        </div>
                    </div>
                    
                    {/* Enhanced Date Range Selector */}
                    <div className='bg-white/80 backdrop-blur-sm border border-orange-200 rounded-2xl px-6 py-4 shadow-lg animate-fadeInUp' style={{ animationDelay: '200ms' }}>
                        <div className='flex items-center gap-4'>
                            <div className='p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg'>
                                <FaCalendarAlt className='text-white text-xl' />
                            </div>
                            <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                                <div className='flex items-center gap-3'>
                                    <label className='text-sm font-semibold text-gray-700'>From:</label>
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                                        className='px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg'
                                    />
                                </div>
                                <div className='flex items-center gap-3'>
                                    <label className='text-sm font-semibold text-gray-700'>To:</label>
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                                        className='px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Report Cards Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {reportTypes.map((report, index) => {
                        return (
                            <div 
                                key={report.id} 
                                className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp'
                                style={{ animationDelay: `${300 + index * 100}ms` }}
                            >
                                <div className='flex items-center gap-4 mb-6'>
                                    <div className={`p-4 bg-gradient-to-br rounded-2xl shadow-lg ${getGradientBg(report.color)}`}>
                                        {report.icon}
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-bold gradient-to-r bg-clip-text text-transparent ${getGradientText(report.color)}`}>
                                            {report.title}
                                        </h3>
                                        <p className='text-gray-600 font-medium mt-1'>
                                            {report.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Enhanced Stats */}
                                <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6'>
                                    <div className='space-y-4'>
                                        {report.stats.total !== undefined && (
                                            <div className='flex justify-between items-center'>
                                                <span className='text-gray-600 font-medium'>Total Records:</span>
                                                <span className={`font-bold text-lg ${getGradientText(report.color)}`}>
                                                    {report.stats.total?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                        )}
                                        {report.stats.active !== undefined && (
                                            <div className='flex justify-between items-center'>
                                                <span className='text-gray-600 font-medium'>Active:</span>
                                                <span className={`font-bold text-lg ${getGradientText(report.color)}`}>
                                                    {report.stats.active?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                        )}
                                        {report.stats.amount !== undefined && (
                                            <div className='flex justify-between items-center'>
                                                <span className='text-gray-600 font-medium'>Total Amount:</span>
                                                <span className='font-bold text-lg text-orange-600'>
                                                    ₹{report.stats.amount?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => exportReport(report.id)}
                                    disabled={loading}
                                    className={`w-full bg-gradient-to-r ${getGradientBg(report.color)} disabled:bg-gray-400 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <FaDownload className='text-xl' />
                                            Export Excel Report
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className='mt-8 bg-gray-50 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <button
                            onClick={() => {
                                const today = new Date().toISOString().split('T')[0];
                                setDateRange({ startDate: today, endDate: today });
                            }}
                            className='px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors'
                        >
                            Today's Reports
                        </button>
                        <button
                            onClick={() => {
                                const today = new Date();
                                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                setDateRange({ 
                                    startDate: lastWeek.toISOString().split('T')[0], 
                                    endDate: today.toISOString().split('T')[0] 
                                });
                            }}
                            className='px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => {
                                const today = new Date();
                                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                                setDateRange({ 
                                    startDate: lastMonth.toISOString().split('T')[0], 
                                    endDate: today.toISOString().split('T')[0] 
                                });
                            }}
                            className='px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors'
                        >
                            Last 30 Days
                        </button>
                    </div>
                </div>

                {/* Export History */}
                <div className='mt-8'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Export Guidelines</h3>
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                        <ul className='text-sm text-blue-700 space-y-2'>
                            <li>• Reports are generated in Excel format (.xlsx) for easy analysis</li>
                            <li>• Date range filters apply to creation/transaction dates</li>
                            <li>• Large reports may take a few moments to generate</li>
                            <li>• All sensitive data is included for admin analysis</li>
                            <li>• Reports include comprehensive data with multiple sheets when applicable</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsExports;
