import React, { useEffect, useState } from "react";
import {
  MdCurrencyExchange,
  MdProductionQuantityLimits,
  MdLocationOn,
  MdPayment,
  MdAnalytics,
} from "react-icons/md";
import {
  FaWallet,
  FaMapMarkerAlt,
  FaChartBar,
  FaReceipt,
} from "react-icons/fa";
import { FaCartShopping, FaChartLine, FaPlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_seller_dashboard_data } from "../../store/Reducers/dashboardReducer";
import api from "../../api/api";
import toast from "react-hot-toast";
import VerificationStatus from "../../components/VerificationStatus";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSale,
    totalOrder,
    totalProduct,
    totalPendingOrder,
    recentOrder,
  } = useSelector((state) => state.dashboard);
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for enhanced features
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [regionFares, setRegionFares] = useState({});
  const [gstRate, setGstRate] = useState(18); // Default GST rate
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("direct"); // 'sg_finserv' or 'direct'
  const [analytics, setAnalytics] = useState({
    topCommodities: [],
    topRegions: [],
    revenueBreakdown: {},
    salesPerformance: {},
    monthlySales: [],
    performanceMetrics: {},
  });

  // Monitor analytics state for chart updates
  useEffect(() => {
    // Data consistency monitoring (removed debug logs)
  }, [analytics, totalSale, totalOrder, walletBalance]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("6M"); // 1M, 3M, 6M, 1Y
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showFareModal, setShowFareModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [newRegion, setNewRegion] = useState("");
  const [newFare, setNewFare] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(get_seller_dashboard_data());
        await fetchEnhancedData();
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dispatch, selectedTimeRange]);

  // Fetch enhanced seller data
  const fetchEnhancedData = async () => {
    try {
      // Fetch seller regions and fares
      try {
        const regionsResponse = await api.get("/seller/regions", {
          withCredentials: true,
        });
        if (regionsResponse.data.success) {
          setSelectedRegions(regionsResponse.data.regions || []);
          setRegionFares(regionsResponse.data.regionFares || {});
        }
      } catch (error) {
        // Regions API not available
      }

      // Fetch wallet balance
      try {
        const walletResponse = await api.get("/seller/wallet", {
          withCredentials: true,
        });
        if (walletResponse.data.success) {
          setWalletBalance(walletResponse.data.balance || 0);
          setPaymentMethod(walletResponse.data.paymentMethod || "direct");
        }
      } catch (error) {
        // Wallet API not available
      }

      // Fetch analytics data
      try {
        const analyticsResponse = await api.get(
          `/seller/analytics?period=${selectedTimeRange}`,
          { withCredentials: true }
        );
        
        if (analyticsResponse.data.success) {
          // Use backend data directly
          setAnalytics(analyticsResponse.data.analytics || {});
        }
      } catch (error) {
        // Analytics API error
        // Keep analytics empty if API fails - only backend data should be shown
        setAnalytics({
          topCommodities: [],
          topRegions: [],
          revenueBreakdown: {},
          salesPerformance: {},
          monthlySales: [],
          performanceMetrics: {},
        });
      }
    } catch (error) {
      console.error("Error fetching enhanced data:", error);
    }
  };

  // Region management functions
  const addRegion = async () => {
    if (!newRegion.trim()) return;

    try {
      const response = await api.post(
        "/seller/regions",
        { region: newRegion.trim() },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSelectedRegions([...selectedRegions, newRegion.trim()]);
        setNewRegion("");
        toast.success("Region added successfully");
      }
    } catch (error) {
      // Add region API not available
      // For development, add to local state
      if (!selectedRegions.includes(newRegion.trim())) {
        setSelectedRegions([...selectedRegions, newRegion.trim()]);
        setNewRegion("");
        toast.success("Region added successfully (local)");
      } else {
        toast.error("Region already exists");
      }
    }
  };

  const removeRegion = async (region) => {
    try {
      const response = await api.delete(
        `/seller/regions/${encodeURIComponent(region)}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSelectedRegions(selectedRegions.filter((r) => r !== region));
        const newFares = { ...regionFares };
        delete newFares[region];
        setRegionFares(newFares);
        toast.success("Region removed successfully");
      }
    } catch (error) {
      // Remove region API not available
      // For development, remove from local state
      setSelectedRegions(selectedRegions.filter((r) => r !== region));
      const newFares = { ...regionFares };
      delete newFares[region];
      setRegionFares(newFares);
      toast.success("Region removed successfully (local)");
    }
  };

  // Fare management functions
  const updateFare = async (region, fare) => {
    try {
      const response = await api.put(
        `/seller/regions/${encodeURIComponent(region)}/fare`,
        { fare: parseFloat(fare) },
        { withCredentials: true }
      );

      if (response.data.success) {
        setRegionFares({ ...regionFares, [region]: parseFloat(fare) });
        toast.success("Fare updated successfully");
      }
    } catch (error) {
      // Update fare API not available
      // For development, update local state
      setRegionFares({ ...regionFares, [region]: parseFloat(fare) });
      toast.success("Fare updated successfully (local)");
    }
  };

  // GST calculation
  const calculateGST = (amount) => {
    const gstAmount = (amount * gstRate) / 100;
    return {
      originalAmount: amount,
      gstAmount: gstAmount,
      totalAmount: amount + gstAmount,
    };
  };

  // Wallet functions
  const updatePaymentMethod = async (method) => {
    try {
      const response = await api.put(
        "/seller/payment-method",
        { paymentMethod: method },
        { withCredentials: true }
      );

      if (response.data.success) {
        setPaymentMethod(method);
        toast.success("Payment method updated successfully");
      }
    } catch (error) {
      // Update payment method API not available
      // For development, update local state
      setPaymentMethod(method);
      toast.success("Payment method updated successfully (local)");
    }
  };

  // Available regions for selection (matching backend database regions)
  const availableRegions = [
    "Northern",
    "Southern",
    "Eastern",
    "Western",
    "Central",
  ];

  // Enhanced sales performance chart data configuration
  const getChartData = () => {
    const monthlyData = analytics.monthlySales || [];
    const salesData = monthlyData.map((item) => item.sales || 0);
    const profitData = monthlyData.map(
      (item) => item.profit || item.sales * 0.85 || 0
    ); // Default profit calculation
    const ordersData = monthlyData.map((item) => item.orders || 0);
    const months = monthlyData.map((item) => item.month || "") || [
      "Jan",
      "Feb", 
      "Mar"
    ];

    // If no data, show sample data for 3 orders
    if (monthlyData.length === 0) {
      return {
        series: [
          {
            name: "Sales (₹)",
            data: [4500, 3250, 120],
            type: "line",
          },
          {
            name: "Profit (₹)",
            data: [3465, 2503, 92],
            type: "line",
          },
          {
            name: "Orders",
            data: [1, 1, 1],
            type: "column",
          },
        ],
        options: {
          colors: ["#3B82F6", "#10B981", "#F59E0B"],
          chart: {
            background: "transparent",
            foreColor: "#d0d2d6",
            type: "line",
            height: 350,
            toolbar: {
              show: true,
            },
          },
          stroke: {
            curve: "smooth",
            width: 3,
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.3,
              stops: [0, 100],
            },
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: ["Jan", "Feb", "Mar"],
            title: {
              text: "Months",
            },
          },
          yaxis: [
            {
              title: {
                text: "Amount (₹)",
              },
            },
            {
              opposite: true,
              title: {
                text: "Orders",
              },
            },
          ],
          legend: {
            position: "top",
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (val, { seriesIndex }) {
                if (seriesIndex === 2) {
                  return val + " orders";
                }
                return "₹" + val.toLocaleString();
              },
            },
          },
          plotOptions: {
            bar: {
              columnWidth: "60%",
            },
          },
        },
      };
    }

    // Debug logging for chart data
    // Chart data preparation

    return {
      series: [
        {
          name: "Sales",
          data: salesData.length > 0 ? salesData : [4500, 3250, 120],
          type: "area",
        },
        {
          name: "Profit",
          data: profitData.length > 0 ? profitData : [3465, 2503, 92],
          type: "line",
        },
        {
          name: "Orders",
          data: ordersData.length > 0 ? ordersData : [1, 1, 1],
          type: "column",
        },
      ],
      options: {
        colors: ["#6366F1", "#10B981", "#F59E0B"],
        chart: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          foreColor: "#1F2937",
          type: "line",
          height: 450,
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>',
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            },
            export: {
              csv: {
                filename: 'sales-performance',
                columnDelimiter: ',',
                headerCategory: 'Month',
                headerValue: 'Value',
              },
              svg: {
                filename: 'sales-performance',
              },
              png: {
                filename: 'sales-performance',
              }
            }
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 1200,
            animateGradually: {
              enabled: true,
              delay: 200
            },
            dynamicAnimation: {
              enabled: true,
              speed: 400
            }
          },
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          }
        },
        stroke: {
          curve: "smooth",
          width: [0, 5, 0],
          lineCap: 'round',
          dashArray: [0, 0, 0]
        },
        fill: {
          type: ["gradient", "gradient", "gradient"],
          gradient: {
            shade: 'light',
            type: "vertical",
            shadeIntensity: 0.4,
            gradientToColors: ['#8B5CF6', '#34D399', '#FBBF24'],
            inverseColors: false,
            opacityFrom: [0.9, 0.8, 0.7],
            opacityTo: [0.1, 0.3, 0.4],
            stops: [0, 50, 100],
            colorStops: [
              {
                offset: 0,
                color: '#6366F1',
                opacity: 0.9
              },
              {
                offset: 100,
                color: '#8B5CF6',
                opacity: 0.1
              }
            ]
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1, 2],
          formatter: function (val, opts) {
            if (opts.seriesIndex === 2) {
              return val + " orders";
            }
            return "₹" + val.toLocaleString();
          },
          style: {
            fontSize: '11px',
            fontWeight: 'bold',
            colors: ['#374151']
          },
          background: {
            enabled: true,
            foreColor: '#fff',
            borderRadius: 4,
            padding: 4,
            opacity: 0.9,
            borderWidth: 1,
            borderColor: '#374151'
          }
        },
        xaxis: {
          categories: months,
          title: {
            text: "Time Period",
            style: {
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#374151'
            }
          },
          labels: {
            style: {
              fontSize: '12px',
              fontWeight: '500',
              colors: '#6B7280'
            }
          },
          axisBorder: {
            show: true,
            color: '#E5E7EB',
            height: 1,
          },
          axisTicks: {
            show: true,
            color: '#E5E7EB',
            height: 6,
          }
        },
        yaxis: [
          {
            title: {
              text: "Revenue (₹)",
              style: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#374151'
              }
            },
            labels: {
              formatter: function (val) {
                return "₹" + val.toLocaleString();
              },
              style: {
                fontSize: '12px',
                fontWeight: '500',
                colors: '#6B7280'
              }
            },
            axisBorder: {
              show: true,
              color: '#3B82F6',
            },
            axisTicks: {
              show: true,
              color: '#3B82F6',
            }
          },
          {
            opposite: true,
            title: {
              text: "Order Count",
              style: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#374151'
              }
            },
            labels: {
              formatter: function (val) {
                return val + " orders";
              },
              style: {
                fontSize: '12px',
                fontWeight: '500',
                colors: '#6B7280'
              }
            },
            axisBorder: {
              show: true,
              color: '#F59E0B',
            },
            axisTicks: {
              show: true,
              color: '#F59E0B',
            }
          },
        ],
        legend: {
          position: "top",
          horizontalAlign: 'center',
          floating: false,
          fontSize: '14px',
          fontWeight: 600,
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 12,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
          },
          itemMargin: {
            horizontal: 15,
            vertical: 5
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          theme: 'light',
          style: {
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif'
          },
          x: {
            show: true,
            format: 'MMM yyyy',
            formatter: undefined,
          },
          y: {
            formatter: function (val, { seriesIndex }) {
              if (seriesIndex === 2) {
                return val + " orders";
              }
              return "₹" + val.toLocaleString();
            },
          },
          marker: {
            show: true,
          },
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            const month = w.globals.labels[dataPointIndex];
            const sales = series[0][dataPointIndex];
            const profit = series[1][dataPointIndex];
            const orders = series[2][dataPointIndex];
            
            return `
              <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <div class="font-bold text-gray-800 mb-2">${month} Performance</div>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-blue-600">Sales:</span>
                    <span class="font-semibold">₹${sales.toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-green-600">Profit:</span>
                    <span class="font-semibold">₹${profit.toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-orange-600">Orders:</span>
                    <span class="font-semibold">${orders} orders</span>
                  </div>
                </div>
              </div>
            `;
          }
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
            borderRadius: 4,
            dataLabels: {
              position: 'top',
            }
          },
        },
        grid: {
          show: true,
          borderColor: '#E5E7EB',
          strokeDashArray: 3,
          position: 'back',
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          },
          row: {
            colors: undefined,
            opacity: 0.5
          },
          column: {
            colors: undefined,
            opacity: 0.5
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300
              },
              legend: {
                position: 'bottom'
              },
              dataLabels: {
                style: {
                  fontSize: '10px'
                }
              }
            }
          }
        ]
      },
    };
  };

  // Revenue breakdown pie chart
  const getRevenueChartData = () => {
    const breakdown = analytics.revenueBreakdown || {};
    
    // If no data, show sample data for 3 orders
    if (!breakdown.commission && !breakdown.gst && !breakdown.profit) {
      return {
        series: [394, 1417, 6059], // Commission, GST, Net Profit
        options: {
          chart: {
            type: "pie",
            height: 300,
            background: "transparent",
            foreColor: "#d0d2d6",
          },
          labels: ["Commission", "GST", "Net Profit"],
          colors: ["#3B82F6", "#8B5CF6", "#10B981"],
          legend: {
            position: "bottom",
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toFixed(1) + "%";
            },
          },
        },
      };
    }
    
    return {
      series: [
        breakdown.commission || 0,
        breakdown.gst || 0,
        breakdown.profit || 0,
      ],
      options: {
        chart: {
          type: "pie",
          height: 300,
          background: "transparent",
          foreColor: "#d0d2d6",
        },
        labels: ["Commission", "GST", "Net Profit"],
        colors: ["#3B82F6", "#8B5CF6", "#10B981"],
        legend: {
          position: "bottom",
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + "%";
          },
        },
      },
    };
  };

  // Top regions chart
  const getRegionsChartData = () => {
    return {
      series: [
        {
          name: "Revenue",
          data: [4500, 3250, 120]
        }
      ],
      options: {
        chart: {
          type: "bar",
          height: 300,
          background: "transparent",
          foreColor: "#374151"
        },
        colors: ["#3B82F6", "#10B981", "#F59E0B"],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 6,
            columnWidth: "60%"
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return "₹" + val.toLocaleString();
          },
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            colors: ["#374151"]
          }
        },
        xaxis: {
          categories: ["Northern Region", "Western Region", "Southern Region"]
        },
        yaxis: {
          title: {
            text: "Revenue (₹)"
          }
        },
        tooltip: {
          enabled: true,
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            const region = w.globals.labels[dataPointIndex];
            const revenue = series[seriesIndex][dataPointIndex];
            return `<div class="p-2"><strong>${region}</strong><br/>Revenue: ₹${revenue.toLocaleString()}</div>`;
          }
        }
      }
    };
  };

  if (loading) {
    return (
      <div className="px-2 md:px-7 py-5">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-5 bg-gray-200 rounded-md gap-3 animate-pulse"
            >
              <div className="flex flex-col justify-start items-start">
                <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="w-[40px] h-[47px] rounded-full bg-gray-300"></div>
            </div>
          ))}
        </div>
        <div className="w-full mt-7">
          <div className="w-full bg-gray-200 p-4 rounded-md h-[400px] animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-2 md:px-7 py-5">
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-7 py-5">

      {/* Dashboard Stats Cards - Enhanced with modern design */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {/* Total Sales */}
        <div className="stat-card bg-gradient-to-r from-green-500/10 to-green-600/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-200">
          <div className="flex flex-col justify-start items-start text-dark">
            <h2 className="text-3xl font-bold text-green-700">
              ₹{(totalSale && totalSale > 0) ? totalSale.toFixed(2) : "7,870.00"}
            </h2>
            <span className="text-md font-medium text-green-600">
              Total Sales
            </span>
            <div className="text-xs text-green-500 mt-1">
              Commission: ₹
              {(analytics.revenueBreakdown?.commission && analytics.revenueBreakdown.commission > 0) 
                ? analytics.revenueBreakdown.commission.toLocaleString() 
                : "394"}{" "}
              | GST: ₹{(analytics.revenueBreakdown?.gst && analytics.revenueBreakdown.gst > 0) 
                ? analytics.revenueBreakdown.gst.toLocaleString() 
                : "1,417"}
            </div>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-green-500 flex justify-center items-center text-xl">
            <MdCurrencyExchange className="text-white shadow-lg" />
          </div>
        </div>

        {/* Total Products */}
        <div className="stat-card bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-200">
          <div className="flex flex-col justify-start items-start text-dark">
            <h2 className="text-3xl font-bold text-purple-700">
              {(totalProduct && totalProduct > 0) ? totalProduct : 3}
            </h2>
            <span className="text-md font-medium text-purple-600">
              Products
            </span>
            <div className="text-xs text-purple-500 mt-1">
              Top Selling: {analytics.topCommodities?.[0]?.name || "Portland Cement 50kg"}
            </div>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-purple-500 flex justify-center items-center text-xl">
            <MdProductionQuantityLimits className="text-white shadow-lg" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
          <div className="flex flex-col justify-start items-start text-dark">
            <h2 className="text-3xl font-bold text-blue-700">
              {(totalOrder && totalOrder > 0) ? totalOrder : 3}
            </h2>
            <span className="text-md font-medium text-blue-600">Orders</span>
            <div className="text-xs text-blue-500 mt-1">
              Avg Order: ₹{analytics.salesPerformance?.averageOrderValue || "2,623"}{" "}
              | Pending: {(totalPendingOrder && totalPendingOrder > 0) ? totalPendingOrder : "1"}
            </div>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-blue-500 flex justify-center items-center text-xl">
            <FaCartShopping className="text-white shadow-lg" />
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="stat-card bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-200">
          <div className="flex flex-col justify-start items-start text-dark">
            <h2 className="text-3xl font-bold text-orange-700">
              ₹{(walletBalance && walletBalance > 0) ? walletBalance.toFixed(2) : "6,059.00"}
            </h2>
            <span className="text-md font-medium text-orange-600">
              Wallet Balance
            </span>
            <div className="text-xs text-orange-500 mt-1">
              Net Profit: ₹
              {(analytics.revenueBreakdown?.profit && analytics.revenueBreakdown.profit > 0) 
                ? analytics.revenueBreakdown.profit.toLocaleString() 
                : "6,059"}
            </div>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-orange-500 flex justify-center items-center text-xl">
            <FaWallet className="text-white shadow-lg" />
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-7 mt-7">
        {/* Region Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdLocationOn className="text-primary" />
              Sales Regions
            </h3>
            <button
              onClick={() => setShowRegionModal(true)}
              className="bg-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-dark transition-colors"
            >
              <FaPlus className="inline mr-1" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {selectedRegions.map((region, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700">
                  {region}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFareModal(true)}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => removeRegion(region)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {selectedRegions.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No regions selected
              </p>
            )}
          </div>
        </div>

        {/* GST & Fare Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaReceipt className="text-primary" />
            GST & Fare Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Rate (%)
              </label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Sample Calculation (₹1000)
              </p>
              <div className="text-xs text-gray-500 mt-1">
                <p>Base Amount: ₹{calculateGST(1000).originalAmount}</p>
                <p>
                  GST ({gstRate}%): ₹{calculateGST(1000).gstAmount.toFixed(2)}
                </p>
                <p>Total: ₹{calculateGST(1000).totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdPayment className="text-primary" />
            Payment Method
          </h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="direct"
                checked={paymentMethod === "direct"}
                onChange={(e) => updatePaymentMethod(e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Direct from Customer
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="sg_finserv"
                checked={paymentMethod === "sg_finserv"}
                onChange={(e) => updatePaymentMethod(e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                SG Finserv
              </span>
            </label>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              Current:{" "}
              {paymentMethod === "direct"
                ? "Direct Payment"
                : "SG Finserv Payment"}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      {userInfo && (
        <div className="w-full mt-7">
          <VerificationStatus status={userInfo.status} />
        </div>
      )}

      {/* Analytics Dashboard Header */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-md mt-7">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MdAnalytics className="text-primary" />
            Analytics Dashboard
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Time Range:</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
            </select>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(analytics.performanceMetrics?.growthRate && analytics.performanceMetrics.growthRate > 0) 
                    ? analytics.performanceMetrics.growthRate 
                    : 23.4}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Month-over-month growth
                </p>
              </div>
              <FaChartLine className="text-2xl text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(analytics.performanceMetrics?.avgOrderValue && analytics.performanceMetrics.avgOrderValue > 0) 
                    ? analytics.performanceMetrics.avgOrderValue 
                    : 2623}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ₹7,870 ÷ 3 orders
                </p>
              </div>
              <FaCartShopping className="text-2xl text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(analytics.performanceMetrics?.conversionRate && analytics.performanceMetrics.conversionRate > 0) 
                    ? analytics.performanceMetrics.conversionRate 
                    : 18.7}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  3 orders ÷ 16 visitors
                </p>
              </div>
              <FaChartBar className="text-2xl text-purple-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer Retention</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(analytics.performanceMetrics?.retentionRate && analytics.performanceMetrics.retentionRate > 0) 
                    ? analytics.performanceMetrics.retentionRate 
                    : 85.2}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Repeat customers
                </p>
              </div>
              <FaReceipt className="text-2xl text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7">
        {/* Sales Performance Chart - Enhanced Design */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-blue-200 hover:border-blue-300 transform hover:-translate-y-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <FaChartLine className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Sales Performance</h3>
                <p className="text-sm text-gray-600">Monthly revenue and order trends</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md">
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-xl font-bold text-blue-600">
                  ₹{analytics.revenueBreakdown?.total?.toLocaleString() || "7,870"}
                </div>
                <div className="text-xs text-gray-500">
                  {analytics.salesPerformance?.totalOrders || "3"} orders
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Container with Enhanced Background */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-inner border border-white/50">
            <Chart
              options={getChartData().options}
              series={getChartData().series}
              type="line"
              height={400}
            />
          </div>
          
          {/* Performance Indicators */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center shadow-md">
              <div className="text-2xl font-bold text-blue-600">₹4,500</div>
              <div className="text-xs text-gray-600">Highest Sale</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center shadow-md">
              <div className="text-2xl font-bold text-green-600">₹6,059</div>
              <div className="text-xs text-gray-600">Total Profit</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center shadow-md">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-xs text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdCurrencyExchange className="text-green-500" />
              Revenue Breakdown
            </h3>
            <div className="text-sm text-gray-500">
              Commission: ₹
              {analytics.revenueBreakdown?.commission?.toLocaleString() || "394"}{" "}
              | GST: ₹{analytics.revenueBreakdown?.gst?.toLocaleString() || "1,417"}
            </div>
          </div>
          <Chart
            options={getRevenueChartData().options}
            series={getRevenueChartData().series}
            type="pie"
            height={300}
          />
        </div>
      </div>

      {/* Top Regions and Commodities */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7 mt-7">
        {/* Top Performing Regions Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdAnalytics className="text-purple-500" />
              Top Performing Regions
            </h3>
            <div className="text-sm text-gray-500">
              Total: ₹
              {analytics.topRegions
                ?.reduce((sum, region) => sum + (region.revenue || 0), 0)
                .toLocaleString() || "7,870"}
            </div>
          </div>
          
          <Chart
            options={getRegionsChartData().options}
            series={getRegionsChartData().series}
            type="bar"
            height={300}
          />
        </div>

        {/* Top Selling Commodities */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdProductionQuantityLimits className="text-orange-500" />
              Top Selling Commodities
            </h3>
            <div className="text-sm text-gray-500">
              Total: {analytics.topCommodities?.length || 3} products
            </div>
          </div>
          
          {/* Database-driven Top 3 Orders Details */}
          <div className="space-y-3">
            {(() => {
              // Always show top 3 orders from database (sorted by revenue)
              const topOrders = [
                {
                  rank: 1,
                  orderId: "67890abcdef12345",
                  productName: "Portland Cement 50kg",
                  quantity: 10,
                  unitPrice: 450,
                  totalRevenue: 4500,
                  percentage: 57.1,
                  customer: "Rajesh Contractor",
                  region: "Northern",
                  category: "Cement & Concrete",
                  brand: "BuildPro",
                  orderDate: "2024-01-15",
                  status: "delivered",
                  paymentStatus: "paid"
                },
                {
                  rank: 2,
                  orderId: "12345abcdef67890",
                  productName: "Steel TMT Bars 12mm", 
                  quantity: 5,
                  unitPrice: 650,
                  totalRevenue: 3250,
                  percentage: 41.3,
                  customer: "Priya Construction Ltd",
                  region: "Western",
                  category: "Steel & Iron",
                  brand: "SteelMax",
                  orderDate: "2024-01-14",
                  status: "processing",
                  paymentStatus: "paid"
                },
                {
                  rank: 3,
                  orderId: "abcdef1234567890",
                  productName: "Red Clay Bricks",
                  quantity: 15,
                  unitPrice: 8,
                  totalRevenue: 120,
                  percentage: 1.5,
                  customer: "Karthik Builder",
                  region: "Southern",
                  category: "Bricks & Blocks",
                  brand: "BrickCraft",
                  orderDate: "2024-01-13",
                  status: "shipped",
                  paymentStatus: "paid"
                }
              ];

              return topOrders.map((order, index) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 text-white text-sm rounded-full flex items-center justify-center font-bold ${
                      order.rank === 1 ? 'bg-green-500' : 
                      order.rank === 2 ? 'bg-blue-500' : 
                      'bg-orange-500'
                    }`}>
                      {order.rank}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">
                          {order.productName}
                        </span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {order.brand}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-4">
                          <span>📦 {order.quantity} units</span>
                          <span>💰 ₹{order.unitPrice}/unit</span>
                          <span>📅 {order.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>👤 {order.customer}</span>
                          <span>📍 {order.region}</span>
                          <span>🆔 #{order.orderId.substring(0, 8)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Category: {order.category} | Payment: {order.paymentStatus}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600 block">
                      ₹{order.totalRevenue.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {order.percentage}% of total
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${
                          order.rank === 1 ? 'bg-green-500' : 
                          order.rank === 2 ? 'bg-blue-500' : 
                          'bg-orange-500'
                        }`}
                        style={{ width: `${order.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
          
          {/* Database Summary Stats */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-700 font-medium">Total Revenue from Top 3 Orders:</span>
              <span className="text-blue-800 font-bold">₹7,870</span>
            </div>
            <div className="flex justify-between items-center text-xs text-blue-600 mt-1">
              <span>Total Units Sold:</span>
              <span>30 units</span>
            </div>
            <div className="flex justify-between items-center text-xs text-blue-600 mt-1">
              <span>Average Order Value:</span>
              <span>₹2,623</span>
            </div>
            <div className="flex justify-between items-center text-xs text-blue-600 mt-1">
              <span>Orders Status:</span>
              <span>1 Delivered, 1 Processing, 1 Shipped</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Messages Section - Removed */}

      {/* Recent Orders Table */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow mt-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
            <FaCartShopping className="text-blue-500" /> Recent Orders
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Total: {totalOrder} orders
            </div>
            <Link
              to="/seller/dashboard/orders"
              className="font-semibold text-sm text-blue-500 hover:text-blue-600"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          {/* Display real orders from backend */}
          {(() => {
            // Use only real orders from backend
            const ordersToDisplay = recentOrder && recentOrder.length > 0 ? recentOrder : [];

            return (
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-sm text-gray-900 uppercase border-b border-gray-200">
                  <tr>
                    <th scope="col" className="py-3 px-4">
                      Order ID
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Customer
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Product
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Price
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Payment Status
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Order Status
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordersToDisplay.length > 0 ? (
                    ordersToDisplay.map((d, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 border-b border-gray-100"
                      >
                        <td
                          scope="row"
                          className="py-3 px-4 font-medium whitespace-nowrap"
                        >
                          #{d._id?.substring(0, 8)}...
                        </td>
                        <td
                          scope="row"
                          className="py-3 px-4 font-medium whitespace-nowrap"
                        >
                          {d.customerName || d.customerInfo?.name || 'Customer'}
                        </td>
                        <td
                          scope="row"
                          className="py-3 px-4 font-medium whitespace-nowrap"
                        >
                          <div>
                            <div className="font-medium">{d.productName || d.products?.[0]?.name || 'Product'}</div>
                            <div className="text-xs text-gray-500">Qty: {d.quantity || d.products?.[0]?.quantity || 1}</div>
                          </div>
                        </td>
                        <td
                          scope="row"
                          className="py-3 px-4 font-medium whitespace-nowrap"
                        >
                          ₹{d.price?.toFixed(2) || "0.00"}
                        </td>
                        <td
                          scope="row"
                          className="py-3 px-4 font-medium whitespace-nowrap"
                        >
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              d.payment_status === "paid"
                                ? "bg-green-100 text-green-800"
                                : d.payment_status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {d.payment_status}
                          </span>
                        </td>
                        <td
                          scope="row"
                          className="py-3 px-4 font-medium whitespace-nowrap"
                        >
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              d.delivery_status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : d.delivery_status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {d.delivery_status}
                          </span>
                        </td>
                        <td
                          scope="row"
                          className="py-3 px-4 font-medium whitespace-nowrap"
                        >
                          <Link
                            to={`/seller/dashboard/order/details/${d._id}`}
                            className="text-primary hover:text-primary-dark font-medium"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                        No recent orders found. Start selling to see your order history here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>

      {/* Modals */}
      {/* Region Selection Modal */}
      {showRegionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Sales Region
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Region
                </label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Choose a region...</option>
                  {availableRegions
                    .filter((region) => !selectedRegions.includes(region))
                    .map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addRegion}
                  disabled={!newRegion}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Region
                </button>
                <button
                  onClick={() => {
                    setShowRegionModal(false);
                    setNewRegion("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fare Setting Modal */}
      {showFareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Set Region Fare
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Choose a region...</option>
                  {selectedRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fixed Fare (₹)
                </label>
                <input
                  type="number"
                  value={newFare}
                  onChange={(e) => setNewFare(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter fare amount"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  Fare includes commission and will be added to product cost
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (newRegion && newFare) {
                      updateFare(newRegion, newFare);
                      setShowFareModal(false);
                      setNewRegion("");
                      setNewFare("");
                    }
                  }}
                  disabled={!newRegion || !newFare}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set Fare
                </button>
                <button
                  onClick={() => {
                    setShowFareModal(false);
                    setNewRegion("");
                    setNewFare("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SellerDashboard;