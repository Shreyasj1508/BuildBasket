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

    <div className={`w-[260px] fixed bg-white z-50 top-0 h-screen shadow-xl transition-all ${showSidebar ? 'left-0' : '-left-[260px] lg:left-0'} border-r border-gray-200`}>
        <div className='h-[70px] flex justify-center items-center border-b border-gray-200 bg-primary/5'>
            <Link to='/' className='flex items-center gap-3'>
                <div className='w-[40px] h-[40px] bg-primary rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold text-lg'>SG</span>
                </div>
                <span className='text-dark font-bold text-xl tracking-wide'>BUILD BASKET</span>
            </Link> 
        </div>

        <div className='px-[16px] py-4'>
            <ul>
                {
                    allNav.map((n,i) =><li key={i}>
                       <Link to={n.path} className={`${pathname === n.path ? 'bg-primary shadow-lg text-white duration-500' : 'text-dark font-bold duration-200 hover:bg-primary/10' } px-[12px] py-[9px] rounded-lg flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1 `} >
                        <span className={pathname === n.path ? 'text-white' : 'text-primary'}>{n.icon}</span>
                        <span>{n.title}</span>
                        </Link>

                    </li> )
                }

            <li className="mt-4 pt-4 border-t border-gray-200">
                <button 
                    onClick={handleLogout}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50 font-bold duration-200 px-[12px] py-[9px] rounded-lg flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1'
                >
                <span><BiLogOutCircle /></span>
                <span>Logout</span>
                </button>
            </li>
 


            </ul>

        </div>
        
    </div>

        </div>
    );
};

export default Sidebar;