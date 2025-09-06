import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'
import error from '../assets/error.png'
import success from '../assets/success.png'
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import api from '../api/api';
import toast from 'react-hot-toast';

const load = async () => {
    return await loadStripe('pk_test_51Oml5cGAwoXiNtjJgPPyQngDj9WTjawya4zCsqTn3LPFhl4VvLZZJIh9fW9wqVweFYC5f0YEb9zjUqRpXbkEKT7T00eU1xQvjp')
}

const ConfirmOrder = () => {

    const [loader, setLoader] = useState(true)
    const [stripe, setStripe] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        if (!stripe) {
            return
        }
        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret')
        if (!clientSecret) {
            return
        }
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch(paymentIntent.status){
                case "succeeded":
                    setMessage('succeeded')
                    break
                    case "processing":
                    setMessage('processing')
                    break
                    case "requires_payment_method":
                    setMessage('failed')
                    break
                    default:
                    setMessage('failed')

            }
        })
    },[stripe])

    const get_load = async () => {
        const tempStripe = await load()
        setStripe(tempStripe)
    }
    
    useEffect(() => {
        get_load()
    },[])

    const update_payment = async () => {
        const orderId = localStorage.getItem('orderId')
        if (orderId) {
            try {
                await api.get(`/order/confirm/${orderId}`)
                localStorage.removeItem('orderId')
                setLoader(false)
                toast.success('Payment confirmed successfully!')
            } catch (error) {
                console.error('Payment confirmation error:', error)
                toast.error('Failed to confirm payment. Please contact support.')
                setLoader(false)
            }
        } else {
            toast.error('Order ID not found. Please contact support.')
            setLoader(false)
        }
    }

    useEffect(() => {
        if (message === 'succeeded') {
            update_payment()
        }
    },[message])


    return (
        <div className='w-screen h-screen flex justify-center items-center flex-col gap-4 bg-gray-50'>
            {
                (message === 'failed' || message === 'processing') ? (
                    <div className='text-center'>
                        <img src={error} alt="Payment Failed" className='mx-auto mb-4' />
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Payment Failed</h2>
                        <p className='text-gray-600 mb-4'>
                            {message === 'processing' ? 'Your payment is being processed.' : 'Your payment could not be processed.'}
                        </p>
                        <Link className='px-6 py-3 bg-primary rounded-lg text-white hover:bg-primary-dark transition-colors' to="/dashboard/my-orders">
                            Back to Dashboard
                        </Link>
                    </div>
                ) : message === 'succeeded' ? (
                    loader ? (
                        <div className='text-center'>
                            <FadeLoader/>
                            <p className='mt-4 text-gray-600'>Confirming your payment...</p>
                        </div>
                    ) : (
                        <div className='text-center'>
                            <img src={success} alt="Payment Success" className='mx-auto mb-4' />
                            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Payment Successful!</h2>
                            <p className='text-gray-600 mb-4'>Your order has been confirmed and payment processed.</p>
                            <Link className='px-6 py-3 bg-primary rounded-lg text-white hover:bg-primary-dark transition-colors' to="/dashboard/my-orders">
                                View My Orders
                            </Link>
                        </div>
                    )
                ) : (
                    <div className='text-center'>
                        <FadeLoader/>
                        <p className='mt-4 text-gray-600'>Processing payment...</p>
                    </div>
                )
            }
        </div>
    );
};

export default ConfirmOrder;