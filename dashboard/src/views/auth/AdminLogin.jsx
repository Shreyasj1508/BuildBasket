import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { admin_login,messageClear } from '../../store/Reducers/authReducer';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

// Custom CSS for animations
const customStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
    }
    
    .animate-slideInLeft {
        animation: slideInFromLeft 0.8s ease-out forwards;
        opacity: 0;
    }
    
    .animate-slideInRight {
        animation: slideInFromRight 0.8s ease-out forwards;
        opacity: 0;
    }
    
    .animate-scaleIn {
        animation: scaleIn 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .animate-fadeInUp:nth-child(1) { animation-delay: 0.1s; }
    .animate-fadeInUp:nth-child(2) { animation-delay: 0.2s; }
    .animate-fadeInUp:nth-child(3) { animation-delay: 0.3s; }
`;

const AdminLogin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {loader,errorMessage,successMessage} = useSelector(state=>state.auth)

    const [state, setState] = useState({ 
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault()
        
        // Basic validation
        if (!state.email || !state.password) {
            toast.error('Please fill in all fields');
            return;
        }
        
        if (!state.email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        dispatch(admin_login(state))
    }

    const overrideStyle = {
        display : 'flex',
        margin : '0 auto',
        height: '24px',
        justifyContent : 'center',
        alignItems : 'center'
    }

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())  
            // Use setTimeout to ensure navigation happens after the current render cycle
            setTimeout(() => {
                navigate('/', { replace: true })
            }, 100)
        }
    },[errorMessage,successMessage, dispatch, navigate])

    return (
        <>
            <style>{customStyles}</style>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 relative overflow-hidden" style={{ minHeight: '100vh' }}>
                {/* Enhanced Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
                    
                    {/* Additional floating elements */}
                    <div className="absolute top-20 left-20 w-3 h-3 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-40 right-32 w-4 h-4 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute bottom-32 left-32 w-3 h-3 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>
                </div>

                {/* Login Card */}
                <div className="relative w-full max-w-sm animate-scaleIn">
                    {/* Logo/Brand Section */}
                    <div className="text-center mb-6 animate-fadeInUp">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-2xl shadow-xl mb-4 hover:scale-110 transition-all duration-300 hover:shadow-2xl">
                            <FaShieldAlt className="text-white text-2xl drop-shadow-lg" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">
                            <span className="bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] bg-clip-text text-transparent drop-shadow-sm">BUILD BASKET</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 bg-[#eb8f34] rounded-full animate-pulse"></div>
                            <p className="text-gray-700 font-bold text-sm">Admin Dashboard</p>
                            <div className="w-1.5 h-1.5 bg-[#d17a1e] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                        <p className="text-gray-600 font-medium text-xs">Secure administrative access</p>
                    </div>

                    {/* Login Form Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-lg flex items-center justify-center">
                                    <FaShieldAlt className="text-white text-xs" />
                                </div>
                                Welcome Back!
                            </h2>
                            <p className="text-gray-600 text-sm">Sign in to access your dashboard</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                                    <FaEnvelope className="text-[#eb8f34] text-xs" />
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400 text-xs group-focus-within:text-[#eb8f34] transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={state.email}
                                        onChange={inputHandle}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb8f34]/20 focus:border-[#eb8f34] focus:bg-white transition-all text-gray-800 placeholder-gray-400 text-sm font-medium hover:bg-gray-100/80"
                                        placeholder="admin@buildbasket.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                                    <FaLock className="text-[#eb8f34] text-xs" />
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400 text-xs group-focus-within:text-[#eb8f34] transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        value={state.password}
                                        onChange={inputHandle}
                                        className="w-full pl-10 pr-10 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb8f34]/20 focus:border-[#eb8f34] focus:bg-white transition-all text-gray-800 placeholder-gray-400 text-sm font-medium hover:bg-gray-100/80"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#eb8f34] transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                                    </button>
                                </div>
                            </div>
 
                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-[#eb8f34] bg-gray-100 border-gray-300 rounded focus:ring-[#eb8f34] focus:ring-2 cursor-pointer"
                                    />
                                    <span className="ml-2 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-xs font-bold text-[#eb8f34] hover:text-[#d17a1e] transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loader}
                                className="w-full bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] hover:from-[#d17a1e] hover:to-[#eb8f34] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm animate-slideInRight"
                                style={{ animationDelay: '0.5s' }}
                            >
                                {loader ? (
                                    <>
                                        <PropagateLoader color='#fff' cssOverride={overrideStyle} />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaShieldAlt className="text-sm" />
                                        <span>Access Dashboard</span>
                                    </>
                                )}
                            </button>
    </form>
 
                        {/* Additional Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <FaShieldAlt className="text-green-500 text-sm" />
                                    <span className="font-semibold">Secure admin access</span>
                                </div>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-xs text-gray-500 font-medium">
                                    🔒 SSL Encrypted • 🛡️ Protected • ⚡ Real-time
                                </p>
                            </div>
                        </div>
            </div>  
            
                    {/* Footer */}
                    <div className="mt-4 text-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md border border-white/20">
                            <p className="text-xs text-gray-600 font-medium mb-1">
                                © 2025 BuildBasket. All rights reserved.
                            </p>
                            <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                                <span>🔐 Enterprise Security</span>
                                <span>•</span>
                                <span>⚡ High Performance</span>
                                <span>•</span>
                                <span>🌐 Global Access</span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        </>
    );
};

export default AdminLogin;