import React, { useState } from "react";
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
    <div className="w-full bg-white relative overflow-hidden">
      {/* Background Pattern - Subtle */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-8 left-8 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-primary-light rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-primary-dark rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Title - Left Aligned */}
          <div className="text-left mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why {activeTab === "buyer" ? "Buyers" : "Suppliers"} Choose Us
            </h2>

            {/* Toggle Switch - Below Title */}
            <div className="flex justify-start mb-10">
              <div className="bg-gray-200 rounded-full p-1 flex border border-gray-300">
                <button
                  onClick={() => setActiveTab("buyer")}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    activeTab === "buyer"
                      ? "bg-primary text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => setActiveTab("supplier")}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    activeTab === "supplier"
                      ? "bg-primary text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Supplier
                </button>
              </div>
            </div>
          </div>

          {/* Features in Single Row - Square boxes */}
          <div className="flex flex-wrap justify-start gap-4">
            {currentFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl border border-gray-200 hover:border-primary hover:border-opacity-50 w-[280px] h-[280px] flex flex-col justify-start items-start text-left"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Icon - Primary Circle with White Icon */}
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-dark transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <IconComponent className="text-2xl text-white transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <div className="text-left mt-12">
            <p className="text-xl font-bold text-gray-900">
              <span className="text-primary">25,000+</span> Verified
              Construction Suppliers &
              <span className="text-primary"> 1 Million+</span> Construction
              Professionals Trust Us
            </p>
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
