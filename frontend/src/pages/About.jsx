import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/api";


const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await api.get("/home/about-data");
        if (response.data.success) {
          setAboutData(response.data.aboutData);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eba834] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-20 md:py-24">
        <div className="w-[90%] lg:w-[85%] mx-auto text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            About {aboutData?.companyInfo?.name || "BUILD BASKET"}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Your trusted partner in construction materials and building
            solutions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[90%] lg:w-[85%] mx-auto py-16 px-4">
        {/* Company Story */}
        <div className="mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Our Story
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-6">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {aboutData?.companyInfo?.name || "BUILD BASKET"} was founded
                with a simple mission:{" "}
                {aboutData?.companyInfo?.mission ||
                  "to revolutionize the way construction materials are sourced, delivered, and managed"}
                . We understand the challenges faced by builders, contractors,
                and DIY enthusiasts in finding quality materials at competitive
                prices.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Our platform connects buyers with verified suppliers, ensuring
                transparency, quality, and timely delivery. With years of
                experience in the construction industry, we've built a network
                of trusted partners who share our commitment to excellence.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-6 text-center">
                Why Choose Us?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">
                    Quality guaranteed materials
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">
                    Competitive pricing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">
                    Fast and reliable delivery
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 leading-relaxed">
                    Expert customer support
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-6 text-center">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed text-center">
              {aboutData?.companyInfo?.mission ||
                "To simplify the construction materials procurement process by providing a seamless, transparent, and efficient platform that connects buyers with quality suppliers, ensuring every project gets the materials it needs on time and within budget."}
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-6 text-center">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed text-center">
              {aboutData?.companyInfo?.vision ||
                "To become the leading digital marketplace for construction materials, transforming the industry through technology, innovation, and exceptional customer service while building lasting partnerships with suppliers and buyers."}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-9">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  Q
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                Quality
              </h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We never compromise on the quality of materials
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  T
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                Trust
              </h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Building trust through transparency and reliability
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  I
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                Innovation
              </h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Continuously improving our platform and services
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  S
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                Service
              </h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Exceptional customer service is our priority
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-xl shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 sm:mb-12">
            Get in Touch
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                Email
              </h4>
              <p className="text-gray-600 text-sm sm:text-base break-all">
                {aboutData?.contactInfo?.email || "support@buildbasket.com"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                Phone
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                {aboutData?.contactInfo?.phone || "+(123) 3243 343"}
              </p>
            </div>
            <div className="flex flex-col items-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                Address
              </h4>
              <p className="text-gray-600 text-sm sm:text-base text-center">
                {aboutData?.contactInfo?.address ||
                  "Construction Hub, Building Materials District"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;