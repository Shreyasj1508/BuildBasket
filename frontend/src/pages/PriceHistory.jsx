import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PriceGraph from '../components/PriceGraph';
import PriceRangeDetails from '../components/PriceRangeDetails';
import { FaArrowLeft, FaChartLine, FaRupeeSign, FaFilter } from 'react-icons/fa';
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
        region: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        states: [],
        cities: [],
        regions: []
    });

    const [showFilters, setShowFilters] = useState(true); // Start with filters visible for testing
    const [filtersLoading, setFiltersLoading] = useState(false);

    // Enhanced fetch filter options from database
    const fetchFilterOptions = async () => {
        try {
            console.log('Fetching filter options from database...');
            const { data } = await api.get('/home/price-history-filter-options');
            console.log('Filter options API response:', data);
            
            if (data.success && data.filterOptions) {
                // Update filter options with database data
                setFilterOptions({
                    states: data.filterOptions.states || [],
                    cities: data.filterOptions.cities || [],
                    regions: data.filterOptions.regions || []
                });
                console.log('✅ Filter options loaded from database:');
                console.log('States:', data.filterOptions.states?.length || 0);
                console.log('Cities:', data.filterOptions.cities?.length || 0);
                console.log('Regions:', data.filterOptions.regions?.length || 0);
            } else {
                console.error('❌ API returned success: false or missing filterOptions', data);
                // Set fallback options if API fails
                setFilterOptions({
                    states: ['Maharashtra', 'Delhi', 'Karnataka'],
                    cities: ['Mumbai', 'Delhi', 'Bangalore'],
                    regions: ['Northern', 'Southern', 'Eastern', 'Western', 'Central']
                });
                console.log('Using fallback filter options');
            }
        } catch (error) {
            console.error('❌ Error fetching filter options:', error);
            console.error('Error details:', error.response?.data);
            // Set fallback options on error
            setFilterOptions({
                states: ['Maharashtra', 'Delhi', 'Karnataka'],
                cities: ['Mumbai', 'Delhi', 'Bangalore'], 
                regions: ['Northern', 'Southern', 'Eastern', 'Western', 'Central']
            });
            console.log('Using fallback filter options due to error');
        }
    };

    useEffect(() => {
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000); // 10 seconds timeout

        // Log current filter options
        console.log('Current filterOptions:', filterOptions);

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
        console.log(`=== handleFilterChange called ===`);
        console.log(`Filter type: ${filterType}`);
        console.log(`Value: "${value}"`);
        console.log(`Value type: ${typeof value}`);
        console.log(`Value length: ${value.length}`);
        console.log(`Current filters before change:`, filters);
        
        setFiltersLoading(true);
        
        // If value is empty (like "All Regions"), clear all filters
        if (value === '') {
            console.log('Clearing all filters because value is empty');
            setFilters({ state: '', city: '', region: '' });
        } else {
            console.log(`Setting ${filterType} filter to: "${value}"`);
            // Only one filter can be active at a time
            if (filterType === 'state') {
                setFilters({ state: value, city: '', region: '' });
            } else if (filterType === 'city') {
                setFilters({ state: '', city: value, region: '' });
            } else if (filterType === 'region') {
                setFilters({ state: '', city: '', region: value });
            }
        }
        
        setTimeout(() => {
            setFiltersLoading(false);
            console.log('Filters loading set to false');
        }, 500);
        
        console.log(`=== handleFilterChange completed ===`);
    };

    const clearFilters = (e) => {
        // Prevent any default behavior or event propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('🗑️ Clearing all filters...');
        console.log('Filters before clearing:', filters);
        
        setFiltersLoading(true);
        
        // Clear all filters
        const clearedFilters = {
            state: '',
            city: '',
            region: ''
        };
        
        setFilters(clearedFilters);
        
        setTimeout(() => {
            setFiltersLoading(false);
            console.log('✅ All filters cleared successfully');
            console.log('Filters after clearing:', clearedFilters);
        }, 300);
        
        // Ensure we stay on the same page
        return false;
    };


    const applyFilters = () => {
        // Filters are applied automatically when changed, no need for separate apply button
        setShowFilters(false);
    };

    const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

    // Debug: Log filters state changes
    useEffect(() => {
        console.log('Current filters state:', filters);
        console.log('Has active filters:', hasActiveFilters);
    }, [filters, hasActiveFilters]);

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
                        
                        {/* Filter Button - Always Visible */}
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 border-2 shadow-lg ${
                                    showFilters || hasActiveFilters
                                        ? 'bg-primary text-white border-primary transform scale-105'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-primary hover:shadow-xl'
                                }`}
                            >
                                <FaFilter className="text-lg" />
                                <span className="font-semibold">Filters</span>
                                {hasActiveFilters && (
                                    <span className="bg-white text-primary text-xs px-2 py-1 rounded-full font-bold">
                                        {Object.values(filters).filter(f => f !== '').length}
                                    </span>
                                )}
                            </button>
                            {/* Removed duplicate 'Clear All' button */}
                        </div>
                        
                    </div>
                    

                    {/* Simple Filter Dropdown */}
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-md border">
                        <div className="flex items-center space-x-4 flex-wrap">
                            <span className="text-sm font-medium text-gray-700">Filter by:</span>
                            
                            {/* State Dropdown */}
                            <select
                                value={filters.state || ''}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    console.log('State selected:', selectedValue);
                                    handleFilterChange('state', selectedValue);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All States</option>
                                {filterOptions.states && filterOptions.states.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>

                            {/* City Dropdown */}
                            <select
                                value={filters.city || ''}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    console.log('City selected:', selectedValue);
                                    handleFilterChange('city', selectedValue);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">All Cities</option>
                                {filterOptions.cities && filterOptions.cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            {/* New Region Dropdown - Database Integrated */}
                            <select
                                value={filters.region || ''}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    console.log('New Region selected:', selectedValue);
                                    handleFilterChange('region', selectedValue);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[150px]"
                                style={{ minWidth: '150px' }}
                            >
                                <option value="">All Regions</option>
                                {filterOptions.regions && filterOptions.regions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>


                            {/* New Remove All Filters Button */}
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        clearFilters(e);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium flex items-center space-x-2 shadow-md"
                                    title="Clear all active filters"
                                >
                                    <span>🗑️</span>
                                    <span>Remove All Filters</span>
                                    <span className="bg-red-600 text-xs px-1.5 py-0.5 rounded-full">
                                        {Object.values(filters).filter(f => f !== '').length}
                                    </span>
                                </button>
                            )}
                        </div>
                        
                        {/* Active Filters Display */}
                        {Object.values(filters).filter(f => f !== '').length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-gray-600">Active filters: </span>
                                        {filters.state && <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">{filters.state}</span>}
                                        {filters.city && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">{filters.city}</span>}
                                        {filters.region && <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-1">{filters.region}</span>}
                                    </div>
                                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                        {filtersLoading ? (
                                            <span className="flex items-center">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                                                Applying...
                                            </span>
                                        ) : (
                                            "✅ Filters Applied"
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
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
