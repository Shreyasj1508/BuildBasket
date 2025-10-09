import React, { useState, useEffect } from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import Stripe from "../components/Stripe";
import api from "../api/api";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners";
import { FaCreditCard, FaWallet, FaCheckCircle } from "react-icons/fa";

const Payment = () => {
  const {
    state: { price, items, orderId },
  } = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [creditInfo, setCreditInfo] = useState(null);
  const [creditEligible, setCreditEligible] = useState(false);

  useEffect(() => {
    // Get user info and credit information
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/customer/get-customer-info', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.success) {
          setUserInfo(res.data.customer);
          setCreditInfo(res.data.customer.creditInfo);
          
          // Check if user has approved credit limit and sufficient available credit
          if (res.data.customer.creditInfo && 
              res.data.customer.creditInfo.applicationStatus === 'approved' &&
              res.data.customer.creditInfo.availableCredit >= price) {
            setCreditEligible(true);
          }
        }
      }).catch(err => {
        console.log('Error fetching user info:', err);
      });
    }
  }, [price]);

  const handleCODPayment = async () => {
    if (!orderId) {
      toast.error("Order ID not found. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // For COD, we'll mark the order as paid immediately
      await api.get(`/order/confirm/${orderId}`);
      toast.success("Order confirmed! You will pay on delivery.");
      navigate("/dashboard/my-orders");
    } catch (error) {
      console.error("COD payment error:", error);
      toast.error("Failed to confirm order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreditPayment = async () => {
    if (!orderId) {
      toast.error("Order ID not found. Please try again.");
      return;
    }

    if (!creditEligible) {
      toast.error("Credit limit not available or insufficient credit.");
      return;
    }

    setLoading(true);
    try {
      // Process credit payment
      const response = await api.post('/order/pay-with-credit', {
        orderId,
        amount: price
      });

      if (response.data.success) {
        toast.success("Order paid successfully using credit limit!");
        navigate("/dashboard/my-orders");
      } else {
        toast.error(response.data.message || "Credit payment failed.");
      }
    } catch (error) {
      console.error("Credit payment error:", error);
      toast.error("Failed to process credit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <section className="bg-[#eeeeee]">
        <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4 ">
          <div className="flex flex-wrap md:flex-col-reverse">
            <div className="w-7/12 md:w-full">
              <div className="pr-2 md:pr-0">
                <div className="flex flex-wrap">
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "stripe" ? "bg-white" : "bg-slate-100"
                    } `}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img
                        src="http://localhost:3000/images/payment/stripe.png"
                        alt=""
                      />
                    </div>
                    <span className="text-slate-600">Stripe</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                      paymentMethod === "cod" ? "bg-white" : "bg-slate-100"
                    } `}
                  >
                    <div className="flex flex-col gap-[3px] justify-center items-center">
                      <img
                        src="http://localhost:3000/images/payment/cod.jpg"
                        alt=""
                      />
                    </div>
                    <span className="text-slate-600">COD</span>
                  </div>

                  {creditEligible && (
                    <div
                      onClick={() => setPaymentMethod("credit")}
                      className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
                        paymentMethod === "credit" ? "bg-white" : "bg-slate-100"
                      } `}
                    >
                      <div className="flex flex-col gap-[3px] justify-center items-center">
                        <FaCreditCard className="text-3xl text-green-600" />
                      </div>
                      <span className="text-slate-600">Credit Limit</span>
                      <span className="text-xs text-green-600 font-semibold">
                        Available: ₹{creditInfo?.availableCredit?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {paymentMethod === "stripe" && (
                  <div>
                    <Stripe orderId={orderId} price={price} />
                  </div>
                )}
                {paymentMethod === "cod" && (
                  <div className="w-full px-4 py-8 bg-white shadow-sm">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Cash on Delivery (COD)
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You will pay ₹{price} when your order is delivered.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-800 mb-2">COD Information:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Payment will be collected upon delivery</li>
                          <li>• Please keep exact change ready</li>
                          <li>• Delivery person will provide receipt</li>
                          <li>• No additional charges for COD</li>
                        </ul>
                      </div>
                    </div>
                    <button 
                      onClick={handleCODPayment}
                      disabled={loading}
                      className="btn-primary px-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <FadeLoader color="white" size={20} />
                          Confirming...
                        </>
                      ) : (
                        "Confirm COD Order"
                      )}
                    </button>
                  </div>
                )}
                {paymentMethod === "credit" && (
                  <div className="w-full px-4 py-8 bg-white shadow-sm">
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <FaWallet className="text-2xl text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Pay with Credit Limit
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Pay ₹{price} using your approved credit limit from SG Finserv.
                      </p>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-green-800 mb-2">Credit Information:</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                          <div>
                            <span className="font-medium">Approved Limit:</span>
                            <p className="font-bold">₹{creditInfo?.approvedLimit?.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Available Credit:</span>
                            <p className="font-bold">₹{creditInfo?.availableCredit?.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Order Amount:</span>
                            <p className="font-bold">₹{price}</p>
                          </div>
                          <div>
                            <span className="font-medium">Remaining Credit:</span>
                            <p className="font-bold">₹{(creditInfo?.availableCredit - price)?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Credit Payment Benefits:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Interest-free credit period</li>
                          <li>• Instant payment processing</li>
                          <li>• GST invoice from SG Finserv</li>
                          <li>• Flexible repayment terms</li>
                        </ul>
                      </div>
                    </div>
                    <button 
                      onClick={handleCreditPayment}
                      disabled={loading}
                      className="btn-primary px-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <FadeLoader color="white" size={20} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          Pay with Credit Limit
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-5/12 md:w-full">
              <div className="pl-2 md:pl-0 md:mb-0">
                <div className="bg-white shadow p-5 text-slate-600 flex flex-col gap-3">
                  <h2 className="font-bold text-lg">Order Summary </h2>
                  <div className="flex justify-between items-center">
                    <span>{items} Items and Shipping Fee Included </span>
                    <span>₹{price} </span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount </span>
                    <span className="text-lg text-primary font-bold">
                      ₹{price}
                    </span>
                  </div>
                  {creditEligible && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <FaCheckCircle className="text-sm" />
                        <span className="text-sm font-medium">Credit Payment Available</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        You can pay using your credit limit of ₹{creditInfo?.availableCredit?.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;
