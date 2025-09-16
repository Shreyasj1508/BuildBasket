import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get_category } from "../store/reducers/homeReducer";
import { useHomeState } from "../hooks/useSafeSelector";

const StatisticsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorys } = useHomeState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        await dispatch(get_category());
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [dispatch]);

  // Function to get icon based on category name
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "Cement & Concrete": (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h8" />
        </svg>
      ),
      "Steel & Iron": (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="2" rx="1" />
          <rect x="3" y="7" width="18" height="2" rx="1" />
          <rect x="3" y="11" width="18" height="2" rx="1" />
          <rect x="3" y="15" width="18" height="2" rx="1" />
          <rect x="3" y="19" width="18" height="2" rx="1" />
        </svg>
      ),
      "Bricks & Blocks": (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="6" height="4" rx="1" />
          <rect x="11" y="3" width="6" height="4" rx="1" />
          <rect x="3" y="9" width="6" height="4" rx="1" />
          <rect x="11" y="9" width="6" height="4" rx="1" />
          <rect x="3" y="15" width="6" height="4" rx="1" />
          <rect x="11" y="15" width="6" height="4" rx="1" />
        </svg>
      ),
      "Tiles & Flooring": (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h6v6H3V3zm6 0h6v6H9V3zm6 0h6v6h-6V3zM3 9h6v6H3V9zm6 0h6v6H9V9zm6 0h6v6h-6V9zM3 15h6v6H3v-6zm6 0h6v6H9v-6zm6 0h6v6h-6v-6z" />
        </svg>
      ),
      Electrical: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      Plumbing: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7h-1V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM9 6h6v1H9V6zm8 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
        </svg>
      ),
      "Tools & Equipment": (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
        </svg>
      ),
    };

    return (
      iconMap[categoryName] || (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    );
  };

  // Function to handle category click
  const handleCategoryClick = (categoryName) => {
    navigate(`/shops?category=${encodeURIComponent(categoryName)}`);
  };

  // Function to handle "View All" click
  const handleViewAllClick = () => {
    navigate("/shops");
  };

  // Get first 7 categories for display
  const displayCategories = categorys?.slice(0, 7) || [];

  return (
    <div className="w-full py-8 bg-gradient-to-br from-gray-50 via-primary/10 to-gray-100">
      <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] mx-auto">
        {/* Statistics Banner */}
        <div className="bg-gradient-to-r from-white to-primary/10 rounded-2xl p-8 mb-0 shadow-2xl border border-primary/20 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-8">
            {/* Raw Material Prices */}
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-2xl font-bold">₹</span>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-2">
                500K+
              </div>
              <div className="text-gray-600 text-base font-semibold">Raw Material Prices</div>
            </div>

            {/* Orders Delivered */}
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 7h-1V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM9 6h6v1H9V6zm8 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-2">
                400K+
              </div>
              <div className="text-gray-600 text-base font-semibold">Orders Delivered</div>
            </div>

            {/* Locations Served */}
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-2">
                100+
              </div>
              <div className="text-gray-600 text-base font-semibold">Locations Served</div>
            </div>
          </div>
        </div>

        {/* Explore Raw Material Categories */}
        <div className="bg-gradient-to-br from-white to-primary/10 border-x-2 border-b-2 border-dashed border-primary rounded-b-2xl p-8 shadow-lg">


          <div className="text-center mb-8">
            <div className="inline-block">
              <h2 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Explore Raw Material Categories
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-dark mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-600 text-lg mt-4 font-medium">
              Discover premium quality materials for your construction needs
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8">
            {loading
              ? // Loading skeleton
                Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg p-6 text-center border border-gray-100 rounded-2xl animate-pulse"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center">
                        <div className="w-10 h-10 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 mb-4 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ))
              : displayCategories.map((category, index) => (
                  <div
                    key={category._id}
                    data-category-id={category._id}
                    className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 p-6 text-center cursor-pointer border border-gray-100 rounded-2xl hover:border-orange-300 hover:-translate-y-2 hover:scale-105"
                    onClick={() => handleCategoryClick(category.name)}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center overflow-hidden group-hover:from-primary/30 group-hover:to-primary/40 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                        <img
                          src={
                            category.image || "/images/placeholder-category.png"
                          }
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            // Hide image and show icon fallback
                            e.target.style.display = "none";
                            const iconDiv =
                              e.target.parentElement.querySelector(
                                ".icon-fallback"
                              );
                            if (iconDiv) {
                              iconDiv.style.display = "flex";
                            }
                          }}
                          onLoad={(e) => {
                            // Hide icon fallback when image loads successfully
                            const iconDiv =
                              e.target.parentElement.querySelector(
                                ".icon-fallback"
                              );
                            if (iconDiv) {
                              iconDiv.style.display = "none";
                            }
                          }}
                        />
                        <div
                          className="icon-fallback w-full h-full flex items-center justify-center text-primary group-hover:text-primary-dark transition-colors duration-300"
                          style={{ display: "flex" }}
                        >
                          {getCategoryIcon(category.name)}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <button
                      className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl hover:from-primary-dark hover:to-primary transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.name);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
          </div>

          <div className="text-center">
            <button
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-xl hover:from-primary-dark hover:to-primary transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
              onClick={handleViewAllClick}
            >
              <span>View All Categories</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
