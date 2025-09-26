import React, { useState, useEffect } from 'react';
import { FaEdit, FaFileInvoice, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';
import api from '../../api/api';
import toast from 'react-hot-toast';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [invoiceFile, setInvoiceFile] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/seller/orders', { withCredentials: true });
            if (response.data.success) {
                setOrders(response.data.orders || []);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            const response = await api.put(`/api/seller/orders/${selectedOrder._id}/status`, 
                { delivery_status: newStatus }, 
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Order status updated successfully');
                setShowStatusModal(false);
                setSelectedOrder(null);
                setNewStatus('');
                fetchOrders();
            }
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const uploadInvoice = async () => {
        if (!selectedOrder || !invoiceFile) return;

        try {
            const formData = new FormData();
            formData.append('invoice', invoiceFile);

            const response = await api.post(`/api/seller/orders/${selectedOrder._id}/invoice`, 
                formData, 
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (response.data.success) {
                toast.success('Delivery invoice uploaded successfully');
                setShowInvoiceModal(false);
                setSelectedOrder(null);
                setInvoiceFile(null);
                fetchOrders();
            }
        } catch (error) {
            toast.error('Failed to upload invoice');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <FaCheckCircle className="text-green-500" />;
            case 'shipped':
                return <FaTruck className="text-blue-500" />;
            case 'processing':
                return <FaClock className="text-yellow-500" />;
            default:
                return <FaClock className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="px-2 md:px-7 py-5">
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaEdit className="text-primary" />
                    Order Management
                </h1>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-sm text-gray-900 uppercase bg-gray-50">
                            <tr>
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">Customer</th>
                                <th className="py-3 px-4">Products</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Payment</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Invoice</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">
                                        #{order._id?.substring(0, 8)}...
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="font-medium">{order.shippingInfo?.name || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">{order.shippingInfo?.email || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="max-w-xs">
                                            <p className="text-xs text-gray-600">
                                                {order.products?.length || 0} item(s)
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-semibold">
                                        ₹{order.price?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.delivery_status)}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.delivery_status)}`}>
                                                {order.delivery_status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {order.delivery_invoice ? (
                                            <span className="text-green-600 text-xs">✓ Uploaded</span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Not uploaded</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setNewStatus(order.delivery_status);
                                                    setShowStatusModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                title="Update Status"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowInvoiceModal(true);
                                                }}
                                                className="text-green-600 hover:text-green-800 text-sm"
                                                title="Upload Invoice"
                                            >
                                                <FaFileInvoice />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {orders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <FaEdit className="text-4xl mx-auto mb-2" />
                            <p>No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Update Order Status
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order: #{selectedOrder._id?.substring(0, 8)}...
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={updateOrderStatus}
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
                                >
                                    Update Status
                                </button>
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedOrder(null);
                                        setNewStatus('');
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Upload Modal */}
            {showInvoiceModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Upload Delivery Invoice
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order: #{selectedOrder._id?.substring(0, 8)}...
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setInvoiceFile(e.target.files[0])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Upload delivery invoice (PDF, JPG, PNG). This will be visible to admin only.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={uploadInvoice}
                                    disabled={!invoiceFile}
                                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Upload Invoice
                                </button>
                                <button
                                    onClick={() => {
                                        setShowInvoiceModal(false);
                                        setSelectedOrder(null);
                                        setInvoiceFile(null);
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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

export default OrderManagement;
