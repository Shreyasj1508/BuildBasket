import React from 'react';
import { MdOutlineKeyboardDoubleArrowLeft,MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";


const Pagination = ({pageNumber,setPageNumber,totalItem,parPage,showItem}) => {

    let totalPage = Math.ceil(totalItem / parPage)
    let startPage = pageNumber

    let dif = totalPage - pageNumber
    if (dif <= showItem) {
        startPage = totalPage - showItem
    }
    let endPage = startPage < 0 ? showItem : showItem + startPage
     
    if (startPage <= 0) {
        startPage = 1
    }

    const createBtn = () => {

        const btns = []
        for (let i = startPage; i < endPage; i++) {
            btns.push(
                <li onClick={()=>setPageNumber(i)} className={` ${pageNumber === i ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 text-white transform scale-110' : 'bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 shadow-lg hover:shadow-orange-500/50 hover:text-white text-gray-700 hover:text-white'} w-[40px] h-[40px] rounded-xl flex justify-center items-center cursor-pointer transition-all duration-300 transform hover:scale-105 font-semibold`}>
                    {i}                    
                </li>
            ) 
        }
        return btns
    }

    return (
        <ul className='flex gap-3'>
            {
                pageNumber > 1 && <li onClick={() => setPageNumber(pageNumber - 1)} className='w-[40px] h-[40px] rounded-xl flex justify-center items-center bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 text-gray-700 hover:text-white cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50 font-semibold'>
                    <MdOutlineKeyboardDoubleArrowLeft />
                </li>
            }
            {
                createBtn()
            }
            {
                pageNumber < totalPage && <li onClick={() => setPageNumber(pageNumber + 1)} className='w-[40px] h-[40px] rounded-xl flex justify-center items-center bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 text-gray-700 hover:text-white cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/50 font-semibold'>
                    <MdOutlineKeyboardDoubleArrowRight  />
                </li>
            }

        </ul>
    )


};

export default Pagination;