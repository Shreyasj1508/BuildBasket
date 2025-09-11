import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowLeft, FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
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

const PriceDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [priceDetail, setPriceDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchPriceDetails();
  }, [productId]);

  const fetchPriceDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/price-details/${productId}`);
      if (data.success) {
        setPriceDetail(data.priceDetail);
      }
    } catch (error) {
      console.error('Error fetching price details:', error);
    } finally {
      setLoading(false);
    }
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getChartData = () => {
    if (!priceDetail?.priceHistory) return null;

    let filteredData = priceDetail.priceHistory;
    
    if (selectedPeriod === '7d') {
      filteredData = priceDetail.priceHistory.slice(-7);
    } else if (selectedPeriod === '14d') {
      filteredData = priceDetail.priceHistory.slice(-14);
    }

    return {
      labels: filteredData.map(item => 
        new Date(item.date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets: [
        {
          label: 'Price',
          data: filteredData.map(item => item.price),
          borderColor: priceDetail.marketTrend === 'up' ? '#10b981' : priceDetail.marketTrend === 'down' ? '#ef4444' : '#6b7280',
          backgroundColor: priceDetail.marketTrend === 'up' ? 'rgba(16, 185, 129, 0.1)' : priceDetail.marketTrend === 'down' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: priceDetail.marketTrend === 'up' ? '#10b981' : priceDetail.marketTrend === 'down' ? '#ef4444' : '#6b7280',
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
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Price: ${formatPrice(context.parsed.y)}`;
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading price details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!priceDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Price Details Not Found</h2>
            <p className="text-gray-600 mb-6">Unable to load price information for this product.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center hover:text-primary transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <span>/</span>
            <span>Price Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {priceDetail.productId?.name || 'Product Price Details'}
              </h1>
              <p className="text-gray-600 mb-4">
                {priceDetail.productId?.category || 'Construction Material'}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaRupeeSign className="text-2xl text-primary" />
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(priceDetail.currentPrice)}
                  </span>
                </div>
                <div className={`flex items-center space-x-1 ${getTrendColor(priceDetail.marketTrend)}`}>
                  {getTrendIcon(priceDetail.marketTrend)}
                  <span className="font-semibold capitalize">{priceDetail.marketTrend}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 lg:items-end">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold">
                  {new Date(priceDetail.lastUpdated).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-slideInUp">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Weekly Change</p>
                <p className={`text-2xl font-bold ${priceDetail.weeklyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceDetail.weeklyChange >= 0 ? '+' : ''}{formatPrice(priceDetail.weeklyChange)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Change</p>
                <p className={`text-2xl font-bold ${priceDetail.monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceDetail.monthlyChange >= 0 ? '+' : ''}{formatPrice(priceDetail.monthlyChange)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Price Range</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(priceDetail.priceRange.min)} - {formatPrice(priceDetail.priceRange.max)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaArrowUp className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Price History</h2>
            <div className="flex space-x-2">
              {['7d', '14d', '30d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'bg-primary text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-96">
            {getChartData() && (
              <Line data={getChartData()} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Recent Price Changes */}
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Price Changes</h2>
          <div className="space-y-4">
            {priceDetail.priceHistory.slice(-10).reverse().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    item.change > 0 ? 'bg-green-500' : item.change < 0 ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    item.change > 0 ? 'text-green-500' : item.change < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {item.change > 0 ? '+' : ''}{formatPrice(item.change)}
                  </p>
                  <p className={`text-sm ${
                    item.changePercent > 0 ? 'text-green-500' : item.changePercent < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PriceDetail;
