import React, { useEffect, useState } from 'react';
import api from '../api/api';

const PriceRangeDetails = ({ productId }) => {
  const [priceRange, setPriceRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/home/price-history/${productId}`);
        if (data.success && data.priceHistory && data.priceHistory.priceHistory && data.priceHistory.priceHistory.priceRange) {
          setPriceRange(data.priceHistory.priceHistory.priceRange);
        } else {
          setPriceRange({ min: 0, max: 0, avg: 0 });
        }
      } catch (err) {
        setError('Failed to fetch price range');
        setPriceRange({ min: 0, max: 0, avg: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchPriceRange();
  }, [productId]);

  if (loading) return <span className="text-gray-500">Loading...</span>;
  if (error) return <span className="text-red-500">{error}</span>;

  return (
    <div className="flex space-x-8">
      <div>
        <span className="font-medium text-gray-700">Min:</span> <span className="font-bold text-green-700">₹{priceRange.min}</span>
      </div>
      <div>
        <span className="font-medium text-gray-700">Max:</span> <span className="font-bold text-red-700">₹{priceRange.max}</span>
      </div>
      <div>
        <span className="font-medium text-gray-700">Avg:</span> <span className="font-bold text-blue-700">₹{priceRange.avg}</span>
      </div>
    </div>
  );
};

export default PriceRangeDetails;