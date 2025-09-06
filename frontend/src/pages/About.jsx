import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/api';

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await api.get('/home/about-data');
                if (response.data.success) {
                    setAboutData(response.data.aboutData);
                }
            } catch (error) {
                console.error('Error fetching about data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#eba834] mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />
            
            {/* Hero Section */}
            <div className='bg-gradient-to-r from-primary to-primary-dark py-16'>
                <div className='w-[85%] mx-auto text-center'>
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                        About {aboutData?.companyInfo?.name || 'BUILD BASKET'}
                    </h1>
                    <p className='text-xl text-white/90 max-w-3xl mx-auto'>
                        Your trusted partner in construction materials and building solutions
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className='w-[85%] mx-auto py-16'>
                {/* Company Story */}
                <div className='mb-16'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Our Story</h2>
                    <div className='grid md:grid-cols-2 gap-12 items-center'>
                        <div>
                            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
                                {aboutData?.companyInfo?.name || 'BUILD BASKET'} was founded with a simple mission: {aboutData?.companyInfo?.mission || 'to revolutionize the way construction materials are sourced, delivered, and managed'}. 
                                We understand the challenges faced by builders, contractors, and DIY enthusiasts 
                                in finding quality materials at competitive prices.
                            </p>
                            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
                                Our platform connects buyers with verified suppliers, ensuring transparency, quality, and timely delivery. 
                                With years of experience in the construction industry, we've built a network of trusted partners who share 
                                our commitment to excellence.
                            </p>
                        </div>
                        <div className='bg-white p-8 rounded-lg shadow-lg'>
                            <h3 className='text-2xl font-bold text-primary mb-4'>Why Choose Us?</h3>
                            <ul className='space-y-3'>
                                <li className='flex items-center gap-3'>
                                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                                    <span>Quality guaranteed materials</span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                                    <span>Competitive pricing</span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                                    <span>Fast and reliable delivery</span>
                                </li>
                                <li className='flex items-center gap-3'>
                                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                                    <span>Expert customer support</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className='grid md:grid-cols-2 gap-12 mb-16'>
                    <div className='bg-white p-8 rounded-lg shadow-lg'>
                        <h3 className='text-2xl font-bold text-primary mb-4'>Our Mission</h3>
                        <p className='text-gray-600 leading-relaxed'>
                            {aboutData?.companyInfo?.mission || 'To simplify the construction materials procurement process by providing a seamless, transparent, and efficient platform that connects buyers with quality suppliers, ensuring every project gets the materials it needs on time and within budget.'}
                        </p>
                    </div>
                    <div className='bg-white p-8 rounded-lg shadow-lg'>
                        <h3 className='text-2xl font-bold text-primary mb-4'>Our Vision</h3>
                        <p className='text-gray-600 leading-relaxed'>
                            {aboutData?.companyInfo?.vision || 'To become the leading digital marketplace for construction materials, transforming the industry through technology, innovation, and exceptional customer service while building lasting partnerships with suppliers and buyers.'}
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className='text-center mb-16'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-8'>Our Values</h2>
                    <div className='grid md:grid-cols-4 gap-8'>
                        <div className='bg-white p-6 rounded-lg shadow-lg'>
                            <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-white text-2xl font-bold'>Q</span>
                            </div>
                            <h4 className='text-xl font-bold text-gray-800 mb-2'>Quality</h4>
                            <p className='text-gray-600'>We never compromise on the quality of materials</p>
                        </div>
                        <div className='bg-white p-6 rounded-lg shadow-lg'>
                            <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-white text-2xl font-bold'>T</span>
                            </div>
                            <h4 className='text-xl font-bold text-gray-800 mb-2'>Trust</h4>
                            <p className='text-gray-600'>Building trust through transparency and reliability</p>
                        </div>
                        <div className='bg-white p-6 rounded-lg shadow-lg'>
                            <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-white text-2xl font-bold'>I</span>
                            </div>
                            <h4 className='text-xl font-bold text-gray-800 mb-2'>Innovation</h4>
                            <p className='text-gray-600'>Continuously improving our platform and services</p>
                        </div>
                        <div className='bg-white p-6 rounded-lg shadow-lg'>
                            <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-white text-2xl font-bold'>S</span>
                            </div>
                            <h4 className='text-xl font-bold text-gray-800 mb-2'>Service</h4>
                            <p className='text-gray-600'>Exceptional customer service is our priority</p>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-6'>Get in Touch</h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        <div>
                            <h4 className='text-xl font-bold text-primary mb-2'>Email</h4>
                            <p className='text-gray-600'>{aboutData?.contactInfo?.email || 'support@buildbasket.com'}</p>
                        </div>
                        <div>
                            <h4 className='text-xl font-bold text-primary mb-2'>Phone</h4>
                            <p className='text-gray-600'>{aboutData?.contactInfo?.phone || '+(123) 3243 343'}</p>
                        </div>
                        <div>
                            <h4 className='text-xl font-bold text-primary mb-2'>Address</h4>
                            <p className='text-gray-600'>{aboutData?.contactInfo?.address || 'Construction Hub, Building Materials District'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;
