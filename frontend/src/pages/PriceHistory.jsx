import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PriceGraph from '../components/PriceGraph';
import { FaArrowLeft, FaChartLine, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import { get_products } from '../store/reducers/homeReducer';
import api from '../api/api';

const PriceHistory = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.home);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000); // 10 seconds timeout

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
    }, [products, productId, product]);

    const fetchProductFromAPI = async () => {
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
    };

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
                                        }).format(product.price)}
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
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <FaChartLine className="text-primary text-xl" />
                            <h3 className="text-xl font-semibold text-gray-900">Price Trend Analysis</h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <FaCalendarAlt />
                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <PriceGraph
                        productId={productId}
                        productName={product.name}
                        onClose={() => {}} // No close functionality needed on this page
                    />
                </div>

                {/* Additional Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaChartLine className="text-blue-600 text-sm" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Price History Information</h4>
                            <p className="text-sm text-blue-700">
                                This graph shows the historical price data for {product.name}. 
                                You can view price trends over different time periods (7 days, 1 month, 3 months, 6 months, 1 year) 
                                to make informed purchasing decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PriceHistory;
