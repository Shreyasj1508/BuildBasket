import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const CommissionContext = createContext();

export const useCommission = () => {
    const context = useContext(CommissionContext);
    if (!context) {
        throw new Error('useCommission must be used within a CommissionProvider');
    }
    return context;
};

export const CommissionProvider = ({ children }) => {
    const [commission, setCommission] = useState({
        commissionType: 'fixed',
        fixedAmount: 20,
        percentageAmount: 0,
        isActive: true,
        description: 'Platform commission'
    });
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    // Fetch initial commission settings
    const fetchCommissionSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/home/commission/settings');
            if (response.data.success && response.data.commission) {
                setCommission(response.data.commission);
            }
        } catch (error) {
            console.error('Error fetching commission settings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate commission for a given price
    const calculateCommission = (basePrice) => {
        if (!commission.isActive) {
            return {
                basePrice,
                commissionAmount: 0,
                finalPrice: basePrice,
                commissionType: 'none'
            };
        }

        let commissionAmount = 0;
        if (commission.commissionType === 'fixed') {
            commissionAmount = commission.fixedAmount;
        } else if (commission.commissionType === 'percentage') {
            commissionAmount = (basePrice * commission.percentageAmount) / 100;
        }

        const finalPrice = basePrice + commissionAmount;

        return {
            basePrice,
            commissionAmount,
            finalPrice,
            commissionType: commission.commissionType
        };
    };

    // Setup polling for commission updates (fallback for WebSocket)
    useEffect(() => {
        let pollingInterval;
        
        const startPolling = () => {
            // Poll for commission updates every 5 seconds
            pollingInterval = setInterval(async () => {
                try {
                    const response = await api.get('/home/commission/settings');
                    if (response.data.success && response.data.commission) {
                        const newCommission = response.data.commission;
                        
                        // Check if commission has changed
                        if (JSON.stringify(newCommission) !== JSON.stringify(commission)) {
                            console.log('Commission updated via polling:', newCommission);
                            setCommission(newCommission);
                            
                            // Show notification to user
                            if (typeof window !== 'undefined' && window.toast) {
                                window.toast.success('Commission rates have been updated!');
                            } else {
                                console.log('Commission rates have been updated!');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error polling commission updates:', error);
                }
            }, 5000); // Poll every 5 seconds
        };

        // Start polling after initial fetch
        const timeoutId = setTimeout(startPolling, 2000);

        return () => {
            clearTimeout(timeoutId);
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [commission]);

    // Fetch commission settings on mount
    useEffect(() => {
        fetchCommissionSettings();
    }, []);

    const value = {
        commission,
        loading,
        calculateCommission,
        fetchCommissionSettings,
        socket
    };

    return (
        <CommissionContext.Provider value={value}>
            {children}
        </CommissionContext.Provider>
    );
};
