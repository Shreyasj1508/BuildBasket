import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCommission } from '../context/CommissionContext';

const CartNotification = ({ show, onClose, product }) => {
  const { calculateCommission } = useCommission();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] max-w-sm">
      <div
        className={`bg-white border border-green-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <FaShoppingCart className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-gray-900">
                  Added!
                </p>
              </div>
              
              {product && (
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{Math.round(calculateCommission(product.price - Math.floor((product.price * product.discount) / 100), product).finalPrice)}
                      {product.discount > 0 && (
                        <span className="ml-1 line-through text-gray-400">
                          ₹{Math.round(calculateCommission(product.price, product).finalPrice)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Link
                  to="/card"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  View Cart
                </Link>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
