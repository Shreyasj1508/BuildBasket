import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectUser = () => {
    const { userInfo } = useSelector(state => state.auth);
    const location = useLocation();

    // Check if user is logged in
    const isAuthenticated = userInfo && userInfo.id;

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace={true} />;
    }

    // If authenticated, render the protected component
    return <Outlet />;
};

export default ProtectUser;