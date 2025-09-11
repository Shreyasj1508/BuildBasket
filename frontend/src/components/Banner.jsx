import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { get_banners } from "../store/reducers/homeReducer";
import { useHomeState } from "../hooks/useSafeSelector";
import { FaArrowRight, FaShoppingCart, FaTools, FaBolt } from "react-icons/fa";

const Banner = () => {
  const dispatch = useDispatch();
  const { banners } = useHomeState();

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

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        await dispatch(get_banners());
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    // Add a small delay to ensure store is initialized
    const timer = setTimeout(() => {
      fetchBanners();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full md-lg:mt-6">
      <div className="w-[85%] lg:w-[90%] mx-auto">
        <div className="w-full flex flex-wrap md-lg:gap-8">
          <div className="w-full">
            <div className="my-8">
              <Carousel
                autoPlay={true}
                infinite={true}
                arrows={true}
                showDots={true}
                responsive={responsive}
                className="banner-carousel"
              >
                {/* Banner 1 - Cement & Concrete */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <div
                    className="w-full h-[400px] md:h-[350px] sm:h-[300px] bg-gradient-to-br from-primary/90 via-primary to-primary-dark flex items-center"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, rgba(235, 143, 52, 0.9), rgba(209, 122, 30, 0.95)), url("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&h=400&fit=crop")',
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                    <div className="relative z-10 px-8 md:px-12 text-white w-full flex items-center justify-between">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          <FaShoppingCart className="text-3xl text-white/90" />
                          <span className="text-lg font-semibold text-white/90">
                            Cement & Concrete
                          </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                          Premium Cement & Concrete
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                          High-quality cement, ready-mix concrete, and concrete
                          materials for your construction projects
                        </p>
                        <div className="flex justify-start">
                          <Link
                            to="/shops?category=Cement & Concrete"
                            className="group bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            Shop All Materials
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                      <div className="ml-16">
                        <img
                          src="/images/cement.png"
                          alt="Cement & Concrete"
                          className="w-48 h-48 lg:w-64 lg:h-64 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner 2 - Steel & Iron */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <div
                    className="w-full h-[400px] md:h-[350px] sm:h-[300px] bg-gradient-to-br from-primary-light/90 via-primary to-primary-dark flex items-center"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, rgba(245, 165, 90, 0.9), rgba(235, 143, 52, 0.95)), url("https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&h=400&fit=crop")',
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                    <div className="relative z-10 px-8 md:px-12 text-white w-full flex items-center justify-between">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          <FaTools className="text-3xl text-white/90" />
                          <span className="text-lg font-semibold text-white/90">
                            Steel & Iron
                          </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                          Premium Steel & Iron
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                          High-grade steel bars, iron rods, structural steel,
                          and metal products for construction
                        </p>
                        <div className="flex justify-start">
                          <Link
                            to="/shops?category=Steel & Iron"
                            className="group bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            Shop All Materials
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                      <div className="ml-8">
                        <img
                          src="/images/steel.png"
                          alt="Steel & Iron"
                          className="w-48 h-48 lg:w-64 lg:h-64 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner 3 - Bricks & Blocks */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <div
                    className="w-full h-[400px] md:h-[350px] sm:h-[300px] bg-gradient-to-br from-primary-dark/90 via-primary to-primary-light flex items-center"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, rgba(209, 122, 30, 0.9), rgba(235, 143, 52, 0.95)), url("https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=400&fit=crop")',
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                    <div className="relative z-10 px-8 md:px-12 text-white w-full flex items-center justify-between">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          <FaBolt className="text-3xl text-white/90" />
                          <span className="text-lg font-semibold text-white/90">
                            Bricks & Blocks
                          </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                          Premium Bricks & Blocks
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                          High-quality clay bricks, concrete blocks, and masonry
                          materials for strong foundations
                        </p>
                        <div className="flex justify-start">
                          <Link
                            to="/shops?category=Bricks & Blocks"
                            className="group bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            Shop All Materials
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                      <div className="ml-8">
                        <img
                          src="/images/bricks.png"
                          alt="Bricks & Blocks"
                          className="w-48 h-48 lg:w-64 lg:h-64 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Banner;
