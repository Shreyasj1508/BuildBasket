import React, { useEffect, useState } from 'react';
import { FaEye, FaRegHeart } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';
import { useAuthState, useCardState } from '../../hooks/useSafeSelector';
import ProductCardWithGraph from '../ProductCardWithGraph';
import api from '../../api/api';

const FeatureProductsWithGraph = ({ products = [] }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useAuthState()
    const { errorMessage, successMessage } = useCardState()
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
            navigate('/login')
        }
    }

    const add_wishlist = (id) => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: id
            }))
        } else {
            navigate('/login')
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

    if (loading) {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading featured products with price data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (productsWithPrices.length === 0) {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                </div>
                <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">⭐</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Products</h3>
                    <p className="text-gray-600">No featured products available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                <div className="flex items-center space-x-2 text-primary">
                    <span className="text-sm font-semibold">⭐ Live Price Tracking</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {productsWithPrices.map((product, index) => (
                    <ProductCardWithGraph 
                        key={product._id || index} 
                        product={product}
                        add_card={add_card}
                        add_wishlist={add_wishlist}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeatureProductsWithGraph;
