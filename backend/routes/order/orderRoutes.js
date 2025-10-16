const orderController = require('../../controllers/order/orderController')
const router = require('express').Router()

// Customer
router.post('/home/order/place-order',orderController.place_order) 
router.post('/home/order/calculate-total',orderController.calculate_order_total)
router.get('/home/customer/get-dashboard-data/:userId',orderController.get_customer_dashboard_data)
router.get('/home/customer/get-orders/:customerId/:status',orderController.get_orders)
router.get('/home/customer/get-order-details/:orderId',orderController.get_order_details)
router.get('/home/customer/track-order/:orderNumber',orderController.track_order_by_number)
router.put('/home/customer/update-order-status/:orderId',orderController.update_order_status)

router.post('/order/create-payment',orderController.create_payment)
router.get('/order/confirm/:orderId',orderController.order_confirm)

// Admin
router.get('/admin/orders',orderController.get_admin_orders)
router.get('/admin/order/:orderId',orderController.get_admin_order)
router.put('/admin/order-status/update/:orderId',orderController.admin_order_status_update)
router.get('/admin/pending-orders',orderController.get_pending_orders)
router.put('/admin/approve-order/:orderId',orderController.approve_order)

// Seller
router.get('/seller/orders/:sellerId',orderController.get_seller_orders)
router.get('/seller/order/:orderId',orderController.get_seller_order)
router.put('/seller/order-status/update/:orderId',orderController.seller_order_status_update)
router.put('/seller/confirm-order/:orderId',orderController.confirm_order_seller)

// Receipt Download
router.get('/customer/download-receipt/:orderId',orderController.download_receipt)

// Purchase tracking routes
router.get('/admin/purchase-tracking',orderController.get_purchase_tracking)
router.put('/admin/update-task-status',orderController.update_task_status)

// Payment processing routes
router.post('/home/order/process-payment',orderController.process_payment)
router.get('/home/order/get-order/:orderId',orderController.get_order_details)
router.put('/home/order/update-status/:orderId',orderController.update_order_status)

// PDF generation routes
router.get('/home/order/generate-pdf/:orderId/:type',orderController.generate_order_pdf)

// Admin payment management routes
router.get('/admin/payment-info/:orderId',orderController.get_payment_info)
router.put('/admin/update-payment/:orderId',orderController.update_payment_info)
router.get('/admin/payments',orderController.get_all_payments)

// Test connection endpoint
router.get('/home/order/test-connection', (req, res) => {
    res.json({ success: true, message: 'Backend connection successful', timestamp: new Date() });
})

// Simple health check
router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running', timestamp: new Date() });
})

// Test order creation with minimal data
router.post('/home/order/test-create', async (req, res) => {
    try {
        const customerOrder = require('../../models/customerOrder');
        const { generateOrderNumber, generateTrackingNumber, calculateEstimatedDelivery, initializeTrackingHistory } = require('../../utiles/orderTrackingUtils');
        const moment = require('moment');
        
        const tempDate = moment(Date.now()).format('LLL');
        const orderNumber = generateOrderNumber();
        const trackingNumber = generateTrackingNumber();
        const estimatedDelivery = calculateEstimatedDelivery(tempDate, 'pending');
        const trackingHistory = initializeTrackingHistory(orderNumber);

        const testOrder = await customerOrder.create({
            customerId: '507f1f77bcf86cd799439011', // Test ObjectId
            shippingInfo: { name: 'Test User', address: 'Test Address' },
            products: [{ name: 'Test Product', price: 100 }],
            price: 100,
            payment_status: 'pending',
            delivery_status: 'pending',
            date: tempDate,
            orderNumber: orderNumber,
            trackingNumber: trackingNumber,
            estimatedDelivery: estimatedDelivery,
            trackingHistory: trackingHistory
        });

        res.json({ success: true, message: 'Test order created', orderId: testOrder.id });
    } catch (error) {
        console.error('Test order creation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: error.errors || error.keyPattern || error.code
        });
    }
})

// Debug endpoint to log frontend data
router.post('/home/order/debug-data', (req, res) => {
    console.log('=== FRONTEND DATA DEBUG ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('=== END DEBUG ===');
    
    res.json({ 
        success: true, 
        message: 'Data received and logged',
        receivedData: req.body
    });
})

module.exports = router  