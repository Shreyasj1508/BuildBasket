import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { get_seller_products, delete_product } from '../../store/Reducers/productReducer';
import { messageClear } from '../../store/Reducers/authReducer';
import { getProductImage, getImageUrl, handleImageError } from '../../utils/imageUtils';

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

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold'>Products</h2>
                        <div className='h-8 w-32 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                    <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12 gap-2 ml-4'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
                            <div key={i} className='bg-white rounded-lg p-2 shadow-md border border-gray-200 animate-pulse aspect-square flex flex-col'>
                                <div className='aspect-square bg-gray-200 rounded-md mb-2'></div>
                                <div className='h-3 bg-gray-200 rounded mb-1'></div>
                                <div className='flex justify-between mb-1'>
                                    <div className='h-2 bg-gray-200 rounded w-1/3'></div>
                                    <div className='h-2 bg-gray-200 rounded w-1/4'></div>
                                </div>
                                <div className='flex justify-between mb-2'>
                                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                                    <div className='h-2 bg-gray-200 rounded w-1/3'></div>
                                </div>
                                <div className='flex gap-1 mt-auto'>
                                    <div className='h-6 bg-gray-200 rounded-md flex-1'></div>
                                    <div className='h-6 bg-gray-200 rounded-md flex-1'></div>
                                    <div className='h-6 bg-gray-200 rounded-md flex-1'></div>
                                </div>
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
                        <div className='p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg'>
                            <MdProductionQuantityLimits className='text-2xl text-white' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>My Products</h2>
                            <p className='text-sm text-gray-600'>Manage your product inventory</p>
                        </div>
                        <span className='bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg'>
                            {filteredProducts?.length || 0} products
                        </span>
                    </div>
                    <button 
                        onClick={() => {
                            window.location.href = '/seller/dashboard/add-product';
                        }}
                        className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium'
                    >
                        <FaPlus className='text-sm' />
                        Add Product
                    </button>
                </div>

                {/* Search and Filter */}
                <div className='flex flex-col md:flex-row gap-4 mb-6'>
                    <div className='flex-1'>
                        <div className='relative'>
                            <input
                                type="text"
                                placeholder="Search products by name, category, or brand..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-300'
                            />
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <svg className='h-5 w-5 text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-300 bg-white'
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        {errorMessage}
                    </div>
                )}

                {/* Products Container */}
                <div className='w-full ml-4'>
                    {/* Products Grid */}
                    {filteredProducts && filteredProducts.length > 0 ? (
                        <>
                            <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12 gap-2'>
                                {filteredProducts.map((product) => (
                            <div key={product._id} className='group bg-white rounded-lg p-2 shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-400 transition-all duration-300 hover:transform hover:scale-[1.03] aspect-square flex flex-col'>
                                {/* Product Image */}
                                <div className='relative overflow-hidden rounded-md shadow-sm group-hover:shadow-md transition-all duration-300 mb-2 aspect-square'>
                                    <img
                                        src={getImageUrl(getProductImage(product.images))}
                                        alt={product.name}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                        onError={(e) => handleImageError(e, '/images/placeholder-product.png')}
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
                                <div className='flex flex-col gap-1 flex-grow'>
                                    <h3 className='text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2'>
                                        {product.name}
                                    </h3>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-xs text-gray-600 bg-gray-100 px-1 py-0.5 rounded-full text-xs'>{product.category}</span>
                                        <span className='text-xs text-gray-500'>{product.brand}</span>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-1'>
                                            <span className='text-sm font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent'>
                                                ₹{product.price?.toFixed(0)}
                                            </span>
                                            {product.discount > 0 && (
                                                <span className='text-xs text-gray-500 line-through'>
                                                    ₹{(product.price / (1 - product.discount / 100)).toFixed(0)}
                                                </span>
                                            )}
                                        </div>
                                        <span className='text-xs text-gray-600 bg-blue-50 px-1 py-0.5 rounded-full text-xs'>
                                            {product.stock}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    {product.rating && (
                                        <div className='flex items-center gap-1'>
                                            <div className='flex text-yellow-400'>
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-2 h-2 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className='text-xs text-gray-600 bg-yellow-50 px-1 py-0.5 rounded-full text-xs'>({product.rating})</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className='flex gap-1 mt-auto'>
                                        <Link
                                            to={`/seller/dashboard/edit-product/${product._id}`}
                                            className='flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-center py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                                            title="Edit Product"
                                        >
                                            <FaEdit className='text-xs' />
                                            <span className='text-xs'>Edit</span>
                                        </Link>
                                        <Link
                                            to={`/seller/dashboard/view-product/${product._id}`}
                                            className='flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-center py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                                            title="View Product"
                                        >
                                            <FaEye className='text-xs' />
                                            <span className='text-xs'>View</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this product?')) {
                                                    dispatch(delete_product(product._id));
                                                }
                                            }}
                                            className='flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-center py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105'
                                            title="Delete Product"
                                        >
                                            <FaTrash className='text-xs' />
                                            <span className='text-xs'>Del</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                                ))}
                            </div>
                        </>
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
                            <button
                                onClick={() => {
                                    console.log('Add Your First Product button clicked!');
                                    alert('Add Your First Product button clicked! Navigating to add product page...');
                                    window.location.href = '/seller/dashboard/add-product';
                                }}
                                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2'
                            >
                                <FaPlus />
                                Add Your First Product
                            </button>
                        )}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default Products;