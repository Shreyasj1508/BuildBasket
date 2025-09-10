import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Categorys from "../components/Categorys";
import FeatureProducts from "../components/products/FeatureProducts";
import Products from "../components/products/Products";
import WhyChooseUs from "../components/WhyChooseUs";
import CustomerTestimonials from "../components/CustomerTestimonials";
import StatisticsSection from "../components/StatisticsSection";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { get_products, get_category } from "../store/reducers/homeReducer";
import { useNavigate } from "react-router-dom";
import { useHomeState } from "../hooks/useSafeSelector";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homeState = useHomeState();

  // Safely destructure with fallbacks
  const products = homeState?.products || [];
  const latest_product = homeState?.latest_product || [];
  const topRated_product = homeState?.topRated_product || [];
  const discount_product = homeState?.discount_product || [];
  const categorys = homeState?.categorys || [];
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Add a small delay to ensure store is initialized
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Check if dispatch is available
        if (dispatch && typeof dispatch === "function") {
          await dispatch(get_products());
          await dispatch(get_category());
        } else {
          console.error("Dispatch function is not available");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data on component mount only
    fetchData();
  }, [dispatch]);

  const search = () => {
    // Build search parameters
    const params = new URLSearchParams();
    
    // Only include category parameter if a specific category is selected
    // When "All Categories" is selected (empty string), don't include category parameter
    if (category && category.trim() !== "") {
      params.append("category", category);
    }
    
    if (searchValue && searchValue.trim() !== "") {
      params.append("search", searchValue);
    }

    // Navigate to shops with search parameters
    const queryString = params.toString();
    navigate(`/shops${queryString ? `?${queryString}` : ""}`);
  };

  // Handle category selection
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    // No automatic navigation - user must click search button to search
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <div className="w-full">
      <Header />

      {/* Hero Section - matching BUILD BASKET design */}
      <div
        className="w-full min-h-[70vh] relative overflow-hidden"
        style={{
          backgroundImage: "url(/images/landing_page_bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* No overlay - showing full image */}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-center mb-6 leading-tight">
            <span
              className="text-white animate-pulse hover:animate-bounce inline-block transform hover:scale-105 transition-all duration-500"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                padding: "15px 25px",
                borderRadius: "15px",
                background:
                  "linear-gradient(45deg, rgba(235, 143, 52, 0.2), rgba(255, 255, 255, 0.1))",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                animation:
                  "slideInFromLeft 1s ease-out, float 3s ease-in-out infinite 2s",
              }}
            >
              Join the Finest Community of
            </span>
            <br />
            <span
              className="text-white inline-block transform hover:scale-105 transition-all duration-500"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                padding: "15px 25px",
                borderRadius: "15px",
                background:
                  "linear-gradient(45deg, rgba(235, 143, 52, 0.3), rgba(255, 255, 255, 0.2))",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                animation:
                  "slideInFromRight 1s ease-out 0.5s both, glow 2s ease-in-out infinite alternate 1.5s",
              }}
            >
              25,000+ Construction Material Suppliers
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-2xl md:text-3xl font-bold text-white text-center mb-12 max-w-4xl inline-block transform hover:scale-105 transition-all duration-500"
            style={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              padding: "20px 30px",
              borderRadius: "15px",
              background:
                "linear-gradient(45deg, rgba(235, 143, 52, 0.1), rgba(255, 255, 255, 0.05))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              animation:
                "fadeInUp 1s ease-out 1s both, pulse 3s ease-in-out infinite 2.5s",
            }}
          >
            Shop Products at Wholesale Price | Directly from Verified Sellers
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full flex justify-center pb-16 -mt-8 relative z-20">
        <div className="w-full max-w-4xl px-4">
          <div className="flex w-full bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-[200px] text-slate-600 font-semibold bg-transparent px-4 py-4 outline-0 border-none border-r border-gray-200"
            >
              <option value="">All Categories</option>
              {categorys.map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for construction materials..."
              className="flex-1 px-6 py-4 text-lg border-none outline-none text-gray-700 placeholder-gray-500"
            />

            {/* Search Button */}
            <button
              onClick={search}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 font-semibold text-lg transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search Material
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <StatisticsSection />

      <Banner />
      <Categorys />
      <div className="py-[45px]">
        <FeatureProducts products={Array.isArray(products) ? products : []} />
      </div>

      {isLoading ? (
        <div className="py-10 flex justify-center items-center">
          <div className="text-[#eba834] text-xl">Loading products...</div>
        </div>
      ) : (
        <div className="py-10">
          <div className="w-[85%] flex flex-wrap mx-auto">
            <div className="grid w-full grid-cols-3 md-lg:grid-cols-2 md:grid-cols-1 gap-7">
              <div className="overflow-hidden">
                <Products
                  title="Latest Product"
                  products={Array.isArray(latest_product) ? latest_product : []}
                />
              </div>

              <div className="overflow-hidden">
                <Products
                  title="Top Rated Product"
                  products={
                    Array.isArray(topRated_product) ? topRated_product : []
                  }
                />
              </div>

              <div className="overflow-hidden">
                <Products
                  title="Discount Product"
                  products={
                    Array.isArray(discount_product) ? discount_product : []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Customer Testimonials Section */}
      <CustomerTestimonials />

      <Footer />
    </div>
  );
};

export default Home;
