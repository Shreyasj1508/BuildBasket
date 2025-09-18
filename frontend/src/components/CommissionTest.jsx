import React from 'react';
import { useCommission } from '../context/CommissionContext';

const CommissionTest = () => {
  const { commission, calculateCommission } = useCommission();

  const testPrice = 100;
  const commissionInfo = calculateCommission(testPrice);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Commission Test (Real-time)</h3>
      
      {/* Current Commission Settings */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">Current Commission Settings</h4>
        <div className="text-sm space-y-1">
          <div><strong>Type:</strong> {commission.commissionType}</div>
          {commission.commissionType === 'fixed' && (
            <div><strong>Amount:</strong> ₹{commission.fixedAmount}</div>
          )}
          {commission.commissionType === 'percentage' && (
            <div><strong>Percentage:</strong> {commission.percentageAmount}%</div>
          )}
          <div>
            <strong>Status:</strong>
            <span className={`ml-1 ${commission.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {commission.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Commission Calculation Test */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Test Calculation (₹{testPrice})</h4>
        <div className="text-sm space-y-1">
          <div><strong>Base Price:</strong> ₹{commissionInfo.basePrice}</div>
          <div><strong>Commission:</strong> ₹{commissionInfo.commissionAmount}</div>
          <div className="border-t pt-1">
            <strong>Final Price:</strong> ₹{commissionInfo.finalPrice}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        Updates automatically when admin changes commission settings
      </div>
    </div>
  );
};

export default CommissionTest;