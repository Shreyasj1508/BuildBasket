import React, { useState, useEffect, useRef } from 'react';
import { FaFileExcel, FaUpload, FaDownload, FaEdit, FaTrash, FaPlus, FaEye, FaUser, FaCreditCard, FaUsers, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { MdCloudUpload, MdPeople, MdPersonAdd } from 'react-icons/md';
import api from '../../api/api';
import toast from 'react-hot-toast';

const BuyerManagement = () => {
    const [buyers, setBuyers] = useState([]);
    
    // Enhanced StatCard component
    const StatCard = ({ title, value, change, icon, color, delay = 0 }) => (
        <div 
            className={`${color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fadeInUp`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                    {icon}
                </div>
                <div className="text-right">
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 text-sm font-semibold ${
                            change >= 0 ? 'text-green-200' : 'text-red-200'
                        }`}>
                            {change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                            {Math.abs(change)}%
                        </div>
                    )}
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
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResults, setUploadResults] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalBuyers, setTotalBuyers] = useState(0);
    const [parPage] = useState(10);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBuyer, setEditingBuyer] = useState(null);
    const [activeTab, setActiveTab] = useState('buyers'); // 'buyers' or 'credit-applications'
    const [creditApplications, setCreditApplications] = useState([]);
    const [stats, setStats] = useState({});
    const fileInputRef = useRef(null);

    // Form state for adding/editing buyers
    const [buyerForm, setBuyerForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        personalInfo: {
            occupation: '',
            company: ''
        },
        creditLimit: 0
    });

    useEffect(() => {
        if (activeTab === 'buyers') {
            fetchBuyers();
        } else {
            fetchCreditApplications();
        }
        fetchStats();
    }, [currentPage, searchTerm, activeTab]);

    const fetchBuyers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/buyers?page=${currentPage}&parPage=${parPage}&searchValue=${searchTerm}`);
            
            if (response.data.success) {
                setBuyers(response.data.buyers || []);
                setTotalBuyers(response.data.totalBuyers || 0);
            }
        } catch (error) {
            console.error('Error fetching buyers:', error);
            toast.error('Failed to fetch buyers');
        } finally {
            setLoading(false);
        }
    };

    const fetchCreditApplications = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/credit-applications?page=${currentPage}&parPage=${parPage}`);
            
            if (response.data.success) {
                setCreditApplications(response.data.applications || []);
                setTotalBuyers(response.data.totalApplications || 0);
            }
        } catch (error) {
            console.error('Error fetching credit applications:', error);
            toast.error('Failed to fetch credit applications');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/buyers/stats');
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
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

            const response = await api.post('/admin/buyers/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setUploadResults(response.data);
                toast.success(`Successfully imported ${response.data.results.success || 0} buyers`);
                fetchBuyers();
                setShowUploadModal(false);
                resetFileInput();
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload buyers');
        } finally {
            setUploading(false);
        }
    };

    const handleAddBuyer = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/buyers', buyerForm);
            if (response.data.success) {
                toast.success('Buyer added successfully');
                fetchBuyers();
                setShowAddModal(false);
                setBuyerForm({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    personalInfo: {
                        occupation: '',
                        company: ''
                    },
                    creditLimit: 0
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add buyer');
        }
    };

    const handleEditBuyer = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/admin/buyers/${editingBuyer._id}`, buyerForm);
            if (response.data.success) {
                toast.success('Buyer updated successfully');
                fetchBuyers();
                setEditingBuyer(null);
                setBuyerForm({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    personalInfo: {
                        occupation: '',
                        company: ''
                    },
                    creditLimit: 0
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update buyer');
        }
    };

    const handleDeleteBuyer = async (buyerId) => {
        if (window.confirm('Are you sure you want to delete this buyer?')) {
            try {
                const response = await api.delete(`/admin/buyers/${buyerId}`);
                if (response.data.success) {
                    toast.success('Buyer deleted successfully');
                    fetchBuyers();
                }
            } catch (error) {
                toast.error('Failed to delete buyer');
            }
        }
    };

    const handleCreditReview = async (buyerId, status, approvedLimit, adminNotes) => {
        try {
            const response = await api.put(`/admin/credit-applications/${buyerId}/review`, {
                status,
                approvedLimit,
                adminNotes
            });
            if (response.data.success) {
                toast.success(`Credit application ${status} successfully`);
                fetchCreditApplications();
            }
        } catch (error) {
            toast.error('Failed to review credit application');
        }
    };

    const exportBuyers = async () => {
        try {
            const response = await api.get('/admin/buyers/export', {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `buyers_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            toast.success('Buyers exported successfully');
        } catch (error) {
            toast.error('Failed to export buyers');
        }
    };

    const downloadTemplate = () => {
        const templateData = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '9876543210',
                password: 'password123',
                occupation: 'Engineer',
                company: 'Tech Corp',
                creditLimit: 50000
            }
        ];
        
        const csvContent = [
            'name,email,phone,password,occupation,company,creditLimit',
            ...templateData.map(row => 
                `${row.name},${row.email},${row.phone},${row.password},${row.occupation},${row.company},${row.creditLimit}`
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'buyer_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const totalPages = Math.ceil(totalBuyers / parPage);

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
                        <div className='p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg'>
                            <MdPeople className='text-white text-3xl' />
                        </div>
                        <div>
                            <h2 className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'>
                                Buyer Management
                            </h2>
                            <p className='text-gray-600 text-lg font-medium'>Manage buyers and credit applications</p>
                            <span className='bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full mt-2 inline-block'>
                                {stats.totalBuyers || 0} buyers
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
                            onClick={exportBuyers}
                            className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold'
                        >
                            <FaDownload className="text-xl" />
                            Export
                        </button>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold'
                        >
                            <MdPersonAdd className="text-xl" />
                            Add Buyer
                        </button>
                    </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                    <StatCard
                        title="Total Buyers"
                        value={stats.totalBuyers?.toLocaleString() || '0'}
                        icon={<FaUsers className="text-white text-xl" />}
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        delay={100}
                    />
                    <StatCard
                        title="Active Buyers"
                        value={stats.activeBuyers?.toLocaleString() || '0'}
                        icon={<FaUser className="text-white text-xl" />}
                        color="bg-gradient-to-br from-green-500 to-green-600"
                        delay={200}
                    />
                    <StatCard
                        title="Credit Applications"
                        value={stats.creditStats?.find(s => s._id === 'pending')?.count?.toLocaleString() || '0'}
                        icon={<FaCreditCard className="text-white text-xl" />}
                        color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                        delay={300}
                    />
                    <StatCard
                        title="Approved Credit"
                        value={`₹${(stats.creditStats?.find(s => s._id === 'approved')?.totalApproved || 0).toLocaleString()}`}
                        icon={<FaCreditCard className="text-white text-xl" />}
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                        delay={400}
                    />
                </div>

                {/* Enhanced Tabs */}
                <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 mb-8 shadow-lg animate-fadeInUp' style={{ animationDelay: '500ms' }}>
                    <div className='flex space-x-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1'>
                        <button
                            onClick={() => setActiveTab('buyers')}
                            className={`flex-1 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-300 ${
                                activeTab === 'buyers'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                            }`}
                        >
                            <div className='flex items-center justify-center gap-2'>
                                <FaUsers className='text-lg' />
                                All Buyers
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('credit-applications')}
                            className={`flex-1 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-300 ${
                                activeTab === 'credit-applications'
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                            }`}
                        >
                            <div className='flex items-center justify-center gap-2'>
                                <FaCreditCard className='text-lg' />
                                Credit Applications
                            </div>
                        </button>
                    </div>
                </div>

                {/* Enhanced Search */}
                <div className='mb-8 animate-fadeInUp' style={{ animationDelay: '600ms' }}>
                    <div className='relative max-w-md'>
                        <input
                            type="text"
                            placeholder="Search buyers by name, email, phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-6 py-4 pl-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl'
                        />
                        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Enhanced Content based on active tab */}
                {activeTab === 'buyers' ? (
                    // Enhanced Buyers Table
                    <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fadeInUp' style={{ animationDelay: '700ms' }}>
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg'>
                                <FaUsers className='text-white text-xl' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800'>All Buyers</h3>
                                <p className='text-gray-600'>Complete buyer directory and management</p>
                            </div>
                        </div>
                        
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm text-left text-gray-500'>
                                <thead className='text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl'>
                                    <tr>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Name</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Email</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Phone</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Status</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Credit Limit</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Registration Date</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buyers.map((buyer, index) => (
                                        <tr 
                                            key={buyer._id} 
                                            className='bg-white border-b hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-300'
                                            style={{ animationDelay: `${800 + index * 50}ms` }}
                                        >
                                            <td className='px-6 py-4 font-semibold text-gray-900 text-lg'>
                                                {buyer.name}
                                            </td>
                                            <td className='px-6 py-4 text-lg'>{buyer.email}</td>
                                            <td className='px-6 py-4 text-lg'>{buyer.phone}</td>
                                            <td className='px-6 py-4'>
                                                <span className={`px-3 py-2 text-sm font-semibold rounded-full shadow-lg ${
                                                    buyer.status === 'active' 
                                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                                        : buyer.status === 'inactive'
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                                                }`}>
                                                    {buyer.status}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 font-bold text-lg text-orange-600'>
                                                ₹{buyer.creditInfo?.approvedLimit?.toLocaleString() || 0}
                                            </td>
                                            <td className='px-6 py-4 text-lg'>
                                                {new Date(buyer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className='px-6 py-4'>
                                                <div className='flex gap-2'>
                                                    <button
                                                        onClick={() => {
                                                            setEditingBuyer(buyer);
                                                            setBuyerForm({
                                                                name: buyer.name,
                                                                email: buyer.email,
                                                                phone: buyer.phone,
                                                                password: '',
                                                                personalInfo: buyer.personalInfo || { occupation: '', company: '' },
                                                                creditLimit: buyer.creditInfo?.approvedLimit || 0
                                                            });
                                                        }}
                                                        className='p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'
                                                        title='Edit'
                                                    >
                                                        <FaEdit className='text-lg' />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBuyer(buyer._id)}
                                                        className='p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg'
                                                        title='Delete'
                                                    >
                                                        <FaTrash className='text-lg' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {buyers.length === 0 && (
                            <div className='text-center py-12'>
                                <div className='p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
                                    <MdPeople className='text-3xl text-gray-400' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-700 mb-2'>No buyers found</h3>
                                <p className='text-gray-500'>Add some buyers to get started</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Enhanced Credit Applications Table
                    <div className='bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fadeInUp' style={{ animationDelay: '700ms' }}>
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg'>
                                <FaCreditCard className='text-white text-xl' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800'>Credit Applications</h3>
                                <p className='text-gray-600'>Review and approve credit limit requests</p>
                            </div>
                        </div>
                        
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm text-left text-gray-500'>
                                <thead className='text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl'>
                                    <tr>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Name</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Email</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Requested Amount</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Application Date</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Status</th>
                                        <th className='px-6 py-4 font-semibold text-gray-800'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {creditApplications.map((application, index) => (
                                        <tr 
                                            key={application._id} 
                                            className='bg-white border-b hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all duration-300'
                                            style={{ animationDelay: `${800 + index * 50}ms` }}
                                        >
                                            <td className='px-6 py-4 font-semibold text-gray-900 text-lg'>
                                                {application.name}
                                            </td>
                                            <td className='px-6 py-4 text-lg'>{application.email}</td>
                                            <td className='px-6 py-4 font-bold text-lg text-orange-600'>
                                                ₹{application.creditInfo?.requestedLimit?.toLocaleString() || 0}
                                            </td>
                                            <td className='px-6 py-4 text-lg'>
                                                {new Date(application.creditInfo?.applicationDate).toLocaleDateString()}
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span className={`px-3 py-2 text-sm font-semibold rounded-full shadow-lg ${
                                                    application.creditInfo?.applicationStatus === 'approved' 
                                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                                        : application.creditInfo?.applicationStatus === 'rejected'
                                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                                                }`}>
                                                    {application.creditInfo?.applicationStatus}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4'>
                                                {application.creditInfo?.applicationStatus === 'pending' && (
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => handleCreditReview(
                                                                application._id, 
                                                                'approved', 
                                                                application.creditInfo.requestedLimit,
                                                                'Approved by admin'
                                                            )}
                                                            className='px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleCreditReview(
                                                                application._id, 
                                                                'rejected', 
                                                                0,
                                                                'Rejected by admin'
                                                            )}
                                                            className='px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {creditApplications.length === 0 && (
                            <div className='text-center py-12'>
                                <div className='p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center'>
                                    <FaCreditCard className='text-3xl text-gray-400' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-700 mb-2'>No credit applications found</h3>
                                <p className='text-gray-500'>All applications have been processed</p>
                            </div>
                        )}
                    </div>
                )}

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
            </div>

            {/* Excel Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Upload Buyers Excel</h3>
                        
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
                                    <li>email (required)</li>
                                    <li>phone (required)</li>
                                    <li>password</li>
                                    <li>occupation</li>
                                    <li>company</li>
                                    <li>creditLimit</li>
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

            {/* Add/Edit Buyer Modal */}
            {(showAddModal || editingBuyer) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingBuyer ? 'Edit Buyer' : 'Add New Buyer'}
                        </h3>
                        
                        <form onSubmit={editingBuyer ? handleEditBuyer : handleAddBuyer}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={buyerForm.name}
                                        onChange={(e) => setBuyerForm({...buyerForm, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter buyer name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={buyerForm.email}
                                        onChange={(e) => setBuyerForm({...buyerForm, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter email"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={buyerForm.phone}
                                        onChange={(e) => setBuyerForm({...buyerForm, phone: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                
                                {!editingBuyer && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password *
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={buyerForm.password}
                                            onChange={(e) => setBuyerForm({...buyerForm, password: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter password"
                                        />
                                    </div>
                                )}
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Occupation
                                    </label>
                                    <input
                                        type="text"
                                        value={buyerForm.personalInfo.occupation}
                                        onChange={(e) => setBuyerForm({
                                            ...buyerForm, 
                                            personalInfo: {...buyerForm.personalInfo, occupation: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter occupation"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        value={buyerForm.personalInfo.company}
                                        onChange={(e) => setBuyerForm({
                                            ...buyerForm, 
                                            personalInfo: {...buyerForm.personalInfo, company: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter company"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Credit Limit (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={buyerForm.creditLimit}
                                        onChange={(e) => setBuyerForm({...buyerForm, creditLimit: parseFloat(e.target.value) || 0})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter credit limit"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    {editingBuyer ? 'Update' : 'Add'} Buyer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingBuyer(null);
                                        setBuyerForm({
                                            name: '',
                                            email: '',
                                            phone: '',
                                            password: '',
                                            personalInfo: {
                                                occupation: '',
                                                company: ''
                                            },
                                            creditLimit: 0
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

export default BuyerManagement;
