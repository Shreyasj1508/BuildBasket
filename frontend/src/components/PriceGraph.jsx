import React, { useState, useEffect } from 'react';
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
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
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

const PriceGraph = ({ productId, productName, onClose }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [error, setError] = useState(null);

  const periods = [
    { key: '7D', label: '7 Days', days: 7 },
    { key: '1M', label: '1 Month', days: 30 },
    { key: '3M', label: '3 Months', days: 90 },
    { key: '6M', label: '6 Months', days: 180 },
    { key: '1Y', label: '1 Year', days: 365 }
  ];

  useEffect(() => {
    fetchPriceData();
  }, [productId, selectedPeriod]);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/home/price-history/${productId}?period=${selectedPeriod}`);
      
      if (data.success) {
        setPriceData(data.priceHistory.priceHistory);
      } else {
        setError(data.message || 'Failed to fetch price data');
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
      setError('Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FaArrowUp className="text-green-500" />;
      case 'down':
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaMinus className="text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getChartData = () => {
    if (!priceData) return null;

    const data = priceData;
    const trend = priceData.marketTrend || 'stable';
    
    // Determine colors based on trend
    const borderColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';
    const backgroundColor = trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 
                          trend === 'down' ? 'rgba(239, 68, 68, 0.1)' : 
                          'rgba(107, 114, 128, 0.1)';

    return {
      labels: data.map(item => 
        new Date(item.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets: [
        {
          label: 'Price',
          data: data.map(item => item.price),
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
            const item = priceData.priceHistory[context.dataIndex];
            return [
              `Price: ${formatPrice(context.parsed.y)}`,
              `Change: ${item.change >= 0 ? '+' : ''}${formatPrice(item.change)}`,
              `Change %: ${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%`
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaChartLine className="text-2xl text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{productName}</h2>
              <p className="text-gray-600">Price History & Market Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Current Price & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaRupeeSign className="text-primary" />
              <span className="text-sm text-gray-600">Current Price</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(priceData.currentPrice)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              {getTrendIcon(priceData.marketTrend)}
              <span className="text-sm text-gray-600">Market Trend</span>
            </div>
            <div className={`text-lg font-semibold capitalize ${getTrendColor(priceData.marketTrend)}`}>
              {priceData.marketTrend}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaCalendarAlt className="text-primary" />
              <span className="text-sm text-gray-600">Weekly Change</span>
            </div>
            <div className={`text-lg font-semibold ${
              (priceData.changes?.weekly?.value || 0) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {(priceData.changes?.weekly?.value || 0) >= 0 ? '+' : ''}{formatPrice(priceData.changes?.weekly?.value || 0)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FaArrowUp className="text-primary" />
              <span className="text-sm text-gray-600">Monthly Change</span>
            </div>
            <div className={`text-lg font-semibold ${
              (priceData.changes?.monthly?.value || 0) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {(priceData.changes?.monthly?.value || 0) >= 0 ? '+' : ''}{formatPrice(priceData.changes?.monthly?.value || 0)}
            </div>
          </div>
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

        {/* Chart */}
        <div className="h-96 mb-6">
          {getChartData() && (
            <Line data={getChartData()} options={chartOptions} />
          )}
        </div>

        {/* Price Range & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Highest:</span>
                <span className="font-semibold">{formatPrice(priceData.priceRange.max)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lowest:</span>
                <span className="font-semibold">{formatPrice(priceData.priceRange.min)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average:</span>
                <span className="font-semibold">{formatPrice(priceData.priceRange.avg)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Market Indicators</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Volatility:</span>
                <span className="font-semibold">{priceData.marketIndicators?.volatility?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Support:</span>
                <span className="font-semibold">{formatPrice(priceData.marketIndicators?.supportLevel || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Resistance:</span>
                <span className="font-semibold">{formatPrice(priceData.marketIndicators?.resistanceLevel || 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Time Period Changes</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily:</span>
                <span className={`font-semibold ${
                  priceData.changes.daily.value >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {priceData.changes.daily.value >= 0 ? '+' : ''}{formatPrice(priceData.changes.daily.value)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quarterly:</span>
                <span className={`font-semibold ${
                  priceData.changes.quarterly.value >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {priceData.changes.quarterly.value >= 0 ? '+' : ''}{formatPrice(priceData.changes.quarterly.value)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Yearly:</span>
                <span className={`font-semibold ${
                  priceData.changes.yearly.value >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {priceData.changes.yearly.value >= 0 ? '+' : ''}{formatPrice(priceData.changes.yearly.value)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceGraph;
