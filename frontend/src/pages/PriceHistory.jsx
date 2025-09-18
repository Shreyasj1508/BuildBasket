import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PriceGraph from '../components/PriceGraph';
import PriceRangeDetails from '../components/PriceRangeDetails';
import { FaArrowLeft, FaChartLine, FaRupeeSign, FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';
import { get_products } from '../store/reducers/homeReducer';
import api from '../api/api';
import { useCommission } from '../context/CommissionContext';

const PriceHistory = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.home);
    const { calculateCommission } = useCommission();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [filters, setFilters] = useState({
        state: '',
        city: '',
        region: '',
        category: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        states: [],
        cities: [],
        regions: [],
        categories: []
    });
    const [showFilters, setShowFilters] = useState(false);

    // Fetch filter options
    const fetchFilterOptions = async () => {
        try {
            const { data } = await api.get('/home/price-history-filter-options');
            if (data.success) {
                setFilterOptions(data.filterOptions);
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    useEffect(() => {
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000); // 10 seconds timeout

        // Fetch filter options
        fetchFilterOptions();

        // First try to find product in existing products list
        if (products && products.length > 0) {
            const foundProduct = products.find(p => p._id === productId);
            if (foundProduct) {
                setProduct(foundProduct);
                setLoading(false);
                clearTimeout(timeout);
                return;
            }
        }
        
        // If not found, fetch all products first
        if (!products || products.length === 0) {
            dispatch(get_products());
        }

        return () => clearTimeout(timeout);
    }, [productId, products, dispatch]);


    const fetchProductFromAPI = React.useCallback(async () => {
        try {
            const { data } = await api.get(`/home/product-by-id/${productId}`);
            if (data.success) {
                setProduct(data.product);
            } else {
                console.error('Product not found via API:', data.message);
            }
        } catch (error) {
            console.error('Error fetching product from API:', error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    // Update product when products are loaded
    useEffect(() => {
        if (products && products.length > 0 && !product) {
            const foundProduct = products.find(p => p._id === productId);
            if (foundProduct) {
                setProduct(foundProduct);
                setLoading(false);
            } else {
                console.log('Product not found in products list, trying API...');
                // Try API as fallback
                fetchProductFromAPI();
            }
        }
    }, [products, productId, product, fetchProductFromAPI]);

    // Filter functions
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            state: '',
            city: '',
            region: '',
            category: ''
        });
    };

    const applyFilters = () => {
        // This will trigger a re-fetch of price history with filters
        setShowFilters(false);
    };

    const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading price history...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="text-gray-500 text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
                        <p className="text-gray-600 mb-4">The requested product could not be found.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Go Home
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
            
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                            >
                                <FaArrowLeft />
                                <span>Back</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                                    <FaChartLine className="text-primary text-xl" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Price History</h1>
                                    <p className="text-gray-600">Track price changes over time</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Filter Button */}
                        <div className="flex items-center space-x-3">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <FaTimes />
                                    <span>Clear Filters</span>
                                </button>
                            )}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                    showFilters || hasActiveFilters
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <FaFilter />
                                <span>Filters</span>
                                {hasActiveFilters && (
                                    <span className="bg-white text-primary text-xs px-2 py-1 rounded-full">
                                        {Object.values(filters).filter(f => f !== '').length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Price History</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* State Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <select
                                        value={filters.state}
                                        onChange={(e) => handleFilterChange('state', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">All States</option>
                                        {filterOptions.states.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* City Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <select
                                        value={filters.city}
                                        onChange={(e) => handleFilterChange('city', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">All Cities</option>
                                        {filterOptions.cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Region Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                                    <select
                                        value={filters.region}
                                        onChange={(e) => handleFilterChange('region', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">All Regions</option>
                                        {filterOptions.regions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">All Categories</option>
                                        {filterOptions.categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={product.images?.[0] || '/images/demo.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-3">{product.description}</p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <FaRupeeSign className="text-primary" />
                                    <span className="text-2xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('en-IN', {
                                            style: 'currency',
                                            currency: 'INR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(Math.round(calculateCommission(product.price).finalPrice))}
                                    </span>
                                </div>
                                {product.discount > 0 && (
                                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        {product.discount}% OFF
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Price Graph Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    {/* Removed Price Trend Analysis and Last updated */}
                    <PriceGraph
                        productId={productId}
                        productName={product.name}
                        onClose={() => {}} // No close functionality needed on this page
                        filters={filters} // Pass filters to PriceGraph
                    />
                    {/* Price Range Details */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Price Range</h4>
                        <PriceRangeDetails productId={productId} filters={filters} />
                    </div>
                </div>

                {/* Additional Info Removed */}
            </div>

            <Footer />
        </div>
    );
};

export default PriceHistory;
