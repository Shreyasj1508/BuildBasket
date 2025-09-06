import React from 'react';
import { useSafeSelector } from '../hooks/useSafeSelector';

const ReduxErrorBoundary = ({ children }) => {
    // Check if Redux store is accessible using safe selector
    const storeState = useSafeSelector(state => state, {});
    
    // Check if home state exists
    const homeState = useSafeSelector(state => state.home, {});
    
    // If we can't access the store or home state, show error
    if (!storeState || Object.keys(storeState).length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Redux Store Error</h2>
                    <p className="text-gray-600 mb-4">The Redux store is not accessible. Please refresh the page.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-[#eba834] text-white px-6 py-2 rounded-lg hover:bg-[#d4a32e] transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }
    
    return children;
};

export default ReduxErrorBoundary;
