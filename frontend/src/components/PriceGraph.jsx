import React, { useState, useEffect } from 'react';
import { useCommission } from '../context/CommissionContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaChartLine, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import api from '../api/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


const PriceGraph = ({ productId, productName, onClose, filters = {} }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7D');
  const [error, setError] = useState(null);
  const { calculateCommission } = useCommission();

  const periods = [
    { key: '7D', label: '7 Days', days: 7 },
    { key: '1M', label: '1 Month', days: 30 },
    { key: '3M', label: '3 Months', days: 90 },
    { key: '6M', label: '6 Months', days: 180 },
    { key: '1Y', label: '1 Year', days: 365 }
  ];


  // Fetch price data for selected product and period
  const fetchPriceData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters including filters
      const queryParams = new URLSearchParams({
        period: selectedPeriod
      });
      
      // Add filters to query params if they exist
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.region) queryParams.append('region', filters.region);
      
      const { data } = await api.get(`/home/price-history/${productId}?${queryParams.toString()}`);
      if (data.success) {
        setPriceData(data.priceHistory.priceHistory);
      } else {
        setError(data.message || 'Failed to fetch price data');
      }
    } catch (error) {
      setError('Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  }, [productId, selectedPeriod, filters]);

  // Refetch data when product or period changes
  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  // Format price as INR currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };


  // Prepare chart data for Chart.js
  const getChartData = () => {
    if (!priceData || !Array.isArray(priceData)) return null;

    let data = [...priceData]; // Create a copy to avoid mutating original data
    
    // No need to sample data since we now have exact intervals for each period
    // The database already provides the correct number of data points for each time period

    // Calculate price range for better scaling
    const prices = data.map(item => calculateCommission(item.price).finalPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Use slight green color for all graphs, especially for 1-year period
    const borderColor = '#22c55e'; // Slight green color
    const backgroundColor = 'rgba(34, 197, 94, 0.1)'; // Light green background

    // Use commission-adjusted price for chart
    return {
      labels: data.map(item => 
        new Date(item.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets: [
        {
          label: 'Price (with commission)',
          data: prices,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: priceRange > 10000 ? 3 : 4, // Smaller points for large price ranges
          pointHoverRadius: priceRange > 10000 ? 5 : 6,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `${productName} - Price History`,
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const item = priceData?.[context.dataIndex];
            if (!item) {
              return [`Price: ${formatPrice(context.parsed.y)}`];
            }
            return [
              `Price: ${formatPrice(context.parsed.y)}`,
              `Change: ${item.change >= 0 ? '+' : ''}${formatPrice(item.change || 0)}`,
              `Change %: ${item.changePercent >= 0 ? '+' : ''}${item.changePercent?.toFixed(2) ?? '0.00'}%`,
              `Date: ${new Date(item.date).toLocaleDateString('en-IN')}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          maxTicksLimit: 8 // Limit number of x-axis labels for better readability
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return formatPrice(value);
          },
          // Better scaling for significant price changes
          min: function(context) {
            const prices = context.chart.data.datasets[0].data;
            const minPrice = Math.min(...prices);
            return Math.max(0, minPrice * 0.95); // Add 5% padding below minimum
          },
          max: function(context) {
            const prices = context.chart.data.datasets[0].data;
            const maxPrice = Math.max(...prices);
            return maxPrice * 1.05; // Add 5% padding above maximum
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff'
      }
    },
    // Better interaction for significant price changes
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading price data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 my-8 shadow-md">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Price Data</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={fetchPriceData}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 my-4 shadow-md">
        {/* Current Price Only */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-2">
          <div className="bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaRupeeSign className="text-primary" />
              <span className="text-sm text-gray-600">Current Price</span>
            </div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-900">
                  {Array.isArray(priceData) && priceData.length > 0
                    ? formatPrice(calculateCommission(priceData[priceData.length - 1].price).finalPrice)
                    : formatPrice(0)}
                </span>
                <span className="text-xs text-gray-500">
                  Last updated: {
                    Array.isArray(priceData) && priceData.length > 0 && priceData[priceData.length - 1].date
                      ? new Date(priceData[priceData.length - 1].date).toLocaleDateString('en-IN')
                      : 'N/A'
                  }
                </span>
              </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 mb-6">
          {getChartData() && (
            <Line data={getChartData()} options={chartOptions} />
          )}
        </div>

        {/* Period Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === period.key
                  ? 'bg-primary text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Price Range for selected period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Price Range ({selectedPeriod})</h3>
            <div className="space-y-1">
              {Array.isArray(priceData) && priceData.length > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest:</span>
                    <span className="font-semibold text-green-600">{formatPrice(Math.max(...priceData.map(item => calculateCommission(item.price).finalPrice)))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest:</span>
                    <span className="font-semibold text-red-600">{formatPrice(Math.min(...priceData.map(item => calculateCommission(item.price).finalPrice)))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-semibold text-blue-600">{formatPrice(Math.round(priceData.reduce((sum, item) => sum + calculateCommission(item.price).finalPrice, 0) / priceData.length))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Range:</span>
                    <span className="font-semibold text-purple-600">
                      {formatPrice(Math.max(...priceData.map(item => calculateCommission(item.price).finalPrice)) - Math.min(...priceData.map(item => calculateCommission(item.price).finalPrice)))}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest:</span>
                    <span className="font-semibold">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest:</span>
                    <span className="font-semibold">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-semibold">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Range:</span>
                    <span className="font-semibold">{formatPrice(0)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Additional Statistics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Statistics</h3>
            <div className="space-y-1">
              {Array.isArray(priceData) && priceData.length > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Points:</span>
                    <span className="font-semibold">{priceData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Period:</span>
                    <span className="font-semibold">{selectedPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Volatility:</span>
                    <span className="font-semibold">
                      {(() => {
                        const prices = priceData.map(item => calculateCommission(item.price).finalPrice);
                        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
                        const variance = prices.reduce((acc, price) => acc + Math.pow(price - avg, 2), 0) / prices.length;
                        const volatility = Math.sqrt(variance);
                        return `${((volatility / avg) * 100).toFixed(1)}%`;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trend:</span>
                    <span className={`font-semibold ${
                      (() => {
                        const prices = priceData.map(item => calculateCommission(item.price).finalPrice);
                        const firstPrice = prices[0];
                        const lastPrice = prices[prices.length - 1];
                        return lastPrice > firstPrice ? 'text-green-600' : lastPrice < firstPrice ? 'text-red-600' : 'text-gray-600';
                      })()
                    }`}>
                      {(() => {
                        const prices = priceData.map(item => calculateCommission(item.price).finalPrice);
                        const firstPrice = prices[0];
                        const lastPrice = prices[prices.length - 1];
                        return lastPrice > firstPrice ? '↗ Upward' : lastPrice < firstPrice ? '↘ Downward' : '→ Stable';
                      })()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Points:</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Period:</span>
                    <span className="font-semibold">{selectedPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Volatility:</span>
                    <span className="font-semibold">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trend:</span>
                    <span className="font-semibold text-gray-600">→ Stable</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PriceGraph;





