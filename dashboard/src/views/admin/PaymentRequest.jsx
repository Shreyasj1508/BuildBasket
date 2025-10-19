import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { confirm_payment_request, get_payment_request,messageClear } from '../../store/Reducers/PaymentReducer';
import moment from 'moment';
import toast from 'react-hot-toast';

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel',deltaY)
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} /> 
 ))
 
const PaymentRequest = () => {

    const dispatch = useDispatch()
    const {successMessage, errorMessage, pendingWithdrows,loader } = useSelector(state => state.payment)
    const [paymentId, setPaymentId] = useState('')

    useEffect(() => { 
        dispatch(get_payment_request())
    },[])

    const confirm_request = (id) => {
        setPaymentId(id)
        dispatch(confirm_payment_request(id))
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    },[successMessage,errorMessage])
     

    const Row = ({ index, style }) => {
        const withdrawal = pendingWithdrows?.[index];
        if (!withdrawal) return null;
        
        return (
        <div style={style} className='flex text-sm text-gray-800 font-medium hover:bg-gray-50 transition-colors duration-200'>
        <div className='w-[25%] p-3 whitespace-nowrap font-semibold'>{index + 1}</div>
        <div className='w-[25%] p-3 whitespace-nowrap text-green-600 font-bold'>${withdrawal.amount}</div>
        <div className='w-[25%] p-3 whitespace-nowrap'>
            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
            }`}>{withdrawal.status}</span>
         </div>
        <div className='w-[25%] p-3 whitespace-nowrap text-gray-600'> {moment(withdrawal.createdAt).format('LL')} </div>
        <div className='w-[25%] p-3 whitespace-nowrap'>
            <button disabled={loader} onClick={() => confirm_request(withdrawal._id)} className='bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] hover:shadow-lg hover:scale-105 px-4 py-2 cursor-pointer text-white rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'>
                {(loader && paymentId === withdrawal._id) ? 'Loading...' : 'Confirm'}
            </button>
        </div>
        </div>
        )
    }





    return (
<div className='px-2 lg:px-7 pt-5'>
    <div className='w-full p-6 bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-xl shadow-xl'>
        <div className='flex justify-between items-center mb-6'>
            <h2 className='text-3xl font-bold text-white flex items-center gap-3'>
                <div className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-lg'>P</span>
                </div>
                Payment Requests
            </h2>
            <div className='bg-white/20 text-white px-4 py-2 rounded-lg'>
                <span className='font-semibold'>{pendingWithdrows?.length || 0} Requests</span>
            </div>
        </div>
        <div className='w-full'>
            <div className='w-full overflow-x-auto bg-white rounded-lg shadow-lg'>
                <div className='flex bg-gradient-to-r from-[#eb8f34] to-[#d17a1e] uppercase text-sm font-bold min-w-[340px] rounded-t-lg text-white'>
                    <div className='w-[25%] p-4'> No </div>
                    <div className='w-[25%] p-4'> Amount </div>
                    <div className='w-[25%] p-4'> Status </div>
                    <div className='w-[25%] p-4'> Date </div>
                    <div className='w-[25%] p-4'> Action </div> 
                </div>
                {
                    pendingWithdrows && pendingWithdrows.length > 0 ? (
                        <List
                        style={{ minWidth : '340px'}}
                        className='List'
                        height={350}
                        itemCount={pendingWithdrows.length}
                        itemSize={35}
                        outerElementType={outerElementType}                    
                        >
                            {Row}
                        </List>
                    ) : (
                        <div className='flex items-center justify-center h-[350px] bg-white rounded-lg'>
                            <div className='text-center'>
                                <div className='text-gray-500 text-lg font-semibold mb-2'>No Payment Requests</div>
                                <div className='text-gray-400 text-sm'>No withdrawal requests found</div>
                            </div>
                        </div>
                    )
                }

            </div>

        </div>

    </div>
    
</div>
    );
};

export default PaymentRequest;