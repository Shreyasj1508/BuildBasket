import React from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const VerificationStatus = ({ status, className = '' }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'active':
                return {
                    icon: <FaCheckCircle className="text-green-500" />,
                    text: 'Verified',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    message: 'Your account is verified and you can publish products.'
                };
            case 'pending':
                return {
                    icon: <FaClock className="text-yellow-500" />,
                    text: 'Pending Verification',
                    bgColor: 'bg-yellow-50',
                    textColor: 'text-yellow-700',
                    borderColor: 'border-yellow-200',
                    message: 'Your account is under review. You cannot publish products until verified.'
                };
            case 'inactive':
                return {
                    icon: <FaTimesCircle className="text-red-500" />,
                    text: 'Account Suspended',
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-700',
                    borderColor: 'border-red-200',
                    message: 'Your account has been suspended. Contact admin for assistance.'
                };
            default:
                return {
                    icon: <FaExclamationTriangle className="text-gray-500" />,
                    text: 'Unknown Status',
                    bgColor: 'bg-gray-50',
                    textColor: 'text-gray-700',
                    borderColor: 'border-gray-200',
                    message: 'Account status is unclear. Please contact support.'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}>
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    {config.icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-sm font-medium ${config.textColor}`}>
                        {config.text}
                    </h3>
                    <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>
                        {config.message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationStatus;
