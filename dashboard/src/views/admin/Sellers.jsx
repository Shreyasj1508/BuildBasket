import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer';

const Sellers = () => {

    const dispatch = useDispatch()

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] =  useState(false)

    const {sellers,totalSeller } = useSelector(state => state.seller)


    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_active_sellers(obj))
    },[searchValue,currentPage,parPage])
 
    return (
        <div className='px-2 lg:px-7 pt-5'>
             <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-lg flex items-center justify-center'>
                        <span className='text-white font-bold text-lg'>S</span>
                    </div>
                    Active Sellers
                </h1>
                <div className='bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] text-white px-4 py-2 rounded-lg shadow-lg'>
                    <span className='font-semibold'>{totalSeller} Sellers</span>
                </div>
             </div>
             <div className='w-full p-6 bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-xl shadow-xl'>
            
             <div className='flex justify-between items-center mb-6'>
                    <select onChange={(e) => setParPage(parseInt(e.target.value))} className='px-4 py-3 focus:border-[#eb8f34] focus:ring-2 focus:ring-[#eb8f34]/20 outline-none bg-white border border-gray-300 rounded-lg text-gray-800 font-medium shadow-md hover:shadow-lg transition-all duration-300'>
                        <option value="5">Show 5</option>
                        <option value="10">Show 10</option>
                        <option value="20">Show 20</option> 
                    </select>
                    <input  onChange={e => setSearchValue(e.target.value)} value={searchValue} className='px-4 py-3 focus:border-[#eb8f34] focus:ring-2 focus:ring-[#eb8f34]/20 outline-none bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 shadow-md hover:shadow-lg transition-all duration-300 w-64' type="text" placeholder='Search sellers...' /> 
                </div>

                <div className='relative overflow-x-auto bg-white rounded-lg shadow-lg'>
    <table className='w-full text-sm text-left text-gray-800'>
        <thead className='text-sm text-white uppercase bg-gradient-to-r from-[#eb8f34] to-[#d17a1e]'>
        <tr>
            <th scope='col' className='py-4 px-4 font-semibold'>No</th>
            <th scope='col' className='py-4 px-4 font-semibold'>Image</th>
            <th scope='col' className='py-4 px-4 font-semibold'>Name</th>
            <th scope='col' className='py-4 px-4 font-semibold'>Shop Name</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>Payment Status</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>Email</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>Status</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>District</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>Action</th> 
        </tr>
        </thead>

        <tbody className='divide-y divide-gray-200'>
            {
                sellers.map((d, i) => <tr key={i} className='hover:bg-gray-50 transition-colors duration-200'>
                <td scope='row' className='py-4 px-4 font-semibold text-gray-800'>{i+1}</td>
                <td scope='row' className='py-4 px-4'>
                    <img className='w-12 h-12 rounded-full object-cover shadow-md border-2 border-gray-200' src={ d.image } alt={d.name} />
                </td>
                <td scope='row' className='py-4 px-4 font-semibold text-gray-800'>{ d.name }</td>
                <td scope='row' className='py-4 px-4 text-gray-700'>{ d.shopInfo?.shopName }</td>
                <td scope='row' className='py-4 px-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.payment === 'paid' ? 'bg-green-100 text-green-800' : 
                        d.payment === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                    }`}>{ d.payment }</span>
                </td>
                <td scope='row' className='py-4 px-4 text-gray-700'>{ d.email }</td>
                <td scope='row' className='py-4 px-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.status === 'active' ? 'bg-green-100 text-green-800' : 
                        d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                    }`}>{ d.status }</span>
                </td>
                <td scope='row' className='py-4 px-4 text-gray-700'>{ d.shopInfo?.district }</td>
                 
                <td scope='row' className='py-4 px-4'>
                    <div className='flex justify-start items-center gap-3'>
                    <Link to={`/admin/dashboard/seller/details/${d._id}`} className='p-3 bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md'> 
                        <FaEye className='text-sm' /> 
                    </Link> 
                    </div>
                </td>
            </tr> )
            }

            
        </tbody> 
    </table> 
    </div>  

   {
     totalSeller > parPage ? <div className='w-full flex justify-center mt-8'>
     <div className='bg-white p-4 rounded-lg shadow-lg'>
     <Pagination 
         pageNumber = {currentPage}
         setPageNumber = {setCurrentPage}
         totalItem = {totalSeller}
         parPage = {parPage}
         showItem = {4}
     />
     </div>
     </div> : ""
   }
    






             </div>
            
        </div>
    );
};

export default Sellers;