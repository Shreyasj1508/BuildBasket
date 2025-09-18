import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useCommission } from '../context/CommissionContext';

const PriceRangeDetails = ({ productId, filters = {} }) => {
  const [priceRange, setPriceRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { calculateCommission } = useCommission();

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters including filters
        const queryParams = new URLSearchParams();
        
        // Add filters to query params if they exist
        if (filters.state) queryParams.append('state', filters.state);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.region) queryParams.append('region', filters.region);
        if (filters.category) queryParams.append('category', filters.category);
        
        const queryString = queryParams.toString();
        const url = queryString ? `/home/price-history/${productId}?${queryString}` : `/home/price-history/${productId}`;
        
        const { data } = await api.get(url);
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
  }, [productId, filters]);

  if (loading) return <span className="text-gray-500">Loading...</span>;
  if (error) return <span className="text-red-500">{error}</span>;

  return (
    <div className="flex space-x-8">
      <div>
        <span className="font-medium text-gray-700">Min:</span> <span className="font-bold text-green-700">₹{Math.round(calculateCommission(priceRange.min).finalPrice)}</span>
      </div>
      <div>
        <span className="font-medium text-gray-700">Max:</span> <span className="font-bold text-red-700">₹{Math.round(calculateCommission(priceRange.max).finalPrice)}</span>
      </div>
      <div>
        <span className="font-medium text-gray-700">Avg:</span> <span className="font-bold text-blue-700">₹{Math.round(calculateCommission(priceRange.avg).finalPrice)}</span>
      </div>
    </div>
  );
};

export default PriceRangeDetails;