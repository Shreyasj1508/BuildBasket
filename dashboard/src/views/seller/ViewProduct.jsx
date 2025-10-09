import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaShoppingCart, FaTag } from 'react-icons/fa';
import { MdProductionQuantityLimits, MdCategory, MdBusiness } from 'react-icons/md';
import { get_product } from '../../store/Reducers/productReducer';
import { messageClear } from '../../store/Reducers/authReducer';

const ViewProduct = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { product, loading, errorMessage } = useSelector(state => state.product);

    useEffect(() => {
        if (productId) {
            dispatch(get_product(productId));
        }
        return () => {
            dispatch(messageClear());
        };
    }, [dispatch, productId]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            // dispatch(delete_product(productId));
            console.log('Delete functionality to be implemented');
        }
    };

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='animate-pulse'>
                        <div className='h-8 w-32 bg-gray-200 rounded mb-4'></div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                            <div className='h-96 bg-gray-200 rounded'></div>
                            <div className='space-y-4'>
                                <div className='h-6 bg-gray-200 rounded'></div>
                                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                                <div className='h-8 bg-gray-200 rounded w-24'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        {errorMessage}
                    </div>
                    <Link
                        to='/seller/dashboard/products'
                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2'
                    >
                        <FaArrowLeft />
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='text-center py-12'>
                        <MdProductionQuantityLimits className='text-6xl text-gray-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>Product not found</h3>
                        <p className='text-gray-500 mb-4'>The product you're looking for doesn't exist or has been removed.</p>
                        <Link
                            to='/seller/dashboard/products'
                            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2'
                        >
                            <FaArrowLeft />
                            Back to Products
                        </Link>
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
                    <div className='flex items-center gap-4'>
                        <Link
                            to='/seller/dashboard/products'
                            className='bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors'
                        >
                            <FaArrowLeft />
                            Back
                        </Link>
                        <div className='flex items-center gap-2'>
                            <MdProductionQuantityLimits className='text-2xl text-blue-600' />
                            <h2 className='text-xl font-semibold'>Product Details</h2>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Link
                            to={`/seller/dashboard/edit-product/${product._id}`}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
                        >
                            <FaEdit />
                            Edit Product
                        </Link>
                        <button
                            onClick={handleDelete}
                            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
                        >
                            <FaTrash />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Product Details */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Product Images */}
                    <div className='space-y-4'>
                        <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                            <img
                                src={product.images?.[0] || '/images/placeholder.jpg'}
                                alt={product.name}
                                className='w-full h-full object-cover'
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.jpg';
                                }}
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className='grid grid-cols-4 gap-2'>
                                {product.images.slice(1, 5).map((image, index) => (
                                    <div key={index} className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 2}`}
                                            className='w-full h-full object-cover'
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className='space-y-6'>
                        {/* Basic Info */}
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800 mb-2'>{product.name}</h1>
                            <div className='flex items-center gap-4 mb-4'>
                                <div className='flex items-center gap-1'>
                                    <FaStar className='text-yellow-400' />
                                    <span className='text-sm text-gray-600'>{product.rating || 'No rating'}</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${
                                    product.status === 'active' ? 'bg-green-500 text-white' :
                                    product.status === 'inactive' ? 'bg-red-500 text-white' :
                                    'bg-yellow-500 text-white'
                                }`}>
                                    {product.status}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='bg-gray-50 p-4 rounded-lg'>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-sm text-gray-600'>Price</span>
                                <div className='flex items-center gap-2'>
                                    <span className='text-2xl font-bold text-green-600'>
                                        ${product.price?.toFixed(2)}
                                    </span>
                                    {product.discount > 0 && (
                                        <span className='text-sm text-gray-500 line-through'>
                                            ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {product.discount > 0 && (
                                <div className='flex items-center gap-1 text-red-600'>
                                    <FaTag className='text-sm' />
                                    <span className='text-sm font-medium'>{product.discount}% OFF</span>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3'>
                                <MdCategory className='text-gray-500' />
                                <div>
                                    <span className='text-sm text-gray-600'>Category</span>
                                    <p className='font-medium'>{product.category}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <MdBusiness className='text-gray-500' />
                                <div>
                                    <span className='text-sm text-gray-600'>Brand</span>
                                    <p className='font-medium'>{product.brand}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <FaShoppingCart className='text-gray-500' />
                                <div>
                                    <span className='text-sm text-gray-600'>Stock</span>
                                    <p className='font-medium'>{product.stock} units</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div>
                                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
                            </div>
                        )}

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div>
                                <h3 className='text-lg font-semibold mb-2'>Specifications</h3>
                                <div className='bg-gray-50 p-4 rounded-lg'>
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className='flex justify-between py-1 border-b border-gray-200 last:border-b-0'>
                                            <span className='text-sm text-gray-600 capitalize'>{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className='text-sm font-medium'>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <span className='text-gray-600'>Created</span>
                                <p className='font-medium'>{new Date(product.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className='text-gray-600'>Last Updated</span>
                                <p className='font-medium'>{new Date(product.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;
