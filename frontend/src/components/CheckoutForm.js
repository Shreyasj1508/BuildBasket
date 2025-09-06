import React, { useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners";

const CheckoutForm = ({ orderId }) => {
  localStorage.setItem("orderId", orderId);
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const paymentElementOptions = {
    loyout: "tabs",
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }

    if (!orderId) {
      toast.error("Order ID not found. Please try again.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/order/confirm",
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message);
          toast.error(error.message);
        } else {
          setMessage("An unexpected error occurred");
          toast.error("An unexpected error occurred");
        }
      } else {
        toast.success("Payment processing...");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submit} id="payment-form">
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="px-10 py-3 rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span id="button-text">
          {isLoading ? (
            <>
              <FadeLoader color="white" size={20} />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </span>
      </button>

      {message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{message}</p>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
