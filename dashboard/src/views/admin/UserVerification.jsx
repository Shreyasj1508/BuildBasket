import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaUserCheck, FaUserTimes, FaFileAlt, FaBuilding } from 'react-icons/fa';
import api from '../../api/api';
import toast from 'react-hot-toast';

const UserVerification = () => {
    const [sellers, setSellers] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('sellers');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            if (activeTab === 'sellers') {
                const response = await api.get('/admin/sellers');
                setSellers(response.data.sellers || []);
            } else {
                const response = await api.get('/admin/buyers');
                setBuyers(response.data.buyers || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (userId, status, userType) => {
        try {
            const endpoint = userType === 'seller' ? '/admin/seller/verify' : '/admin/buyer/verify';
            const response = await api.post(endpoint, {
                userId,
                status
            });

            if (response.data.success) {
                toast.success(`User ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
                fetchUsers();
            } else {
                toast.error('Failed to update verification status');
            }
        } catch (error) {
            console.error('Error updating verification:', error);
            toast.error('Failed to update verification status');
        }
    };

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const getVerificationStatus = (user) => {
        if (user.isVerified) return { status: 'verified', color: 'green', icon: FaCheckCircle };
        if (user.isRejected) return { status: 'rejected', color: 'red', icon: FaTimesCircle };
        return { status: 'pending', color: 'yellow', icon: FaEye };
    };

    const renderUserCard = (user, userType) => {
        const verification = getVerificationStatus(user);
        const StatusIcon = verification.icon;

        return (
            <div key={user._id} className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow'>
                <div className='flex items-start justify-between'>
                    <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white'>
                            <FaBuilding className='text-lg' />
                        </div>
                        <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-gray-900'>{user.name}</h3>
                            <p className='text-gray-600'>{user.email}</p>
                            <p className='text-sm text-gray-500 mt-1'>
                                {userType === 'seller' ? 'Seller' : 'Buyer'} • Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            {userType === 'seller' && (
                                <div className='mt-2'>
                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                        Business: {user.businessName || 'Not provided'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${verification.color}-100 text-${verification.color}-800`}>
                            <StatusIcon className='w-3 h-3 mr-1' />
                            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                        </span>
                    </div>
                </div>

                <div className='mt-4 flex gap-2'>
                    <button
                        onClick={() => viewUserDetails(user)}
                        className='flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors'
                    >
                        <FaEye />
                        View Details
                    </button>
                    
                    {verification.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleVerification(user._id, 'approved', userType)}
                                className='flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors'
                            >
                                <FaUserCheck />
                                Approve
                            </button>
                            <button
                                onClick={() => handleVerification(user._id, 'rejected', userType)}
                                className='flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors'
                            >
                                <FaUserTimes />
                                Reject
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className='px-4 py-6'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white'>
                        <FaUserCheck className='text-xl' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>User Verification</h1>
                        <p className='text-gray-600 mt-1'>Verify sellers and manage buyer credit limits</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className='bg-white rounded-lg shadow-sm mb-6'>
                <div className='border-b border-gray-200'>
                    <nav className='-mb-px flex space-x-8 px-6'>
                        <button
                            onClick={() => setActiveTab('sellers')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'sellers'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Sellers ({sellers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('buyers')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'buyers'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Buyers ({buyers.length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Users List */}
            <div className='space-y-4'>
                {loading ? (
                    <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                        <p className='text-gray-500 mt-4'>Loading users...</p>
                    </div>
                ) : activeTab === 'sellers' ? (
                    sellers.length === 0 ? (
                        <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                            <FaUserCheck className='text-4xl text-gray-400 mx-auto mb-4' />
                            <p className='text-gray-500'>No sellers found</p>
                        </div>
                    ) : (
                        sellers.map(seller => renderUserCard(seller, 'seller'))
                    )
                ) : (
                    buyers.length === 0 ? (
                        <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
                            <FaUserCheck className='text-4xl text-gray-400 mx-auto mb-4' />
                            <p className='text-gray-500'>No buyers found</p>
                        </div>
                    ) : (
                        buyers.map(buyer => renderUserCard(buyer, 'buyer'))
                    )
                )}
            </div>

            {/* User Details Modal */}
            {showDetailsModal && selectedUser && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-xl font-semibold'>User Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className='text-gray-400 hover:text-gray-600'
                            >
                                <FaTimesCircle />
                            </button>
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Name</label>
                                    <p className='mt-1 text-sm text-gray-900'>{selectedUser.name}</p>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Email</label>
                                    <p className='mt-1 text-sm text-gray-900'>{selectedUser.email}</p>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Phone</label>
                                    <p className='mt-1 text-sm text-gray-900'>{selectedUser.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Status</label>
                                    <p className='mt-1 text-sm text-gray-900'>
                                        {selectedUser.isVerified ? 'Verified' : selectedUser.isRejected ? 'Rejected' : 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {selectedUser.businessName && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Business Name</label>
                                    <p className='mt-1 text-sm text-gray-900'>{selectedUser.businessName}</p>
                                </div>
                            )}

                            {selectedUser.address && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700'>Address</label>
                                    <p className='mt-1 text-sm text-gray-900'>{selectedUser.address}</p>
                                </div>
                            )}

                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Documents</label>
                                <div className='mt-2 space-y-2'>
                                    {selectedUser.documents?.map((doc, index) => (
                                        <div key={index} className='flex items-center gap-2 p-2 bg-gray-50 rounded'>
                                            <FaFileAlt className='text-gray-400' />
                                            <span className='text-sm text-gray-700'>{doc.name}</span>
                                            <a href={doc.url} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 text-sm'>
                                                View
                                            </a>
                                        </div>
                                    )) || <p className='text-sm text-gray-500'>No documents uploaded</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserVerification;
