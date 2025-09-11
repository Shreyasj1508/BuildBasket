import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaChartLine, FaArrowRight } from "react-icons/fa";
import ProductCardWithGraph from '../ProductCardWithGraph';
import api from '../../api/api';

const ProductsWithGraph = ({ title, products = [] }) => {
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

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 4
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        },
    };

    const ButtonGroup = ({ next, previous }) => {
        return (
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={previous}
                    className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                    <IoIosArrowBack />
                </button>
                <button
                    onClick={next}
                    className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                    <IoIosArrowForward />
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading products with price data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (productsWithPrices.length === 0) {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                </div>
                <div className="text-center py-12">
                    <div className="text-gray-500 text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-600">No products available in this category.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <div className="flex items-center space-x-2 text-primary">
                    <FaChartLine className="text-lg" />
                    <span className="text-sm font-semibold">Live Price Tracking</span>
                </div>
            </div>

            <Carousel
                responsive={responsive}
                infinite={true}
                autoPlay={false}
                autoPlaySpeed={3000}
                customButtonGroup={<ButtonGroup />}
                arrows={false}
                showDots={false}
                className="products-carousel"
            >
                {productsWithPrices.map((product, index) => (
                    <div key={product._id || index} className="px-2">
                        <ProductCardWithGraph product={product} />
                    </div>
                ))}
            </Carousel>

            {/* View All Products Link */}
            <div className="text-center mt-6">
                <Link
                    to="/shops"
                    className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <span>View All Products</span>
                    <FaArrowRight />
                </Link>
            </div>
        </div>
    );
};

export default ProductsWithGraph;
