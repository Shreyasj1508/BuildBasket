import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEye, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import moment from "moment";

const Orders = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Fetching ONLY from backend database...");

      const response = await fetch(`http://localhost:5000/api/seller/orders`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🗃️ Backend database response:", data);

      if (data.success && data.orders) {
        setOrders(data.orders);
        console.log("✅ Database orders loaded:", data.orders.length);
        console.log("📦 Orders from database:", data.orders);
      } else {
        setOrders([]);
        console.log("⚠️ No orders in database");
      }
    } catch (err) {
      console.error("❌ Database fetch error:", err);
      setError(`Database connection failed: ${err.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo?._id]);

  useEffect(() => {
    console.log("🚀 Component mounted, fetching from database only");
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/seller/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: status }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update the order in local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, delivery_status: status }
              : order
          )
        );
        alert("Order status updated successfully!");
      } else {
        alert(data.error || "Failed to update order status");
      }
    } catch (err) {
      alert("Failed to update order status");
      console.error("Update order error:", err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", icon: MdPending },
      processing: { color: "bg-blue-500", icon: FaTruck },
      delivered: { color: "bg-green-500", icon: FaCheckCircle },
      cancelled: { color: "bg-red-500", icon: FaTimesCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`${config.color} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}
      >
        <Icon className="text-xs" />
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const color = status === "paid" ? "bg-green-500" : "bg-yellow-500";
    return (
      <span className={`${color} text-white px-2 py-1 rounded text-xs`}>
        {status}
      </span>
    );
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(
    (order) => filterStatus === "all" || order.delivery_status === filterStatus
  );

  if (loading) {
    return (
      <div className="px-2 md:px-7 py-5">
        <div className="w-full bg-white rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Orders</h2>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-7 py-5 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
              <FaTruck className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
              <p className="text-sm text-gray-600">
                Manage and track your orders from database
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                {filteredOrders.length} orders
              </span>
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                {filteredOrders.reduce(
                  (sum, order) => sum + (order.products?.length || 0),
                  0
                )}{" "}
                products
              </span>
            </div>
          </div>
        </div>


        {/* Filter */}
        <div className="flex gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Filter by status:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>



        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                {/* Order Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                      <FaTruck className="text-white text-sm" />
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(order.delivery_status)}
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    Order #{order._id.substring(0, 8)}...
                  </h3>
                  <p className="text-sm text-gray-600">
                    {moment(order.createdAt).format("MMM Do, h:mm a")}
                  </p>
                </div>

                {/* Order Details - Compact */}
                <div className="space-y-3 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Customer
                    </h4>
                    <p className="text-sm text-gray-700 font-medium">
                      {order.customerInfo?.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customerInfo?.email || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Shipping
                    </h4>
                    <p className="text-xs text-gray-700">
                      {order.shippingInfo?.address?.substring(0, 50) || "N/A"}
                      ...
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.shippingInfo?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Summary
                    </h4>
                    <p className="text-sm text-gray-700">
                      Items: {order.products?.length || 0}
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      ₹{order.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>

                {/* Products - Individual Square Boxes */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Products ({order.products?.length || 0})
                  </h4>

                  {/* Individual Product Square Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.products?.map((product, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:scale-105"
                      >
                        {/* Product Image */}
                        <div className="relative mb-4">
                          <img
                            src={
                              product.images?.[0] || "/images/placeholder.jpg"
                            }
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg shadow-md border border-gray-200"
                          />
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full shadow-lg">
                            Qty: {product.quantity}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-3">
                          {/* Product Name */}
                          <h5 className="font-bold text-lg text-gray-800 leading-tight">
                            {product.name}
                          </h5>

                          {/* Category & Brand */}
                          <div className="flex flex-col gap-2">
                            <div className="bg-blue-100 text-blue-800 text-sm px-3 py-2 rounded-lg font-medium text-center border border-blue-200">
                              📦 Category:{" "}
                              {product.category || "Construction Material"}
                            </div>
                            <div className="bg-green-100 text-green-800 text-sm px-3 py-2 rounded-lg font-medium text-center border border-green-200">
                              🏷️ Brand: {product.brand || "Generic"}
                            </div>
                          </div>

                          {/* Price Information */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                            <div className="text-center">
                              <p className="font-bold text-2xl text-green-600 mb-1">
                                ₹{(product.price * product.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                ₹{product.price?.toFixed(2)} per unit ×{" "}
                                {product.quantity} units
                              </p>
                            </div>
                          </div>

                          {/* Product Specifications */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 text-center">
                              <span className="font-semibold text-blue-700 block">
                                Quantity
                              </span>
                              <span className="text-blue-600 font-bold">
                                {product.quantity} units
                              </span>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-lg border border-purple-200 text-center">
                              <span className="font-semibold text-purple-700 block">
                                Unit Price
                              </span>
                              <span className="text-purple-600 font-bold">
                                ₹{product.price?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Product ID */}
                          {product.productId && (
                            <div className="bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-lg text-center border border-gray-200">
                              <span className="font-semibold">Product ID:</span>{" "}
                              {product.productId.toString().substring(0, 8)}...
                            </div>
                          )}

                          {/* Product Status */}
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-2 rounded-lg border border-yellow-200 text-center">
                            <span className="text-yellow-800 text-sm font-medium">
                              ✅ Available in Stock
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary Card */}
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="text-blue-700">
                        <div className="text-2xl font-bold text-blue-800">
                          {order.products?.length || 0}
                        </div>
                        <div className="text-sm font-medium">
                          Total Products
                        </div>
                      </div>
                      <div className="text-blue-700">
                        <div className="text-2xl font-bold text-blue-800">
                          {order.products?.reduce(
                            (sum, p) => sum + (p.quantity || 0),
                            0
                          )}
                        </div>
                        <div className="text-sm font-medium">Total Units</div>
                      </div>
                      <div className="text-blue-700">
                        <div className="text-2xl font-bold text-blue-800">
                          ₹{order.price?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-sm font-medium">Order Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-200">
                  <Link
                    to={`/seller/dashboard/order/details/${order._id}`}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FaEye className="text-sm" />
                    View Details
                  </Link>

                  <div className="flex gap-2">
                    {order.delivery_status === "pending" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "processing")
                        }
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <FaTruck className="text-xs" />
                        Process
                      </button>
                    )}

                    {order.delivery_status === "processing" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "delivered")
                        }
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <FaCheckCircle className="text-xs" />
                        Deliver
                      </button>
                    )}

                    {(order.delivery_status === "pending" ||
                      order.delivery_status === "processing") && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to cancel this order?"
                            )
                          ) {
                            updateOrderStatus(order._id, "cancelled");
                          }
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <FaTimesCircle className="text-xs" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FaTruck className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No orders found
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              {filterStatus === "all"
                ? "No customer orders found in database. Orders will appear here when customers place orders from your products."
                : `No orders with status "${filterStatus}" found. Try changing the filter.`}
            </p>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Show All Orders
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
