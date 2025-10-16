import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCommission } from '../context/CommissionContext';
import { delete_card_product, quantity_inc, quantity_dec, get_card_products } from '../store/reducers/cardReducer';
import { useAuthState } from '../hooks/useSafeSelector';

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { userInfo } = useAuthState();
  const { card_products = [], price = 0, buy_product_item = 0, shipping_fee = 0, outofstock_products = [] } = useSelector(state => state.card);
  const { calculateCommission } = useCommission();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Load fresh cart data when sidebar opens
      if (userInfo && userInfo.id) {
        dispatch(get_card_products(userInfo.id));
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, userInfo?.id, dispatch]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleQuantityChange = (type, cardId, currentQuantity, stock) => {
    if (type === 'inc' && currentQuantity < stock) {
      dispatch(quantity_inc(cardId));
    } else if (type === 'dec' && currentQuantity > 1) {
      dispatch(quantity_dec(cardId));
    }
  };

  const handleRemoveItem = (cardId) => {
    dispatch(delete_card_product(cardId));
  };

  const totalItems = card_products.reduce((total, sellerGroup) => {
    return total + (sellerGroup.products?.length || 0);
  }, 0) + outofstock_products.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-[9999] transform transition-transform duration-300 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <FaShoppingCart className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {totalItems === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FaShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Empty Cart</h3>
                <p className="text-gray-500 mb-6">Add products to get started!</p>
                <Link
                  to="/shops"
                  onClick={handleClose}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* In Stock Products */}
                {card_products.map((sellerGroup, sellerIndex) => (
                  <div key={sellerIndex} className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-2">
                      {sellerGroup.shopName}
                    </h3>
                    {sellerGroup.products?.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.productInfo?.images?.[0]}
                          alt={item.productInfo?.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.productInfo?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Brand: {item.productInfo?.brand}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-semibold text-primary">
                              ₹{Math.round(calculateCommission(item.productInfo?.price - Math.floor((item.productInfo?.price * item.productInfo?.discount) / 100), item.productInfo).finalPrice)}
                            </span>
                            {item.productInfo?.discount > 0 && (
                              <>
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{Math.round(calculateCommission(item.productInfo?.price, item.productInfo).finalPrice)}
                                </span>
                                <span className="text-xs text-red-500 font-medium">
                                  -{item.productInfo?.discount}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-1 bg-white rounded-md border border-gray-200">
                            <button
                              onClick={() => handleQuantityChange('dec', item._id, item.quantity)}
                              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              <FaMinus className="h-3 w-3" />
                            </button>
                            <span className="px-2 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange('inc', item._id, item.quantity, item.productInfo?.stock)}
                              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              <FaPlus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="p-1 text-red-400 hover:text-red-600 focus:outline-none"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Out of Stock Products */}
                {outofstock_products.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-red-600 border-b border-red-100 pb-2">
                      Out of Stock ({outofstock_products.length})
                    </h3>
                    {outofstock_products.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <img
                          src={item.products?.[0]?.images?.[0]}
                          alt={item.products?.[0]?.name}
                          className="h-16 w-16 object-cover rounded-md opacity-50"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.products?.[0]?.name}
                          </h4>
                          <p className="text-sm text-red-500">Out of Stock</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-1 text-red-400 hover:text-red-600 focus:outline-none"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {totalItems > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({buy_product_item} items)</span>
                  <span className="font-medium">₹{price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{shipping_fee}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span className="text-primary">₹{price + shipping_fee}</span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/card"
                    onClick={handleClose}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    View Cart & Checkout
                  </Link>
                  <button
                    onClick={handleClose}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
