import React, { useState, useEffect } from 'react';
import { FaPercentage, FaSave, FaMoneyBillWave, FaEdit, FaHistory, FaCheckCircle, FaSpinner, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../api/api';
import toast from 'react-hot-toast';

const CommissionSettings = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [commission, setCommission] = useState({
        rate: 0.05,
        type: 'percentage',
        description: 'Platform commission applied to all products',
        fixedAmount: 0
    });
    const [newCommission, setNewCommission] = useState({
        rate: 0.05,
        type: 'percentage',
        description: 'Platform commission applied to all products',
        fixedAmount: 0
    });
    const [commissionHistory, setCommissionHistory] = useState([]);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        fetchCommissionConfig();
        fetchCommissionHistory();
    }, []);

    const fetchCommissionConfig = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/commission/get-config');
            if (response.data && response.data.config) {
                setCommission(response.data.config);
                setNewCommission(response.data.config);
            }
        } catch (error) {
            console.error('Error fetching commission:', error);
            toast.error('Failed to load commission settings');
        } finally {
            setLoading(false);
            setIsInitialized(true);
        }
    };

    const fetchCommissionHistory = async () => {
        try {
            const response = await api.get('/admin/commission/history');
            if (response.data && response.data.history) {
                setCommissionHistory(response.data.history);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const validateCommission = () => {
        const newErrors = {};
        
        if (!newCommission.type) {
            newErrors.type = 'Commission type is required';
        }
        
        if (newCommission.type === 'percentage') {
            if (!newCommission.rate || newCommission.rate <= 0 || newCommission.rate > 100) {
                newErrors.rate = 'Rate must be between 0 and 100';
            }
        } else if (newCommission.type === 'fixed') {
            if (!newCommission.fixedAmount || newCommission.fixedAmount <= 0) {
                newErrors.fixedAmount = 'Fixed amount must be greater than 0';
            }
        }
        
        if (!newCommission.description || newCommission.description.trim() === '') {
            newErrors.description = 'Description is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveCommission = async () => {
        if (!validateCommission()) {
            toast.error('Please fix the validation errors before saving');
            return;
        }

        try {
            setSaving(true);
            setErrors({});
            
            const response = await api.post('/admin/commission/update-config', newCommission);
            
            if (response.data && response.data.success) {
                toast.success('Commission settings updated successfully!');
                setCommission(newCommission);
                setEditMode(false);
                fetchCommissionHistory();
            } else {
                toast.error(response.data?.error || 'Failed to update commission settings');
            }
        } catch (error) {
            console.error('Error saving commission:', error);
            const errorMessage = error.response?.data?.error || 'Failed to save commission settings';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateAll = async () => {
        try {
            setLoading(true);
            const response = await api.post('/admin/commission/update-all');
            
            if (response.data && response.data.success) {
                toast.success(response.data.message || 'All products updated successfully');
            } else {
                toast.error('Failed to update products');
            }
        } catch (error) {
            console.error('Error updating products:', error);
            toast.error('Failed to update products commission');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setNewCommission(commission);
        setEditMode(false);
        setErrors({});
    };

    if (!isInitialized && loading) {
        return (
            <div className='px-4 py-6 max-w-7xl mx-auto'>
                <div className='flex items-center justify-center min-h-[400px]'>
                    <div className='flex flex-col items-center gap-4'>
                        <FaSpinner className='text-4xl text-blue-600 animate-spin' />
                        <p className='text-gray-600 font-medium'>Loading commission settings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='px-4 py-6 max-w-7xl mx-auto'>
            {/* Header */}
            <div className='bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 animate-fadeIn'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse'>
                            <FaPercentage className='text-2xl' />
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>Commission Settings</h1>
                            <p className='text-gray-600 mt-1'>Manage platform commission configuration</p>
                        </div>
                    </div>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className='flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md transform hover:scale-105'
                        >
                            <FaEdit />
                            Edit Commission
                        </button>
                    )}
                </div>
            </div>

            {/* Current Commission Display */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-800'>Commission Rate</h3>
                        <FaPercentage className='text-2xl text-blue-600' />
                    </div>
                    <div className='text-4xl font-bold text-blue-600'>
                        {commission.type === 'percentage' 
                            ? `${(commission.rate * 100).toFixed(1)}%`
                            : `₹${commission.fixedAmount || commission.rate}`
                        }
                    </div>
                    <p className='text-sm text-gray-600 mt-2'>Current platform commission</p>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-800'>Commission Type</h3>
                        <FaMoneyBillWave className='text-2xl text-green-600' />
                    </div>
                    <div className='text-3xl font-bold text-green-600 capitalize'>
                        {commission.type}
                    </div>
                    <p className='text-sm text-gray-600 mt-2'>Applied to all products</p>
                </div>

                <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-800'>Status</h3>
                        <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                    </div>
                    <div className='text-3xl font-bold text-purple-600'>
                        Active
                    </div>
                    <p className='text-sm text-gray-600 mt-2'>Commission is active</p>
                </div>
            </div>

            {/* Edit Commission Form */}
            {editMode && (
                <div className='bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-blue-200 animate-fadeInUp'>
                    <div className='flex items-center gap-3 mb-6'>
                        <FaEdit className='text-2xl text-blue-600' />
                        <h2 className='text-2xl font-bold text-gray-800'>Edit Commission Settings</h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        {/* Commission Type */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                Commission Type <span className='text-red-500'>*</span>
                            </label>
                            <select
                                value={newCommission.type}
                                onChange={(e) => {
                                    setNewCommission({...newCommission, type: e.target.value});
                                    setErrors({...errors, type: ''});
                                }}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors ${
                                    errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            >
                                <option value='percentage'>Percentage (%)</option>
                                <option value='fixed'>Fixed Amount (₹)</option>
                            </select>
                            {errors.type && (
                                <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                                    <FaExclamationTriangle className='text-xs' />
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* Commission Rate/Amount */}
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                {newCommission.type === 'percentage' ? 'Commission Percentage' : 'Fixed Amount'} 
                                <span className='text-red-500'>*</span>
                            </label>
                            {newCommission.type === 'percentage' ? (
                                <div className='relative'>
                                    <input
                                        type='number'
                                        min='0'
                                        max='100'
                                        step='0.1'
                                        value={(newCommission.rate * 100).toFixed(1)}
                                        onChange={(e) => {
                                            setNewCommission({...newCommission, rate: parseFloat(e.target.value) / 100});
                                            setErrors({...errors, rate: ''});
                                        }}
                                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors ${
                                            errors.rate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder='5.0'
                                    />
                                    <span className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold'>%</span>
                                </div>
                            ) : (
                                <div className='relative'>
                                    <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold'>₹</span>
                                    <input
                                        type='number'
                                        min='0'
                                        step='1'
                                        value={newCommission.fixedAmount || 0}
                                        onChange={(e) => {
                                            setNewCommission({...newCommission, fixedAmount: parseFloat(e.target.value)});
                                            setErrors({...errors, fixedAmount: ''});
                                        }}
                                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors ${
                                            errors.fixedAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder='50'
                                    />
                                </div>
                            )}
                            {(errors.rate || errors.fixedAmount) && (
                                <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                                    <FaExclamationTriangle className='text-xs' />
                                    {errors.rate || errors.fixedAmount}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className='mb-6'>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>
                            Description <span className='text-red-500'>*</span>
                        </label>
                        <textarea
                            value={newCommission.description}
                            onChange={(e) => {
                                setNewCommission({...newCommission, description: e.target.value});
                                setErrors({...errors, description: ''});
                            }}
                            rows='3'
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors resize-none ${
                                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder='Enter commission description...'
                        />
                        {errors.description && (
                            <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                                <FaExclamationTriangle className='text-xs' />
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Example Calculation */}
                    <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6'>
                        <h4 className='font-semibold text-gray-800 mb-2'>Example Calculation:</h4>
                        <p className='text-gray-700'>
                            {newCommission.type === 'percentage' ? (
                                <>
                                    Base Price: ₹1000 → Commission: ₹{(1000 * newCommission.rate).toFixed(2)} → 
                                    <span className='font-bold text-blue-600'> Final Price: ₹{(1000 + (1000 * newCommission.rate)).toFixed(2)}</span>
                                </>
                            ) : (
                                <>
                                    Base Price: ₹1000 → Commission: ₹{newCommission.fixedAmount || 0} → 
                                    <span className='font-bold text-blue-600'> Final Price: ₹{(1000 + (newCommission.fixedAmount || 0)).toFixed(2)}</span>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={handleSaveCommission}
                            disabled={saving}
                            className='flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {saving ? (
                                <>
                                    <FaSpinner className='animate-spin' />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className='flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50'
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Commission Info */}
            <div className='bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Commission Information</h2>
                <div className='space-y-4'>
                    <div className='flex items-start gap-3 p-4 bg-blue-50 rounded-xl'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                        <div className='flex-1'>
                            <p className='text-gray-700 font-semibold mb-1'>Description</p>
                            <p className='text-gray-600'>{commission.description}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3 p-4 bg-green-50 rounded-xl'>
                        <div className='w-2 h-2 bg-green-500 rounded-full mt-2'></div>
                        <div className='flex-1'>
                            <p className='text-gray-700 font-semibold mb-1'>How it works</p>
                            <p className='text-gray-600'>
                                Commission is automatically added to product base price. 
                                Customers see the final price (Base Price + Commission).
                            </p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3 p-4 bg-purple-50 rounded-xl'>
                        <div className='w-2 h-2 bg-purple-500 rounded-full mt-2'></div>
                        <div className='flex-1'>
                            <p className='text-gray-700 font-semibold mb-1'>Example Calculation</p>
                            <p className='text-gray-600'>
                                {commission.type === 'percentage' ? (
                                    <>
                                        If base price is ₹1000 and commission is {(commission.rate * 100).toFixed(1)}%, 
                                        final price will be ₹{(1000 + (1000 * commission.rate)).toFixed(2)}
                                    </>
                                ) : (
                                    <>
                                        If base price is ₹1000 and commission is ₹{commission.fixedAmount || commission.rate}, 
                                        final price will be ₹{(1000 + (commission.fixedAmount || commission.rate)).toFixed(2)}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className='bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Actions</h2>
                <div className='space-y-4'>
                    <div className='border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors'>
                        <div className='flex items-start justify-between mb-4'>
                            <div className='flex-1'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                                    Update All Products
                                </h3>
                                <p className='text-gray-600'>
                                    Recalculate and update commission for all products in the database. 
                                    This will apply the current commission rate to all products.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpdateAll}
                            disabled={loading}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                                transition-all duration-200 shadow-sm hover:shadow-md
                                ${loading 
                                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className='animate-spin' />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Update All Products
                                </>
                            )}
                        </button>
                    </div>

                    <div className='border-2 border-yellow-200 bg-yellow-50 rounded-xl p-4'>
                        <div className='flex items-start gap-3'>
                            <div className='text-yellow-600 text-2xl'>⚠️</div>
                            <div>
                                <h4 className='font-semibold text-gray-800 mb-1'>Important Note</h4>
                                <p className='text-sm text-gray-600'>
                                    Updating all products may take some time depending on the number of products. 
                                    Please wait for the process to complete. The commission change will be applied immediately to new products.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Commission History */}
            {commissionHistory.length > 0 && (
                <div className='bg-white rounded-2xl shadow-sm p-6 border border-gray-100'>
                    <div className='flex items-center gap-3 mb-4'>
                        <FaHistory className='text-2xl text-gray-600' />
                        <h2 className='text-xl font-bold text-gray-800'>Commission History</h2>
                    </div>
                    <div className='space-y-3'>
                        {commissionHistory.slice(0, 5).map((item, index) => (
                            <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                                <div>
                                    <p className='font-semibold text-gray-800'>
                                        {item.type === 'percentage' 
                                            ? `${(item.rate * 100).toFixed(1)}%` 
                                            : `₹${item.fixedAmount || item.rate}`
                                        } ({item.type})
                                    </p>
                                    <p className='text-sm text-gray-600'>{item.description}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm text-gray-500'>
                                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className='text-xs text-gray-400'>
                                        {new Date(item.createdAt).toLocaleTimeString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommissionSettings;
