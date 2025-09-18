import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaRupeeSign, FaArrowUp, FaArrowDown, FaMinus, FaEye, FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import PriceGraph from './PriceGraph';
import { useCommission } from '../../context/CommissionContext';

const ProductCardWithGraph = ({ product, add_card, add_wishlist }) => {
  const [showGraph, setShowGraph] = useState(false);
  const { calculateCommission } = useCommission();

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

  const getPriceChangeColor = (value) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        {/* Product Image */}
        <div className="relative h-32 bg-gray-100">
          <img
            src={product.images?.[0] || '/images/demo.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{product.discount}%
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => setShowGraph(true)}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
              title="View Price Graph"
            >
              <FaChartLine className="text-primary text-lg" />
            </button>
            <Link
              to={`/product/details/${product.slug}`}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
              title="View Details"
            >
              <FaEye className="text-gray-600 text-lg" />
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          <div className="mb-1">
            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
              {product.brand}
            </span>
          </div>
          
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <FaRupeeSign className="text-primary text-sm" />
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(Math.round(calculateCommission(product.price).finalPrice))}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Stock</p>
                <p className="text-xs font-semibold text-gray-900">{product.stock}</p>
              </div>
            </div>

            {/* Price History Info */}
            {product.priceHistory && (
              <div className="bg-gray-50 rounded p-2 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">Market Price</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(product.priceHistory.marketTrend)}
                    <span className={`text-xs font-semibold capitalize ${getTrendColor(product.priceHistory.marketTrend)}`}>
                      {product.priceHistory.marketTrend}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <p className="text-gray-500">Weekly</p>
                    <p className={`font-semibold ${getPriceChangeColor(product.priceHistory.changes?.weekly?.value || 0)}`}>
                      {product.priceHistory.changes?.weekly?.value >= 0 ? '+' : ''}{formatPrice(product.priceHistory.changes?.weekly?.value || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monthly</p>
                    <p className={`font-semibold ${getPriceChangeColor(product.priceHistory.changes?.monthly?.value || 0)}`}>
                      {product.priceHistory.changes?.monthly?.value >= 0 ? '+' : ''}{formatPrice(product.priceHistory.changes?.monthly?.value || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-1">
            <div className="flex space-x-1">
              <button
                onClick={() => setShowGraph(true)}
                className="flex-1 bg-primary text-white py-1 px-2 rounded text-xs hover:bg-primary-dark transition-colors flex items-center justify-center space-x-1"
              >
                <FaChartLine className="text-xs" />
                <span>Graph</span>
              </button>
              <Link
                to={`/product/details/${product.slug}`}
                className="flex-1 bg-gray-100 text-gray-700 py-1 px-2 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
              >
                <FaEye className="text-xs" />
                <span>View</span>
              </Link>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => add_card && add_card(product._id)}
                className="flex-1 bg-orange-500 text-white py-1 px-2 rounded text-xs hover:bg-orange-600 transition-colors flex items-center justify-center space-x-1 font-semibold"
              >
                <FaShoppingCart className="text-xs" />
                <span>ADD TO CART</span>
              </button>
              <button
                onClick={() => add_wishlist && add_wishlist(product._id)}
                className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
              >
                <FaRegHeart className="text-xs" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Graph Modal */}
      {showGraph && (
        <PriceGraph
          productId={product._id}
          productName={product.name}
          onClose={() => setShowGraph(false)}
        />
      )}
    </>
  );
};

export default ProductCardWithGraph;
