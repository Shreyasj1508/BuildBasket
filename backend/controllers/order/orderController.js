const authOrderModel = require('../../models/authOrder')
const customerOrder = require('../../models/customerOrder')
const productModel = require('../../models/productModel')
const customerModel = require('../../models/customerModel')

const myShopWallet = require('../../models/myShopWallet')
const sellerWallet = require('../../models/sellerWallet')

const cardModel = require('../../models/cardModel')
const { responseReturn } = require('../../utiles/response') 
const { mongo: {ObjectId}} = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { calculateOrderTotal } = require('../../utiles/orderCalculation')
const { 
    generateOrderNumber, 
    generateTrackingNumber, 
    calculateEstimatedDelivery, 
    initializeTrackingHistory,
    addTrackingUpdate 
} = require('../../utiles/orderTrackingUtils')

class orderController {
    // Place order
    place_order = async (req, res) => {
        try {
            const { products, shippingInfo, paymentMethod } = req.body
            const customerId = req.body.customerId || req.id
            
            const orderNumber = generateOrderNumber()
            const trackingNumber = generateTrackingNumber()
            const tempDate = new Date().toLocaleString()
            const estimatedDelivery = calculateEstimatedDelivery(tempDate, 'pending')
            const trackingHistory = initializeTrackingHistory(orderNumber)
            
            const order = await customerOrder.create({
                customerId,
                orderNumber,
                trackingNumber,
                products,
                price: req.body.totalAmount || 0,
                shippingInfo,
                paymentMethod,
                estimatedDelivery,
                trackingHistory,
                payment_status: 'pending',
                delivery_status: 'pending',
                date: tempDate
            })
            
            responseReturn(res, 201, { 
                message: 'Order placed successfully',
                order: order
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Calculate order total
    calculate_order_total = async (req, res) => {
        try {
            const { products } = req.body
            let total = 0
            
            for (const item of products) {
                total += item.price * item.quantity
            }
            
            responseReturn(res, 200, { total })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Get customer dashboard data
    get_customer_dashboard_data = async (req, res) => {
        try {
            const { userId } = req.params
            const orders = await customerOrder.find({ customerId: userId })
            
            responseReturn(res, 200, { 
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => o.delivery_status === 'pending').length,
                orders: orders.slice(0, 5)
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Get orders
    get_orders = async (req, res) => {
        try {
            const { customerId, status } = req.params
            let query = { customerId }
            
            if (status !== 'all') {
                query.delivery_status = status
            }
            
            const orders = await customerOrder.find(query).sort({ createdAt: -1 })
            responseReturn(res, 200, { orders })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Get order details
    get_order_details = async (req, res) => {
        try {
            const { orderId } = req.params
            const order = await customerOrder.findById(orderId)
            
            if (!order) {
                return responseReturn(res, 404, { error: 'Order not found' })
            }
            
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Track order by number
    track_order_by_number = async (req, res) => {
        try {
            const { orderNumber } = req.params
            const order = await customerOrder.findOne({ orderNumber })
            
            if (!order) {
                return responseReturn(res, 404, { error: 'Order not found' })
            }
            
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Update order status
    update_order_status = async (req, res) => {
        try {
            const { orderId } = req.params
            const { status } = req.body
            
            const order = await customerOrder.findByIdAndUpdate(
                orderId,
                { delivery_status: status },
                { new: true }
            )
            
            if (!order) {
                return responseReturn(res, 404, { error: 'Order not found' })
            }
            
            responseReturn(res, 200, { 
                message: 'Order status updated',
                order
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Create payment
    create_payment = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'Payment created' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Order confirm
    order_confirm = async (req, res) => {
        try {
            const { orderId } = req.params
            const order = await customerOrder.findByIdAndUpdate(
                orderId,
                { payment_status: 'paid' },
                { new: true }
            )
            
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Admin methods
    get_admin_orders = async (req, res) => {
        try {
            const orders = await customerOrder.find().sort({ createdAt: -1 })
            responseReturn(res, 200, { orders })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_admin_order = async (req, res) => {
        try {
            const { orderId } = req.params
            const order = await customerOrder.findById(orderId)
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    admin_order_status_update = async (req, res) => {
        try {
            const { orderId } = req.params
            const { status } = req.body
            
            const order = await customerOrder.findByIdAndUpdate(
                orderId,
                { delivery_status: status },
                { new: true }
            )
            
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_pending_orders = async (req, res) => {
        try {
            const orders = await customerOrder.find({ delivery_status: 'pending' })
            responseReturn(res, 200, { orders })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    approve_order = async (req, res) => {
        try {
            const { orderId } = req.params
            const order = await customerOrder.findByIdAndUpdate(
                orderId,
                { delivery_status: 'approved' },
                { new: true }
            )
            
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Seller methods
    get_seller_orders = async (req, res) => {
        try {
            const { sellerId } = req.params
            const orders = await customerOrder.find({ 'products.sellerId': sellerId })
            responseReturn(res, 200, { orders })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_seller_order = async (req, res) => {
        try {
            const { orderId } = req.params
            const order = await customerOrder.findById(orderId)
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    seller_order_status_update = async (req, res) => {
        try {
            const { orderId } = req.params
            const { status } = req.body
            
            const order = await customerOrder.findByIdAndUpdate(
                orderId,
                { delivery_status: status },
                { new: true }
            )
            
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    confirm_order_seller = async (req, res) => {
        try {
            const { orderId } = req.params
            const order = await customerOrder.findByIdAndUpdate(
                orderId,
                { delivery_status: 'confirmed' },
                { new: true }
            )
            
            responseReturn(res, 200, { order })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Additional methods for compatibility
    download_receipt = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'Receipt download' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_purchase_tracking = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'Purchase tracking' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    update_task_status = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'Task status updated' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    process_payment = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'Payment processed' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    generate_order_pdf = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'PDF generated' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_payment_info = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'Payment info' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    update_payment_info = async (req, res) => {
        try {
            responseReturn(res, 200, { message: 'Payment info updated' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_all_payments = async (req, res) => {
        try {
            responseReturn(res, 200, { payments: [] })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new orderController()
