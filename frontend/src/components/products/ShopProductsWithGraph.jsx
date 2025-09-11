import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaRupeeSign, FaArrowUp, FaArrowDown, FaMinus, FaEye, FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/reducers/cardReducer';
import { useAuthState, useCardState } from '../../hooks/useSafeSelector';
import toast from 'react-hot-toast';
import api from '../../api/api';

const ShopProductsWithGraph = ({ products = [], grid }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useAuthState();
    const { errorMessage, successMessage } = useCardState();
    const [productsWithPrices, setProductsWithPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductsWithPrices();
    }, [products]);

    const fetchProductsWithPrices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/home/products-with-prices');
            
            if (data.success) {
                // Filter products that match the current products list
                const filteredProducts = data.products.filter(product => 
                    products.some(p => p._id === product._id)
                );
                setProductsWithPrices(filteredProducts);
            } else {
                // Fallback to original products if API fails
                setProductsWithPrices(products);
            }
        } catch (error) {
            console.error('Error fetching products with prices:', error);
            // Fallback to original products
            setProductsWithPrices(products);
        } finally {
            setLoading(false);
        }
    };

    const add_card = (id) => {
        if (userInfo) {
            dispatch(add_to_card({
                userId: userInfo.id,
                quantity: 1,
                productId: id
            }))
        } else {
            window.location.href = '/login'
        }
    }

    const add_wishlist = (id) => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: id
            }))
        } else {
            window.location.href = '/login'
        }
    }

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
    }, [errorMessage, successMessage])

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products with price data...</p>
                </div>
            </div>
        );
    }

    if (productsWithPrices.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600">No products match your current filters.</p>
            </div>
        );
    }

    return (
        <div className={`${grid ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
            {productsWithPrices.map((product, index) => (
                <div key={product._id || index}>
                    {grid ? (
                        // Grid View
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-100">
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
                                        onClick={() => navigate(`/price-history/${product._id}`)}
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
                            <div className="p-4">
                                <div className="mb-2">
                                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        {product.brand}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    {product.name}
                                </h3>
                                
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {product.description}
                                </p>

                                {/* Price Section */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaRupeeSign className="text-primary" />
                                            <span className="text-2xl font-bold text-gray-900">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Stock</p>
                                            <p className="font-semibold text-gray-900">{product.stock} units</p>
                                        </div>
                                    </div>

                                    {/* Price History Info */}
                                    {product.priceHistory && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-gray-700">Current Market Price</span>
                                                <div className="flex items-center space-x-1">
                                                    {getTrendIcon(product.priceHistory.marketTrend)}
                                                    <span className={`text-sm font-semibold capitalize ${getTrendColor(product.priceHistory.marketTrend)}`}>
                                                        {product.priceHistory.marketTrend}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Weekly Change</p>
                                                    <p className={`font-semibold ${getPriceChangeColor(product.priceHistory.changes?.weekly?.value || 0)}`}>
                                                        {product.priceHistory.changes?.weekly?.value >= 0 ? '+' : ''}{formatPrice(product.priceHistory.changes?.weekly?.value || 0)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Monthly Change</p>
                                                    <p className={`font-semibold ${getPriceChangeColor(product.priceHistory.changes?.monthly?.value || 0)}`}>
                                                        {product.priceHistory.changes?.monthly?.value >= 0 ? '+' : ''}{formatPrice(product.priceHistory.changes?.monthly?.value || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/price-history/${product._id}`)}
                                            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <FaChartLine />
                                            <span>Price Graph</span>
                                        </button>
                                        <Link
                                            to={`/product/details/${product.slug}`}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <FaEye />
                                            <span>View Details</span>
                                        </Link>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => add_card(product._id)}
                                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <FaShoppingCart />
                                            <span>Add to Cart</span>
                                        </button>
                                        <button
                                            onClick={() => add_wishlist(product._id)}
                                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <FaRegHeart />
                                            <span>Wishlist</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // List View
                        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                            <div className="flex space-x-4">
                                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={product.images?.[0] || '/images/demo.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.discount > 0 && (
                                        <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                            -{product.discount}%
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/price-history/${product._id}`)}
                                                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                                title="View Price Graph"
                                            >
                                                <FaChartLine />
                                            </button>
                                            <Link
                                                to={`/product/details/${product.slug}`}
                                                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {product.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaRupeeSign className="text-primary" />
                                            <span className="text-xl font-bold text-gray-900">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                                        </div>
                                    </div>

                                    {/* Price History Info for List View */}
                                    {product.priceHistory && (
                                        <div className="bg-gray-50 rounded-lg p-2 mb-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-semibold text-gray-700">Market Price: {formatPrice(product.priceHistory.currentPrice)}</span>
                                                <div className="flex items-center space-x-1">
                                                    {getTrendIcon(product.priceHistory.marketTrend)}
                                                    <span className={`font-semibold capitalize ${getTrendColor(product.priceHistory.marketTrend)}`}>
                                                        {product.priceHistory.marketTrend}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => add_card(product._id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                                        >
                                            <FaShoppingCart />
                                            <span>Add to Cart</span>
                                        </button>
                                        <button
                                            onClick={() => add_wishlist(product._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                                        >
                                            <FaRegHeart />
                                            <span>Wishlist</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ShopProductsWithGraph;
