import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { get_seller_products, delete_product } from '../../store/Reducers/productReducer';
import { messageClear } from '../../store/Reducers/authReducer';

const Products = () => {
    const dispatch = useDispatch();
    const { products, loading, errorMessage } = useSelector(state => state.product);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        dispatch(get_seller_products());
        return () => {
            dispatch(messageClear());
        };
    }, [dispatch]);

    // Filter products based on search term and status
    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'bg-green-500 text-white',
            inactive: 'bg-red-500 text-white',
            pending: 'bg-yellow-500 text-white'
        };
        
        return (
            <span className={`px-2 py-1 rounded text-xs ${statusClasses[status] || 'bg-gray-500 text-white'}`}>
                {status}
            </span>
        );
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(delete_product(productId));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='flex justify-between items-center mb-6'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md'>
                                <MdProductionQuantityLimits className='text-2xl text-white' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-800'>My Products</h2>
                                <p className='text-sm text-gray-600'>Manage your product inventory</p>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className='bg-white rounded-lg p-4 shadow-md animate-pulse'>
                                <div className='w-full h-48 bg-gray-200 rounded-lg mb-4'></div>
                                <div className='h-4 bg-gray-200 rounded mb-2'></div>
                                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
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
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md'>
                            <MdProductionQuantityLimits className='text-2xl text-white' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>My Products</h2>
                            <p className='text-sm text-gray-600'>Manage your product inventory</p>
                        </div>
                        <span className='bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-md'>
                            {filteredProducts?.length || 0} products
                        </span>
                    </div>
                    <Link 
                        to='/seller/dashboard/add-product'
                        className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium'
                    >
                        <FaPlus className='text-sm' />
                        Add Product
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className='flex flex-col md:flex-row gap-4 mb-6'>
                    <div className='flex-1'>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Search products...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300'
                            />
                            <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                    </div>
                    <div className='md:w-48'>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 bg-white'
                        >
                            <option value='all'>All Status</option>
                            <option value='active'>Active</option>
                            <option value='inactive'>Inactive</option>
                            <option value='pending'>Pending</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts && filteredProducts.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {filteredProducts.map((product) => (
                            <div key={product._id} className='group bg-white rounded-xl p-4 shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:transform hover:scale-[1.02]'>
                                {/* Product Image */}
                                <div className='relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 mb-4'>
                                    <img
                                        src={product.images?.[0] || '/images/placeholder.jpg'}
                                        alt={product.name}
                                        className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300'
                                        onError={(e) => {
                                            e.target.src = '/images/placeholder.jpg';
                                        }}
                                    />
                                    <div className='absolute top-2 right-2'>
                                        {getStatusBadge(product.status)}
                                    </div>
                                    {product.discount > 0 && (
                                        <div className='absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg'>
                                            -{product.discount}%
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className='flex flex-col gap-2'>
                                    <h3 className='text-sm font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2'>
                                        {product.name}
                                    </h3>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>
                                            {product.category}
                                        </span>
                                        <span className='text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full'>
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent'>
                                            ₹{product.price}
                                        </span>
                                        {product.discount > 0 && (
                                            <span className='text-xs text-gray-500 line-through'>
                                                ₹{Math.round(product.price / (1 - product.discount / 100))}
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full'>
                                            {product.brand}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <div className='flex items-center'>
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className='w-3 h-3 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className='text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded-full'>
                                            {product.rating || 4.5}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-2 mt-4'>
                                    <Link
                                        to={`/seller/dashboard/edit-product/${product._id}`}
                                        className='flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                                    >
                                        <FaEdit className='text-xs' />
                                        Edit
                                    </Link>
                                    <Link
                                        to={`/seller/dashboard/view-product/${product._id}`}
                                        className='flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                                    >
                                        <FaEye className='text-xs' />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className='flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                                    >
                                        <FaTrash className='text-xs' />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-12'>
                        <MdProductionQuantityLimits className='text-6xl text-gray-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>No products found</h3>
                        <p className='text-gray-500 mb-4'>
                            {searchTerm || filterStatus !== 'all' 
                                ? 'Try adjusting your search or filter criteria'
                                : 'Start by adding your first product'
                            }
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <Link
                                to='/seller/dashboard/add-product'
                                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2'
                            >
                                <FaPlus />
                                Add Your First Product
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;