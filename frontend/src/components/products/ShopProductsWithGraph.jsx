import React, { useEffect, useState } from 'react';
import { FaEye, FaRegHeart, FaChartLine, FaShoppingCart, FaRupeeSign } from "react-icons/fa";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear, get_card_products } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';
import { useAuthState, useCardState } from '../../hooks/useSafeSelector';
import { useCommission } from '../../context/CommissionContext';
import CartNotification from '../CartNotification';

const ShopProductsWithGraph = ({ products = [], grid = true }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useAuthState();
    const { errorMessage, successMessage } = useCardState();
    const { card_products = [], card_product_count = 0, outofstock_products = [] } = useSelector(state => state.card);
    const { calculateCommission } = useCommission();
    
    const [showNotification, setShowNotification] = useState(false);
    const [addedProduct, setAddedProduct] = useState(null);

    const add_card = (product) => {
        if (userInfo) {
            console.log('Adding product to cart:', product._id);
            dispatch(messageClear());
            dispatch(add_to_card({
                userId: userInfo.id,
                quantity: 1,
                productId: product._id
            })).then(() => {
                console.log('Product added, refreshing cart');
                dispatch(get_card_products(userInfo.id));
                setAddedProduct(product);
                setShowNotification(true);
            }).catch((error) => {
                console.error('Error adding to cart:', error);
            });
        } else {
            navigate('/login');
        }
    };

    const getProductQuantity = (productId) => {
        let totalQuantity = 0;
        
        card_products.forEach(sellerGroup => {
            if (sellerGroup.products) {
                sellerGroup.products.forEach(product => {
                    if (product.productInfo && product.productInfo._id === productId) {
                        totalQuantity += product.quantity;
                    }
                });
            }
        });
        
        outofstock_products.forEach(product => {
            if (product.productId === productId) {
                totalQuantity += product.quantity;
            }
        });
        
        return totalQuantity;
    };

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());  
        } 
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());  
        } 
    }, [successMessage, errorMessage]);

    useEffect(() => {
        if (userInfo && userInfo.id) {
            dispatch(get_card_products(userInfo.id));
        }
    }, [userInfo, dispatch]);

    const add_wishlist = (pro) => {
        dispatch(add_to_wishlist({
            userId: userInfo.id,
            productId: pro._id,
            name: pro.name,
            price: pro.price,
            image: pro.images[0],
            discount: pro.discount,
            rating: pro.rating,
            slug: pro.slug
        }));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <span className="text-green-500">↗</span>;
            case 'down': return <span className="text-red-500">↘</span>;
            case 'stable': return <span className="text-gray-500">→</span>;
            default: return <span className="text-gray-500">→</span>;
        }
    };

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up': return 'text-green-600';
            case 'down': return 'text-red-600';
            case 'stable': return 'text-gray-600';
            default: return 'text-gray-600';
        }
    };

    const getPriceChangeColor = (value) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    // Add mock price history data for demonstration
    const productsWithPrices = products.map(product => ({
        ...product,
        priceHistory: {
            marketTrend: 'up',
            changes: {
                weekly: { value: Math.random() * 100 - 50 },
                monthly: { value: Math.random() * 200 - 100 }
            }
        }
    }));

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading products...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
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
                                
                                {/* Action Buttons */}
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        onClick={() => add_wishlist(product)}
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-md"
                                    >
                                        <FaRegHeart className="text-sm" />
                                    </button>
                                    <Link
                                        to={`/product/details/${product.slug}`}
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-md"
                                    >
                                        <FaEye className="text-sm" />
                                    </Link>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <div className="mb-2">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Rating ratings={product.rating} />
                                        <span className="text-sm text-gray-500">({product.rating})</span>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaRupeeSign className="text-primary" />
                                            <span className="text-2xl font-bold text-gray-900">
                                                {formatPrice(Math.round(calculateCommission(product.price, product).finalPrice))}
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
                                            onClick={() => add_card(product)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 font-semibold flex-1"
                                        >
                                            <FaShoppingCart />
                                            <span>ADD TO CART</span>
                                        </button>
                                        <button
                                            onClick={() => add_wishlist(product)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                                        >
                                            <FaRegHeart />
                                            <span>Wishlist</span>
                                        </button>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/product/details/${product.slug}`}
                                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 flex-1 justify-center"
                                        >
                                            <FaEye />
                                            <span>View Details</span>
                                        </Link>
                                        <button
                                            onClick={() => navigate(`/price-history/${product._id}`)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                        >
                                            <FaChartLine />
                                            <span>Price History</span>
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
                                        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                                        <div className="flex space-x-2">
                                            <button onClick={() => add_wishlist(product)} className="text-red-500 hover:text-red-700">
                                                <FaRegHeart />
                                            </button>
                                            <Link to={`/product/details/${product.slug}`} className="text-primary hover:text-primary-dark">
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Rating ratings={product.rating} />
                                        <span className="text-sm text-gray-500">({product.rating})</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FaRupeeSign className="text-primary" />
                                            <span className="text-xl font-bold text-gray-900">
                                                {formatPrice(Math.round(calculateCommission(product.price, product).finalPrice))}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                                        </div>
                                    </div>
                                    
                                    {product.priceHistory && (
                                        <div className="bg-gray-50 rounded-lg p-2 mb-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-semibold text-gray-700">Market Trend</span>
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
                                            onClick={() => add_card(product)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 font-semibold"
                                        >
                                            <FaShoppingCart />
                                            <span>ADD TO CART</span>
                                        </button>
                                        <button
                                            onClick={() => add_wishlist(product)}
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