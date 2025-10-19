import { lazy } from "react";         

// Main Admin Components
const AdminLogin = lazy(()=> import('../../views/admin/AdminLogin'))
const AdminDashboard = lazy(()=> import('../../views/admin/AdminDashboard'))  
const Orders = lazy(()=> import('../../views/admin/Orders')) 
const Category = lazy(()=> import('../../views/admin/Category'))  
const Sellers = lazy(()=> import('../../views/admin/Sellers'))
const PaymentRequest = lazy(()=> import('../../views/admin/PaymentRequest'))  
const DeactiveSellers = lazy(()=> import('../../views/admin/DeactiveSellers'))  
const SellerRequest = lazy(()=> import('../../views/admin/SellerRequest'))   
const SellerDetails = lazy(()=> import('../../views/admin/SellerDetails'))   
const ChatSeller = lazy(()=> import('../../views/admin/ChatSeller'))   
const OrderDetails = lazy(()=> import('../../views/admin/OrderDetails'))
const ExcelUpload = lazy(()=> import('../../views/admin/ExcelUpload'))
const AdminProducts = lazy(()=> import('../../views/admin/AdminProducts'))
const AdminCategories = lazy(()=> import('../../views/admin/AdminCategories'))
const CommissionSettings = lazy(()=> import('../../views/admin/CommissionSettings'))  

// New Admin Features
const CommodityManagement = lazy(()=> import('../../views/admin/CommodityManagement'))
const UserVerification = lazy(()=> import('../../views/admin/UserVerification'))
const BuyerCreditManagement = lazy(()=> import('../../views/admin/BuyerCreditManagement'))
const ReportsExports = lazy(()=> import('../../views/admin/ReportsExports'))
const AnalyticsDashboard = lazy(()=> import('../../views/admin/AnalyticsDashboard'))
const BuyerManagement = lazy(()=> import('../../views/admin/BuyerManagement'))
const PurchaseTracking = lazy(()=> import('../../views/admin/PurchaseTracking'))
const OrderManagement = lazy(()=> import('../../views/admin/OrderManagement'))
const OrderApproval = lazy(()=> import('../../views/admin/OrderApproval'))
const PaymentManagement = lazy(()=> import('../../views/admin/PaymentManagement'))

export const adminRoutes = [
    {
        path: '/admin/login',
        element : <AdminLogin/>,
        role : null
    },
    {
        path: '/admin/dashboard',
        element : <AdminDashboard/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/commodity-management',
        element : <CommodityManagement/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/user-verification',
        element : <UserVerification/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/buyer-credit-management',
        element : <BuyerCreditManagement/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/reports-exports',
        element : <ReportsExports/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/analytics',
        element : <AnalyticsDashboard/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/orders',
        element : <Orders/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/category',
        element : <Category/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/sellers',
        element : <Sellers/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/payment-request',
        element : <PaymentRequest/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/deactive-sellers',
        element : <DeactiveSellers/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/sellers-request',
        element : <SellerRequest/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/seller/details/:sellerId',
        element : <SellerDetails/> ,
        role : 'admin'
    }, 
    {
        path: '/admin/dashboard/chat-sellers',
        element : <ChatSeller/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/chat-sellers/:sellerId',
        element : <ChatSeller/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/order/details/:orderId',
        element : <OrderDetails/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/excel-upload',
        element : <ExcelUpload/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/admin-products',
        element : <AdminProducts/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/admin-categories',
        element : <AdminCategories/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/commission-settings',
        element : <CommissionSettings/> ,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/buyer-management',
        element : <BuyerManagement/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/purchase-tracking',
        element : <PurchaseTracking/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/order-management',
        element : <OrderManagement/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/order-approval',
        element : <OrderApproval/>,
        role : 'admin'
    },
    {
        path: '/admin/dashboard/payment-management',
        element : <PaymentManagement/>,
        role : 'admin'
    }
]