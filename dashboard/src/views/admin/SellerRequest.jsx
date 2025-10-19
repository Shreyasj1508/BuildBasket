import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import Search from '../components/Search';
import { get_seller_request } from '../../store/Reducers/sellerReducer';

const SellerRequest = () => {

    const dispatch = useDispatch()
    const {sellers,totalSeller} = useSelector(state=> state.seller)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] =  useState(false)

    useEffect(() => {
        dispatch(get_seller_request({
            parPage,
            searchValue,
            page: currentPage
        }))

    },[parPage,searchValue,currentPage])

    return (
        <div className='px-2 lg:px-7 pt-5'>
             <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
                        <span className='text-white font-bold text-lg'>R</span>
                    </div>
                    Seller Requests
                </h1>
                <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg'>
                    <span className='font-semibold'>{totalSeller} Requests</span>
                </div>
             </div>
             <div className='w-full p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl'>
            
             <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue}  /> 

                <div className='relative overflow-x-auto bg-white rounded-lg shadow-lg mt-6'>
    <table className='w-full text-sm text-left text-gray-800'>
        <thead className='text-sm text-white uppercase bg-gradient-to-r from-blue-500 to-blue-600'>
        <tr>
            <th scope='col' className='py-4 px-4 font-semibold'>No</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>Name</th>
            <th scope='col' className='py-4 px-4 font-semibold'>Email</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>Payment Status</th> 
            <th scope='col' className='py-4 px-4 font-semibold'>Status</th>  
            <th scope='col' className='py-4 px-4 font-semibold'>Action</th> 
        </tr>
        </thead>

        <tbody className='divide-y divide-gray-200'>
            {
                sellers.map((d, i) => <tr key={i} className='hover:bg-gray-50 transition-colors duration-200'>
                <td scope='row' className='py-4 px-4 font-semibold text-gray-800'>{i+1}</td> 
                <td scope='row' className='py-4 px-4 font-semibold text-gray-800'>{d.name}</td>
                <td scope='row' className='py-4 px-4 text-gray-700'>{d.email}</td>
                <td scope='row' className='py-4 px-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.payment === 'paid' ? 'bg-green-100 text-green-800' : 
                        d.payment === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                    }`}>{d.payment}</span>
                </td>

               <td scope='row' className='py-4 px-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        d.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                    }`}>{d.status}</span>
                </td>
                 
                 
                <td scope='row' className='py-4 px-4'>
                    <div className='flex justify-start items-center gap-3'>
                    <Link to={`/admin/dashboard/seller/details/${d._id}`} className='p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md'> 
                        <FaEye className='text-sm' /> 
                    </Link> 
                    </div>
                </td>
            </tr> )
            }

            
        </tbody> 
    </table> 
    </div>  

    <div className='w-full flex justify-center mt-8'>
        <div className='bg-white p-4 rounded-lg shadow-lg'>
        <Pagination 
            pageNumber = {currentPage}
            setPageNumber = {setCurrentPage}
            totalItem = {totalSeller}
            parPage = {parPage}
            showItem = {3}
        />
        </div>
        </div>

             </div>
            
        </div>
    );
};

export default SellerRequest;