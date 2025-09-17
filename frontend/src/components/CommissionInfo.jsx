import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaCalculator } from 'react-icons/fa';
import { useCommission } from '../context/CommissionContext';

const CommissionInfo = ({ product }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { commission, calculateCommission } = useCommission();

  // Calculate commission info using context
  const commissionInfo = product?.price ? calculateCommission(product.price) : null;

  if (!commissionInfo) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FaInfoCircle className="text-blue-600 text-sm" />
          <span className="text-sm font-semibold text-blue-800">
            Price Breakdown
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          <FaCalculator className="text-xs" />
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>
      
      <div className="text-sm text-blue-700">
        <div className="flex justify-between items-center">
          <span>Final Price:</span>
          <span className="font-bold text-lg">₹{commissionInfo.finalPrice}</span>
        </div>
        
        {showDetails && (
          <div className="mt-2 pt-2 border-t border-blue-200 space-y-1">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>₹{commissionInfo.basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Commission ({commissionInfo.commissionType}):</span>
              <span className="text-green-600 font-semibold">+₹{commissionInfo.commissionAmount}</span>
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Platform commission automatically added to seller price
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionInfo;
