const crypto = require('crypto');

/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXXX (where XXXXXX is a random 6-digit number)
 */
const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Generate a random 6-digit number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    
    return `ORD-${year}${month}${day}-${randomNumber}`;
};

/**
 * Generate a tracking number for courier services
 * Format: TRK-XXXXXXXX (where X is alphanumeric)
 */
const generateTrackingNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TRK-';
    
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
};

/**
 * Calculate estimated delivery date based on order date and delivery status
 */
const calculateEstimatedDelivery = (orderDate, deliveryStatus) => {
    const order = new Date(orderDate);
    let estimatedDays = 7; // Default 7 days
    
    switch (deliveryStatus) {
        case 'pending':
        case 'confirmed':
            estimatedDays = 7;
            break;
        case 'processing':
            estimatedDays = 5;
            break;
        case 'shipped':
            estimatedDays = 3;
            break;
        case 'out_for_delivery':
            estimatedDays = 1;
            break;
        case 'delivered':
            estimatedDays = 0;
            break;
        default:
            estimatedDays = 7;
    }
    
    const estimatedDelivery = new Date(order);
    estimatedDelivery.setDate(order.getDate() + estimatedDays);
    
    return estimatedDelivery;
};

/**
 * Get status description for tracking
 */
const getStatusDescription = (status) => {
    const descriptions = {
        'pending': 'Your order has been placed and is being processed',
        'confirmed': 'Your order has been confirmed and is being prepared',
        'processing': 'Your order is being processed and packed',
        'shipped': 'Your order has been shipped and is on its way',
        'out_for_delivery': 'Your order is out for delivery',
        'delivered': 'Your order has been delivered successfully',
        'cancelled': 'Your order has been cancelled',
        'returned': 'Your order has been returned'
    };
    
    return descriptions[status] || 'Status update not available';
};

/**
 * Get location based on delivery status
 */
const getStatusLocation = (status) => {
    const locations = {
        'pending': 'Order Processing Center',
        'confirmed': 'Order Processing Center',
        'processing': 'Warehouse',
        'shipped': 'In Transit',
        'out_for_delivery': 'Local Delivery Hub',
        'delivered': 'Delivered to Customer',
        'cancelled': 'Order Processing Center',
        'returned': 'Return Processing Center'
    };
    
    return locations[status] || 'Unknown Location';
};

/**
 * Initialize tracking history for a new order
 */
const initializeTrackingHistory = (orderNumber) => {
    return [{
        status: 'pending',
        description: getStatusDescription('pending'),
        location: getStatusLocation('pending'),
        timestamp: new Date(),
        updatedBy: 'system'
    }];
};

/**
 * Add tracking update to order
 */
const addTrackingUpdate = (currentHistory, newStatus, updatedBy = 'system') => {
    const newUpdate = {
        status: newStatus,
        description: getStatusDescription(newStatus),
        location: getStatusLocation(newStatus),
        timestamp: new Date(),
        updatedBy: updatedBy
    };
    
    return [...currentHistory, newUpdate];
};

module.exports = {
    generateOrderNumber,
    generateTrackingNumber,
    calculateEstimatedDelivery,
    getStatusDescription,
    getStatusLocation,
    initializeTrackingHistory,
    addTrackingUpdate
};
