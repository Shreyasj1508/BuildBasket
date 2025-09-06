import React, { useEffect, useState } from 'react';
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping, FaChartLine, FaMessage } from "react-icons/fa6";
import Chart from 'react-apexcharts'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_dashboard_data } from '../../store/Reducers/dashboardReducer';
import moment from 'moment';
import customer from '../../assets/demo.jpg'

const SellerDashboard = () => {
    const dispatch = useDispatch()
    const { totalSale, totalOrder, totalProduct, totalPendingOrder, recentOrder, recentMessage } = useSelector(state => state.dashboard)
    const { userInfo } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                setError(null)
                await dispatch(get_seller_dashboard_data())
            } catch (err) {
                setError('Failed to load dashboard data')
                console.error('Dashboard data error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [dispatch])

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
            {/* Dashboard Stats Cards */}
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                {/* Total Sales */}
                <div className='flex justify-between items-center p-5 bg-[#fae8e8] rounded-md gap-3 hover:shadow-lg transition-shadow'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>${totalSale?.toFixed(2) || '0.00'}</h2>
                        <span className='text-md font-medium'>Total Sales</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl'>
                        <MdCurrencyExchange className='text-[#fae8e8] shadow-lg' />
                    </div>
                </div>

                {/* Total Products */}
                <div className='flex justify-between items-center p-5 bg-[#fde2ff] rounded-md gap-3 hover:shadow-lg transition-shadow'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalProduct || 0}</h2>
                        <span className='text-md font-medium'>Products</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#760077] flex justify-center items-center text-xl'>
                        <MdProductionQuantityLimits className='text-[#fae8e8] shadow-lg' />
                    </div>
                </div>

                {/* Total Orders */}
                <div className='flex justify-between items-center p-5 bg-[#e9feea] rounded-md gap-3 hover:shadow-lg transition-shadow'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalOrder || 0}</h2>
                        <span className='text-md font-medium'>Orders</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#038000] flex justify-center items-center text-xl'>
                        <FaCartShopping className='text-[#fae8e8] shadow-lg' />
                    </div>
                </div>

                {/* Pending Orders */}
                <div className='flex justify-between items-center p-5 bg-[#ecebff] rounded-md gap-3 hover:shadow-lg transition-shadow'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalPendingOrder || 0}</h2>
                        <span className='text-md font-medium'>Pending Orders</span>
                    </div>
                    <div className='w-[40px] h-[47px] rounded-full bg-[#0200f8] flex justify-center items-center text-xl'>
                        <FaCartShopping className='text-[#fae8e8] shadow-lg' />
                    </div>
                </div>
            </div>

            {/* Charts and Messages Section */}
            <div className='w-full flex flex-wrap mt-7'>
                {/* Sales Chart */}
                <div className='w-full lg:w-7/12 lg:pr-3'>
                    <div className='w-full bg-[#6a5fdf] p-4 rounded-md'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-lg font-semibold text-[#d0d2d6]'>Sales Analytics</h3>
                            <FaChartLine className='text-[#d0d2d6] text-xl' />
                        </div>
                        <Chart options={chartData.options} series={chartData.series} type='bar' height={350} />
                    </div>
                </div>

                {/* Recent Messages */}
                <div className='w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0'>
                    <div className='w-full bg-[#6a5fdf] p-4 rounded-md text-[#d0d2d6]'>
                        <div className='flex justify-between items-center'>
                            <h2 className='font-semibold text-lg text-[#d0d2d6] pb-3 flex items-center gap-2'>
                                <FaMessage /> Recent Messages
                            </h2>
                            <Link to='/seller/messages' className='font-semibold text-sm text-[#d0d2d6] hover:text-white'>View All</Link>
                        </div>

                        <div className='flex flex-col gap-2 pt-6 text-[#d0d2d6]'>
                            {recentMessage && recentMessage.length > 0 ? (
                                <ol className='relative border-1 border-slate-600 ml-4'>
                                    {recentMessage.map((m, i) => (
                                        <li key={i} className='mb-3 ml-6'>
                                            <div className='flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#4c7fe2] rounded-full z-10'>
                                                {m.senderId === userInfo?._id ? (
                                                    <img className='w-full rounded-full h-full shadow-lg' src={userInfo?.image || customer} alt="" />
                                                ) : (
                                                    <img className='w-full rounded-full h-full shadow-lg' src={customer} alt="" />
                                                )}
                                            </div>
                                            <div className='p-3 bg-slate-800 rounded-lg border border-slate-600 shadow-sm'>
                                                <div className='flex justify-between items-center mb-2'>
                                                    <Link className='text-md font-normal'>{m.senderName}</Link>
                                                    <time className='mb-1 text-sm font-normal sm:order-last sm:mb-0'>
                                                        {moment(m.createdAt).startOf('hour').fromNow()}
                                                    </time>
                                                </div>
                                                <div className='p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800'>
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
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md mt-6'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg text-[#d0d2d6] pb-3'>Recent Orders</h2>
                    <Link to='/seller/orders' className='font-semibold text-sm text-[#d0d2d6] hover:text-white'>View All</Link>
                </div>

                <div className='relative overflow-x-auto'>
                    {recentOrder && recentOrder.length > 0 ? (
                        <table className='w-full text-sm text-left text-[#d0d2d6]'>
                            <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
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
                                    <tr key={i} className='hover:bg-slate-700'>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            #{d._id?.substring(0, 8)}...
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            ${d.price?.toFixed(2) || '0.00'}
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                d.payment_status === 'paid' ? 'bg-green-500' : 
                                                d.payment_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}>
                                                {d.payment_status}
                                            </span>
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                d.delivery_status === 'delivered' ? 'bg-green-500' : 
                                                d.delivery_status === 'processing' ? 'bg-blue-500' : 'bg-yellow-500'
                                            }`}>
                                                {d.delivery_status}
                                            </span>
                                        </td>
                                        <td scope='row' className='py-3 px-4 font-medium whitespace-nowrap'>
                                            <Link 
                                                to={`/seller/dashboard/order/details/${d._id}`}
                                                className='text-blue-400 hover:text-blue-300'
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
        </div>
    );
};

export default SellerDashboard;