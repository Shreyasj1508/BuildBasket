import React from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = ({showSidebar, setShowSidebar}) => {

  const {userInfo } = useSelector(state => state.auth)

    return (
        <div className='fixed top-0 left-0 w-full py-5 px-2 lg:px-7 z-40'>
          <div className='ml-0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-white shadow-lg px-5 transition-all border-b-2 border-primary/20'>

        <div onClick={() => setShowSidebar(!showSidebar)} className='w-[35px] flex lg:hidden h-[35px] rounded-sm bg-primary shadow-lg hover:shadow-primary/50 justify-center items-center cursor-pointer transition-all' >
          <span className="text-white"><FaList/></span>
        </div>

        <div className='hidden md:block'>
          <input className='px-3 py-2 outline-none border bg-transparent border-gray-300 rounded-md text-dark focus:border-primary focus:ring-1 focus:ring-primary overflow-hidden transition-all' type="text" name='search' placeholder='Search...' />
        </div>

        <div className='flex justify-center items-center gap-8 relative'>
          <div className='flex justify-center items-center'>
            <div className='flex justify-center items-center gap-3'>
              <div className='flex justify-center items-center flex-col text-end'>
          <h2 className='text-md font-bold text-dark'>{ userInfo.name }</h2>
          <span className='text-[14px] w-full font-normal text-primary capitalize'>{ userInfo.role }</span>
              </div>

              {
                userInfo.role === 'admin' ? <img className='w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-primary' src="/images/admin.jpg" alt="" />  : <img className='w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-primary' src={userInfo.image || '/images/user.png'} alt="" />
              }
            </div>
          </div>

        </div>

          </div> 
        </div>
    );
};

export default Header;