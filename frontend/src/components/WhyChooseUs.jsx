import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaWallet,
  FaTruck,
  FaStar,
  FaUsers,
  FaCreditCard,
  FaChartLine,
  FaCogs,
  FaTools,
  FaBuilding,
  FaShieldAlt,
  FaHandshake,
} from "react-icons/fa";

const WhyChooseUs = () => {
  const [activeTab, setActiveTab] = useState("buyer");
  const [isVisible, setIsVisible] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    // Trigger animations when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimateCards(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Reset and trigger animations when tab changes
    setAnimateCards(false);
    const timer = setTimeout(() => {
      setAnimateCards(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const buyerFeatures = [
    {
      icon: FaShoppingCart,
      title: "Best Wholesale Prices",
      description:
        "Get construction materials at wholesale rates, up to 15% lower than retail",
    },
    {
      icon: FaWallet,
      title: "Easy Credit Options",
      description:
        "Flexible payment terms and credit facilities for your construction projects",
    },
    {
      icon: FaTruck,
      title: "Pan India Delivery",
      description:
        "Fast and reliable delivery across all major cities and construction sites",
    },
    {
      icon: FaStar,
      title: "Verified Suppliers",
      description:
        "Quality assured materials from 25,000+ verified construction suppliers",
    },
  ];

  const supplierFeatures = [
    {
      icon: FaUsers,
      title: "Expand Your Reach",
      description:
        "Connect with 1M+ construction professionals and grow your business 3x",
    },
    {
      icon: FaCreditCard,
      title: "Quick Payments",
      description:
        "Get advance payments and faster settlements for your material supplies",
    },
    {
      icon: FaChartLine,
      title: "High Volume Orders",
      description:
        "Access to bulk orders from large construction companies and contractors",
    },
    {
      icon: FaCogs,
      title: "Logistics Support",
      description:
        "End-to-end logistics management while you focus on manufacturing",
    },
  ];

  const currentFeatures =
    activeTab === "buyer" ? buyerFeatures : supplierFeatures;

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-primary/10 to-gray-100 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-primary-light to-primary rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-primary-dark to-primary rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Title - Left Aligned */}
          <div className="text-left mb-8">
            <div className={`inline-block transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                Why {activeTab === "buyer" ? "Buyers" : "Suppliers"} Choose Us
              </h2>
              <div className={`w-24 h-1 bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-1000 delay-300 ${isVisible ? 'scale-x-100' : 'scale-x-0'}`}></div>
            </div>

            {/* Enhanced Toggle Switch */}
            <div className={`flex justify-start mb-10 mt-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="bg-white rounded-full p-1 flex border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <button
                  onClick={() => setActiveTab("buyer")}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-500 transform ${
                    activeTab === "buyer"
                      ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105 rotate-1"
                      : "text-gray-600 hover:text-primary hover:bg-primary/10 hover:scale-105"
                  }`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => setActiveTab("supplier")}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-500 transform ${
                    activeTab === "supplier"
                      ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105 rotate-1"
                      : "text-gray-600 hover:text-primary hover:bg-primary/10 hover:scale-105"
                  }`}
                >
                  Supplier
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="flex flex-wrap justify-start gap-4">
            {currentFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={`${activeTab}-${index}`}
                  className={`group bg-white rounded-xl p-6 hover:bg-gradient-to-br hover:from-primary/10 hover:to-white transition-all duration-700 hover:transform hover:scale-105 hover:shadow-xl border border-gray-200 hover:border-primary/30 w-[280px] h-[280px] flex flex-col justify-start items-start text-left ${
                    animateCards 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-10 scale-95'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Enhanced Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mb-4 group-hover:from-primary-dark group-hover:to-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg group-hover:shadow-xl ${
                    animateCards ? 'animate-bounceIn' : ''
                  }`}>
                    <IconComponent className="text-2xl text-white transition-all duration-500 group-hover:scale-110" />
                  </div>

                  {/* Enhanced Content */}
                  <h3 className={`text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-all duration-500 ${
                    animateCards ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`} style={{ transitionDelay: `${index * 150 + 200}ms` }}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-all duration-500 ${
                    animateCards ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`} style={{ transitionDelay: `${index * 150 + 300}ms` }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Enhanced Bottom Stats */}
          <div className={`text-left mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <p className="text-xl font-bold text-center">
                <span className="text-white animate-pulse">25,000+</span> Verified Construction Suppliers & 
                <span className="text-white animate-pulse"> 1 Million+</span> Construction Professionals Trust Us
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary bg-opacity-5 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-10 -left-10 w-96 h-96 bg-primary-light bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-dark bg-opacity-5 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
