import React, { useEffect, useState } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/Reducers/authReducer';
import { FaLock } from "react-icons/fa";
import api from '../api/api';

const Sidebar = ({showSidebar, setShowSidebar}) => {

    const dispatch = useDispatch()
    const { role } = useSelector(state => state.auth)
    const navigate = useNavigate()

    const {pathname} = useLocation()
    const [allNav,setAllNav] = useState([])
    useEffect(() => {
        const navs = getNav(role)
        setAllNav(navs)
    },[role])
    // console.log(allNav)

    const handleLogout = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Logout button clicked, role:', role);
        
        // Clear everything immediately
        localStorage.removeItem('accessToken');
        
        // Clear Redux state
        dispatch(logout());
        
        // Force navigation using window.location to avoid React Router issues
        if (role === 'admin') {
            window.location.href = '/admin/login';
        } else {
            window.location.href = '/login';
        }
    };


    return (
        <div>
            <div onClick={()=> setShowSidebar(false)} className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-black/50 top-0 left-0 z-10`} > 
            </div>

    <div className={`w-[260px] fixed bg-white/95 backdrop-blur-sm z-50 top-0 h-screen shadow-2xl transition-all duration-300 ${showSidebar ? 'left-0' : '-left-[260px] lg:left-0'} border-r border-orange-200`}>
        {/* Enhanced Header */}
        <div className='h-[70px] flex justify-center items-center border-b border-orange-200 bg-gradient-to-r from-orange-50/50 to-orange-100/50 backdrop-blur-sm'>
            <Link to='/' className='flex items-center gap-4 hover:scale-105 transition-transform duration-300'>
                <div className='w-[45px] h-[45px] bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300'>
                    <span className='text-white font-bold text-xl'>SG</span>
                </div>
                <span className='text-gray-800 font-bold text-xl tracking-wide bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'>BUILD BASKET</span>
            </Link> 
        </div>

        <div className='px-[16px] py-6'>
            <ul className='space-y-2'>
                {
                    allNav.map((n,i) =><li key={i} className='animate-fadeInUp' style={{ animationDelay: `${i * 50}ms` }}>
                       <Link to={n.path} className={`group ${pathname === n.path ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white' : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700' } px-4 py-3 rounded-xl flex justify-start items-center gap-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full group-hover:translate-x-1`}>
                        <span className={`text-xl ${pathname === n.path ? 'text-white' : 'text-orange-500 group-hover:text-orange-600'} transition-all duration-300`}>{n.icon}</span>
                        <span className={`font-semibold text-sm ${pathname === n.path ? 'text-white' : 'text-gray-700 group-hover:text-orange-700'} transition-all duration-300`}>{n.title}</span>
                        </Link>
                    </li> )
                }

            <li className="mt-6 pt-4 border-t border-orange-200 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
                <button 
                    onClick={handleLogout}
                    className='group text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 font-semibold duration-300 px-4 py-3 rounded-xl flex justify-start items-center gap-4 transition-all transform hover:scale-105 hover:shadow-lg w-full group-hover:translate-x-1'
                >
                <span className='text-lg group-hover:text-white transition-all duration-300'><BiLogOutCircle /></span>
                <span className='text-sm'>Logout</span>
                </button>
            </li>
 


            </ul>

        </div>
        
    </div>

        </div>
    );
};

export default Sidebar;