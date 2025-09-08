import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

const CustomerTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Mr. Rajesh Kumar",
      position: "Managing Director",
      company: "Kumar Construction & Materials",
      image: "/images/avatars/customer1.jpg", // You can add actual customer images
      testimonial: "As Managing Director of a construction materials company serving residential and commercial projects, we faced challenges with material sourcing, quality consistency, and timely delivery. BUILD BASKET streamlined our procurement process, reduced our working capital cycles, and helped us cut material costs significantly while maintaining quality standards."
    },
    {
      id: 2,
      name: "Ms. Priya Sharma",
      position: "Project Manager",
      company: "Sharma Builders Pvt Ltd",
      image: "/images/avatars/customer2.jpg",
      testimonial: "BUILD BASKET has revolutionized our construction material procurement. The platform's direct seller connections, competitive pricing, and reliable delivery have helped us complete projects on time and within budget. The quality assurance and customer support are exceptional."
    },
    {
      id: 3,
      name: "Mr. Amit Singh",
      position: "Owner",
      company: "Singh Hardware & Construction",
      image: "/images/avatars/customer3.jpg",
      testimonial: "Working with BUILD BASKET has been a game-changer for our business. The wholesale pricing, verified sellers, and comprehensive product range have helped us serve our customers better while increasing our profit margins. The platform is user-friendly and the support team is always helpful."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern - Matching WhyChooseUs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-8 left-8 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-primary-light rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-primary-dark rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container-custom">
        {/* Section Header */}
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            <div className="flex">
              {/* Customer Image - Left Side */}
              <div className="w-1/3 p-8 lg:p-12 flex items-center justify-center bg-gray-50">
                <div className="relative">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={currentData.image}
                      alt={currentData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/user.png'; // Fallback image
                      }}
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Content - Right Side */}
              <div className="w-2/3 p-8 lg:p-12 flex flex-col justify-center">
                {/* Quote Icons - Using your primary colors */}
                <div className="flex items-start mb-6">
                  <FaQuoteLeft className="text-6xl text-primary mr-4 mt-1" />
                  <FaQuoteLeft className="text-6xl text-primary-light mr-4 mt-1" />
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                  "{currentData.testimonial}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-1">
                      {currentData.name}
                    </h4>
                  </div>

                  {/* Navigation Controls - Bottom Right */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center group"
                      aria-label="Previous testimonial"
                    >
                      <FaChevronLeft className="text-sm text-gray-600 group-hover:text-white" />
                    </button>

                    <button
                      onClick={nextTestimonial}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center group"
                      aria-label="Next testimonial"
                    >
                      <FaChevronRight className="text-sm text-gray-600 group-hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements - Matching WhyChooseUs */}
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
    </section>
  );
};

export default CustomerTestimonials;
