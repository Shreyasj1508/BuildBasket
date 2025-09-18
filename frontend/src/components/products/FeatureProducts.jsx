import React, { useEffect, useState } from 'react';
import { FaEye, FaRegHeart, FaChartLine } from "react-icons/fa";
import { RiShoppingCartLine } from "react-icons/ri";
import Rating from '../Rating';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card,add_to_wishlist,messageClear, get_card_products } from '../../store/reducers/cardReducer';
import toast from 'react-hot-toast';
import { useAuthState, useCardState } from '../../hooks/useSafeSelector';
import { useCommission } from '../../context/CommissionContext';

const FeatureProducts = ({products = []}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {userInfo} = useAuthState()
    const {errorMessage, successMessage} = useCardState()
    const {card_products = [], card_product_count = 0, outofstock_products = []} = useSelector(state => state.card)
    const { calculateCommission } = useCommission();

    const add_card = (id) => {
        if (userInfo) {
           console.log('Adding product to cart:', id)
           // Clear any previous error messages
           dispatch(messageClear())
           dispatch(add_to_card({
            userId: userInfo.id,
            quantity : 1,
            productId : id
           })).then(() => {
               console.log('Product added, refreshing cart')
               dispatch(get_card_products(userInfo.id))
           }).catch((error) => {
               console.error('Error adding to cart:', error)
           })
        } else {
            navigate('/login')
        }
    }

    const getProductQuantity = (productId) => {
        console.log('Looking for product:', productId)
        console.log('Cart products:', card_products)
        console.log('Out of stock products:', outofstock_products)
        
        // Handle the complex structure from backend
        let totalQuantity = 0
        
        // Check in regular cart products
        card_products.forEach(sellerGroup => {
            if (sellerGroup.products) {
                sellerGroup.products.forEach(product => {
                    if (product.productInfo && product.productInfo._id === productId) {
                        totalQuantity += product.quantity
                    }
                })
            }
        })
        
        // Check in out of stock products
        outofstock_products.forEach(product => {
            if (product.productId === productId) {
                totalQuantity += product.quantity
            }
        })
        
        console.log('Total quantity for product', productId, ':', totalQuantity)
        return totalQuantity
    }

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())  
        } 
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())  
        } 
        
    },[successMessage,errorMessage])

    useEffect(() => {
        if (userInfo && userInfo.id) {
            dispatch(get_card_products(userInfo.id))
        }
    }, [userInfo, dispatch])


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
        }))
    }


    return ( 
        <div className='w-[85%] flex flex-wrap mx-auto'>
            <div className='w-full'>
            <div className='text-center flex justify-center items-center flex-col text-4xl text-slate-600 font-bold relative pb-[45px]'>
                <h2 className="text-gradient">Featured Products</h2>
                <div className='w-[100px] h-[2px] bg-primary mt-4'></div>
            </div>
            </div>

        <div className='w-full grid grid-cols-4 md-lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6'>
    {
        products.map((p,i) => <div key={i} className='border group transition-all duration-500 hover:shadow-md hover:-mt-3'>
            <div className='relative overflow-hidden'>
            
        {
            p.discount ? <div className='flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2'>{p.discount}% </div> : ''
        }

    <img className='sm:w-full w-full h-full max-w-[350px]  mx-auto object-cover rounded-lg' src={p.images[0]} alt="" />  

        <ul className='flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3'>
            <li onClick={() => add_wishlist(p)} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-primary hover:text-white hover:rotate-[720deg] transition-all shadow-md'>
            <FaRegHeart />
            </li>
            <Link to={`/product/details/${p.slug}`} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-primary hover:text-white hover:rotate-[720deg] transition-all shadow-md'>
            <FaEye />
            </Link> 
            <li onClick={() => add_card(p._id)} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-orange-500 hover:text-white hover:rotate-[720deg] transition-all shadow-md relative'>
            <RiShoppingCartLine />
            {getProductQuantity(p._id) > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white">
                    {getProductQuantity(p._id)}
                </span>
            )}
            </li>
            <li onClick={() => navigate(`/price-history/${p._id}`)} className='w-[38px] h-[38px] cursor-pointer bg-white flex justify-center items-center rounded-full hover:bg-primary hover:text-white hover:rotate-[720deg] transition-all shadow-md'>
            <FaChartLine />
            </li>
        </ul>    
            </div>

        <div className='py-3 text-slate-600 px-2'>
            <h2 className='font-bold'>{p.name} </h2>
                                    <div className='flex justify-start items-center gap-3'>
                                            <span className='text-md font-semibold'>₹{Math.round(calculateCommission(p.price).finalPrice)}</span>
                                            <div className='flex'>
                                                    <Rating ratings={p.rating} />
                                            </div>
                                    </div>
        </div>    




        </div>
        )
    }

        </div>
            
        </div>
    );
};

export default FeatureProducts;