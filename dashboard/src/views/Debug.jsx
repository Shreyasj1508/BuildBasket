import React from 'react';
import { useSelector } from 'react-redux';

const Debug = () => {
    const { token, role, userInfo, loader, errorMessage, successMessage } = useSelector(state => state.auth);

    return (
        <div className='p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8'>
            <h2 className='text-2xl font-bold mb-4'>Debug Information</h2>
            
            <div className='space-y-4'>
                <div>
                    <h3 className='font-semibold text-lg'>Auth State:</h3>
                    <pre className='bg-gray-100 p-4 rounded text-sm overflow-auto'>
                        {JSON.stringify({
                            token: token ? 'Present' : 'Missing',
                            role,
                            userInfo: userInfo ? {
                                _id: userInfo._id,
                                name: userInfo.name,
                                email: userInfo.email,
                                role: userInfo.role,
                                status: userInfo.status
                            } : 'Not loaded',
                            loader,
                            errorMessage,
                            successMessage
                        }, null, 2)}
                    </pre>
                </div>

                <div>
                    <h3 className='font-semibold text-lg'>Current URL:</h3>
                    <p className='bg-gray-100 p-2 rounded'>{window.location.href}</p>
                </div>

                <div>
                    <h3 className='font-semibold text-lg'>Local Storage:</h3>
                    <p className='bg-gray-100 p-2 rounded'>
                        accessToken: {localStorage.getItem('accessToken') ? 'Present' : 'Missing'}
                    </p>
                </div>

                <div>
                    <h3 className='font-semibold text-lg'>Navigation Links:</h3>
                    <div className='space-y-2'>
                        <a href='/seller/dashboard' className='block bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                            Go to Seller Dashboard
                        </a>
                        <a href='/seller' className='block bg-green-500 text-white p-2 rounded hover:bg-green-600'>
                            Go to Seller Root
                        </a>
                        <a href='/login' className='block bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600'>
                            Go to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Debug;
