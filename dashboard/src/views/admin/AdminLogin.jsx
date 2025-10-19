import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { admin_login } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

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
    
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    .animate-fadeInUp:nth-child(1) { animation-delay: 0.1s; }
    .animate-fadeInUp:nth-child(2) { animation-delay: 0.2s; }
    .animate-fadeInUp:nth-child(3) { animation-delay: 0.3s; }
`;

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loader, errorMessage, successMessage, userInfo } = useSelector(state => state.auth);

    const [state, setState] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!state.email || !state.password) {
            toast.error('Please fill in all fields');
            return;
        }
        
        if (!state.email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        dispatch(admin_login(state));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            navigate('/admin/dashboard');
        }
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [successMessage, errorMessage, navigate]);

    useEffect(() => {
        if (userInfo && userInfo.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [userInfo, navigate]);

    return (
        <>
            <style>{customStyles}</style>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 relative overflow-hidden" style={{ minHeight: '100vh' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
                
                <div className="absolute top-20 left-20 w-4 h-4 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-40 right-32 w-6 h-6 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
                <div className="absolute bottom-32 left-32 w-5 h-5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '5s' }}></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8 animate-fadeInUp">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-3xl shadow-2xl mb-6 hover:scale-110 transition-all duration-300 hover:shadow-3xl">
                        <FaShieldAlt className="text-white text-4xl drop-shadow-lg" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-800 mb-3 tracking-tight">
                        <span className="bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] bg-clip-text text-transparent drop-shadow-sm">BUILD BASKET</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-[#eb8f34] rounded-full animate-pulse"></div>
                        <p className="text-gray-700 font-bold text-lg">Admin Dashboard</p>
                        <div className="w-2 h-2 bg-[#d17a1e] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-gray-600 font-medium text-sm">Secure administrative access portal</p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-lg flex items-center justify-center">
                                <FaShieldAlt className="text-white text-sm" />
                            </div>
                            Welcome Back!
                        </h2>
                        <p className="text-gray-600 text-base">Please sign in to access your administrative dashboard</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-3">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaEnvelope className="text-[#eb8f34]" />
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400 group-focus-within:text-[#eb8f34] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={state.email}
                                    onChange={inputHandle}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#eb8f34]/20 focus:border-[#eb8f34] focus:bg-white transition-all text-gray-800 placeholder-gray-400 font-medium hover:bg-gray-100/80"
                                    placeholder="admin@buildbasket.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-3">
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaLock className="text-[#eb8f34]" />
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400 group-focus-within:text-[#eb8f34] transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={state.password}
                                    onChange={inputHandle}
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#eb8f34]/20 focus:border-[#eb8f34] focus:bg-white transition-all text-gray-800 placeholder-gray-400 font-medium hover:bg-gray-100/80"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#eb8f34] transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-[#eb8f34] bg-gray-100 border-gray-300 rounded focus:ring-[#eb8f34] focus:ring-2 cursor-pointer"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-[#eb8f34] hover:text-[#d17a1e] transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loader}
                            className="w-full bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] hover:from-[#d17a1e] hover:to-[#eb8f34] text-white font-bold py-5 px-8 rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
                        >
                            {loader ? (
                                <>
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt className="text-xl" />
                                    <span>Access Admin Dashboard</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-green-500 text-lg" />
                                <span className="font-semibold">Secure admin access only</span>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500 font-medium">
                                🔒 SSL Encrypted • 🛡️ Protected Access • ⚡ Real-time Monitoring
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                        <p className="text-sm text-gray-600 font-medium mb-2">
                            © 2025 BuildBasket. All rights reserved.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
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
