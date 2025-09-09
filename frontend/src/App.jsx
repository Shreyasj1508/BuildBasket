import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Shops from "./pages/Shops";
import Card from "./pages/Card";
import Shipping from "./pages/Shipping";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Prices from "./pages/Prices";
import TrackOrder from "./pages/TrackOrder";
import { get_category } from "./store/reducers/homeReducer";
import { useDispatch } from "react-redux";
import CategoryShop from "./pages/CategoryShop";
import SearchProducts from "./pages/SearchProducts";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import MyOrders from "./pages/MyOrders";
import ProtectUser from "./utils/ProtectUser";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Orders";
import ChangePassword from "./components/dashboard/ChangePassword";
import Wishlist from "./components/dashboard/Wishlist";
import OrderDetails from "./components/dashboard/OrderDetails";
import Chat from "./components/dashboard/Chat";
import ConfirmOrder from "./pages/ConfirmOrder";
import ReduxErrorBoundary from "./components/ReduxErrorBoundary";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Add a small delay to ensure store is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check if dispatch is available before using it
        if (dispatch && typeof dispatch === "function") {
          dispatch(get_category());
        }

        // Check if current path is admin dashboard and redirect to login
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []); // Remove dispatch from dependencies to prevent re-runs

  return (
    <ReduxErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/card" element={<Card />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/about" element={<About />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/products?" element={<CategoryShop />} />
          <Route path="/products/search?" element={<SearchProducts />} />
          <Route path="/product/details/:slug" element={<Details />} />
          <Route path="/order/confirm?" element={<ConfirmOrder />} />

          <Route path="/dashboard" element={<ProtectUser />}>
            <Route path="" element={<Dashboard />}>
              <Route path="" element={<DashboardHome />} />
              <Route path="my-orders" element={<MyOrders />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="my-wishlist" element={<Wishlist />} />
              <Route path="order-details/:orderId" element={<OrderDetails />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:sellerId" element={<Chat />} />
            </Route>
          </Route>

          {/* Admin routes - redirect to login */}
          <Route path="/admin/*" element={<Navigate to="/login" replace />} />

          {/* Catch-all route for undefined paths - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ReduxErrorBoundary>
  );
}

export default App;
