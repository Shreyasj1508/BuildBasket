import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import api from '../api/api';
import ApiTest from '../components/ApiTest';

const TestPriceHistory = () => {
    const [filterOptions, setFilterOptions] = useState({
        states: [],
        cities: [],
        regions: [],
        categories: []
    });
    const [filters, setFilters] = useState({
        state: '',
        city: '',
        region: '',
        category: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch filter options
    const fetchFilterOptions = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching filter options...');
            const { data } = await api.get('/home/price-history-filter-options');
            console.log('Filter options response:', data);
            if (data.success) {
                setFilterOptions(data.filterOptions);
                console.log('Filter options loaded:', data.filterOptions);
            } else {
                setError('Failed to load filter options');
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilterOptions();
    }, []);

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

    const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading filter options...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Filters</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchFilterOptions}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Price History Filter Test</h1>
                    
                    {/* API Test Component */}
                    <ApiTest />
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-8">
                    
                    {/* Filter Button */}
                    <div className="flex items-center justify-between mb-6">
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
                        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
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
                        </div>
                    )}

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Active Filters:</h4>
                            <div className="flex flex-wrap gap-2">
                                {filters.state && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        State: {filters.state}
                                    </span>
                                )}
                                {filters.city && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        City: {filters.city}
                                    </span>
                                )}
                                {filters.region && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        Region: {filters.region}
                                    </span>
                                )}
                                {filters.category && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        Category: {filters.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Filter Options Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">States</h4>
                            <p className="text-sm text-gray-600">{filterOptions.states.length} available</p>
                            <div className="mt-2 text-xs text-gray-500">
                                {filterOptions.states.slice(0, 3).join(', ')}
                                {filterOptions.states.length > 3 && '...'}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Cities</h4>
                            <p className="text-sm text-gray-600">{filterOptions.cities.length} available</p>
                            <div className="mt-2 text-xs text-gray-500">
                                {filterOptions.cities.slice(0, 3).join(', ')}
                                {filterOptions.cities.length > 3 && '...'}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Regions</h4>
                            <p className="text-sm text-gray-600">{filterOptions.regions.length} available</p>
                            <div className="mt-2 text-xs text-gray-500">
                                {filterOptions.regions.join(', ')}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
                            <p className="text-sm text-gray-600">{filterOptions.categories.length} available</p>
                            <div className="mt-2 text-xs text-gray-500">
                                {filterOptions.categories.slice(0, 3).join(', ')}
                                {filterOptions.categories.length > 3 && '...'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPriceHistory;
