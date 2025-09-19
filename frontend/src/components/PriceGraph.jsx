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
    if (!priceData) return null;

    let data = priceData;
    // Sample data for longer periods to reduce points
    if (Array.isArray(data)) {
      let step = 1;
      if (selectedPeriod === '3M') step = 3; // every 3rd day
      if (selectedPeriod === '6M') step = 7; // every 7th day
      if (selectedPeriod === '1Y') step = 15; // every 15th day
      if (step > 1) {
        data = data.filter((_, idx) => idx % step === 0 || idx === data.length - 1);
      }
    }
    const trend = priceData.marketTrend || 'stable';
    // Determine colors based on trend
    const borderColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';
    const backgroundColor = trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 
                          trend === 'down' ? 'rgba(239, 68, 68, 0.1)' : 
                          'rgba(107, 114, 128, 0.1)';

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
          data: data.map(item => calculateCommission(item.price).finalPrice),
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
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
            const item = priceData?.priceHistory?.[context.dataIndex];
            if (!item) {
              return [`Price: ${formatPrice(context.parsed.y)}`];
            }
            return [
              `Price: ${formatPrice(context.parsed.y)}`,
              `Change: ${item.change >= 0 ? '+' : ''}${formatPrice(item.change)}`,
              `Change %: ${item.changePercent >= 0 ? '+' : ''}${item.changePercent?.toFixed(2) ?? '0.00'}%`
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
          }
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
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff'
      }
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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
            <div className="space-y-1">
              {Array.isArray(priceData) && priceData.length > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest:</span>
                    <span className="font-semibold">{formatPrice(Math.max(...priceData.map(item => calculateCommission(item.price).finalPrice)))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest:</span>
                    <span className="font-semibold">{formatPrice(Math.min(...priceData.map(item => calculateCommission(item.price).finalPrice)))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-semibold">{formatPrice(priceData.reduce((sum, item) => sum + calculateCommission(item.price).finalPrice, 0) / priceData.length)}</span>
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
