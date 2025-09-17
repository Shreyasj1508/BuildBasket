import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaEye, FaPlus, FaUser } from 'react-icons/fa';
import { MdProductionQuantityLimits } from 'react-icons/md';
import api from '../../api/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [parPage] = useState(10);

    useEffect(() => {
        fetchProducts();
        fetchSellers();
    }, [currentPage, searchTerm, filterStatus]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/products-get?page=${currentPage}&parPage=${parPage}&searchValue=${searchTerm}`);
            
            if (response.data.success) {
                setProducts(response.data.products);
                setTotalProducts(response.data.totalProduct);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchSellers = async () => {
        try {
            const response = await api.get('/admin/sellers-get');
            if (response.data.success) {
                setSellers(response.data.sellers);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await api.delete(`/admin/product-delete/${productId}`);
                if (response.data.success) {
                    toast.success('Product deleted successfully');
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

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

    const totalPages = Math.ceil(totalProducts / parPage);

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold'>Admin Products</h2>
                        <div className='h-8 w-32 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className='bg-gray-100 rounded-lg p-4 animate-pulse'>
                                <div className='h-32 bg-gray-200 rounded mb-3'></div>
                                <div className='h-4 bg-gray-200 rounded mb-2'></div>
                                <div className='h-3 bg-gray-200 rounded mb-2'></div>
                                <div className='h-3 bg-gray-200 rounded w-1/2'></div>
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
                    <div className='flex items-center gap-2'>
                        <MdProductionQuantityLimits className='text-2xl text-blue-600' />
                        <h2 className='text-xl font-semibold'>Admin Products Management</h2>
                        <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>
                            {totalProducts} products
                        </span>
                    </div>
                    <Link 
                        to='/admin/dashboard/add-product'
                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
                    >
                        <FaPlus className='text-sm' />
                        Add Product
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className='flex flex-col md:flex-row gap-4 mb-6'>
                    <div className='flex-1'>
                        <input
                            type="text"
                            placeholder="Search products by name, category, or brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {products && products.length > 0 ? (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {products.map((product) => (
                                <div key={product._id} className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow'>
                                    {/* Product Image */}
                                    <div className='relative h-48 bg-gray-100'>
                                        <img
                                            src={product.images?.[0] || '/images/placeholder.jpg'}
                                            alt={product.name}
                                            className='w-full h-full object-cover'
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                        <div className='absolute top-2 right-2'>
                                            {getStatusBadge(product.status)}
                                        </div>
                                        {product.discount > 0 && (
                                            <div className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>
                                                {product.discount}% OFF
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className='p-4'>
                                        <h3 className='font-semibold text-gray-800 mb-2 line-clamp-2'>
                                            {product.name}
                                        </h3>
                                        <div className='flex items-center justify-between mb-2'>
                                            <span className='text-sm text-gray-600'>{product.category}</span>
                                            <span className='text-sm text-gray-500'>{product.brand}</span>
                                        </div>
                                        <div className='flex items-center justify-between mb-3'>
                                            <div className='flex items-center gap-1'>
                                                <span className='text-lg font-bold text-green-600'>
                                                    ${product.price?.toFixed(2)}
                                                </span>
                                                {product.discount > 0 && (
                                                    <span className='text-sm text-gray-500 line-through'>
                                                        ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className='text-sm text-gray-600'>
                                                Stock: {product.stock}
                                            </span>
                                        </div>

                                        {/* Seller Info */}
                                        {product.sellerId && (
                                            <div className='flex items-center gap-1 mb-3 text-sm text-gray-600'>
                                                <FaUser className='text-xs' />
                                                <span>{product.sellerId.name || product.sellerId.shopName}</span>
                                            </div>
                                        )}

                                        {/* Rating */}
                                        {product.rating && (
                                            <div className='flex items-center gap-1 mb-3'>
                                                <div className='flex text-yellow-400'>
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className='text-sm text-gray-600'>({product.rating})</span>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className='flex gap-2'>
                                            <Link
                                                to={`/admin/dashboard/product/edit/${product._id}`}
                                                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors'
                                            >
                                                <FaEdit className='text-xs' />
                                                Edit
                                            </Link>
                                            <Link
                                                to={`/admin/dashboard/product/view/${product._id}`}
                                                className='flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors'
                                            >
                                                <FaEye className='text-xs' />
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className='flex-1 bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors'
                                            >
                                                <FaTrash className='text-xs' />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='flex justify-center items-center gap-2 mt-6'>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className='px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                >
                                    Previous
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-2 border rounded-lg ${
                                            currentPage === i + 1
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className='px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                >
                                    Next
                                </button>
                            </div>
                        )}
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
                            <Link
                                to='/admin/dashboard/add-product'
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

export default AdminProducts;
