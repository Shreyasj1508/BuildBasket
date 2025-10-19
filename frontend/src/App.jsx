import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CommissionProvider } from "./context/CommissionContext";
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
import PaymentPage from "./pages/PaymentPage";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import CustomerOrderDashboard from "./components/CustomerOrderDashboard";
import ProtectUser from "./utils/ProtectUser";
import Index from "./components/dashboard/Index";
import Orders from "./components/dashboard/Orders";
import ChangePassword from "./components/dashboard/ChangePassword";
import Wishlist from "./components/dashboard/Wishlist";
import OrderDetails from "./components/dashboard/OrderDetails";
import Chat from "./components/dashboard/Chat";
import ConfirmOrder from "./pages/ConfirmOrder";
import PriceDetail from "./pages/PriceDetail";
import PriceHistory from "./pages/PriceHistory";
import ReduxErrorBoundary from "./components/ReduxErrorBoundary";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (dispatch && typeof dispatch === "function") {
          dispatch(get_category());
        }
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };
    initializeApp();
  }, []);

  return (
    <ReduxErrorBoundary>
      <CommissionProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/card" element={<Card />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-page" element={<PaymentPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/products?" element={<CategoryShop />} />
          <Route path="/products/search?" element={<SearchProducts />} />
          <Route path="/product/details/:slug" element={<Details />} />
          <Route path="/price-detail/:productId" element={<PriceDetail />} />
          <Route path="/price-history/:productId" element={<PriceHistory />} />
          <Route path="/order/confirm?" element={<ConfirmOrder />} />

          <Route path="/dashboard" element={<ProtectUser />}>
            <Route path="" element={<Dashboard />}>
              <Route path="" element={<DashboardHome />} />
              <Route path="my-orders" element={<CustomerOrderDashboard />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="my-wishlist" element={<Wishlist />} />
              <Route path="order-details/:orderId" element={<OrderDetails />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:sellerId" element={<Chat />} />
            </Route>
          </Route>

          <Route path="/admin/*" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </CommissionProvider>
    </ReduxErrorBoundary>
  );
}

export default App;
