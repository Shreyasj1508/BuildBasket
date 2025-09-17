import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import api from '../../api/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    const [parPage] = useState(10);

    useEffect(() => {
        fetchCategories();
    }, [currentPage, searchTerm]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/category-get?page=${currentPage}&parPage=${parPage}&searchValue=${searchTerm}`);
            
            if (response.data.success) {
                setCategories(response.data.categorys);
                setTotalCategories(response.data.totalCategory);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await api.delete(`/admin/category-delete/${categoryId}`);
                if (response.data.success) {
                    toast.success('Category deleted successfully');
                    fetchCategories();
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Failed to delete category');
            }
        }
    };

    const totalPages = Math.ceil(totalCategories / parPage);

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold'>Admin Categories</h2>
                        <div className='h-8 w-32 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className='bg-gray-100 rounded-lg p-4 animate-pulse'>
                                <div className='h-32 bg-gray-200 rounded mb-3'></div>
                                <div className='h-4 bg-gray-200 rounded mb-2'></div>
                                <div className='h-3 bg-gray-200 rounded mb-2'></div>
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
                        <BiCategory className='text-2xl text-blue-600' />
                        <h2 className='text-xl font-semibold'>Admin Categories Management</h2>
                        <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>
                            {totalCategories} categories
                        </span>
                    </div>
                    <button 
                        onClick={() => {/* Add category modal or navigate to add page */}}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
                    >
                        <FaPlus className='text-sm' />
                        Add Category
                    </button>
                </div>

                {/* Search */}
                <div className='flex flex-col md:flex-row gap-4 mb-6'>
                    <div className='flex-1'>
                        <input
                            type="text"
                            placeholder="Search categories by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                {categories && categories.length > 0 ? (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {categories.map((category) => (
                                <div key={category._id} className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow'>
                                    {/* Category Image */}
                                    <div className='relative h-48 bg-gray-100'>
                                        <img
                                            src={category.image || '/images/placeholder.jpg'}
                                            alt={category.name}
                                            className='w-full h-full object-cover'
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    </div>

                                    {/* Category Info */}
                                    <div className='p-4'>
                                        <h3 className='font-semibold text-gray-800 mb-2 line-clamp-2'>
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                                                {category.description}
                                            </p>
                                        )}
                                        <div className='text-xs text-gray-500 mb-3'>
                                            Slug: {category.slug}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {/* Edit category modal or navigate to edit page */}}
                                                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors'
                                            >
                                                <FaEdit className='text-xs' />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
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
                        <BiCategory className='text-6xl text-gray-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>No categories found</h3>
                        <p className='text-gray-500 mb-4'>
                            {searchTerm 
                                ? 'Try adjusting your search criteria'
                                : 'Start by adding your first category'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => {/* Add category modal or navigate to add page */}}
                                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2'
                            >
                                <FaPlus />
                                Add Your First Category
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
