import React, { useEffect, useState } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits, MdLocationOn, MdPayment, MdAnalytics } from "react-icons/md";
import { FaWallet, FaMapMarkerAlt, FaChartBar, FaReceipt } from "react-icons/fa";
import { FaCartShopping, FaChartLine, FaMessage, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';
import customer from '../../assets/demo.jpg'
import api from '../../api/api';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
    const dispatch = useDispatch()
    const { totalSale, totalOrder, totalProduct, totalPendingOrder, recentOrder, recentMessage } = useSelector(state => state.dashboard)
    const { userInfo } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // New state for enhanced features
    const [selectedRegions, setSelectedRegions] = useState([])
    const [regionFares, setRegionFares] = useState({})
    const [gstRate, setGstRate] = useState(18) // Default GST rate
    const [walletBalance, setWalletBalance] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState('direct') // 'sg_finserv' or 'direct'
    const [analytics, setAnalytics] = useState({
        topCommodities: [],
        topRegions: [],
        revenueBreakdown: {},
        salesPerformance: {}
    })
    const [showRegionModal, setShowRegionModal] = useState(false)
    const [showFareModal, setShowFareModal] = useState(false)
    const [showWalletModal, setShowWalletModal] = useState(false)
    const [newRegion, setNewRegion] = useState('')
    const [newFare, setNewFare] = useState('')

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                setError(null)
                await dispatch(get_seller_dashboard_data())
                await fetchEnhancedData()
            } catch (err) {
                setError('Failed to load dashboard data')
                console.error('Dashboard data error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [dispatch])

    // Fetch enhanced seller data
    const fetchEnhancedData = async () => {
        try {
            // Fetch seller regions and fares
            const regionsResponse = await api.get('/api/seller/regions', { withCredentials: true })
            if (regionsResponse.data.success) {
                setSelectedRegions(regionsResponse.data.regions || [])
                setRegionFares(regionsResponse.data.regionFares || {})
            }

            // Fetch wallet balance
            const walletResponse = await api.get('/api/seller/wallet', { withCredentials: true })
            if (walletResponse.data.success) {
                setWalletBalance(walletResponse.data.balance || 0)
                setPaymentMethod(walletResponse.data.paymentMethod || 'direct')
            }

            // Fetch analytics data
            const analyticsResponse = await api.get('/api/seller/analytics', { withCredentials: true })
            if (analyticsResponse.data.success) {
                setAnalytics(analyticsResponse.data.analytics || {})
            }
        } catch (error) {
            console.error('Error fetching enhanced data:', error)
        }
    }

    // Region management functions
    const addRegion = async () => {
        if (!newRegion.trim()) return
        
        try {
            const response = await api.post('/api/seller/regions', 
                { region: newRegion.trim() }, 
                { withCredentials: true }
            )
            
            if (response.data.success) {
                setSelectedRegions([...selectedRegions, newRegion.trim()])
                setNewRegion('')
                toast.success('Region added successfully')
            }
        } catch (error) {
            toast.error('Failed to add region')
        }
    }

    const removeRegion = async (region) => {
        try {
            const response = await api.delete(`/api/seller/regions/${encodeURIComponent(region)}`, 
                { withCredentials: true }
            )
            
            if (response.data.success) {
                setSelectedRegions(selectedRegions.filter(r => r !== region))
                const newFares = { ...regionFares }
                delete newFares[region]
                setRegionFares(newFares)
                toast.success('Region removed successfully')
            }
        } catch (error) {
            toast.error('Failed to remove region')
        }
    }

    // Fare management functions
    const updateFare = async (region, fare) => {
        try {
            const response = await api.put(`/api/seller/regions/${encodeURIComponent(region)}/fare`, 
                { fare: parseFloat(fare) }, 
                { withCredentials: true }
            )
            
            if (response.data.success) {
                setRegionFares({ ...regionFares, [region]: parseFloat(fare) })
                toast.success('Fare updated successfully')
            }
        } catch (error) {
            toast.error('Failed to update fare')
        }
    }

    // GST calculation
    const calculateGST = (amount) => {
        const gstAmount = (amount * gstRate) / 100
        return {
            originalAmount: amount,
            gstAmount: gstAmount,
            totalAmount: amount + gstAmount
        }
    }

    // Wallet functions
    const updatePaymentMethod = async (method) => {
        try {
            const response = await api.put('/api/seller/payment-method', 
                { paymentMethod: method }, 
                { withCredentials: true }
            )
            
            if (response.data.success) {
                setPaymentMethod(method)
                toast.success('Payment method updated successfully')
            }
        } catch (error) {
            toast.error('Failed to update payment method')
        }
    }

    // Available regions for selection
    const availableRegions = [
        'North India', 'South India', 'East India', 'West India', 'Central India',
        'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
        'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh', 'Bhopal'
    ]

    const chartData = {
        series: [
            {
                name: "Orders",
                data: [23, 34, 45, 56, 76, 34, 23, 76, 87, 78, 34, 45]
            },
            {
                name: "Revenue",
                data: [67, 39, 45, 56, 90, 56, 23, 56, 87, 78, 67, 78]
            },
            {
                name: "Sales",
                data: [34, 39, 56, 56, 80, 67, 23, 56, 98, 78, 45, 56]
            },
        ],
        options: {
            color: ['#181ee8', '#181ee8'],
            plotOptions: {
                radius: 30
            },
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                curve: ['smooth', 'straight', 'stepline'],
                lineCap: 'butt',
                colors: '#f0f0f0',
                width: .5,
                dashArray: 0
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            legend: {
                position: 'top'
            },
            responsive: [
                {
                    breakpoint: 565,
                    yaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    options: {
                        plotOptions: {
                            bar: {
                                horizontal: true
                            }
                        },
                        chart: {
                            height: "550px"
                        }
                    }
                }
            ]
        }
    }

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className='flex justify-between items-center p-5 bg-gray-200 rounded-md gap-3 animate-pulse'>
                            <div className='flex flex-col justify-start items-start'>
                                <div className='h-8 w-16 bg-gray-300 rounded mb-2'></div>
                                <div className='h-4 w-24 bg-gray-300 rounded'></div>
                            </div>
                            <div className='w-[40px] h-[47px] rounded-full bg-gray-300'></div>
                        </div>
                    ))}
                </div>
                <div className='w-full mt-7'>
                    <div className='w-full bg-gray-200 p-4 rounded-md h-[400px] animate-pulse'></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                    <strong className='font-bold'>Error: </strong>
                    <span className='block sm:inline'>{error}</span>
                    <button 
                        onClick={() => window.location.reload()} 
                        className='mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='px-2 md:px-7 py-5'>
            {/* Dashboard Stats Cards - Enhanced with modern design */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                {/* Total Sales */}
                <div className='stat-card bg-gradient-to-r from-primary/10 to-primary-light/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex flex-col justify-start items-start text-dark'>
                        <h2 className='text-3xl font-bold'>₹{totalSale?.toFixed(2) || '0.00'}</h2>
                        <span className='text-md font-medium'>Total Sales</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-primary flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-white shadow-lg' />
                    </div>
                </div>

                {/* Total Products */}
                <div className='stat-card bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex flex-col justify-start items-start text-dark'>
                        <h2 className='text-3xl font-bold'>{totalProduct || 0}</h2>
                        <span className='text-md font-medium'>Products</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-purple-500 flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-white shadow-lg' />
                    </div>
                </div>

                {/* Total Orders */}
                <div className='stat-card bg-gradient-to-r from-green-500/10 to-green-600/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex flex-col justify-start items-start text-dark'>
                        <h2 className='text-3xl font-bold'>{totalOrder || 0}</h2>
                        <span className='text-md font-medium'>Orders</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-green-500 flex justify-center items-center text-xl'>
                        <FaCartShopping className='text-white shadow-lg' />
                    </div>
                </div>

                {/* Wallet Balance */}
                <div className='stat-card bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex flex-col justify-start items-start text-dark'>
                        <h2 className='text-3xl font-bold'>₹{walletBalance?.toFixed(2) || '0.00'}</h2>
                        <span className='text-md font-medium'>Wallet Balance</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl'>
                        <FaWallet className='text-white shadow-lg' />
                    </div>
                </div>
            </div>

            {/* Enhanced Features Section */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-7 mt-7'>
                {/* Region Selection */}
                <div className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                            <MdLocationOn className='text-primary' />
                            Sales Regions
                        </h3>
                        <button 
                            onClick={() => setShowRegionModal(true)}
                            className='bg-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-dark transition-colors'
                        >
                            <FaPlus className='inline mr-1' /> Add
                        </button>
                    </div>
                    <div className='space-y-2'>
                        {selectedRegions.map((region, index) => (
                            <div key={index} className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                                <span className='text-sm font-medium text-gray-700'>{region}</span>
                                <div className='flex items-center gap-2'>
                                    <button 
                                        onClick={() => setShowFareModal(true)}
                                        className='text-primary hover:text-primary-dark text-sm'
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => removeRegion(region)}
                                        className='text-red-500 hover:text-red-600 text-sm'
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                        {selectedRegions.length === 0 && (
                            <p className='text-gray-500 text-sm text-center py-4'>No regions selected</p>
                        )}
                    </div>
                </div>

                {/* GST & Fare Settings */}
                <div className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <FaReceipt className='text-primary' />
                        GST & Fare Settings
                    </h3>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>GST Rate (%)</label>
                            <input 
                                type='number' 
                                value={gstRate} 
                                onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                                min='0'
                                max='100'
                            />
                        </div>
                        <div className='bg-gray-50 p-3 rounded-lg'>
                            <p className='text-sm text-gray-600'>Sample Calculation (₹1000)</p>
                            <div className='text-xs text-gray-500 mt-1'>
                                <p>Base Amount: ₹{calculateGST(1000).originalAmount}</p>
                                <p>GST ({gstRate}%): ₹{calculateGST(1000).gstAmount.toFixed(2)}</p>
                                <p>Total: ₹{calculateGST(1000).totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <MdPayment className='text-primary' />
                        Payment Method
                    </h3>
                    <div className='space-y-3'>
                        <label className='flex items-center space-x-3 cursor-pointer'>
                            <input 
                                type='radio' 
                                name='paymentMethod' 
                                value='direct'
                                checked={paymentMethod === 'direct'}
                                onChange={(e) => updatePaymentMethod(e.target.value)}
                                className='text-primary focus:ring-primary'
                            />
                            <span className='text-sm font-medium text-gray-700'>Direct from Customer</span>
                        </label>
                        <label className='flex items-center space-x-3 cursor-pointer'>
                            <input 
                                type='radio' 
                                name='paymentMethod' 
                                value='sg_finserv'
                                checked={paymentMethod === 'sg_finserv'}
                                onChange={(e) => updatePaymentMethod(e.target.value)}
                                className='text-primary focus:ring-primary'
                            />
                            <span className='text-sm font-medium text-gray-700'>SG Finserv</span>
                        </label>
                    </div>
                    <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
                        <p className='text-xs text-blue-700'>
                            Current: {paymentMethod === 'direct' ? 'Direct Payment' : 'SG Finserv Payment'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7'>
                {/* Sales Performance */}
                <div className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <FaChartBar className='text-primary' />
                        Sales Performance
                    </h3>
                    <Chart options={chartData.options} series={chartData.series} type='bar' height={300} />
                </div>

                {/* Top Performing Regions */}
                <div className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <MdAnalytics className='text-primary' />
                        Top Performing Regions
                    </h3>
                    <div className='space-y-3'>
                        {analytics.topRegions && analytics.topRegions.length > 0 ? (
                            analytics.topRegions.map((region, index) => (
                                <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                    <div className='flex items-center gap-3'>
                                        <span className='w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center'>
                                            {index + 1}
                                        </span>
                                        <span className='text-sm font-medium text-gray-700'>{region.name}</span>
                                    </div>
                                    <span className='text-sm font-semibold text-primary'>₹{region.revenue}</span>
                                </div>
                            ))
                        ) : (
                            <div className='text-center py-8 text-gray-500'>
                                <FaMapMarkerAlt className='text-3xl mx-auto mb-2' />
                                <p>No regional data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Commodities & Revenue Breakdown */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7'>
                {/* Top Selling Commodities */}
                <div className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <MdProductionQuantityLimits className='text-primary' />
                        Top Selling Commodities
                    </h3>
                    <div className='space-y-3'>
                        {analytics.topCommodities && analytics.topCommodities.length > 0 ? (
                            analytics.topCommodities.map((commodity, index) => (
                                <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                    <div className='flex items-center gap-3'>
                                        <span className='w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center'>
                                            {index + 1}
                                        </span>
                                        <div>
                                            <span className='text-sm font-medium text-gray-700 block'>{commodity.name}</span>
                                            <span className='text-xs text-gray-500'>{commodity.quantity} sold</span>
                                        </div>
                                    </div>
                                    <span className='text-sm font-semibold text-green-600'>₹{commodity.revenue}</span>
                                </div>
                            ))
                        ) : (
                            <div className='text-center py-8 text-gray-500'>
                                <MdProductionQuantityLimits className='text-3xl mx-auto mb-2' />
                                <p>No commodity data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue Breakdown */}
                <div className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <MdCurrencyExchange className='text-primary' />
                        Revenue Breakdown
                    </h3>
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center p-3 bg-green-50 rounded-lg'>
                            <span className='text-sm font-medium text-gray-700'>Total Revenue</span>
                            <span className='text-lg font-bold text-green-600'>₹{analytics.revenueBreakdown?.total || 0}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-blue-50 rounded-lg'>
                            <span className='text-sm font-medium text-gray-700'>Commission Earned</span>
                            <span className='text-lg font-bold text-blue-600'>₹{analytics.revenueBreakdown?.commission || 0}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-purple-50 rounded-lg'>
                            <span className='text-sm font-medium text-gray-700'>GST Collected</span>
                            <span className='text-lg font-bold text-purple-600'>₹{analytics.revenueBreakdown?.gst || 0}</span>
                        </div>
                        <div className='flex justify-between items-center p-3 bg-orange-50 rounded-lg'>
                            <span className='text-sm font-medium text-gray-700'>Net Profit</span>
                            <span className='text-lg font-bold text-orange-600'>₹{analytics.revenueBreakdown?.profit || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Messages Section */}
            <div className='w-full flex flex-wrap mt-7'>
                {/* Sales Chart */}
                <div className='w-full lg:w-7/12 lg:pr-3'>
                    <div className='w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                                <FaChartLine className='text-primary' />
                                Sales Analytics
                            </h3>
                        </div>
                        <Chart options={chartData.options} series={chartData.series} type='bar' height={350} />
                    </div>
                </div>

                {/* Recent Messages */}
                <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
                    <div className='w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='font-semibold text-lg text-gray-900 flex items-center gap-2'>
                                <FaMessage className='text-primary' /> Recent Messages
                            </h2>
                            <Link to='/seller/messages' className='font-semibold text-sm text-primary hover:text-primary-dark'>View All</Link>
                        </div>

                        <div className='flex flex-col gap-2 pt-2'>
                            {recentMessage && recentMessage.length > 0 ? (
                                <ol className='relative border-l-2 border-gray-200 ml-4'>
                                    {recentMessage.map((m, i) => (
                                        <li key={i} className='mb-3 ml-6'>
                                            <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-primary rounded-full z-10'>
                                                {m.senderId === userInfo?._id ? (
                                                    <img className='w-full rounded-full h-full shadow-lg' src={userInfo?.image || customer} alt="" />
                                                ) : (
                                                    <img className='w-full rounded-full h-full shadow-lg' src={customer} alt="" />
                                                )}
                                            </div>
                                            <div className='p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm'>
                                                <div className='flex justify-between items-center mb-2'>
                                                    <Link className='text-md font-normal text-gray-700'>{m.senderName}</Link>
                                                    <time className='mb-1 text-sm font-normal text-gray-500 sm:order-last sm:mb-0'>
                                                        {moment(m.createdAt).startOf('hour').fromNow()}
                                                    </time>
                                                </div>
                                                <div className='p-2 text-xs font-normal bg-white rounded-lg border border-gray-100 text-gray-600'>
                                                    {m.message}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <div className='text-center py-8 text-gray-400'>
                                    <FaMessage className='text-4xl mx-auto mb-2' />
                                    <p>No recent messages</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className='w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow mt-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='font-semibold text-lg text-gray-900 flex items-center gap-2'>
                        <FaCartShopping className='text-primary' /> Recent Orders
                    </h2>
                    <Link to='/seller/orders' className='font-semibold text-sm text-primary hover:text-primary-dark'>View All</Link>
                </div>

                <div className='relative overflow-x-auto'>
                    {recentOrder && recentOrder.length > 0 ? (
                        <table className='w-full text-sm text-left text-gray-700'>
                            <thead className='text-sm text-gray-900 uppercase border-b border-gray-200'>
                                <tr>
                                    <th scope='col' className='py-3 px-4'>Order ID</th>
                                    <th scope='col' className='py-3 px-4'>Price</th>
                                    <th scope='col' className='py-3 px-4'>Payment Status</th>
                                    <th scope='col' className='py-3 px-4'>Order Status</th>
                                    <th scope='col' className='py-3 px-4'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrder.map((d, i) => (
                                    <tr key={i} className='hover:bg-gray-50 border-b border-gray-100'>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            #{d._id?.substring(0, 8)}...
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            ₹{d.price?.toFixed(2) || '0.00'}
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                d.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                                                d.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {d.payment_status}
                                            </span>
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                d.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                                d.delivery_status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {d.delivery_status}
                                            </span>
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            <Link 
                                                to={`/seller/dashboard/order/details/${d._id}`}
                                                className='text-primary hover:text-primary-dark font-medium'
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className='text-center py-8 text-gray-400'>
                            <FaCartShopping className='text-4xl mx-auto mb-2' />
                            <p>No recent orders</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {/* Region Selection Modal */}
            {showRegionModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-2xl p-6 max-w-md w-full mx-4'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Add Sales Region</h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Select Region</label>
                                <select 
                                    value={newRegion} 
                                    onChange={(e) => setNewRegion(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                                >
                                    <option value=''>Choose a region...</option>
                                    {availableRegions.filter(region => !selectedRegions.includes(region)).map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex gap-3'>
                                <button 
                                    onClick={addRegion}
                                    disabled={!newRegion}
                                    className='flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    Add Region
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowRegionModal(false)
                                        setNewRegion('')
                                    }}
                                    className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Fare Setting Modal */}
            {showFareModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-2xl p-6 max-w-md w-full mx-4'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Set Region Fare</h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Region</label>
                                <select 
                                    value={newRegion} 
                                    onChange={(e) => setNewRegion(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                                >
                                    <option value=''>Choose a region...</option>
                                    {selectedRegions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Fixed Fare (₹)</label>
                                <input 
                                    type='number' 
                                    value={newFare} 
                                    onChange={(e) => setNewFare(e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                                    placeholder='Enter fare amount'
                                />
                            </div>
                            <div className='bg-gray-50 p-3 rounded-lg'>
                                <p className='text-sm text-gray-600'>Fare includes commission and will be added to product cost</p>
                            </div>
                            <div className='flex gap-3'>
                                <button 
                                    onClick={() => {
                                        if (newRegion && newFare) {
                                            updateFare(newRegion, newFare)
                                            setShowFareModal(false)
                                            setNewRegion('')
                                            setNewFare('')
                                        }
                                    }}
                                    disabled={!newRegion || !newFare}
                                    className='flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    Set Fare
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowFareModal(false)
                                        setNewRegion('')
                                        setNewFare('')
                                    }}
                                    className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;