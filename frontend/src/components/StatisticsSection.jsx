import React from 'react';

const StatisticsSection = () => {
  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-6">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {/* Raw Material Prices */}
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg md:text-2xl font-bold">₹</span>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">
                500K+
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                Raw Material Prices
              </div>
            </div>

            {/* Orders Delivered */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 md:w-8 md:h-8 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 7h-1V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM9 6h6v1H9V6zm8 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">
                400K+
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                Orders Delivered
              </div>
            </div>

            {/* Locations Served */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 md:w-8 md:h-8 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">
                100+
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                Locations Served
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
