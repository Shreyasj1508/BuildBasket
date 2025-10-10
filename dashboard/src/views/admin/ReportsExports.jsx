import React, { useState, useEffect } from 'react';
import { FaFileExcel, FaDownload, FaChartBar, FaUsers, FaShoppingCart, FaCreditCard, FaEnvelope, FaCalendarAlt, FaTimesCircle, FaPlus } from 'react-icons/fa';
import api from '../../api/api';
import toast from 'react-hot-toast';

const ReportsExports = () => {
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [emailReports, setEmailReports] = useState({
        enabled: false,
        frequency: 'weekly',
        recipients: []
    });

    const reportTypes = [
        { id: 'sellers', name: 'Seller Report', icon: FaUsers, description: 'Export seller statistics and performance' },
        { id: 'buyers', name: 'Buyer Report', icon: FaUsers, description: 'Export buyer information and activity' },
        { id: 'transactions', name: 'Transaction Report', icon: FaShoppingCart, description: 'Export transaction history and details' },
        { id: 'credit', name: 'Credit Report', icon: FaCreditCard, description: 'Export credit utilization and limits' }
    ];

    const handleExport = async (type) => {
        try {
            setLoading(true);
            const response = await api.post('/admin/reports/export', {
                reportType: type,
                dateRange: dateRange.startDate && dateRange.endDate ? dateRange : null,
                format: 'excel'
            }, {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully`);
        } catch (error) {
            console.error('Error exporting report:', error);
            toast.error('Failed to export report');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailReport = async () => {
        try {
            setLoading(true);
            const response = await api.post('/admin/reports/setup-email', {
                enabled: emailReports.enabled,
                frequency: emailReports.frequency,
                recipients: emailReports.recipients
            });

            if (response.data.success) {
                toast.success('Email report settings updated successfully');
            } else {
                toast.error('Failed to update email report settings');
            }
        } catch (error) {
            console.error('Error updating email settings:', error);
            toast.error('Failed to update email report settings');
        } finally {
            setLoading(false);
        }
    };

    const addEmailRecipient = () => {
        const email = prompt('Enter email address:');
        if (email && email.includes('@')) {
            setEmailReports(prev => ({
                ...prev,
                recipients: [...prev.recipients, email]
            }));
        }
    };

    const removeEmailRecipient = (index) => {
        setEmailReports(prev => ({
            ...prev,
            recipients: prev.recipients.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className='px-4 py-6'>
            {/* Header */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white'>
                        <FaFileExcel className='text-xl' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>Reports & Exports</h1>
                        <p className='text-gray-600 mt-1'>Export seller, buyer, transaction, and credit reports in Excel</p>
                    </div>
                </div>
            </div>

            {/* Export Reports Section */}
            <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <FaDownload />
                    Export Reports
                </h2>

                {/* Date Range Filter */}
                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Start Date</label>
                        <input
                            type='date'
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>End Date</label>
                        <input
                            type='date'
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                </div>

                {/* Report Types */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {reportTypes.map((report) => {
                        const IconComponent = report.icon;
                        return (
                            <div key={report.id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                                <div className='flex items-start gap-3'>
                                    <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                                        <IconComponent className='text-blue-600' />
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='font-semibold text-gray-900'>{report.name}</h3>
                                        <p className='text-sm text-gray-600 mt-1'>{report.description}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleExport(report.id)}
                                    disabled={loading}
                                    className='mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors'
                                >
                                    {loading ? (
                                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                                    ) : (
                                        <>
                                            <FaDownload />
                                            Export Excel
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Email Reports Section */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                    <FaEnvelope />
                    Automated Email Reports
                </h2>
                <p className='text-gray-600 mb-6'>Weekly automated credit utilization reports sent via email</p>

                {/* Email Settings */}
                <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                        <input
                            type='checkbox'
                            id='emailEnabled'
                            checked={emailReports.enabled}
                            onChange={(e) => setEmailReports(prev => ({ ...prev, enabled: e.target.checked }))}
                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                        />
                        <label htmlFor='emailEnabled' className='text-sm font-medium text-gray-700'>
                            Enable automated email reports
                        </label>
                    </div>

                    {emailReports.enabled && (
                        <>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Report Frequency</label>
                                <select
                                    value={emailReports.frequency}
                                    onChange={(e) => setEmailReports(prev => ({ ...prev, frequency: e.target.value }))}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    <option value='daily'>Daily</option>
                                    <option value='weekly'>Weekly</option>
                                    <option value='monthly'>Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Email Recipients</label>
                                <div className='space-y-2'>
                                    {emailReports.recipients.map((email, index) => (
                                        <div key={index} className='flex items-center gap-2 p-2 bg-gray-50 rounded'>
                                            <span className='text-sm text-gray-700'>{email}</span>
                                            <button
                                                onClick={() => removeEmailRecipient(index)}
                                                className='text-red-600 hover:text-red-800'
                                            >
                                                <FaTimesCircle />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addEmailRecipient}
                                        className='flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors'
                                    >
                                        <FaPlus />
                                        Add Recipient
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleEmailReport}
                                disabled={loading}
                                className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors'
                            >
                                {loading ? (
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                                ) : (
                                    <>
                                        <FaEnvelope />
                                        Save Email Settings
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsExports;