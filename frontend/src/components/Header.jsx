import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import logoImage from "../assets/cropped_circle_image.png";
import {
  FaFacebookF,
  FaList,
  FaLock,
  FaUser,
  FaHome,
  FaLinkedin,
  FaGithub,
  FaPhoneAlt,
  FaShoppingBag,
  FaListAlt,
  FaStore,
} from "react-icons/fa";
import { FaTwitter, FaHeart, FaCartShopping } from "react-icons/fa6";
import { IoMdArrowDropdown, IoIosArrowDown, IoMdLogOut } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  get_card_products,
  get_wishlist_products,
} from "../store/reducers/cardReducer";
import { user_reset } from "../store/reducers/authReducer";
import { reset_count } from "../store/reducers/cardReducer";
import api from "../api/api";
import toast from "react-hot-toast";
import {
  useHomeState,
  useAuthState,
  useCardState,
} from "../hooks/useSafeSelector";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorys } = useHomeState();
  const { userInfo } = useAuthState();
  const { card_product_count, wishlist_count } = useCardState();

  const { pathname } = useLocation();

  const [showShidebar, setShowShidebar] = useState(true);
  const [categoryShow, setCategoryShow] = useState(true);

  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");

  const search = () => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };

  const redirect_card_page = () => {
    if (userInfo) {
      navigate("/card");
    } else {
      navigate("/login");
    }
  };

  const logout = async () => {
    try {
      const { data } = await api.get("/customer/logout");
      localStorage.removeItem("customerToken");
      dispatch(user_reset());
      dispatch(reset_count());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id));
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo]);

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* Top Header */}
      <div className="header-top bg-primary">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="flex w-full justify-between items-center min-h-[50px] py-2 text-white">
            {/* Left side - Navigation buttons */}
            <div className="flex justify-start items-center gap-2 md:gap-4 lg:gap-6 flex-wrap ml-[40px]">
              <button
                onClick={() => navigate("/about")}
                className="flex justify-center items-center gap-1 text-lg md:text-xl text-white hover:text-gray-200 transition-colors cursor-pointer px-4 py-2 rounded hover:bg-white/10"
              >
                <span>About Us</span>
              </button>
              <button
                onClick={() => navigate("/prices")}
                className="flex justify-center items-center gap-1 text-lg md:text-xl text-white hover:text-gray-200 transition-colors cursor-pointer px-4 py-2 rounded hover:bg-white/10"
              >
                <span>Prices</span>
              </button>
              <button
                onClick={() => navigate("/track-order")}
                className="flex justify-center items-center gap-1 text-lg md:text-xl text-white hover:text-gray-200 transition-colors cursor-pointer px-4 py-2 rounded hover:bg-white/10"
              >
                <span>Track Order</span>
              </button>
            </div>

            {/* Right side - User actions */}
            <div className="flex justify-end items-center gap-3">
              {userInfo ? (
                <>
                  <Link
                    className="flex cursor-pointer justify-center items-center gap-2 text-lg text-white hover:text-gray-200 transition-colors"
                    to="/dashboard"
                  >
                    <span>
                      {" "}
                      <FaUser />{" "}
                    </span>
                    <span> {userInfo.name} </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex justify-center items-center gap-1 text-lg text-white hover:text-gray-200 transition-colors cursor-pointer px-4 py-2 rounded hover:bg-white/10 mr-[-93.5px]"
                  >
                    <IoMdLogOut />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex cursor-pointer justify-center items-center gap-2 text-lg text-white hover:text-gray-200 transition-colors mr-[-75px]"
                >
                  <span>
                    {" "}
                    <FaLock />{" "}
                  </span>
                  <span>Login </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-white">
        <div className="w-[85%] lg:w-[90%] mx-auto">
          <div className="h-[80px] md-lg:h-[100px] flex justify-between items-center flex-wrap">
            {/* Logo Section */}
            <div className="md-lg:w-full w-3/12 md-lg:pt-4">
              <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-4">
                  <div className="w-[110px] h-[110px] rounded-full flex items-center justify-center shadow-lg overflow-hidden ml-[-70px] mt-[-30px]">
                    <img
                      src={logoImage}
                      alt="SG Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-dark font-bold text-2xl tracking-wide">
                      BUILD
                      <FaLock className="inline-block mx-1 text-primary" />
                      BASKET
                    </span>
                  </div>
                </Link>

                <div
                  className="justify-center items-center w-[30px] h-[30px] bg-white text-slate-600 border border-slate-600 rounded-sm cursor-pointer lg:hidden md-lg:flex xl:hidden hidden"
                  onClick={() => setShowShidebar(false)}
                >
                  <span>
                    {" "}
                    <FaList />{" "}
                  </span>
                </div>
              </div>
            </div>

            {/* Search Section */}

            <div className="md-lg:hidden flex justify-center items-center text-white bg-primary relative">
              <div className="w-[95%] mx-auto ">
                <div className="flex justify-end items-center h-[70px] w-full">
                  {/* Empty space where categories button was */}
                </div>

                {/* Categories Dropdown */}
                <div
                  className={`${
                    categoryShow ? "h-0 opacity-0" : "h-[500px] opacity-100"
                  } overflow-hidden transition-all duration-300 absolute top-full left-0 z-[99999] bg-white w-[950px] h-[230px] border border-gray-200 rounded-b-lg shadow-xl`}
                >
                  <div className="w-[90%] mx-auto py-4">
                    <div className="w-full grid grid-cols-3 md-lg:grid-cols-3 md:grid-cols-2 gap-3">
                      {categorys?.map((c, i) => {
                        return (
                          <Link
                            key={i}
                            to={`/products?category=${c.name}`}
                            className="flex items-center gap-2 text-gray-700 px-3 py-2 hover:bg-primary hover:text-white rounded-md transition-all duration-200 text-sm font-medium"
                          >
                            <img
                              src={c.image}
                              className="w-[40px] h-[40px] rounded-full overflow-hidden object-cover"
                              alt=""
                            />
                            <span className="text-xs truncate">{c.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Home and Shop Links */}
            <div className="flex justify-center items-center gap-1 mr-[-100px]">
              {/* All Categories Button */}
              <div
                className="flex justify-center items-center gap-1 text-lg text-primary hover:text-primary-dark transition-colors cursor-pointer px-4 py-2 rounded hover:bg-primary/10"
                onClick={() => setCategoryShow(!categoryShow)}
              >
                <FaList className="text-lg" />
                <span>All Categories</span>
                <IoMdArrowDropdown className="text-sm" />
              </div>

              {/* My Orders Button */}
              {userInfo ? (
                <Link
                  to="/dashboard/my-orders"
                  className="flex justify-center items-center gap-1 text-lg text-primary hover:text-primary-dark transition-colors cursor-pointer px-4 py-2 rounded hover:bg-primary/10"
                >
                  <FaShoppingBag className="text-lg" />
                  <span>My Orders</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex justify-center items-center gap-1 text-lg text-primary hover:text-primary-dark transition-colors cursor-pointer px-4 py-2 rounded hover:bg-primary/10"
                >
                  <FaShoppingBag className="text-lg" />
                  <span>My Orders</span>
                </Link>
              )}

              {/* Wishlist Button */}
              {userInfo ? (
                <Link
                  to="/dashboard/my-wishlist"
                  className="flex justify-center items-center gap-1 text-lg text-primary hover:text-primary-dark transition-colors cursor-pointer px-4 py-2 rounded hover:bg-primary/10"
                >
                  <FaHeart className="text-lg" />
                  <span>Wishlist</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex justify-center items-center gap-1 text-lg text-primary hover:text-primary-dark transition-colors cursor-pointer px-4 py-2 rounded hover:bg-primary/10"
                >
                  <FaHeart className="text-lg" />
                  <span>Wishlist</span>
                </Link>
              )}

              {/* Home Button */}
              {/* <Link
                to="/"
                className="flex justify-center items-center gap-1 text-lg text-primary hover:text-primary-light transition-colors cursor-pointer px-6 py-2 rounded hover:bg-white/10"
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </Link> */}
              <Link
                to="/shops"
                className="flex justify-center items-center gap-1 text-lg text-primary hover:text-primary-dark transition-colors cursor-pointer px-6 py-2 rounded hover:bg-primary/10"
              >
                <FaStore className="text-lg" />
                <span>Shop</span>
              </Link>
            </div>

            {/* Logout Button - Right Side */}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="hidden md-lg:block">
        <div
          onClick={() => setShowShidebar(true)}
          className={`fixed duration-200 transition-all ${
            showShidebar ? "invisible" : "visible"
          } hidden md-lg:block w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 z-20 `}
        ></div>

        <div
          className={`w-[300px] z-[9999] transition-all duration-200 fixed ${
            showShidebar ? "-left-[300px]" : "left-0 top-0"
          } overflow-y-auto bg-white h-screen py-6 px-8 `}
        >
          <div className="flex justify-start flex-col gap-6">
            <Link to="/" className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={logoImage}
                  alt="SG Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center">
                <span className="text-dark font-bold text-2xl tracking-wide">
                  BUILD
                  <FaLock className="inline-block mx-1 text-primary" />
                  BASKET
                </span>
              </div>
            </Link>

            <div className="flex justify-start items-center gap-10">
              {userInfo ? (
                <>
                  <Link
                    className="flex cursor-pointer justify-center items-center gap-3 text-lg font-semibold text-dark hover:text-primary transition-colors"
                    to="/dashboard"
                  >
                    <span className="text-xl">
                      <FaUser />
                    </span>
                    <span>{userInfo.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 text-slate-600 hover:text-red-500 hover:bg-red-50 flex items-center gap-3"
                  >
                    <IoMdLogOut className="text-lg" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  className="flex cursor-pointer justify-center items-center gap-3 text-lg font-semibold text-dark hover:text-primary transition-colors"
                  to="/login"
                >
                  <span className="text-xl">
                    <FaLock />
                  </span>
                  <span>Login</span>
                </Link>
              )}
            </div>

            <ul className="flex flex-col justify-start items-start text-lg font-bold uppercase gap-2">
              {/* My Orders */}
              <li>
                {userInfo ? (
                  <Link
                    to="/dashboard/my-orders"
                    className={`py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 flex items-center gap-3 ${
                      pathname === "/dashboard/my-orders"
                        ? "text-primary bg-primary/10 border-l-4 border-primary"
                        : "text-slate-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <FaShoppingBag className="text-lg" />
                    My Orders
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 text-slate-600 hover:text-primary hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FaShoppingBag className="text-lg" />
                    My Orders
                  </Link>
                )}
              </li>

              {/* Wishlist */}
              <li>
                {userInfo ? (
                  <Link
                    to="/dashboard/my-wishlist"
                    className={`py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 flex items-center gap-3 ${
                      pathname === "/dashboard/my-wishlist"
                        ? "text-primary bg-primary/10 border-l-4 border-primary"
                        : "text-slate-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <FaHeart className="text-lg" />
                    Wishlist
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 text-slate-600 hover:text-primary hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FaHeart className="text-lg" />
                    Wishlist
                  </Link>
                )}
              </li>

              {/* Home */}
              <li>
                <Link
                  to="/"
                  className={`py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 flex items-center gap-3 ${
                    pathname === "/"
                      ? "text-primary bg-primary/10 border-l-4 border-primary"
                      : "text-slate-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <FaHome className="text-lg" />
                  Home
                </Link>
              </li>

              {/* Shop */}
              <li>
                <Link
                  to="/shops"
                  className={`py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 flex items-center gap-3 ${
                    pathname === "/shops"
                      ? "text-primary bg-primary/10 border-l-4 border-primary"
                      : "text-slate-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <FaStore className="text-lg" />
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 ${
                    pathname === "/about"
                      ? "text-primary bg-primary/10 border-l-4 border-primary"
                      : "text-slate-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/prices"
                  className={`py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 ${
                    pathname === "/prices"
                      ? "text-primary bg-primary/10 border-l-4 border-primary"
                      : "text-slate-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  Prices
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className={`py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 ${
                    pathname === "/track-order"
                      ? "text-primary bg-primary/10 border-l-4 border-primary"
                      : "text-slate-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  Track Order
                </Link>
              </li>

              {/* Logout Button - Mobile Sidebar */}
              {userInfo && (
                <li>
                  <button
                    onClick={logout}
                    className="w-full py-3 px-4 block text-lg font-semibold rounded-lg transition-all duration-300 text-slate-600 hover:text-primary hover:bg-gray-50 flex items-center gap-3"
                  >
                    <IoMdLogOut className="text-lg" />
                    Logout
                  </button>
                </li>
              )}
            </ul>

            <div className="flex justify-start items-center gap-6 text-dark">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <FaLinkedin className="text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <FaGithub className="text-lg" />
              </a>
            </div>

            <div className="w-full flex justify-end md-lg:justify-start gap-4 items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-[56px] h-[56px] rounded-full flex bg-primary justify-center items-center">
                <span className="text-white text-xl">
                  <FaPhoneAlt />
                </span>
              </div>
              <div className="flex justify-end flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-700">
                  +134343455
                </h2>
                <span className="text-sm text-slate-500">Support 24/7</span>
              </div>
            </div>

            <div className="flex flex-col justify-start items-start gap-3 text-[#1c1c1c] p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-start items-center gap-3 text-base">
                <span className="text-primary text-xl">
                  <MdEmail />
                </span>
                <span className="font-medium">support@buildbasket.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
