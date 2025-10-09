import React, { useState, useEffect, useRef } from 'react';
import { FaFileExcel, FaUpload, FaDownload, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { MdCloudUpload, MdInventory } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import api from '../../api/api';
import toast from 'react-hot-toast';

const CommodityManagement = () => {
    const [commodities, setCommodities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResults, setUploadResults] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCommodities, setTotalCommodities] = useState(0);
    const [parPage] = useState(10);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCommodity, setEditingCommodity] = useState(null);
    const fileInputRef = useRef(null);

    // Form state for adding/editing commodities
    const [commodityForm, setCommodityForm] = useState({
        name: '',
        category: '',
        description: '',
        unit: '',
        basePrice: '',
        image: ''
    });

    useEffect(() => {
        fetchCommodities();
    }, [currentPage, searchTerm]);

    const fetchCommodities = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/commodities?page=${currentPage}&parPage=${parPage}&searchValue=${searchTerm}`);
            
            if (response.data.success) {
                setCommodities(response.data.commodities || []);
                setTotalCommodities(response.data.totalCommodities || 0);
            }
        } catch (error) {
            console.error('Error fetching commodities:', error);
            // If endpoint doesn't exist, use categories as commodities for now
            try {
                const categoryResponse = await api.get(`/admin/category-get?page=${currentPage}&parPage=${parPage}&searchValue=${searchTerm}`);
                if (categoryResponse.data.success) {
                    const mappedCommodities = categoryResponse.data.categorys.map(cat => ({
                        _id: cat._id,
                        name: cat.name,
                        category: 'General',
                        description: cat.description || 'No description available',
                        unit: 'Unit',
                        basePrice: 0,
                        image: cat.image,
                        createdAt: cat.createdAt
                    }));
                    setCommodities(mappedCommodities);
                    setTotalCommodities(categoryResponse.data.totalCategory || 0);
                }
            } catch (fallbackError) {
                toast.error('Failed to fetch commodities');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['.xlsx', '.xls'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
            
            if (allowedTypes.includes(fileExtension)) {
                setSelectedFile(file);
                toast.success('File selected successfully!');
            } else {
                toast.error('Please select an Excel file (.xlsx or .xls)');
                resetFileInput();
            }
        }
    };

    const resetFileInput = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleExcelUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first!');
            return;
        }

        setUploading(true);
        setUploadResults(null);

        try {
            const formData = new FormData();
            formData.append('excelFile', selectedFile);

            const response = await api.post('/excel/import/commodities', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setUploadResults(response.data);
                toast.success(`Successfully imported ${response.data.success || 0} commodities`);
                fetchCommodities();
                setShowUploadModal(false);
                resetFileInput();
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload commodities');
        } finally {
            setUploading(false);
        }
    };

    const handleAddCommodity = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/commodities', commodityForm);
            if (response.data.success) {
                toast.success('Commodity added successfully');
                fetchCommodities();
                setShowAddModal(false);
                setCommodityForm({
                    name: '',
                    category: '',
                    description: '',
                    unit: '',
                    basePrice: '',
                    image: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add commodity');
        }
    };

    const handleEditCommodity = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/admin/commodities/${editingCommodity._id}`, commodityForm);
            if (response.data.success) {
                toast.success('Commodity updated successfully');
                fetchCommodities();
                setEditingCommodity(null);
                setCommodityForm({
                    name: '',
                    category: '',
                    description: '',
                    unit: '',
                    basePrice: '',
                    image: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update commodity');
        }
    };

    const handleDeleteCommodity = async (commodityId) => {
        if (window.confirm('Are you sure you want to delete this commodity?')) {
            try {
                const response = await api.delete(`/admin/commodities/${commodityId}`);
                if (response.data.success) {
                    toast.success('Commodity deleted successfully');
                    fetchCommodities();
                }
            } catch (error) {
                toast.error('Failed to delete commodity');
            }
        }
    };

    const downloadTemplate = () => {
        // Create a sample Excel template
        const templateData = [
            {
                name: 'Sample Commodity',
                category: 'Construction',
                description: 'Sample description',
                unit: 'Kg',
                basePrice: 100,
                image: 'https://example.com/image.jpg'
            }
        ];
        
        // Convert to CSV for download
        const csvContent = [
            'name,category,description,unit,basePrice,image',
            ...templateData.map(row => 
                `${row.name},${row.category},${row.description},${row.unit},${row.basePrice},${row.image}`
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'commodity_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportCommodities = async () => {
        try {
            const response = await api.get('/admin/commodities/export', {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `commodities_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            toast.success('Commodities exported successfully');
        } catch (error) {
            toast.error('Failed to export commodities');
        }
    };

    const totalPages = Math.ceil(totalCommodities / parPage);

    if (loading) {
        return (
            <div className='px-2 md:px-7 py-5'>
                <div className='w-full bg-white rounded-md p-4'>
                    <div className='animate-pulse'>
                        <div className='h-8 bg-gray-200 rounded w-1/3 mb-4'></div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className='bg-gray-100 rounded-lg p-4'>
                                    <div className='h-32 bg-gray-200 rounded mb-3'></div>
                                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                                    <div className='h-3 bg-gray-200 rounded'></div>
                                </div>
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
                        <div className='p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg'>
                            <MdInventory className='text-white text-3xl' />
                        </div>
                        <div>
                            <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent'>
                                Commodity Management
                            </h2>
                            <p className='text-gray-600 text-lg font-medium'>Manage commodities and upload via Excel</p>
                            <span className='bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mt-2 inline-block'>
                                {totalCommodities} commodities
                            </span>
                        </div>
                    </div>
                    
                    <div className='flex flex-wrap gap-3'>
                        <button 
                            onClick={() => setShowUploadModal(true)}
                            className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold'
                        >
                            <FaFileExcel className="text-xl" />
                            Upload Excel
                        </button>
                        <button 
                            onClick={downloadTemplate}
                            className='bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold'
                        >
                            <FaDownload className="text-xl" />
                            Template
                        </button>
                        <button 
                            onClick={exportCommodities}
                            className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold'
                        >
                            <FaDownload className="text-xl" />
                            Export
                        </button>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold'
                        >
                            <FaPlus className="text-xl" />
                            Add Commodity
                        </button>
                    </div>
                </div>

                {/* Enhanced Search */}
                <div className='mb-8 animate-fadeInUp' style={{ animationDelay: '200ms' }}>
                    <div className='relative max-w-md'>
                        <input
                            type="text"
                            placeholder="Search commodities by name, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-6 py-4 pl-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl'
                        />
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Commodities Grid */}
                {commodities && commodities.length > 0 ? (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                            {commodities.map((commodity, index) => (
                                <div 
                                    key={commodity._id} 
                                    className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp'
                                    style={{ animationDelay: `${300 + index * 100}ms` }}
                                >
                                    {/* Commodity Image */}
                                    <div className='relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden'>
                                        <img
                                            src={commodity.image || '/images/placeholder.jpg'}
                                            alt={commodity.name}
                                            className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                        <div className='absolute top-4 right-4'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                                                commodity.status === 'active' 
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                                                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                            }`}>
                                                {commodity.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Commodity Info */}
                                    <div className='p-6'>
                                        <h3 className='font-bold text-gray-800 text-lg mb-3 line-clamp-2'>
                                            {commodity.name}
                                        </h3>
                                        <div className='space-y-2 mb-4'>
                                            <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                <BiCategory className='text-blue-500' />
                                                <span className='font-medium'>Category:</span> 
                                                <span className='text-gray-800'>{commodity.category}</span>
                                            </div>
                                            {commodity.unit && (
                                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                    <svg className='w-4 h-4 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                                                    </svg>
                                                    <span className='font-medium'>Unit:</span> 
                                                    <span className='text-gray-800'>{commodity.unit}</span>
                                                </div>
                                            )}
                                            {commodity.basePrice > 0 && (
                                                <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                    <svg className='w-4 h-4 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                                                    </svg>
                                                    <span className='font-medium'>Base Price:</span> 
                                                    <span className='text-gray-800 font-semibold'>₹{commodity.basePrice}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Enhanced Action Buttons */}
                                        <div className='flex justify-between items-center pt-4 border-t border-gray-200'>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => {
                                                        setEditingCommodity(commodity);
                                                        setCommodityForm({
                                                            name: commodity.name,
                                                            category: commodity.category,
                                                            description: commodity.description || '',
                                                            unit: commodity.unit || '',
                                                            basePrice: commodity.basePrice || '',
                                                            image: commodity.image || ''
                                                        });
                                                    }}
                                                    className='p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'
                                                    title='Edit'
                                                >
                                                    <FaEdit className='text-lg' />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCommodity(commodity._id)}
                                                    className='p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'
                                                    title='Delete'
                                                >
                                                    <FaTrash className='text-lg' />
                                                </button>
                                            </div>
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
                        <MdInventory className='text-6xl text-gray-300 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-600 mb-2'>No commodities found</h3>
                        <p className='text-gray-500 mb-4'>
                            {searchTerm 
                                ? 'Try adjusting your search criteria'
                                : 'Start by adding your first commodity or uploading from Excel'
                            }
                        </p>
                        {!searchTerm && (
                            <div className='flex justify-center gap-2'>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2'
                                >
                                    <FaPlus />
                                    Add Commodity
                                </button>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2'
                                >
                                    <FaFileExcel />
                                    Upload Excel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Excel Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Upload Commodities Excel</h3>
                        
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <MdCloudUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 mb-2">Select Excel file to upload</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Choose File
                                </button>
                                {selectedFile && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>
                            
                            <div className="text-sm text-gray-600">
                                <p className="mb-2">Excel should contain columns:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>name (required)</li>
                                    <li>category (required)</li>
                                    <li>description</li>
                                    <li>unit</li>
                                    <li>basePrice</li>
                                    <li>image (URL)</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleExcelUpload}
                                disabled={!selectedFile || uploading}
                                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload />
                                        Upload
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    resetFileInput();
                                }}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Commodity Modal */}
            {(showAddModal || editingCommodity) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingCommodity ? 'Edit Commodity' : 'Add New Commodity'}
                        </h3>
                        
                        <form onSubmit={editingCommodity ? handleEditCommodity : handleAddCommodity}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={commodityForm.name}
                                        onChange={(e) => setCommodityForm({...commodityForm, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter commodity name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={commodityForm.category}
                                        onChange={(e) => setCommodityForm({...commodityForm, category: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter category"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unit
                                    </label>
                                    <input
                                        type="text"
                                        value={commodityForm.unit}
                                        onChange={(e) => setCommodityForm({...commodityForm, unit: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Kg, Liter, Piece"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Base Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={commodityForm.basePrice}
                                        onChange={(e) => setCommodityForm({...commodityForm, basePrice: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter base price"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={commodityForm.image}
                                        onChange={(e) => setCommodityForm({...commodityForm, image: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter image URL"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={commodityForm.description}
                                        onChange={(e) => setCommodityForm({...commodityForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter description"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    {editingCommodity ? 'Update' : 'Add'} Commodity
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingCommodity(null);
                                        setCommodityForm({
                                            name: '',
                                            category: '',
                                            description: '',
                                            unit: '',
                                            basePrice: '',
                                            image: ''
                                        });
                                    }}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommodityManagement;
