import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order,messageClear, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import { FaFileInvoice, FaUpload, FaEye, FaCheckCircle, FaTruck, FaClock, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/api';

const OrderDetails = () => {

    const { orderId } = useParams() 
    const dispatch = useDispatch() 
    const [status, setStatus] = useState('')
    const [showInvoiceModal, setShowInvoiceModal] = useState(false)
    const [invoiceFile, setInvoiceFile] = useState(null)
    const [uploading, setUploading] = useState(false)

    const { order,errorMessage,successMessage } = useSelector(state => state.order)

    useEffect(() => {
        setStatus(order?.delivery_status)
    },[order])


    useEffect(() => {
        dispatch(get_seller_order(orderId))
    },[orderId])

    const status_update = (e) => {
        dispatch(seller_order_status_update({orderId, info: {status: e.target.value} }))
        setStatus(e.target.value)
    }

    const uploadInvoice = async () => {
        if (!invoiceFile) {
            toast.error('Please select a file to upload');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('invoice', invoiceFile);

            const response = await api.post(`/api/seller/orders/${orderId}/invoice`, 
                formData, 
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (response.data.success) {
                toast.success('Delivery invoice uploaded successfully');
                setShowInvoiceModal(false);
                setInvoiceFile(null);
                // Refresh order data
                dispatch(get_seller_order(orderId));
            }
        } catch (error) {
            toast.error('Failed to upload invoice');
            console.error('Invoice upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <FaCheckCircle className="text-green-500" />;
            case 'shipped':
                return <FaTruck className="text-blue-500" />;
            case 'processing':
                return <FaClock className="text-yellow-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaClock className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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

    return (
        <div className='px-2 lg:px-7 pt-5'>
        <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
            <div className='flex justify-between items-center p-4'>
                <h2 className='text-xl text-[#d0d2d6]'>Order Details</h2>
                <div className='flex items-center gap-4'>
                    {/* Status Update Section */}
                    <div className='flex items-center gap-2'>
                        <span className='text-[#d0d2d6] text-sm'>Status:</span>
                        <div className='flex items-center gap-2'>
                            {getStatusIcon(status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                {status}
                            </span>
                        </div>
                        <select 
                            onChange={status_update} 
                            value={status} 
                            className='px-3 py-1 focus:border-indigo-500 outline-none bg-[#475569] border border-slate-700 rounded-md text-[#d0d2d6] text-sm'
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    
                    {/* Invoice Upload Button */}
                    <button
                        onClick={() => setShowInvoiceModal(true)}
                        className='bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors'
                        title="Upload Delivery Invoice (Admin Only)"
                    >
                        <FaFileInvoice className='text-xs' />
                        Upload Invoice
                    </button>
                </div>
            </div>

        <div className='p-4'>
            <div className='flex gap-2 text-lg text-[#d0d2d6]'>
                <h2>#{order._id}</h2>
                <span>{order.date}</span> 
            </div>
             
            <div className='flex flex-wrap'>
                <div className='w-[30%]'>
                    <div className='pr-3 text-[#d0d2d6] text-lg'>
                        <div className='flex flex-col gap-1'>
                            <h2 className='pb-2 font-semibold'>Deliver To : {order.shippingInfo} </h2>
                             
                        </div>
            <div className='flex justify-start items-center gap-3'>
                <h2>Payment Status: </h2>
                <span className='text-base'>{order.payment_status}</span>
             </div>  
             <span>Price : ${order.price}</span> 

         {
            order?.products?.map((p,i) => <div key={i} className='mt-4 flex flex-col gap-4 bg-[#8288ed] rounded-md'>
            <div className='text-[#d0d2d6]'> 
                <div className='flex gap-3 text-md'>
                    <img className='w-[50px] h-[50px]' src={p.images[0]} alt="" />

                    <div>
                        <h2>{p.name}</h2>
                        <p>
                            <span>Brand : </span>
                            <span>{p.brand}</span>
                            <span className='text-lg'>Quantity : {p.quantity} </span>
                        </p>
                    </div> 
                </div> 
            </div>
            </div>   )
         }
            

 


                    </div>
                </div> 
 


            </div>


        </div>   
        </div> 

        {/* Invoice Upload Modal */}
        {showInvoiceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#6a5fdf] p-6 rounded-lg w-full max-w-md mx-4">
                    <h3 className="text-[#d0d2d6] text-lg font-semibold mb-4">
                        Upload Delivery Invoice
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[#d0d2d6] text-sm block mb-2">
                                Order: #{order._id?.substring(0, 8)}...
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setInvoiceFile(e.target.files[0])}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                            />
                        </div>
                        <div className="bg-slate-800 p-3 rounded-md">
                            <p className="text-xs text-gray-300">
                                <strong>Note:</strong> This delivery invoice will be visible to admin only. 
                                Upload PDF, JPG, or PNG files only.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={uploadInvoice}
                                disabled={!invoiceFile || uploading}
                                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload className="text-xs" />
                                        Upload Invoice
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowInvoiceModal(false);
                                    setInvoiceFile(null);
                                }}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
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

export default OrderDetails;