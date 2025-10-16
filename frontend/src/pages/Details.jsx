import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io"; 
import Carousel from 'react-multi-carousel'; 
import 'react-multi-carousel/lib/styles.css'
import Rating from '../components/Rating';
import { FaHeart } from "react-icons/fa6";
import { FaFacebookF} from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Reviews from '../components/Reviews';
import {Pagination } from 'swiper/modules';
import 'swiper/css'; 
import 'swiper/css/pagination';
import {Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { product_details } from '../store/reducers/homeReducer';
import toast from 'react-hot-toast';
import { add_to_card,messageClear,add_to_wishlist, get_card_products, quantity_inc, quantity_dec } from '../store/reducers/cardReducer';
import { useHomeState, useAuthState, useCardState } from '../hooks/useSafeSelector';
import { useCommission } from '../context/CommissionContext'
import { getProductImage, getAllProductImages, handleImageError, getImageUrl } from '../utils/imageUtils';
import CartNotification from '../components/CartNotification';
 

const Details = () => {

    const navigate = useNavigate()
    const {slug} = useParams()
    const dispatch = useDispatch()
    const {product,relatedProducts,moreProducts} = useHomeState()
    const {userInfo } = useAuthState()
    const {errorMessage,successMessage } = useCardState()
    const {card_products = [], outofstock_products = []} = useSelector(state => state.card)
    const { calculateCommission } = useCommission()
    
    const [showNotification, setShowNotification] = useState(false);

  // Get current price from price history or fallback to product price
  const getCurrentPrice = () => {
    if (product?.priceHistory?.currentPrice) {
      return product.priceHistory.currentPrice;
    }
    return product?.price || 0;
  };

    useEffect(() => {
        dispatch(product_details(slug))
    },[slug])

    useEffect(() => {
        if (userInfo && userInfo.id) {
            dispatch(get_card_products(userInfo.id))
        }
    }, [userInfo, dispatch])

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

    const [image, setImage] = useState('')
    const [state, setState] = useState('reviews')

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 1
        },
    }

    const [quantity, setQuantity] = useState(1)

    const inc = () => {
        if (userInfo) {
            const { quantity: cartQuantity, cartItemId } = getProductQuantity(product._id)
            
            if (cartQuantity >= product.stock) {
                toast.error('Out of Stock')
            } else if (cartItemId) {
                // If product is already in cart, increment quantity
                dispatch(quantity_inc(cartItemId)).then(() => {
                    dispatch(get_card_products(userInfo.id))
                })
            } else {
                // If product is not in cart, add it
                dispatch(add_to_card({
                    userId: userInfo.id,
                    quantity: 1,
                    productId: product._id
                })).then(() => {
                    dispatch(get_card_products(userInfo.id))
                })
            }
        } else {
            navigate('/login')
        }
    }

    const dec = () => {
        if (userInfo) {
            const { quantity: cartQuantity, cartItemId } = getProductQuantity(product._id)
            
            if (cartQuantity > 1 && cartItemId) {
                // Decrement quantity
                dispatch(quantity_dec(cartItemId)).then(() => {
                    dispatch(get_card_products(userInfo.id))
                })
            } else if (cartQuantity === 1 && cartItemId) {
                // Remove from cart if quantity becomes 0
                dispatch(quantity_dec(cartItemId)).then(() => {
                    dispatch(get_card_products(userInfo.id))
                })
            }
        }
    }

    const add_card = () => {
        if (userInfo) {
           dispatch(messageClear())
           dispatch(add_to_card({
            userId: userInfo.id,
            quantity,
            productId : product._id
           })).then(() => {
               dispatch(get_card_products(userInfo.id))
               // Show notification
               setShowNotification(true);
           })
        } else {
            navigate('/login')
        }
    }

    const getProductQuantity = (productId) => {
        let totalQuantity = 0
        let cartItemId = null
        
        // Check in regular cart products
        card_products.forEach(sellerGroup => {
            if (sellerGroup.products) {
                sellerGroup.products.forEach(cartProduct => {
                    if (cartProduct.productInfo && cartProduct.productInfo._id === productId) {
                        totalQuantity += cartProduct.quantity
                        cartItemId = cartProduct._id
                    }
                })
            }
        })
        
        // Check in out of stock products
        outofstock_products.forEach(cartProduct => {
            if (cartProduct.productId === productId) {
                totalQuantity += cartProduct.quantity
                cartItemId = cartProduct._id
            }
        })
        
        return { quantity: totalQuantity, cartItemId }
    }

    const add_wishlist = () => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                discount: product.discount,
                rating: product.rating,
                slug: product.slug
            }))
        } else {
            navigate('/login')
        }
       
    }

   const buynow = () => {
        let price = 0;
        if (product.discount !== 0) {
            price = product.price - Math.floor((product.price * product.discount) / 100)
        } else {
            price = product.price
        }

        const obj = [
            {
                sellerId: product.sellerId,
                shopName: product.shopName,
                price :  quantity * (price - Math.floor((price * 5) / 100)),
                products : [
                    {
                        quantity,
                        productInfo: product
                    }
                ]
            }
        ]
        
        navigate('/shipping',{
            state: {
                products : obj,
                price: price * quantity,
                shipping_fee : 50,
                items: 1
            }
        }) 
   }


    return (
        <div>
            <Header/>

    <section>
        <div className='bg-gradient-to-r from-gray-50 to-gray-100 py-6 mb-6'>
            <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                <div className='flex justify-start items-center text-md text-gray-600 w-full'>
                    <Link to='/' className='hover:text-primary transition-colors duration-300 font-medium'>Home</Link>
                    <span className='pt-1 mx-2 text-primary'><IoIosArrowForward /></span>
                    <Link to='/' className='hover:text-primary transition-colors duration-300 font-medium'>{ product.category }</Link>
                    <span className='pt-1 mx-2 text-primary'><IoIosArrowForward /></span>
                    <span className='text-dark font-semibold'>{ product.name } </span>
                </div>

            </div>
        </div>
    </section>

        <section>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16'>
            <div className='grid grid-cols-2 md-lg:grid-cols-1 gap-8'>
                <div>
                <div className='p-4 border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white group'>
                    <img className='h-[350px] w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500' src={image ? getImageUrl(image) : getImageUrl(getProductImage(product.images))} alt="" />
                </div>
            <div className='py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4'>
                {
                    product.images && <Carousel
                    autoPlay={false}
                    infinite={true} 
                    responsive={responsive}
                    transitionDuration={500}
                >
                    { 
                       getAllProductImages(product.images).map((img, i) => {
                        return (
                            <div key={i} className="px-2">
                                <div 
                                    onClick={() => setImage(img)} 
                                    className="cursor-pointer border-2 border-transparent hover:border-primary rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-105"
                                >
                                    <img className='h-[120px] w-full object-cover' src={getImageUrl(img)} alt="" onError={(e) => handleImageError(e)} /> 
                                </div>
                            </div>
                        )
                       })
                    } 

                </Carousel>
                }
           </div>    
           </div>

        <div className='flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100'>
                <div className='text-2xl text-gray-800 font-bold leading-tight'>
                    <h3 className='text-gradient'>{product.name}</h3>
                </div>
                
                <div className='flex justify-start items-center gap-4 flex-wrap'>
                    <div className='flex text-lg'>
                        <Rating ratings={4.5} />
                    </div>
                    <span className='text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full text-sm'>(24 reviews)</span>
                    <span className='text-gray-600 font-medium text-sm'>Brand: <span className='text-primary font-semibold'>{product.brand}</span></span>
                </div>

         <div className='text-xl font-bold flex items-center gap-4'>
            {
                product.discount !== 0 ? <>
                <div className='flex flex-col'>
                    <span className='text-gray-500 text-base line-through'>₹{Math.round(calculateCommission(getCurrentPrice(), product).finalPrice)}</span>
                    <span className='text-primary text-2xl font-extrabold'>₹{Math.round(calculateCommission(getCurrentPrice() - Math.floor((getCurrentPrice() * product.discount) / 100), product).finalPrice)}</span>
                </div>
                </> : <h2 className='text-2xl text-primary font-extrabold'>₹{Math.round(calculateCommission(getCurrentPrice(), product).finalPrice)}</h2>
            }
          </div> 

          <div className='text-gray-600 leading-relaxed'>
            <p className='text-base mb-3 text-dark'>{product.description}</p>
            <div className='bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200'>
                <p className='text-gray-800 font-semibold text-sm'>Shop Name: <span className='text-primary font-bold text-base'>{product.shopName}</span></p>
            </div>
           </div>

            <div className='flex gap-4 pb-8 border-b border-gray-200'>
                {
                    product.stock ? <>
        <div className='flex bg-gradient-to-r from-gray-100 to-gray-200 h-[50px] justify-center items-center text-lg rounded-xl border-2 border-gray-200 shadow-md'>
            <div onClick={dec} className='px-4 cursor-pointer hover:bg-primary hover:text-white rounded-l-xl transition-all duration-300 font-bold text-gray-700'>-</div>
            <div className='px-4 font-bold text-gray-800 bg-white min-w-[50px] text-center border-x border-gray-200'>
                {getProductQuantity(product._id).quantity > 0 ? getProductQuantity(product._id).quantity : quantity}
            </div>
            <div onClick={inc} className='px-4 cursor-pointer hover:bg-primary hover:text-white rounded-r-xl transition-all duration-300 font-bold text-gray-700'>+</div>
        </div>
                    <div className="relative">
                        <button onClick={add_card} className='bg-gradient-to-r from-primary to-primary-dark h-[50px] px-6 flex items-center gap-2 text-white font-semibold rounded-xl hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                            </svg>
                            Add To Cart
                            {getProductQuantity(product._id).quantity > 0 && (
                                <span className="bg-white text-primary text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold border-2 border-white shadow-md">
                                    {getProductQuantity(product._id).quantity}
                                </span>
                            )}
                        </button>
                    </div>
                    
                    </> : ''
                }

                <div>
                    <div onClick={add_wishlist} className='h-[50px] w-[50px] flex justify-center items-center cursor-pointer hover:shadow-lg hover:shadow-danger/40 bg-gradient-to-r from-danger to-red-600 text-white rounded-xl transition-all duration-300 hover:scale-105'>
                    <FaHeart className='text-base' />
                    </div> 
                </div> 
            </div>  



          <div className='flex gap-4 pt-4'>
                {
                    product.stock ? <button onClick={buynow} className='bg-gradient-to-r from-success to-green-600 hover:from-green-600 hover:to-green-700 text-white h-[50px] px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105'>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Buy Now
                    </button> : ''
                }
            </div>


             </div>   
            </div> 
       </div> 
        </section>


        <section className='py-16 bg-gradient-to-br from-gray-50 to-gray-100'>
        <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
           <div className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>
                <div className='flex gap-2 mb-8'>
                    <button onClick={() => setState('reviews')} className={`py-3 px-8 hover:text-white font-semibold rounded-2xl transition-all duration-300 ${state === 'reviews' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white'}`}>
                        <span className='flex items-center gap-2'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Reviews
                        </span>
                    </button>
                    
                    <button onClick={() => setState('description')} className={`py-3 px-8 hover:text-white font-semibold rounded-2xl transition-all duration-300 ${state === 'description' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white'}`}>
                        <span className='flex items-center gap-2'>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Description
                        </span>
                    </button>
                </div>

                <div className='py-8'>
                    {
                        state === 'reviews' ? <Reviews product={product} /> : 
                        <div className='space-y-6'>
                            <h3 className='text-2xl font-bold text-dark mb-6 text-gradient'>Product Description</h3>
                            <p className='text-lg text-gray-600 leading-relaxed bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200'>
                                {product.description}
                            </p>
                        </div>
                    }
                </div> 
           </div>
        </div>
        </section>






            <Footer/> 
            
            {/* Cart Notification */}
            <CartNotification 
                show={showNotification}
                onClose={() => setShowNotification(false)}
                product={product}
            />
        </div>
    );
};

export default Details;