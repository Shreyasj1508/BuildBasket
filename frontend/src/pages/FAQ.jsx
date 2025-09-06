import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaPlus, FaMinus } from 'react-icons/fa';
import api from '../api/api';

const FAQ = () => {
    const [faqData, setFaqData] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFAQData = async () => {
            try {
                const { data } = await api.get('/home/faq-data');
                setFaqData(data.faqData);
            } catch (error) {
                console.error('Error fetching FAQ data:', error);
                // Fallback FAQ data
                setFaqData([
                    {
                        question: "How do I track my order?",
                        answer: "You can track your order by entering your order ID in the Track Order page. You'll receive real-time updates on your shipment status."
                    },
                    {
                        question: "What are your delivery charges?",
                        answer: "Delivery charges start from $20. Free shipping is available for orders above $500."
                    },
                    {
                        question: "Do you offer bulk discounts?",
                        answer: "Yes, we offer special pricing for bulk orders. Contact our sales team for custom quotes."
                    },
                    {
                        question: "What is your return policy?",
                        answer: "We offer a 30-day return policy for unused items in original packaging. Contact customer support for returns."
                    },
                    {
                        question: "How can I contact customer support?",
                        answer: "You can reach us via email at support@buildbasket.com, phone at +(123) 3243 343, or through our live chat feature."
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQData();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className='w-full'>
            <Header />
            
            {/* Hero Section */}
            <div className='bg-gradient-to-r from-primary/10 to-primary-light/10 py-16'>
                <div className='container-custom text-center'>
                    <h1 className='text-5xl font-bold text-gradient mb-6'>
                        Frequently Asked Questions
                    </h1>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        Find answers to common questions about BUILD BASKET services, 
                        delivery, payments, and more.
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='section-padding'>
                <div className='container-custom'>
                    <div className='max-w-4xl mx-auto'>
                        {faqData.map((faq, index) => (
                            <div key={index} className='mb-4'>
                                <div 
                                    className='card cursor-pointer'
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <div className='p-6 flex justify-between items-center'>
                                        <h3 className='text-lg font-semibold text-dark'>
                                            {faq.question}
                                        </h3>
                                        <div className='text-primary'>
                                            {openIndex === index ? <FaMinus /> : <FaPlus />}
                                        </div>
                                    </div>
                                    
                                    {openIndex === index && (
                                        <div className='px-6 pb-6 border-t border-gray-100'>
                                            <p className='text-gray-600 mt-4 leading-relaxed'>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className='bg-primary py-16'>
                <div className='container-custom text-center'>
                    <h2 className='text-4xl font-bold text-white mb-6'>
                        Still Have Questions?
                    </h2>
                    <p className='text-xl text-white/90 mb-8'>
                        Our support team is here to help you with any questions.
                    </p>
                    <div className='flex justify-center gap-4 flex-wrap'>
                        <a 
                            href="mailto:support@buildbasket.com" 
                            className='bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all'
                        >
                            Email Support
                        </a>
                        <a 
                            href="tel:+1233243343" 
                            className='border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-3 px-8 rounded-lg transition-all'
                        >
                            Call Us
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FAQ;

