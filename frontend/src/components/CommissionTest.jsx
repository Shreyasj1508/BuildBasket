import React, { useState, useEffect } from 'react';
import { useCommission } from '../context/CommissionContext';
import { FaSync, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const CommissionTest = () => {
  const { commission, calculateCommission } = useCommission();
  const [testPrice, setTestPrice] = useState(100);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    setLastUpdate(new Date().toLocaleTimeString());
  }, [commission]);

  const commissionInfo = calculateCommission(testPrice);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <FaSync className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">Real-Time Commission Test</h3>
        {lastUpdate && (
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdate}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Commission Settings */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Current Commission Settings</h4>
          <div className="space-y-1 text-sm">
            <div><strong>Type:</strong> {commission.commissionType}</div>
            {commission.commissionType === 'fixed' && (
              <div><strong>Amount:</strong> ₹{commission.fixedAmount}</div>
            )}
            {commission.commissionType === 'percentage' && (
              <div><strong>Percentage:</strong> {commission.percentageAmount}%</div>
            )}
            <div><strong>Status:</strong> 
              <span className={`ml-1 ${commission.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {commission.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Commission Calculation Test */}
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Live Calculation Test</h4>
          <div className="space-y-2">
            <input
              type="number"
              value={testPrice}
              onChange={(e) => setTestPrice(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="Enter test price"
            />
            <div className="text-sm space-y-1">
              <div><strong>Base Price:</strong> ₹{testPrice}</div>
              <div><strong>Commission:</strong> ₹{commissionInfo.commissionAmount}</div>
              <div className="font-semibold text-green-600">
                <strong>Final Price:</strong> ₹{commissionInfo.finalPrice}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="mt-3 flex items-center gap-2 text-sm">
        <FaCheckCircle className="text-green-500" />
        <span className="text-gray-600">
          Commission updates are synchronized in real-time across all pages
        </span>
      </div>
    </div>
  );
};

export default CommissionTest;
