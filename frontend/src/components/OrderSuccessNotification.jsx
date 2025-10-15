import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTruck, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderSuccessNotification = ({ show, onClose, orderData }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] max-w-md">
      <div
        className={`bg-white border border-green-200 rounded-lg shadow-lg p-6 transform transition-all duration-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Placed!
                </h3>
              </div>
              
              {orderData && (
                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Order #</span>
                      <button
                        onClick={() => copyToClipboard(orderData.orderNumber)}
                        className="text-gray-500 hover:text-primary"
                      >
                        <FaCopy className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {orderData.orderNumber}
                    </p>
                  </div>
                  
                  {orderData.trackingNumber && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Tracking #</span>
                        <button
                          onClick={() => copyToClipboard(orderData.trackingNumber)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <FaCopy className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {orderData.trackingNumber}
                      </p>
                    </div>
                  )}
                  
                  {orderData.estimatedDelivery && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="text-sm font-medium text-gray-700">Delivery</span>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(orderData.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Link
                  to={`/track-order?orderId=${orderData?.orderNumber || orderData?.orderId}`}
                  onClick={handleClose}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  <FaTruck className="mr-1 h-3 w-3" />
                  Track Order
                </Link>
                <Link
                  to="/dashboard/my-orders"
                  onClick={handleClose}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  View Orders
                </Link>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessNotification;
