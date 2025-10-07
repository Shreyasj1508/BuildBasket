import React, { useEffect, useState } from 'react';
import { LuArrowDownSquare } from "react-icons/lu";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {

    const dispatch = useDispatch()

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] =  useState(false)

    const {myOrders,totalOrder } = useSelector(state => state.order)

    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_admin_orders(obj))
    },[searchValue,currentPage,parPage])

 
    return (
        <div className='px-2 lg:px-7 py-5 min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-100'>
            <div className='w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20'>
                {/* Enhanced Header */}
                <div className='flex items-center gap-4 mb-8'>
                    <div className='p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg'>
                        <LuArrowDownSquare className='text-white text-3xl' />
                    </div>
                    <div>
                        <h2 className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'>
                            Orders Management
                        </h2>
                        <p className='text-gray-600 text-lg font-medium'>Manage and track all platform orders</p>
                    </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                    <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fadeInUp'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm'>
                                <LuArrowDownSquare className='text-white text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-white text-opacity-90 uppercase tracking-wide'>
                                Total Orders
                            </h3>
                            <p className='text-3xl font-bold text-white'>
                                {totalOrder?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fadeInUp' style={{ animationDelay: '100ms' }}>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm'>
                                <LuArrowDownSquare className='text-white text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-white text-opacity-90 uppercase tracking-wide'>
                                Completed
                            </h3>
                            <p className='text-3xl font-bold text-white'>
                                {myOrders?.filter(o => o.delivery_status === 'delivered').length || '0'}
                            </p>
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fadeInUp' style={{ animationDelay: '200ms' }}>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm'>
                                <LuArrowDownSquare className='text-white text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-white text-opacity-90 uppercase tracking-wide'>
                                Processing
                            </h3>
                            <p className='text-3xl font-bold text-white'>
                                {myOrders?.filter(o => o.delivery_status === 'processing').length || '0'}
                            </p>
                        </div>
                    </div>

                    <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fadeInUp' style={{ animationDelay: '300ms' }}>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm'>
                                <LuArrowDownSquare className='text-white text-xl' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium text-white text-opacity-90 uppercase tracking-wide'>
                                Pending
                            </h3>
                            <p className='text-3xl font-bold text-white'>
                                {myOrders?.filter(o => o.delivery_status === 'pending').length || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Controls */}
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                    <div className='flex items-center gap-4'>
                        <select onChange={(e) => setParPage(parseInt(e.target.value))} className='px-4 py-3 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'>
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option> 
                        </select>
                        
                        <input onChange={e => setSearchValue(e.target.value)} value={searchValue} className='px-6 py-3 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 font-medium' type="text" placeholder='Search orders...' /> 
                    </div>
                </div>


                {/* Enhanced Orders Table */}
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fadeInUp'>
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg'>
                            <LuArrowDownSquare className='text-white text-xl' />
                        </div>
                        <div>
                            <h3 className='text-2xl font-bold text-gray-800'>Orders List</h3>
                            <p className='text-gray-600'>Complete order management and tracking</p>
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left text-gray-500'>
                            <thead className='text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl'>
                                <tr>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Order ID</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Price</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Payment Status</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Order Status</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Action</th>
                                    <th className='px-6 py-4 font-semibold text-gray-800'>Details</th>
                                </tr>
                            </thead>
                            <tbody>

                                {myOrders.map((o, i) => (
                                    <>
                                    <tr 
                                        key={i} 
                                        className='bg-white border-b hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-300'
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <td className='px-6 py-4 font-semibold text-gray-900 text-lg'>
                                            #{o._id?.substring(0, 8)}...
                                        </td>
                                        <td className='px-6 py-4 font-bold text-lg text-orange-600'>
                                            ₹{o.price?.toFixed(2) || "0.00"}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className={`px-3 py-2 text-sm font-semibold rounded-full shadow-lg ${
                                                o.payment_status === "paid" 
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                                    : o.payment_status === "pending"
                                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                                                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                            }`}>
                                                {o.payment_status}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className={`px-3 py-2 text-sm font-semibold rounded-full shadow-lg ${
                                                o.delivery_status === "delivered" 
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                                    : o.delivery_status === "processing"
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                                            }`}>
                                                {o.delivery_status}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <Link 
                                                to={`/admin/dashboard/order/details/${o._id}`}
                                                className='px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <button
                                                onClick={(e) => setShow(o._id)}
                                                className='p-3 text-orange-600 hover:bg-orange-100 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'
                                                title='Toggle Details'
                                            >
                                                <LuArrowDownSquare className='text-lg' />
                                            </button>
                                        </td>
                                    </tr> 
            
                                    {show === o._id && o.suborder && o.suborder.length > 0 && (
                                        <tr>
                                            <td colSpan="6" className='px-6 py-4 bg-gradient-to-r from-orange-50 to-orange-100'>
                                                {/* Suborder Details */}
                                                <div className='space-y-3'>
                                                    <h4 className='font-semibold text-gray-800 text-lg mb-3'>Sub Orders:</h4>
                                                    <div className='space-y-2'>
                                                        {o.suborder.map((so, subIndex) => (
                                                            <div key={subIndex} className='flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300'>
                                                                <div className='flex items-center gap-6'>
                                                                    <span className='font-semibold text-gray-800'>#{so._id?.substring(0, 8)}...</span>
                                                                    <span className='font-bold text-orange-600'>₹{so.price?.toFixed(2) || "0.00"}</span>
                                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                        so.payment_status === "paid" 
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : so.payment_status === "pending"
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {so.payment_status}
                                                                    </span>
                                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                        so.delivery_status === "delivered" 
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : so.delivery_status === "processing"
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                        {so.delivery_status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </>
                                ))}

                                {myOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className='py-12 text-center'>
                                            <div className='flex flex-col items-center gap-4'>
                                                <div className='p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center'>
                                                    <LuArrowDownSquare className='text-3xl text-gray-400' />
                                                </div>
                                                <h3 className='text-xl font-semibold text-gray-700'>No orders found</h3>
                                                <p className='text-gray-500'>Orders will appear here once customers start placing them</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Enhanced Pagination */}
                {totalOrder > parPage && (
                    <div className='w-full flex justify-center mt-8'>
                        <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-200'>
                            <Pagination 
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={totalOrder}
                                parPage={parPage}
                                showItem={4}
                            />
                        </div>
                    </div>
                )}
                    



            </div> 
        </div>
    );
};

export default Orders;