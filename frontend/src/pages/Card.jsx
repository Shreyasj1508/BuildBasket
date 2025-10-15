import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaShoppingCart, 
    FaTrash, 
    FaMinus, 
    FaPlus, 
    FaHeart, 
    FaArrowLeft,
    FaRupeeSign,
    FaTruck,
    FaShieldAlt,
    FaUndo,
    FaGift,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle
} from 'react-icons/fa';
import { FadeLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    get_card_products, 
    delete_card_product, 
    messageClear, 
    quantity_inc, 
    quantity_dec,
    add_to_wishlist 
} from '../store/reducers/cardReducer';
import { useAuthState } from '../hooks/useSafeSelector';
import { useCommission } from '../context/CommissionContext';

const Card = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useAuthState();
    const { calculateCommission } = useCommission();
    
    const { 
        card_products = [], 
        successMessage, 
        price = 0, 
        buy_product_item = 0, 
        shipping_fee = 0, 
        outofstock_products = [],
        loader = false
    } = useSelector(state => state.card);
    
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);

    useEffect(() => {
        if (userInfo && userInfo.id) {
            setLoading(true);
            dispatch(get_card_products(userInfo.id)).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [userInfo, dispatch]);

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            if (userInfo?.id) {
                dispatch(get_card_products(userInfo.id));
            }
        }
    }, [successMessage, dispatch, userInfo]);

    const handleQuantityChange = (type, cardId, currentQuantity, stock) => {
        if (type === 'inc' && currentQuantity < stock) {
            dispatch(quantity_inc(cardId));
        } else if (type === 'dec' && currentQuantity > 1) {
            dispatch(quantity_dec(cardId));
        }
    };

    const handleRemoveItem = (cardId, productName) => {
        if (window.confirm(`Are you sure you want to remove "${productName}" from your cart?`)) {
            dispatch(delete_card_product(cardId));
            toast.success('Item removed from cart');
        }
    };

    const handleMoveToWishlist = (productId, productName) => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: productId
            }));
            toast.success(`${productName} moved to wishlist`);
        }
    };

    const applyCoupon = () => {
        // Mock coupon logic - you can implement real coupon validation here
        const validCoupons = {
            'SAVE10': { discount: 10, type: 'percentage' },
            'FLAT50': { discount: 50, type: 'fixed' },
            'WELCOME': { discount: 15, type: 'percentage' }
        };

        if (validCoupons[couponCode.toUpperCase()]) {
            setAppliedCoupon(validCoupons[couponCode.toUpperCase()]);
            if (validCoupons[couponCode.toUpperCase()].type === 'percentage') {
                setCouponDiscount((price * validCoupons[couponCode.toUpperCase()].discount) / 100);
            } else {
                setCouponDiscount(validCoupons[couponCode.toUpperCase()].discount);
            }
            toast.success('Coupon applied successfully!');
        } else {
            toast.error('Invalid coupon code');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const proceedToCheckout = () => {
        if (buy_product_item === 0) {
            toast.error('Your cart is empty');
            return;
        }
        
        navigate('/shipping', {
            state: {
                products: card_products,
                price: price,
                shipping_fee: shipping_fee,
                items: buy_product_item,
                couponDiscount: couponDiscount
            }
        });
    };

    const calculateItemPrice = (product) => {
        const originalPrice = product.productInfo.price;
        const discountPrice = originalPrice - Math.floor((originalPrice * product.productInfo.discount) / 100);
        const finalPrice = calculateCommission(discountPrice, product.productInfo).finalPrice;
        return Math.round(finalPrice);
    };

    const calculateOriginalPrice = (product) => {
        const originalPrice = product.productInfo.price;
        const finalPrice = calculateCommission(originalPrice, product.productInfo).finalPrice;
        return Math.round(finalPrice);
    };

    const totalItems = card_products.reduce((total, sellerGroup) => {
        return total + (sellerGroup.products?.length || 0);
    }, 0) + outofstock_products.length;

    const subtotal = price;
    const totalAfterCoupon = subtotal - couponDiscount;
    const finalTotal = totalAfterCoupon + shipping_fee;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <FadeLoader color="#059473" size={50} />
                        <p className="text-gray-600 mt-4">Loading your cart...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Shopping Cart</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {totalItems > 0 ? (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Shopping Cart ({totalItems} items)
                                        </h1>
                                        <Link 
                                            to="/shops" 
                                            className="flex items-center text-primary hover:text-primary-dark font-medium"
                                        >
                                            <FaArrowLeft className="mr-2" />
                                            Continue Shopping
                                        </Link>
                                    </div>
                            </div>

                                <div className="divide-y divide-gray-200">
                                    {/* In Stock Products */}
                                    {card_products.map((sellerGroup, sellerIndex) => (
                                        <div key={sellerIndex} className="p-6">
                                            <div className="flex items-center mb-4">
                                                <FaCheckCircle className="text-green-500 mr-2" />
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {sellerGroup.shopName}
                                                </h3>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({sellerGroup.products.length} items)
                                                </span>
                   </div>

                                            {sellerGroup.products.map((product, productIndex) => (
                                                <div key={product._id} className="flex items-center space-x-4 py-4">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={product.productInfo.images[0]}
                                                            alt={product.productInfo.name}
                                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                                        />
                       </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-lg font-medium text-gray-900 hover:text-primary cursor-pointer">
                                                            {product.productInfo.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Brand: {product.productInfo.brand}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Category: {product.productInfo.category}
                                                        </p>
                                                        <div className="flex items-center mt-2">
                                                            <span className="text-sm text-gray-500">
                                                                Stock: {product.productInfo.stock} available
                                                            </span>
                           </div>
                       </div>

                                                    {/* Price and Quantity */}
                                                    <div className="flex items-center space-x-6">
                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                ₹{calculateItemPrice(product)}
                                                            </p>
                                                            {product.productInfo.discount > 0 && (
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="text-sm text-gray-500 line-through">
                                                                        ₹{calculateOriginalPrice(product)}
                                                                    </p>
                                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                                        -{product.productInfo.discount}%
                                                                    </span>
       </div>
                                                            )}
   </div>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                                            <button
                                                                onClick={() => handleQuantityChange('dec', product._id, product.quantity, product.productInfo.stock)}
                                                                className="p-2 hover:bg-gray-100 rounded-l-lg"
                                                                disabled={product.quantity <= 1}
                                                            >
                                                                <FaMinus className="w-3 h-3" />
                                                            </button>
                                                            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                                                                {product.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityChange('inc', product._id, product.quantity, product.productInfo.stock)}
                                                                className="p-2 hover:bg-gray-100 rounded-r-lg"
                                                                disabled={product.quantity >= product.productInfo.stock}
                                                            >
                                                                <FaPlus className="w-3 h-3" />
                                                            </button>
                            </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleMoveToWishlist(product.productInfo._id, product.productInfo.name)}
                                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                                title="Move to Wishlist"
                                                            >
                                                                <FaHeart className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveItem(product._id, product.productInfo.name)}
                                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                                title="Remove from Cart"
                                                            >
                                                                <FaTrash className="w-4 h-4" />
                                                            </button>
                       </div>
                           </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {/* Out of Stock Products */}
                                    {outofstock_products.length > 0 && (
                                        <div className="p-6 bg-red-50">
                                            <div className="flex items-center mb-4">
                                                <FaExclamationTriangle className="text-red-500 mr-2" />
                                                <h3 className="text-lg font-semibold text-red-900">
                                                    Out of Stock Items ({outofstock_products.length})
                                                </h3>
                       </div>

                                            {outofstock_products.map((product, index) => (
                                                <div key={product._id} className="flex items-center space-x-4 py-4">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={product.products[0].images[0]}
                                                            alt={product.products[0].name}
                                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 opacity-50"
                                                        />
       </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-lg font-medium text-gray-900">
                                                            {product.products[0].name}
                                                        </h4>
                                                        <p className="text-sm text-red-600 font-medium">
                                                            Currently out of stock
                                                        </p>
           </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleMoveToWishlist(product.products[0]._id, product.products[0].name)}
                                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            Move to Wishlist
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveItem(product._id, product.products[0].name)}
                                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
       </div>
   </div>
                                            ))}
                  </div>           
                                    )}
                        </div> 
                    </div>
                </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white rounded-lg shadow-sm sticky top-4">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                                <div className="px-6 py-4 space-y-4">
                                    {/* Subtotal */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({buy_product_item} items)</span>
                                        <span className="font-medium">₹{subtotal}</span>
                </div>

                                    {/* Shipping */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">
                                            {shipping_fee === 0 ? 'Free' : `₹${shipping_fee}`}
                                        </span>
                </div>

                                    {/* Coupon */}
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Coupon Discount ({couponCode})</span>
                                            <span className="font-medium">-₹{couponDiscount}</span>
                                        </div>
                                    )}

                                    {/* Total */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                                            <span className="text-primary">₹{finalTotal}</span>
                                        </div>
                </div>

                                    {/* Coupon Code */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Coupon Code</h3>
                                        {!appliedCoupon ? (
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="Enter coupon code"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                />
                                                <button
                                                    onClick={applyCoupon}
                                                    className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary-dark transition-colors"
                                                >
                                                    Apply
                </button>
            </div>
                                        ) : (
                                            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-green-800">
                                                        {couponCode} Applied
                                                    </p>
                                                    <p className="text-xs text-green-600">
                                                        You saved ₹{couponDiscount}
                                                    </p>
    </div>
                                                <button
                                                    onClick={removeCoupon}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <FaTimesCircle className="w-4 h-4" />
                                                </button>
</div>
                                        )}
            </div> 
            
                                    {/* Checkout Button */}
                                    <button
                                        onClick={proceedToCheckout}
                                        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center"
                                    >
                                        <FaShoppingCart className="mr-2" />
                                        Proceed to Checkout ({buy_product_item} items)
                                    </button>

                                    {/* Security Features */}
                                    <div className="border-t border-gray-200 pt-4 space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaShieldAlt className="mr-2 text-green-500" />
                                            Secure checkout with SSL encryption
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaTruck className="mr-2 text-blue-500" />
                                            Free shipping on orders over ₹500
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaUndo className="mr-2 text-purple-500" />
                                            30-day return policy
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaGift className="mr-2 text-pink-500" />
                                            Gift wrapping available
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="text-center py-16">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FaShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                        </p>
                        <div className="space-x-4">
                            <Link
                                to="/shops"
                                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                            >
                                <FaShoppingCart className="mr-2" />
                                Start Shopping
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Card;