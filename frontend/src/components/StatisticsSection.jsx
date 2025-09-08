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
    <div className="w-full py-8 bg-gray-50">
      <div className=" w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] mx-auto">
        {/* Statistics Banner */}
        <div className="bg-gray-200 rounded-2xl p-8 mb-0">
          <div className="grid grid-cols-3 gap-8">
            {/* Raw Material Prices */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">₹</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-500 mb-2">
                500K+
              </div>
              <div className="text-gray-600 text-base">Raw Material Prices</div>
            </div>

            {/* Orders Delivered */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 7h-1V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM9 6h6v1H9V6zm8 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-500 mb-2">
                400K+
              </div>
              <div className="text-gray-600 text-base">Orders Delivered</div>
            </div>

            {/* Locations Served */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-500 mb-2">
                100+
              </div>
              <div className="text-gray-600 text-base">Locations Served</div>
            </div>
          </div>
        </div>

        {/* Explore Raw Material Categories */}
        <div className="bg-white border-x-2 border-b-2 border-dashed border-orange-500 rounded-b-2xl p-8">


          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Explore Raw Material Categories
            </h2>
            <p className="text-gray-500 text-lg">
              Click the card to get all details of the product.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            {loading
              ? // Loading skeleton
                Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md p-2 text-center border border-gray-100 animate-pulse"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))
              : displayCategories.map((category) => (
                  <div
                    key={category._id}
                    data-category-id={category._id}
                    className="bg-white  shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center cursor-pointer border border-gray-100"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            category.image || "/images/placeholder-category.png"
                          }
                          alt={category.name}
                          className="w-full h-full object-cover"
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
                          className="icon-fallback w-full h-full flex items-center justify-center text-gray-600"
                          style={{ display: "flex" }}
                        >
                          {getCategoryIcon(category.name)}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {category.name}
                    </h3>
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 text-sm font-medium"
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

          <div className="text-right">
            <button
              className="text-orange-500 hover:text-orange-600 font-medium text-sm underline"
              onClick={handleViewAllClick}
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
