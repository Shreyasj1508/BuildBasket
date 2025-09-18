import React, { useState, useEffect, useRef } from "react";
import { FaCog, FaCalculator, FaHistory, FaSave } from "react-icons/fa";
import api from "../../api/api";
import toast from "react-hot-toast";

// Main component for managing commission settings in the admin dashboard
import io from 'socket.io-client';
const CommissionSettings = () => {
  const [commission, setCommission] = useState({
    commissionType: 'fixed',
    fixedAmount: 20,
    percentageAmount: 0,
    description: 'Platform commission'
  });
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [testPrice, setTestPrice] = useState(100);
  const [testResult, setTestResult] = useState(null);



  // Setup socket connection on mount
  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    fetchCommissionSettings();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch current commission settings from the API
  const fetchCommissionSettings = async () => {
    try {
      const response = await api.get('/admin/commission/settings');
      if (response.data.success) {
        setCommission(response.data.commission);
      }
    } catch (error) {
      console.error('Error fetching commission settings:', error);
      toast.error('Failed to fetch commission settings');
    }
  };

  // Save the updated commission settings to the API
  const handleSave = async () => {
    console.log('🔧 Save button clicked!');
    console.log('📊 Commission data:', commission);
    console.log('🔑 Auth token:', localStorage.getItem('accessToken'));
    
    setLoading(true);
    try {
      console.log('📡 Making API request...');
      const response = await api.put('/admin/commission/settings', commission);
      console.log('✅ API Response:', response);
      
      if (response.data.success) {
        const productsUpdate = response.data.productsUpdate;
        if (productsUpdate && productsUpdate.success) {
          toast.success(`Commission updated! ${productsUpdate.updatedCount} products updated successfully.`);
        } else {
          toast.success('Commission settings updated successfully!');
        }
        // Emit commission_updated event to backend for real-time update
        if (socketRef.current) {
          socketRef.current.emit('commission_updated', {
            commission: response.data.commission,
            message: 'Commission settings have been updated',
            productsUpdated: productsUpdate?.updatedCount || 0
          });
        }
        fetchCommissionSettings();
      } else {
        console.error('❌ API returned success: false', response.data);
        toast.error('API returned success: false');
      }
    } catch (error) {
      console.error('❌ Error updating commission settings:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Error: No popup shown
    } finally {
      setLoading(false);
    }
  };

  // Test commission calculation for a given price
  const handleTestCalculation = async () => {
    try {
      const response = await api.post('/admin/commission/calculate', {
        basePrice: parseFloat(testPrice)
      });
      if (response.data.success) {
        setTestResult(response.data);
      }
    } catch (error) {
      console.error('Error testing calculation:', error);
      toast.error('Failed to test calculation');
    }
  };

  // Fetch commission change history from the API
  const fetchHistory = async () => {
    try {
      const response = await api.get('/admin/commission/history');
      if (response.data.success) {
        setHistory(response.data.commissions);
        setShowHistory(true);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch commission history');
    }
  };

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full bg-white rounded-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FaCog className="text-2xl text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Commission Settings
            </h2>
            <p className="text-gray-600">Manage platform commission rates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commission Settings */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Commission Configuration
            </h3>
            
            <div className="space-y-4">
              {/* Commission Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Type
                </label>
                <select
                  value={commission.commissionType}
                  onChange={(e) => setCommission({...commission, commissionType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>

              {/* Fixed Amount */}
              {commission.commissionType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fixed Commission Amount (₹)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={commission.fixedAmount}
                    onChange={e => {
                      const val = e.target.value.replace(/[^\d.]/g, '');
                      setCommission({ ...commission, fixedAmount: val });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter fixed amount"
                  />
                </div>
              )}

              {/* Percentage Amount */}
              {commission.commissionType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={commission.percentageAmount}
                    onChange={(e) => setCommission({...commission, percentageAmount: parseFloat(e.target.value) || 0})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter percentage"
                    min="0"
                    max="100"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={commission.description}
                  onChange={(e) => setCommission({...commission, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaSave className="text-sm" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>

          {/* Test Calculator */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Commission Calculator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Base Price (₹)
                </label>
                <input
                  type="number"
                  value={testPrice}
                  onChange={(e) => setTestPrice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter test price"
                />
              </div>

              <button
                onClick={handleTestCalculation}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator className="text-sm" />
                Calculate Commission
              </button>

              {testResult && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3">Calculation Result</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-semibold">₹{testResult.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission ({testResult.commissionType}):</span>
                      <span className="font-semibold text-green-600">₹{testResult.commissionAmount}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-semibold">Final Price:</span>
                      <span className="font-bold text-blue-600">₹{testResult.finalPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* History Button */}
            <div className="mt-6">
              <button
                onClick={fetchHistory}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaHistory className="text-sm" />
                View Commission History
              </button>
            </div>
          </div>
        </div>

        {/* Commission History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Commission History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-semibold capitalize">{item.commissionType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount:</span>
                        <span className="ml-2 font-semibold">
                          {item.commissionType === 'fixed' ? `₹${item.fixedAmount}` : `${item.percentageAmount}%`}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`ml-2 font-semibold ${item.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Updated:</span>
                        <span className="ml-2 font-semibold">
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <div className="mt-2 text-sm text-gray-600">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions removed as per requirements */}
      </div>
    </div>
  );
};
export default CommissionSettings;