import { AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUserTimes, FaUsers, FaFileExcel, FaCog, FaEdit } from "react-icons/fa";
import { MdPayment, MdProductionQuantityLimits, MdInventory, MdAnalytics } from "react-icons/md";
import { FaCodePullRequest } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { MdViewList } from "react-icons/md";
import { TbBasketDiscount } from "react-icons/tb";
import { BsCartCheck } from "react-icons/bs"; 
import { IoChatbubbles } from "react-icons/io5";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";

export const allNav = [
    {
        id : 1,
        title : 'Dashboard',
        icon : <AiOutlineDashboard />,
        role : 'admin',
        path: '/admin/dashboard'
    },
    {
        id : 2,
        title : 'Orders',
        icon : <AiOutlineShoppingCart />,
        role : 'admin',
        path: '/admin/dashboard/orders'
    },
    {
        id : 2.5,
        title : 'Purchase Tracking',
        icon : <BsCartCheck />,
        role : 'admin',
        path: '/admin/dashboard/purchase-tracking'
    },
    {
        id : 2.6,
        title : 'Order Management',
        icon : <FaEdit />,
        role : 'admin',
        path: '/admin/dashboard/order-management'
    },
    {
        id : 2.7,
        title : 'Order Approval',
        icon : <FaCheckCircle />,
        role : 'admin',
        path: '/admin/dashboard/order-approval'
    },
    {
        id : 2.8,
        title : 'Payment Management',
        icon : <FaCreditCard />,
        role : 'admin',
        path: '/admin/dashboard/payment-management'
    },
    {
        id : 3,
        title : 'Category',
        icon : <BiCategory  />,
        role : 'admin',
        path: '/admin/dashboard/category'
    },
    {
        id : 4,
        title : 'Sellers',
        icon : <FaUsers   />,
        role : 'admin',
        path: '/admin/dashboard/sellers'
    },
    {
        id : 5,
        title : 'Payment Request',
        icon : <MdPayment />,
        role : 'admin',
        path: '/admin/dashboard/payment-request'
    },
    {
        id : 6,
        title : 'Deactive Sellers',
        icon : <FaUserTimes />,
        role : 'admin',
        path: '/admin/dashboard/deactive-sellers'
    },
    {
        id : 7,
        title : 'Seller Request',
        icon : <FaCodePullRequest />,
        role : 'admin',
        path: '/admin/dashboard/sellers-request'
    },
    {
        id : 8,
        title : 'Live Chat',
        icon : <IoIosChatbubbles />,
        role : 'admin',
        path: '/admin/dashboard/chat-sellers'
    },
    {
        id : 9,
        title : 'Excel Upload',
        icon : <FaFileExcel />,
        role : 'admin',
        path: '/admin/dashboard/excel-upload'
    },
    {
        id : 10,
        title : 'Admin Products',
        icon : <MdProductionQuantityLimits />,
        role : 'admin',
        path: '/admin/dashboard/admin-products'
    },
    {
        id : 11,
        title : 'Admin Categories',
        icon : <BiCategory />,
        role : 'admin',
        path: '/admin/dashboard/admin-categories'
    },
    {
        id : 12,
        title : 'Commission Settings',
        icon : <FaCog />,
        role : 'admin',
        path: '/admin/dashboard/commission-settings'
    },
    {
        id : 13,
        title : 'Commodity Management',
        icon : <MdInventory />,
        role : 'admin',
        path: '/admin/dashboard/commodity-management'
    },
    {
        id : 14,
        title : 'Buyer Management',
        icon : <FaUsers />,
        role : 'admin',
        path: '/admin/dashboard/buyer-management'
    },
    {
        id : 15,
        title : 'Reports & Exports',
        icon : <FaFileExcel />,
        role : 'admin',
        path: '/admin/dashboard/reports-exports'
    },
    {
        id : 16,
        title : 'Analytics Dashboard',
        icon : <MdAnalytics />,
        role : 'admin',
        path: '/admin/dashboard/analytics'
    },
    {
        id : 17,
        title : 'Dashboard',
        icon : <AiOutlineDashboard />,
        role : 'seller',
        path: '/seller/dashboard'
    },
    {
        id : 18,
        title : 'Add Product',
        icon : <IoMdAdd />,
        role : 'seller',
        path: '/seller/dashboard/add-product'
    },     
    {
        id : 19,
        title : 'All Product',
        icon : <MdViewList />,
        role : 'seller',
        path: '/seller/dashboard/products'
    },
    {
        id : 20,
        title : 'Discount Product',
        icon : <TbBasketDiscount />,
        role : 'seller',
        path: '/seller/dashboard/discount-product'
    },
    {
        id : 21,
        title : 'Orders',
        icon : <BsCartCheck />,
        role : 'seller',
        path: '/seller/dashboard/orders'
    },
    {
        id : 22,
        title : 'Order Management',
        icon : <FaEdit />,
        role : 'seller',
        path: '/seller/dashboard/order-management'
    },
    {
        id : 23,
        title : 'Payments',
        icon : <MdPayment />,
        role : 'seller',
        path: '/seller/dashboard/payments'
    },
    {
        id : 20,
        title : 'Chat-Customer',
        icon : <IoChatbubbles />,
        role : 'seller',
        path: '/seller/dashboard/chat-customer'
    },
    {
        id : 21,
        title : 'Chat-Support',
        icon : <BsFillChatQuoteFill />,
        role : 'seller',
        path: '/seller/dashboard/chat-support'
    },
    {
        id : 22,
        title : 'Profile',
        icon : <CgProfile />,
        role : 'seller',
        path: '/seller/dashboard/profile'
    }



]