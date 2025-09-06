import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF} from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { useAuthState, useCardState } from '../hooks/useSafeSelector';
import logoImage from '../assets/cropped_circle_image.png';

const Footer = () => {

    const navigate = useNavigate() 
    const {userInfo} = useAuthState() 
    const {card_product_count,wishlist_count} = useCardState() 

    return (
        <footer className='bg-dark text-white'>
                        <div className='container-custom'>
                <div className='section-padding'>
                    <div className='flex flex-wrap items-start justify-between gap-8'>
                        {/* Company Info */}
                        <div className='flex-1 min-w-[300px]'>
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden'>
                                        <img 
                                            src={logoImage} 
                                            alt="SG Logo" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className='text-white font-bold text-2xl tracking-wide'>
                                        BUILD BASKET
                                    </span>
                                </div>
                                <p className='text-gray-300 text-sm leading-relaxed mb-4'>
                                    Your trusted partner for all construction and building materials. 
                                    Quality products, competitive prices, and reliable service.
                                </p>
                                <ul className='flex flex-col gap-3 text-gray-300 text-sm'>
                                    <li className='flex items-center gap-2'>
                                        <span className='text-primary'>📍</span>
                                        Construction Hub, Building Materials District
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <span className='text-primary'>📞</span>
                                        +(123) 3243 343
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <span className='text-primary'>✉️</span>
                                        support@buildbasket.com
                                    </li>
                                </ul> 
                            </div> 
                        </div>

                        {/* Quick Links */}
                        <div className='flex-1 min-w-[200px]'>
                            <h3 className='font-bold text-lg mb-6 text-primary'>Quick Links</h3>
                            <ul className='flex flex-col gap-3 text-gray-300 text-sm'>
                                <li>
                                    <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shops" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Our Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/track-order" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Track Order
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/prices" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className='flex-1 min-w-[200px]'>
                            <h3 className='font-bold text-lg mb-6 text-primary'>Support</h3>
                            <ul className='flex flex-col gap-3 text-gray-300 text-sm'>
                                <li>
                                    <Link to="/services" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Our Services
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shipping" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Shipping Info
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className='text-primary'>→</span>
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter & Social */}
                        <div className='flex-1 min-w-[250px]'>
                            <div className='flex flex-col gap-6'>
                                <div>
                                    <h3 className='font-bold text-lg mb-4 text-primary'>Newsletter</h3>
                                    <p className="text-gray-300 text-sm mb-4">Get email updates about our latest products and special offers</p>
                                    <div className='relative'>
                                        <input 
                                            className='w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all' 
                                            type="email" 
                                            placeholder='Enter your email' 
                                        />
                                        <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors'>
                                            Subscribe
                                        </button>  
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className='font-bold text-lg mb-4 text-primary'>Follow Us</h3>
                                    <div className='flex gap-3'>
                                        <a 
                                            className='w-10 h-10 hover:bg-primary hover:text-white flex justify-center items-center bg-white/10 rounded-lg transition-all hover:scale-110' 
                                            href="#"
                                        >
                                            <FaFacebookF className="text-sm" />
                                        </a>
                                        <a 
                                            className='w-10 h-10 hover:bg-primary hover:text-white flex justify-center items-center bg-white/10 rounded-lg transition-all hover:scale-110' 
                                            href="#"
                                        >
                                            <FaTwitter className="text-sm" />
                                        </a>
                                        <a 
                                            className='w-10 h-10 hover:bg-primary hover:text-white flex justify-center items-center bg-white/10 rounded-lg transition-all hover:scale-110' 
                                            href="#"
                                        >
                                            <FaLinkedin className="text-sm" />
                                        </a>
                                        <a 
                                            className='w-10 h-10 hover:bg-primary hover:text-white flex justify-center items-center bg-white/10 rounded-lg transition-all hover:scale-110' 
                                            href="#"
                                        >
                                            <FaGithub className="text-sm" />
                                        </a>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className='border-t border-gray-700'>
                <div className='container-custom'>
                    <div className='py-6 text-center'>
                        <p className='text-gray-400 text-sm'>
                            Copyright © 2024 BUILD BASKET. All Rights Reserved | 
                            <span className='text-primary ml-1'>Made with ❤️ for Construction Industry</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Floating Cart */}
            <div className='hidden fixed md-lg:block w-[60px] h-[120px] bottom-4 right-4 bg-white rounded-2xl p-3 shadow-xl border border-gray-200'>
                <div className='w-full h-full flex flex-col gap-3 justify-center items-center'>
                    <div 
                        onClick={() => navigate(userInfo ? '/card' : '/login')}  
                        className='relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-xl bg-light hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110'
                    >
                        <FaCartShopping className='text-lg text-primary hover:text-white transition-colors' />
                        {
                            card_product_count !== 0 && (
                                <div className='w-[18px] h-[18px] absolute bg-accent rounded-full text-white flex justify-center items-center -top-[2px] -right-[2px] text-xs font-bold'>
                                    {card_product_count}
                                </div>
                            )
                        }
                    </div>

                    <div 
                        onClick={() => navigate(userInfo ? '/dashboard/my-wishlist' : '/login')} 
                        className='relative flex justify-center items-center cursor-pointer w-[40px] h-[40px] rounded-xl bg-light hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110'
                    >
                        <FaHeart className='text-lg text-accent hover:text-white transition-colors' />
                        {
                            wishlist_count !== 0 && (
                                <div className='w-[18px] h-[18px] absolute bg-accent rounded-full text-white flex justify-center items-center -top-[2px] -right-[2px] text-xs font-bold'>
                                    {wishlist_count}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>




           
        </footer>
    );
};

export default Footer;