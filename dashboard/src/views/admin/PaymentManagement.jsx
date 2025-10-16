import React, { useEffect, useState } from 'react';
import { 
    FaCreditCard, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaEye, 
    FaEdit,
    FaRupeeSign,
    FaCalendarAlt,
    FaUser,
    FaSearch,
    FaFilter,
    FaDownload,
    FaFilePdf,
    FaClock,
    FaExclamationTriangle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/api';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        method: 'all',
        dateRange: 'all',
        search: ''
    });
    const [stats, setStats] = useState({
        totalPayments: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editForm, setEditForm] = useState({
        paymentStatus: '',
        paymentMethod: '',
        paymentReference: '',
        adminNotes: ''
    });

    useEffect(() => {
        fetchPayments();
    }, [filters, currentPage]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                status: filters.status,
                method: filters.method,
                dateRange: filters.dateRange,
                search: filters.search
            });
            
            const response = await api.get(`/admin/payments?${params}`);
            
            if (response.data.success) {
                setPayments(response.data.orders);
                setStats(response.data.stats);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    const handleViewPayment = async (orderId) => {
        try {
            const response = await api.get(`/admin/payment-info/${orderId}`);
            if (response.data.success) {
                setSelectedPayment(response.data.paymentInfo);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching payment details:', error);
            toast.error('Failed to fetch payment details');
        }
    };

    const handleEditPayment = (payment) => {
        setEditForm({
            paymentStatus: payment.payment_status || '',
            paymentMethod: payment.payment_method || '',
            paymentReference: payment.payment_reference || '',
            adminNotes: ''
        });
        setSelectedPayment(payment);
        setShowEditModal(true);
    };

    const handleUpdatePayment = async () => {
        try {
            const response = await api.put(`/admin/update-payment/${selectedPayment.orderId}`, editForm);
            if (response.data.success) {
                toast.success('Payment information updated successfully');
                setShowEditModal(false);
                setSelectedPayment(null);
                fetchPayments();
            }
        } catch (error) {
            console.error('Error updating payment:', error);
            toast.error('Failed to update payment information');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-success/20 text-success border-success/30';
            case 'pending':
                return 'bg-warning/20 text-warning border-warning/30';
            case 'failed':
                return 'bg-danger/20 text-danger border-danger/30';
            case 'refunded':
                return 'bg-info/20 text-info border-info/30';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getMethodColor = (method) => {
        switch (method?.toLowerCase()) {
            case 'auto_online':
                return 'bg-success/20 text-success border-success/30';
            case 'online':
                return 'bg-primary/20 text-primary border-primary/30';
            case 'cod':
                return 'bg-warning/20 text-warning border-warning/30';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/30 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/30 to-orange-100">
            <div className="px-2 lg:px-7 py-5">
                <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg">
                                <FaCreditCard className="text-white text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold text-gradient">Payment Management</h2>
                                <p className="text-gray-600 text-lg">Monitor and manage all payment transactions</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">Total Payments</p>
                                    <p className="text-3xl font-bold text-primary">{stats.totalPayments}</p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm">
                                    <FaCreditCard className="text-primary text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-success/20 to-success/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">Paid Amount</p>
                                    <p className="text-3xl font-bold text-success">₹{stats.paidAmount?.toFixed(2) || 0}</p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm">
                                    <FaCheckCircle className="text-success text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-warning/20 to-warning/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">Pending Amount</p>
                                    <p className="text-3xl font-bold text-warning">₹{stats.pendingAmount?.toFixed(2) || 0}</p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm">
                                    <FaClock className="text-warning text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-info/20 to-info/30 rounded-2xl p-6 text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">Total Amount</p>
                                    <p className="text-3xl font-bold text-info">₹{stats.totalAmount?.toFixed(2) || 0}</p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-60 rounded-xl backdrop-blur-sm">
                                    <FaRupeeSign className="text-info text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={filters.method}
                                onChange={(e) => setFilters({...filters, method: e.target.value})}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            >
                                <option value="all">All Methods</option>
                                <option value="auto_online">Auto Online</option>
                                <option value="online">Online</option>
                                <option value="cod">Cash on Delivery</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search payments..."
                                value={filters.search}
                                onChange={(e) => setFilters({...filters, search: e.target.value})}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                            />
                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-primary/10 to-primary/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Method</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {payments.map((payment) => (
                                        <tr key={payment._id} className="bg-white hover:bg-primary/5 transition-all duration-300">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        #{payment.orderNumber || payment._id?.substring(0, 8)}...
                                                    </p>
                                                    <p className="text-xs text-gray-500">{payment.payment_reference}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-primary/10 rounded-full mr-3">
                                                        <FaUser className="text-primary text-sm" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{payment.customerId?.name}</p>
                                                        <p className="text-xs text-gray-500">{payment.customerId?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-bold text-primary">₹{(payment.price + (payment.shipping_fee || 0)).toFixed(2)}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getMethodColor(payment.payment_method)}`}>
                                                    {payment.payment_method?.replace('_', ' ').toUpperCase() || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(payment.payment_status)}`}>
                                                    {payment.payment_status?.toUpperCase() || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="text-gray-400 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-900">{formatDate(payment.payment_date || payment.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewPayment(payment._id)}
                                                        className="text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditPayment(payment)}
                                                        className="text-warning hover:text-warning-dark p-2 rounded-lg hover:bg-warning/10 transition-colors"
                                                        title="Edit Payment"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 bg-primary text-white rounded-lg font-semibold">
                                        {currentPage}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Details Modal */}
            {showModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-primary to-primary-dark px-8 py-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-white">
                                    Payment Details - #{selectedPayment.orderNumber || selectedPayment.orderId?.substring(0, 8)}...
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedPayment(null);
                                    }}
                                    className="text-white hover:text-gray-300 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {/* Payment Information */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FaCreditCard className="text-primary" />
                                    Payment Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="text-sm text-gray-600">Payment Status</p>
                                        <p className="text-lg font-bold text-gray-900">{selectedPayment.paymentStatus}</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="text-lg font-bold text-gray-900">{selectedPayment.paymentMethod}</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="text-sm text-gray-600">Payment Reference</p>
                                        <p className="text-lg font-bold text-gray-900">{selectedPayment.paymentReference || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl">
                                        <p className="text-sm text-gray-600">Payment Date</p>
                                        <p className="text-lg font-bold text-gray-900">{formatDate(selectedPayment.paymentDate)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment History */}
                            {selectedPayment.paymentHistory && selectedPayment.paymentHistory.length > 0 && (
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaClock className="text-primary" />
                                        Payment History
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedPayment.paymentHistory.map((history, index) => (
                                            <div key={index} className="p-4 bg-primary/5 rounded-xl">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{history.status?.toUpperCase()}</p>
                                                        <p className="text-sm text-gray-600">{history.paymentMethod}</p>
                                                        <p className="text-xs text-gray-500">₹{history.amount}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">{formatDate(history.processedAt)}</p>
                                                        <p className="text-xs text-gray-500">by {history.processedBy}</p>
                                                        {history.adminNotes && (
                                                            <p className="text-xs text-gray-500 mt-1">{history.adminNotes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Payment Modal */}
            {showEditModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-warning to-warning/80 px-8 py-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-white">
                                    Edit Payment Information
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedPayment(null);
                                        setEditForm({ paymentStatus: '', paymentMethod: '', paymentReference: '', adminNotes: '' });
                                    }}
                                    className="text-white hover:text-gray-300 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
                                    <select
                                        value={editForm.paymentStatus}
                                        onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value})}
                                        className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="paid">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                                    <select
                                        value={editForm.paymentMethod}
                                        onChange={(e) => setEditForm({...editForm, paymentMethod: e.target.value})}
                                        className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700"
                                    >
                                        <option value="">Select Method</option>
                                        <option value="auto_online">Auto Online</option>
                                        <option value="online">Online</option>
                                        <option value="cod">Cash on Delivery</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Reference</label>
                                    <input
                                        type="text"
                                        value={editForm.paymentReference}
                                        onChange={(e) => setEditForm({...editForm, paymentReference: e.target.value})}
                                        className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700"
                                        placeholder="Enter payment reference"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                                    <textarea
                                        value={editForm.adminNotes}
                                        onChange={(e) => setEditForm({...editForm, adminNotes: e.target.value})}
                                        className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary text-gray-700"
                                        rows="3"
                                        placeholder="Add admin notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={handleUpdatePayment}
                                    className="btn-primary flex items-center gap-2 flex-1"
                                >
                                    <FaCheckCircle />
                                    Update Payment
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedPayment(null);
                                        setEditForm({ paymentStatus: '', paymentMethod: '', paymentReference: '', adminNotes: '' });
                                    }}
                                    className="btn-outline flex items-center gap-2 flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;
