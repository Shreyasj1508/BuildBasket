import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaList } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoIosHome } from "react-icons/io";
import { FaBorderAll } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { user_reset } from "../store/reducers/authReducer";
import { reset_count } from "../store/reducers/cardReducer";
import { get_customer_dashboard_data } from "../store/reducers/orderReducer";
import { useAuthState } from "../hooks/useSafeSelector";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [filterShow, setFilterShow] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [trackingOrder, setTrackingOrder] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useAuthState();
  const { dashboardData, loader } = useSelector((state) => state.order);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      dispatch(get_customer_dashboard_data(userInfo.id));
    }
  }, [userInfo, dispatch]);

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

  const trackOrder = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    try {
      const { data } = await api.get(
        `/home/customer/get-order-details/${orderId}`
      );
      setTrackingOrder(data.order);
      toast.success("Order found!");
    } catch (error) {
      toast.error("Order not found. Please check your order ID.");
      setTrackingOrder(null);
    }
  };

  return (
    <div>
      <Header />

      

      <div className="bg-slate-200 mt-5">
        <div className="w-[90%] mx-auto md-lg:block hidden">
          <div>
            <button
              onClick={() => setFilterShow(!filterShow)}
              className="text-center py-3 px-3 bg-green-500 text-white"
            >
              <FaList />{" "}
            </button>
          </div>
        </div>

        <div className="h-full mx-auto">
          <div className="py-5 flex md-lg:w-[90%] mx-auto relative">
            <div
              className={`rounded-md z-50 md-lg:absolute ${
                filterShow ? "-left-4" : "-left-[360px]"
              } w-[270px] ml-4 bg-white`}
            >
              <ul className="py-2 text-slate-600 px-4">
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <IoIosHome />
                  </span>
                  <Link to="/dashboard" className="block">
                    Dashboard{" "}
                  </Link>
                </li>
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <FaBorderAll />
                  </span>
                  <Link to="/dashboard/my-orders" className="block">
                    My Orders{" "}
                  </Link>
                </li>
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <FaHeart />
                  </span>
                  <Link to="/dashboard/my-wishlist" className="block">
                    Wishlist{" "}
                  </Link>
                </li>
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <IoChatbubbleEllipsesSharp />
                  </span>
                  <Link to="/dashboard/chat" className="block">
                    Chat{" "}
                  </Link>
                </li>
                <li className="flex justify-start items-center gap-2 py-2">
                  <span className="text-xl">
                    <RiLockPasswordLine />
                  </span>
                  <Link to="/dashboard/change-password" className="block">
                    Change Password{" "}
                  </Link>
                </li>
                <li
                  onClick={logout}
                  className="flex justify-start items-center gap-2 py-2 cursor-pointer"
                >
                  <span className="text-xl">
                    <IoMdLogOut />
                  </span>
                  <div className="block">Logout </div>
                </li>
              </ul>

              {/* Quick Order Tracking */}
              <div className="px-4 py-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Track Order
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Order ID"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => e.key === "Enter" && trackOrder()}
                  />
                  <button
                    onClick={trackOrder}
                    disabled={loader}
                    className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    <FaSearch />
                  </button>
                </div>

                {trackingOrder && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTruck className="text-green-600" />
                      <span className="font-semibold text-green-800">
                        Found
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      #{trackingOrder._id}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        trackingOrder.delivery_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : trackingOrder.delivery_status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {trackingOrder.delivery_status}
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/track-order?orderId=${trackingOrder._id}`)
                      }
                      className="text-xs text-primary hover:underline mt-2"
                    >
                      Details →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[calc(100%-270px)] md-lg:w-full">
              <div className="mx-4 md-lg:mx-0">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
