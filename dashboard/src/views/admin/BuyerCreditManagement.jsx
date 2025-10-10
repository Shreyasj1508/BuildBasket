import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaUserCheck, FaUserTimes, FaEdit, FaSave, FaTimes, FaPlus, FaSearch } from 'react-icons/fa';
import api from '../../api/api';
import toast from 'react-hot-toast';

const BuyerCreditManagement = () => {
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingBuyer, setEditingBuyer] = useState(null);
    const [creditForm, setCreditForm] = useState({
        creditLimit: '',
        creditUsed: '',
        status: 'active'
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBuyerForm, setNewBuyerForm] = useState({
        name: '',
        email: '',
        phone: '',
        creditLimit: '',
        company: ''
    });

    useEffect(() => {
        fetchBuyers();
    }, []);

    const fetchBuyers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/buyers');
            setBuyers(response.data.buyers || []);
        } catch (error) {
            console.error('Error fetching buyers:', error);
            toast.error('Failed to load buyers');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCredit = (buyer) => {
        setEditingBuyer(buyer._id);
        setCreditForm({
            creditLimit: buyer.creditLimit || '',
            creditUsed: buyer.creditUsed || '',
            status: buyer.creditStatus || 'active'
        });
    };

    const handleSaveCredit = async (buyerId) => {
        try {
            const response = await api.post('/admin/buyer/update-credit', {
                buyerId,
                creditLimit: parseFloat(creditForm.creditLimit),
                creditUsed: parseFloat(creditForm.creditUsed),
                status: creditForm.status
            });

            if (response.data.success) {
                toast.success('Credit limit updated successfully');
                setEditingBuyer(null);
                fetchBuyers();
            } else {
                toast.error('Failed to update credit limit');
            }
        } catch (error) {
            console.error('Error updating credit:', error);
            toast.error('Failed to update credit limit');
        }
    };

    const handleAddBuyer = async () => {
        try {
            const response = await api.post('/admin/buyer/add', {
                ...newBuyerForm,
                creditLimit: parseFloat(newBuyerForm.creditLimit)
            });

            if (response.data.success) {
                toast.success('Buyer added successfully');
                setShowAddModal(false);
                setNewBuyerForm({
                    name: '',
                    email: '',
                    phone: '',
                    creditLimit: '',
                    company: ''
                });
                fetchBuyers();
            } else {
                toast.error('Failed to add buyer');
            }
        } catch (error) {
            console.error('Error adding buyer:', error);
            toast.error('Failed to add buyer');
        }
    };

    const getCreditStatusColor = (status) => {
        switch (status) {
            case 'active': return 'green';
            case 'suspended': return 'red';
            case 'pending': return 'yellow';
            default: return 'gray';
        }
    };

    const getCreditUtilization = (used, limit) => {
        if (!limit || limit === 0) return 0;
        return Math.round((used / limit) * 100);
    };

    const filteredBuyers = buyers.filter(buyer =>
        buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='px-4 py-6'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white'>
                            <FaCreditCard className='text-xl' />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800'>Buyer Credit Management</h1>
                            <p className='text-gray-600 mt-1'>Manage buyer credit limits and applications</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        <FaPlus />
                        Add Buyer
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
                <div className='flex items-center gap-3'>
                    <FaSearch className='text-gray-400' />
                    <input
                        type='text'
                        placeholder='Search buyers...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
            </div>

            {/* Buyers List */}
            <div className='space-y-4'>
                {loading ? (
                    <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                        <p className='text-gray-500 mt-4'>Loading buyers...</p>
                    </div>
                ) : filteredBuyers.length === 0 ? (
                    <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                        <FaCreditCard className='text-4xl text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-500'>No buyers found</p>
                    </div>
                ) : (
                    filteredBuyers.map((buyer) => (
                        <div key={buyer._id} className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                            <div className='flex items-start justify-between'>
                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white'>
                                        <FaCreditCard className='text-lg' />
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='text-lg font-semibold text-gray-900'>{buyer.name}</h3>
                                        <p className='text-gray-600'>{buyer.email}</p>
                                        <p className='text-sm text-gray-500 mt-1'>
                                            {buyer.company && `Company: ${buyer.company}`}
                                            {buyer.phone && ` • Phone: ${buyer.phone}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCreditStatusColor(buyer.creditStatus)}-100 text-${getCreditStatusColor(buyer.creditStatus)}-800`}>
                                        {buyer.creditStatus || 'active'}
                                    </span>
                                </div>
                            </div>

                            {/* Credit Information */}
                            <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <p className='text-sm font-medium text-gray-600'>Credit Limit</p>
                                    {editingBuyer === buyer._id ? (
                                        <input
                                            type='number'
                                            value={creditForm.creditLimit}
                                            onChange={(e) => setCreditForm(prev => ({ ...prev, creditLimit: e.target.value }))}
                                            className='w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='Enter credit limit'
                                        />
                                    ) : (
                                        <p className='text-lg font-semibold text-gray-900 mt-1'>
                                            ₹{buyer.creditLimit?.toLocaleString() || '0'}
                                        </p>
                                    )}
                                </div>

                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <p className='text-sm font-medium text-gray-600'>Credit Used</p>
                                    {editingBuyer === buyer._id ? (
                                        <input
                                            type='number'
                                            value={creditForm.creditUsed}
                                            onChange={(e) => setCreditForm(prev => ({ ...prev, creditUsed: e.target.value }))}
                                            className='w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='Enter credit used'
                                        />
                                    ) : (
                                        <p className='text-lg font-semibold text-gray-900 mt-1'>
                                            ₹{buyer.creditUsed?.toLocaleString() || '0'}
                                        </p>
                                    )}
                                </div>

                                <div className='bg-gray-50 rounded-lg p-4'>
                                    <p className='text-sm font-medium text-gray-600'>Utilization</p>
                                    <div className='mt-1'>
                                        <div className='flex items-center justify-between text-sm'>
                                            <span className='text-gray-900'>
                                                {getCreditUtilization(buyer.creditUsed, buyer.creditLimit)}%
                                            </span>
                                            <span className='text-gray-500'>
                                                ₹{(buyer.creditLimit - buyer.creditUsed)?.toLocaleString() || '0'} available
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-200 rounded-full h-2 mt-1'>
                                            <div
                                                className={`h-2 rounded-full ${
                                                    getCreditUtilization(buyer.creditUsed, buyer.creditLimit) > 80
                                                        ? 'bg-red-500'
                                                        : getCreditUtilization(buyer.creditUsed, buyer.creditLimit) > 60
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                }`}
                                                style={{
                                                    width: `${Math.min(getCreditUtilization(buyer.creditUsed, buyer.creditLimit), 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className='mt-4 flex gap-2'>
                                {editingBuyer === buyer._id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveCredit(buyer._id)}
                                            className='flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors'
                                        >
                                            <FaSave />
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingBuyer(null)}
                                            className='flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors'
                                        >
                                            <FaTimes />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleEditCredit(buyer)}
                                        className='flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors'
                                    >
                                        <FaEdit />
                                        Edit Credit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Buyer Modal */}
            {showAddModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h3 className='text-lg font-semibold mb-4'>Add New Buyer</h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                                <input
                                    type='text'
                                    value={newBuyerForm.name}
                                    onChange={(e) => setNewBuyerForm(prev => ({ ...prev, name: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Enter buyer name'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                <input
                                    type='email'
                                    value={newBuyerForm.email}
                                    onChange={(e) => setNewBuyerForm(prev => ({ ...prev, email: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Enter email address'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                                <input
                                    type='tel'
                                    value={newBuyerForm.phone}
                                    onChange={(e) => setNewBuyerForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Enter phone number'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Company</label>
                                <input
                                    type='text'
                                    value={newBuyerForm.company}
                                    onChange={(e) => setNewBuyerForm(prev => ({ ...prev, company: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Enter company name'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Credit Limit</label>
                                <input
                                    type='number'
                                    value={newBuyerForm.creditLimit}
                                    onChange={(e) => setNewBuyerForm(prev => ({ ...prev, creditLimit: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Enter credit limit'
                                />
                            </div>
                        </div>
                        <div className='flex gap-3 mt-6'>
                            <button
                                onClick={handleAddBuyer}
                                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                            >
                                Add Buyer
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerCreditManagement;
