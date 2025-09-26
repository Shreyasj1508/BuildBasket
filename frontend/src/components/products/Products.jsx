import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaChartLine, FaStar, FaFire, FaTag } from "react-icons/fa";
import { useCommission } from "../../context/CommissionContext";
import { getProductImage, handleImageError } from "../../utils/imageUtils";

const Products = ({ title, products = [] }) => {
  const carouselRef = useRef(null);
  const { calculateCommission } = useCommission();

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // Get icon and gradient based on title
  const getSectionConfig = (title) => {
    switch (title) {
      case "Latest Product":
        return {
          icon: <FaFire className="text-lg" />,
          gradient: "from-primary to-primary-dark",
          bgGradient: "from-primary/10 to-primary/5",
          borderColor: "border-primary/20",
          iconBg: "bg-gradient-to-br from-primary to-primary-dark",
          description: "Newest products added to our store",
        };
      case "Top Rated Product":
        return {
          icon: <FaStar className="text-lg" />,
          gradient: "from-yellow-500 to-yellow-600",
          bgGradient: "from-yellow-50 to-yellow-100/50",
          borderColor: "border-yellow-200",
          iconBg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
          description: "Highest rated products by customers",
        };
      case "Discount Product":
        return {
          icon: <FaTag className="text-lg" />,
          gradient: "from-red-500 to-red-600",
          bgGradient: "from-red-50 to-red-100/50",
          borderColor: "border-red-200",
          iconBg: "bg-gradient-to-br from-red-500 to-red-600",
          description: "Products with best discounts available",
        };
      default:
        return {
          icon: <FaChartLine className="text-lg" />,
          gradient: "from-primary to-primary-dark",
          bgGradient: "from-primary/10 to-primary/5",
          borderColor: "border-primary/20",
          iconBg: "bg-gradient-to-br from-primary to-primary-dark",
          description: "Featured products",
        };
    }
  };

  const sectionConfig = getSectionConfig(title);

  const goToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  // Handle empty products
  if (!products || products.length === 0) {
    return (
      <div
        className={`bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-xl border ${sectionConfig.borderColor}`}
      >
        <div
          className={`flex justify-between items-center mb-6 p-4 bg-gradient-to-r ${sectionConfig.bgGradient} rounded-xl border ${sectionConfig.borderColor} shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${sectionConfig.iconBg} rounded-full flex items-center justify-center text-white shadow-lg`}
            >
              {sectionConfig.icon}
            </div>
            <div>
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${sectionConfig.gradient} bg-clip-text text-transparent uppercase`}
              >
                {title}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {sectionConfig.description}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div
            className={`text-6xl mb-4 ${sectionConfig.iconBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto text-white`}
          >
            {sectionConfig.icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {title} Available
          </h3>
          <p className="text-gray-600">
            No {title.toLowerCase()} found at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-xl border ${sectionConfig.borderColor} hover:shadow-2xl transition-all duration-500`}
    >
      {/* Section Header at Top */}
      <div
        className={`flex justify-between items-center mb-6 p-4 bg-gradient-to-r ${sectionConfig.bgGradient} rounded-xl border ${sectionConfig.borderColor} shadow-lg`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${sectionConfig.iconBg} rounded-full flex items-center justify-center text-white shadow-lg`}
          >
            {sectionConfig.icon}
          </div>
          <div>
            <div
              className={`text-2xl font-bold bg-gradient-to-r ${sectionConfig.gradient} bg-clip-text text-transparent uppercase`}
            >
              {title}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {sectionConfig.description}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={goToPrevious}
            className={`w-10 h-10 flex justify-center items-center bg-white hover:bg-gradient-to-r hover:${sectionConfig.gradient} hover:text-white border ${sectionConfig.borderColor} rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105`}
            title="Previous products"
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={goToNext}
            className={`w-10 h-10 flex justify-center items-center bg-white hover:bg-gradient-to-r hover:${sectionConfig.gradient} hover:text-white border ${sectionConfig.borderColor} rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105`}
            title="Next products"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>

      <Carousel
        ref={carouselRef}
        autoPlay={false}
        infinite={false}
        arrows={false}
        responsive={responsive}
        transitionDuration={500}
        renderButtonGroupOutside={false}
      >
        {products.map((p, i) => {
          return (
            <div key={i} className="flex flex-col justify-start gap-4">
              {p.map((pl, j) => (
                <div
                  key={j}
                  className={`group bg-white rounded-xl p-4 shadow-lg hover:shadow-xl border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-[1.02] h-[180px] ${sectionConfig.bgGradient}`}
                >
                  <div className="flex justify-start items-start relative">
                    <Link
                      className="flex justify-start items-start flex-1 gap-4"
                      to={`/product/details/${pl.slug}`}
                    >
                      {/* Enhanced Product Image */}
                      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                        <img
                          className="w-[120px] h-[120px] object-cover group-hover:scale-110 transition-transform duration-300"
                          src={getProductImage(pl.images)}
                          alt={pl.name}
                          onError={(e) => handleImageError(e)}
                        />
                        {/* Section-specific Badges */}
                        {title === "Latest Product" && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            NEW
                          </div>
                        )}
                        {title === "Top Rated Product" &&
                          pl.rating &&
                          pl.rating >= 4.5 && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              ⭐ {pl.rating}
                            </div>
                          )}
                        {title === "Discount Product" &&
                          pl.discount &&
                          pl.discount > 0 && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              -{pl.discount}%
                            </div>
                          )}
                      </div>

                      {/* Enhanced Product Info */}
                      <div className="flex-1 flex flex-col justify-start gap-2">
                        <h2 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {pl.name}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                            ₹
                            {Math.round(
                              calculateCommission(pl.price).finalPrice
                            )}
                          </span>
                          {pl.discount && pl.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹
                              {Math.round(
                                calculateCommission(
                                  pl.price + (pl.price * pl.discount) / 100
                                ).finalPrice
                              )}
                            </span>
                          )}
                        </div>
                        {/* Enhanced Rating Display */}
                        {pl.rating && (
                          <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, idx) => (
                                <FaStar
                                  key={idx}
                                  className={`text-xs ${
                                    idx < Math.floor(pl.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span
                              className={`text-xs font-semibold ml-1 ${
                                title === "Top Rated Product"
                                  ? "text-yellow-600 font-bold"
                                  : "text-gray-600"
                              }`}
                            >
                              ({pl.rating})
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Enhanced Chart Button */}
                    <Link
                      to={`/price-detail/${pl._id}`}
                      className={`absolute top-3 right-3 w-10 h-10 ${sectionConfig.iconBg} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110`}
                    >
                      <FaChartLine className="text-sm text-white" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Products;
