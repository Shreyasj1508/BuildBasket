import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaFacebookF } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa6";
import { FaUser, FaStore, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { customer_login, messageClear } from "../store/reducers/authReducer";
import toast from "react-hot-toast";
import { FadeLoader } from "react-spinners";
import logoImage from "../assets/cropped_circle_image.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loader, errorMessage, successMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const [activeSection, setActiveSection] = useState("customer");

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!state.email || !state.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Clear previous messages
    dispatch(messageClear());

    // Dispatch login action
    try {
      await dispatch(customer_login(state)).unwrap();
    } catch (error) {
      // Show backend error if available
      toast.error(error?.error || error?.message || "Login failed");
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      // Get redirect URL from query parameters
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get("redirect");

      // Navigate to redirect URL or default to home
      navigate(redirectUrl || "/");
    }
  }, [
    successMessage,
    errorMessage,
    userInfo,
    dispatch,
    navigate,
    location.search,
  ]);

  return (
    <div>
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]">
          <FadeLoader />
        </div>
      )}
      <Header />

      <div className="bg-light min-h-screen py-8">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="card overflow-hidden shadow-2xl">
              <div className="login-container flex flex-col md:flex-row min-h-[600px] w-full">
                {/* Left Section - Orange Background */}
                <div className="bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] p-6 lg:p-8 flex flex-col justify-center w-full md:w-2/5">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                      <img
                        src={logoImage}
                        alt="SG Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                      BUILD BASKET
                    </h2>
                    <p className="text-white/90 text-lg">
                      Choose your login method
                    </p>
                  </div>

                  {/* Login Options */}
                  <div className="space-y-4">
                    <button
                      onClick={() => handleSectionChange("customer")}
                      className={`w-full p-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-500 transform hover:scale-105 ${
                        activeSection === "customer"
                          ? "bg-white text-[#eb8f34] shadow-xl scale-105 animate-pulse"
                          : "bg-white/20 text-white hover:bg-white/30 hover:shadow-lg"
                      }`}
                    >
                      <FaUser className="text-xl transition-transform duration-300 hover:rotate-12" />
                      <span className="font-semibold text-lg">
                        Login as Customer
                      </span>
                    </button>

                    <button
                      onClick={() => handleSectionChange("seller")}
                      className={`w-full p-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-500 transform hover:scale-105 ${
                        activeSection === "seller"
                          ? "bg-white text-[#eb8f34] shadow-xl scale-105 animate-pulse"
                          : "bg-white/20 text-white hover:bg-white/30 hover:shadow-lg"
                      }`}
                    >
                      <FaStore className="text-xl transition-transform duration-300 hover:rotate-12" />
                      <span className="font-semibold text-lg">
                        Login as Seller
                      </span>
                    </button>

                    <button
                      onClick={() => handleSectionChange("register")}
                      className={`w-full p-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-500 transform hover:scale-105 ${
                        activeSection === "register"
                          ? "bg-white text-[#eb8f34] shadow-xl scale-105 animate-pulse"
                          : "bg-white/20 text-white hover:bg-white/30 hover:shadow-lg"
                      }`}
                    >
                      <FaUserPlus className="text-xl transition-transform duration-300 hover:rotate-12" />
                      <span className="font-semibold text-lg">
                        Create Account
                      </span>
                    </button>

                    <a
                      target="_blank"
                      href="http://localhost:3001/register"
                      className="w-full p-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-500 transform bg-white/10 text-white hover:bg-white/20 border border-white/30 hover:scale-105 hover:shadow-lg"
                    >
                      <FaStore className="text-xl transition-transform duration-300 hover:rotate-12" />
                      <span className="font-semibold text-lg">
                        Register as Seller
                      </span>
                    </a>
                  </div>
                </div>

                {/* Right Section - Forms */}
                <div
                  className={`p-5 h-full w-full lg:p-8 flex items-center justify-center relative overflow-hidden w-full md:w-3/5 transition-all duration-500 ${
                    activeSection === "seller" ? "min-h-[600px]" : ""
                  }`}
                  style={{
                    backgroundImage: "url(/images/login_background.jpg)",
                    backgroundSize: activeSection === "seller" ? "cover" : "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    height: activeSection === "seller" ? "100%" : "auto",
                  }}
                >
                   {/* Overlay for better readability */}
                   <div className="absolute inset-0 bg-white/30"></div>

                  {/* Content with higher z-index */}
                  <div className="relative z-10 w-full">
                  {/* Customer Login Form */}
                  <div
                    className={`form-container sign-in-container w-full transition-all duration-500 ease-in-out transform ${
                      activeSection === "customer" 
                        ? "opacity-100 translate-x-0 scale-100" 
                        : "opacity-0 translate-x-8 scale-95 hidden"
                    }`}
                  >
                      <div className="text-center mb-8">
                         <h3 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-lg">
                           Welcome Back
                         </h3>
                          <p className="text-gray-800 font-bold">
                            Sign in to your customer account
                          </p>
                      </div>

                      <form onSubmit={login} className="space-y-6">
                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                          <label
                            htmlFor="email"
                            className="text-lg font-bold text-gray-900 transition-colors duration-300"
                          >
                            Email Address
                          </label>
                          <input
                            onChange={inputHandle}
                            value={state.email}
                            className="input-field transition-all duration-300 hover:scale-105 focus:scale-105 focus:shadow-lg"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                          />
                        </div>

                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                          <label
                            htmlFor="password"
                            className="text-lg font-bold text-gray-900 transition-colors duration-300"
                          >
                            Password
                          </label>
                          <input
                            onChange={inputHandle}
                            value={state.password}
                            className="input-field transition-all duration-300 hover:scale-105 focus:scale-105 focus:shadow-lg"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            required
                          />
                        </div>

                        <button className="btn-primary w-full text-lg py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                          Sign In
                        </button>
                      </form>

                      {/* Divider */}
                      <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-gray-300"></div>
                         <span className="px-4 text-sm text-gray-900 bg-white font-bold">
                           Or continue with
                         </span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>

                      {/* Social Login */}
                      <div className="space-y-3">
                         <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex justify-center items-center gap-3 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                           <FaFacebookF className="text-lg transition-transform duration-300 group-hover:scale-110" />
                           <span>Continue with Facebook</span>
                         </button>

                        <button className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg flex justify-center items-center gap-3 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                          <FaGoogle className="text-lg transition-transform duration-300 group-hover:scale-110" />
                          <span>Continue with Google</span>
                        </button>
                      </div>

                      {/* Register Link */}
                      <div className="text-center mt-6">
                         <p className="text-gray-900 font-bold">
                           Don't have an account?
                           <Link
                             to="/register"
                             className="text-[#eb8f34] hover:text-[#d17a1e] font-bold ml-1 transition-colors"
                           >
                             Create Account
                           </Link>
                         </p>
                      </div>
                    </div>

                    {/* Seller Login Form */}
                    <div
                      className={`form-container seller-container w-full transition-all duration-500 ease-in-out transform ${
                        activeSection === "seller" 
                          ? "opacity-100 translate-x-0 scale-100" 
                          : "opacity-0 translate-x-8 scale-95 hidden"
                      }`}
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-lg">
                          Seller Login
                        </h3>
                        <p className="text-gray-800 font-bold">
                          Access your seller dashboard
                        </p>
                      </div>

                      <form className="space-y-6">
                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                          <label className="text-lg font-bold text-gray-900 transition-colors duration-300">
                            Email Address
                          </label>
                          <input
                            className="input-field transition-all duration-300 hover:scale-105 focus:scale-105 focus:shadow-lg"
                            type="email"
                            placeholder="Enter your email"
                          />
                        </div>

                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                          <label className="text-lg font-bold text-gray-900 transition-colors duration-300">
                            Password
                          </label>
                          <input
                            className="input-field transition-all duration-300 hover:scale-105 focus:scale-105 focus:shadow-lg"
                            type="password"
                            placeholder="Enter your password"
                          />
                        </div>

                        <button className="btn-primary w-full text-lg py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                          Login as Seller
                        </button>
                      </form>

                      <div className="mt-6 text-center">
                        <a
                          href="http://localhost:3001/register"
                          target="_blank"
                          className="text-[#eb8f34] hover:text-[#d17a1e] font-semibold transition-colors"
                        >
                          Don't have a seller account? Register here
                        </a>
                      </div>
                    </div>

                    {/* Register Form */}
                    <div
                      className={`form-container sign-up-container w-full transition-all duration-500 ease-in-out transform ${
                        activeSection === "register" 
                          ? "opacity-100 translate-x-0 scale-100" 
                          : "opacity-0 translate-x-8 scale-95 hidden"
                      }`}
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 drop-shadow-lg">
                          Create Account
                        </h3>
                        <p className="text-lg font-bold text-gray-800">
                          Join our community today
                        </p>
                      </div>

                      <form className="space-y-6">
                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                          <label className="text-lg font-bold text-gray-900">
                            Full Name
                          </label>
                          <input
                            className="input-field transition-all duration-300 hover:scale-105 focus:scale-105 focus:shadow-lg"
                            type="text"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                          <label className="text-lg font-bold text-gray-900">
                            Email Address
                          </label>
                          <input
                            className="input-field transition-all duration-300 hover:scale-105 focus:scale-105 focus:shadow-lg"
                            type="email"
                            placeholder="Enter your email"
                          />
                        </div>

                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                          <label className="text-lg font-bold text-gray-900">
                            Password
                          </label>
                          <input
                            className="input-field transition-all duration-300 hover:scale-105 focus:scale-105 focus:shadow-lg"
                            type="password"
                            placeholder="Create a password"
                          />
                        </div>

                        <button className="btn-primary w-full text-xl py-4 font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                          Create Account
                        </button>
                      </form>

                      {/* Social Register */}
                      <div className="mt-6 space-y-3">
                        <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex justify-center items-center gap-3 transition-colors font-medium">
                          <FaFacebookF className="text-lg" />
                          <span>Sign up with Facebook</span>
                        </button>

                        <button className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg flex justify-center items-center gap-3 transition-colors font-medium">
                          <FaGoogle className="text-lg" />
                          <span>Sign up with Google</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Login;