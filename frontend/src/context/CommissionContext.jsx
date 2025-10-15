import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const CommissionContext = createContext();

export const useCommission = () => {
    const context = useContext(CommissionContext);
    if (!context) {
        throw new Error('useCommission must be used within CommissionProvider');
    }
    return context;
};

export const CommissionProvider = ({ children }) => {
    const [commission, setCommission] = useState({
        rate: 0.05, // Default 5%
        type: 'percentage'
    });
    const [loading, setLoading] = useState(false);

    // Fetch commission from backend
    useEffect(() => {
        fetchCommission();
    }, []);

    const fetchCommission = async () => {
        try {
            setLoading(true);
            // Fetch from local backend only
            const response = await api.get('/home/commission/get-commission');
            if (response.data && response.data.commission) {
                setCommission(response.data.commission);
            }
        } catch (error) {
            console.log('Using default commission (5%)');
            // Use default commission if fetch fails - this is OK for local dev
        } finally {
            setLoading(false);
        }
    };

    /**
     * Calculate commission for a given price
     * @param {Number} basePrice - The base price
     * @param {Object} product - The product object (optional, for stored finalPrice)
     * @returns {Object} - Commission details
     */
    const calculateCommission = (basePrice, product = null) => {
        if (!basePrice || isNaN(basePrice)) {
            return {
                basePrice: 0,
                commissionAmount: 0,
                finalPrice: 0
            };
        }

        // If product has stored finalPrice, use it instead of calculating
        if (product && product.finalPrice && product.finalPrice > 0) {
            return {
                basePrice: parseFloat(basePrice),
                commissionAmount: product.commissionAmount || 0,
                finalPrice: product.finalPrice,
                commissionRate: commission.rate,
                commissionType: commission.type,
                isStored: true // Flag to indicate this is from database
            };
        }

        const price = parseFloat(basePrice);
        let commissionAmount = 0;
        
        if (commission.type === 'fixed') {
            commissionAmount = commission.rate;
        } else {
            // percentage
            commissionAmount = price * commission.rate;
        }

        const finalPrice = price + commissionAmount;

        return {
            basePrice: price,
            commissionAmount: commissionAmount,
            finalPrice: finalPrice,
            commissionRate: commission.rate,
            commissionType: commission.type,
            isStored: false // Flag to indicate this is calculated
        };
    };

    const value = {
        commission,
        loading,
        calculateCommission,
        fetchCommission
    };

    return (
        <CommissionContext.Provider value={value}>
            {children}
        </CommissionContext.Provider>
    );
};

export default CommissionContext;

