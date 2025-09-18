import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import io from 'socket.io-client';

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

    // Setup Socket.io for real-time commission updates
    useEffect(() => {
        const socketInstance = io('http://localhost:5000', {
            transports: ['websocket', 'polling']
        });

        setSocket(socketInstance);

        // Debug: Log socket instance and connection state
        console.log('[CommissionContext] Socket instance created:', socketInstance);

        // Listen for commission updates
        socketInstance.on('commission_changed', (data) => {
            console.log('[CommissionContext] Real-time commission update received:', data);
            if (data.commission) {
                setCommission(data.commission);
                // Debug: Log commission update
                console.log('[CommissionContext] Commission state updated:', data.commission);
                // Show notification to user
                if (typeof window !== 'undefined' && window.toast) {
                    window.toast.success('Commission rates have been updated!');
                } else {
                    console.log('[CommissionContext] Commission rates have been updated!');
                }
            }
        });

        // Handle connection events
        socketInstance.on('connect', () => {
            console.log('[CommissionContext] Connected to server for commission updates');
        });

        socketInstance.on('disconnect', () => {
            console.log('[CommissionContext] Disconnected from server');
        });

        socketInstance.on('connect_error', (error) => {
            console.error('[CommissionContext] Socket connection error:', error);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Fetch commission settings on mount
    useEffect(() => {
        fetchCommissionSettings();
    }, []);

    // Fallback polling mechanism (in case Socket.io fails)
    useEffect(() => {
        let pollingInterval;
        
        const startFallbackPolling = () => {
            // Poll every 30 seconds as fallback
            pollingInterval = setInterval(async () => {
                try {
                    const response = await api.get('/home/commission/settings');
                    if (response.data.success && response.data.commission) {
                        const newCommission = response.data.commission;
                        
                        // Check if commission has changed
                        if (JSON.stringify(newCommission) !== JSON.stringify(commission)) {
                            console.log('Commission updated via fallback polling:', newCommission);
                            setCommission(newCommission);
                        }
                    }
                } catch (error) {
                    console.error('Error in fallback polling:', error);
                }
            }, 30000); // Poll every 30 seconds
        };

        // Start fallback polling after 10 seconds
        const timeoutId = setTimeout(startFallbackPolling, 10000);

        return () => {
            clearTimeout(timeoutId);
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [commission]);

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
