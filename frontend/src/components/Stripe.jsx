import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js' 
import { Elements } from '@stripe/react-stripe-js' 
import api from '../api/api';
import CheckoutForm from './CheckoutForm';
import toast from 'react-hot-toast';
import { FadeLoader } from 'react-spinners';
const stripePromise = loadStripe('pk_test_51Oml5cGAwoXiNtjJgPPyQngDj9WTjawya4zCsqTn3LPFhl4VvLZZJIh9fW9wqVweFYC5f0YEb9zjUqRpXbkEKT7T00eU1xQvjp')

const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState('')
    const [loading, setLoading] = useState(false)
    const apperance = {
        theme: 'stripe'
    }
    const options = {
        apperance,
        clientSecret
    }

    const create_payment = async () => {
        if (!price || !orderId) {
            toast.error('Missing payment information. Please try again.')
            return
        }

        setLoading(true)
        try {
            const { data } = await api.post('/order/create-payment', { price })
            setClientSecret(data.clientSecret)
            toast.success('Payment form loaded successfully!')
        } catch (error) {
            console.error('Payment creation error:', error)
            toast.error('Failed to initialize payment. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='mt-4'>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm orderId={orderId} />
                    </Elements>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Secure Payment with Stripe
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Pay securely with your credit/debit card. Your payment information is encrypted and secure.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-green-800 mb-2">Payment Amount:</h4>
                                <p className="text-2xl font-bold text-green-700">${price}</p>
                            </div>
                        </div>
                        <button 
                            onClick={create_payment} 
                            disabled={loading}
                            className='px-10 py-3 rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            {loading ? (
                                <>
                                    <FadeLoader color="white" size={20} />
                                    Loading...
                                </>
                            ) : (
                                "Start Payment"
                            )}
                        </button>
                    </div>
                )
            }
        </div>
    );
}; 

export default Stripe;