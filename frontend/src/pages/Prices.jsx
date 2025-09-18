import React, { useState, useEffect } from 'react';
import { useCommission } from '../context/CommissionContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDispatch } from 'react-redux';
import { get_products } from '../store/reducers/homeReducer';
import { useHomeState } from '../hooks/useSafeSelector';
import api from '../api/api';

const Prices = () => {
    const dispatch = useDispatch();
    const { products } = useHomeState();
    const { calculateCommission, commission } = useCommission();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [sortBy, setSortBy] = useState('name');
    const [pricingData, setPricingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(get_products());
        
        const fetchPricingData = async () => {
            try {
                const response = await api.get('/home/pricing-data');
                if (response.data.success) {
                    setPricingData(response.data.pricingData);
                }
            } catch (error) {
                console.error('Error fetching pricing data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPricingData();
    }, [dispatch]);

    useEffect(() => {
        let filtered = [...products];

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product => 
                product.category.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }

        // Filter by price range
        filtered = filtered.filter(product => 
            product.price >= priceRange.min && product.price <= priceRange.max
        );

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    }, [products, selectedCategory, priceRange, sortBy, calculateCommission]);

    const categories = [...new Set(products.map(product => product.category))];

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#eba834] mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading pricing data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />
            
            {/* Hero Section */}
            <div className='bg-gradient-to-r from-[#eba834] to-[#d4a32e] py-16'>
                <div className='w-[85%] mx-auto text-center'>
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                        Material Prices
                    </h1>
                    <p className='text-xl text-white/90 max-w-3xl mx-auto'>
                        Compare prices and find the best deals on construction materials
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className='w-[85%] mx-auto py-8'>
                <div className='bg-white p-6 rounded-lg shadow-lg mb-8'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6'>Filter & Sort</h2>
                    
                    <div className='grid md:grid-cols-4 gap-6'>
                        {/* Category Filter */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className='input-field'
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Min Price</label>
                            <input
                                type="number"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                                className='input-field'
                                placeholder="Min Price"
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Max Price</label>
                            <input
                                type="number"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 10000})}
                                className='input-field'
                                placeholder="Max Price"
                            />
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className='input-field'
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="price-low">Price (Low to High)</option>
                                <option value="price-high">Price (High to Low)</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className='mb-6'>
                    <p className='text-gray-600'>
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>

                {/* Products Grid */}
                <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {filteredProducts.map(product => (
                        <div key={product._id} className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
                            <div className='h-48 bg-gray-200 flex items-center justify-center'>
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={product.images[0]} 
                                        alt={product.name}
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <span className='text-gray-400 text-sm'>No Image</span>
                                )}
                            </div>
                            
                            <div className='p-4'>
                                <h3 className='text-lg font-bold text-gray-800 mb-2 line-clamp-2'>
                                    {product.name}
                                </h3>
                                
                                <p className='text-sm text-gray-600 mb-2'>
                                    Category: {product.category}
                                </p>
                                
                                <p className='text-sm text-gray-600 mb-3'>
                                    Brand: {product.brand}
                                </p>

                                <div className='flex items-center justify-between mb-3'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-2xl font-bold text-[#eba834]'>
                                            ₹{Math.round(calculateCommission(product.price - Math.floor((product.price * product.discount) / 100)).finalPrice)}
                                        </span>
                                        {product.discount > 0 && (
                                            <span className='text-sm text-gray-500 line-through'>
                                                ₹{Math.round(calculateCommission(product.price).finalPrice)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {product.discount > 0 && (
                                        <span className='bg-red-500 text-white text-xs px-2 py-1 rounded'>
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-yellow-400'>★</span>
                                        <span className='text-sm text-gray-600'>
                                            {product.rating || 'No rating'}
                                        </span>
                                    </div>
                                    
                                    <span className='text-sm text-gray-600'>
                                        Stock: {product.stock}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredProducts.length === 0 && (
                    <div className='text-center py-12'>
                        <div className='text-6xl text-gray-300 mb-4'>🔍</div>
                        <h3 className='text-xl font-bold text-gray-600 mb-2'>No products found</h3>
                        <p className='text-gray-500'>Try adjusting your filters to see more results</p>
                    </div>
                )}
            </div>

            {/* Pricing Features Section */}
            <div className='w-[85%] mx-auto py-16'>
                <div className='bg-white p-8 rounded-lg shadow-lg mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Why Choose Our Prices?</h2>
                    
                    <div className='grid md:grid-cols-3 gap-8'>
                        <div className='text-center'>
                            <div className='w-16 h-16 bg-[#eba834] rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-white text-2xl'>💰</span>
                            </div>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>Competitive Pricing</h3>
                            <p className='text-gray-600'>
                                We work directly with suppliers to offer the best prices in the market
                            </p>
                        </div>
                        
                        <div className='text-center'>
                            <div className='w-16 h-16 bg-[#eba834] rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-white text-2xl'>📊</span>
                            </div>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>Price Transparency</h3>
                            <p className='text-gray-600'>
                                No hidden fees or surprise charges. What you see is what you pay
                            </p>
                        </div>
                        
                        <div className='text-center'>
                            <div className='w-16 h-16 bg-[#eba834] rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-white text-2xl'>🎯</span>
                            </div>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>Best Value</h3>
                            <p className='text-gray-600'>
                                Quality materials at fair prices with excellent customer service
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing Features from Backend */}
                {pricingData?.pricingFeatures && (
                    <div className='bg-white p-8 rounded-lg shadow-lg mb-8'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Our Pricing Features</h2>
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {pricingData.pricingFeatures.map((feature, index) => (
                                <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                    <div className='w-2 h-2 bg-[#eba834] rounded-full'></div>
                                    <span className='text-gray-700'>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delivery Information */}
                {pricingData?.deliveryInfo && (
                    <div className='bg-white p-8 rounded-lg shadow-lg'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Delivery Information</h2>
                        <div className='grid md:grid-cols-2 gap-8'>
                            <div>
                                <h3 className='text-lg font-bold text-gray-700 mb-4'>Delivery Options</h3>
                                <div className='space-y-3'>
                                    <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                                        <span className='font-medium'>Standard Delivery</span>
                                        <span className='text-[#eba834] font-bold'>{pricingData.deliveryInfo.standardDelivery}</span>
                                    </div>
                                    <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                                        <span className='font-medium'>Express Delivery</span>
                                        <span className='text-[#eba834] font-bold'>{pricingData.deliveryInfo.expressDelivery}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className='text-lg font-bold text-gray-700 mb-4'>Shipping Costs</h3>
                                <div className='space-y-3'>
                                    <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                                        <span className='font-medium'>Free Shipping Threshold</span>
                                        <span className='text-[#eba834] font-bold'>${pricingData.deliveryInfo.freeShippingThreshold}</span>
                                    </div>
                                    <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
                                        <span className='font-medium'>Delivery Charges</span>
                                        <span className='text-[#eba834] font-bold'>{pricingData.deliveryInfo.deliveryCharges}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Prices;
