require('dotenv').config()
console.log('🚀 Starting AlmaMate Backend Server...')
console.log('📍 Environment: LOCAL DEVELOPMENT ONLY')

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { dbConnect } = require('./utiles/db')

const socket = require('socket.io')
const http = require('http')
const server = http.createServer(app)
app.use(cors({
    origin : [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL,
        process.env.DASHBOARD_URL
    ].filter(Boolean),
    credentials: true
}))

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    }
})

var allCustomer = []
var allSeller = []
let admin = {}

const addUser = (customerId,socketId,userInfo) => {
    const checkUser = allCustomer.some(u => u.customerId === customerId)
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        })
    }
} 

const addSeller = (sellerId,socketId,userInfo) => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId)
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        })
    }
} 

const findCustomer = (customerId) => {
    return allCustomer.find(c => c.customerId === customerId)
}
const findSeller = (sellerId) => {
    return allSeller.find(c => c.sellerId === sellerId)
}

const remove = (socketId) => {
    allCustomer = allCustomer.filter(c => c.socketId !== socketId)
    allSeller = allSeller.filter(c => c.socketId !== socketId)
}

io.on('connection', (soc) => {
    console.log('socket server running..')

    soc.on('add_user',(customerId,userInfo)=>{
         addUser(customerId,soc.id,userInfo)
         io.emit('activeSeller', allSeller) 
    })
    soc.on('add_seller',(sellerId, userInfo) => {
       addSeller(sellerId,soc.id,userInfo)
       io.emit('activeSeller', allSeller) 
    })
    soc.on('send_seller_message',(msg) => {
        const customer = findCustomer(msg.receverId)
        if (customer !== undefined) {
            soc.to(customer.socketId).emit('seller_message', msg)
        }
    })  
    soc.on('send_customer_message',(msg) => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg)
        }
    })  

    soc.on('send_message_admin_to_seller',(msg) => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('receved_admin_message', msg)
        }
    })

    soc.on('send_message_seller_to_admin',(msg) => { 
        if (admin.socketId) {
            soc.to(admin.socketId).emit('receved_seller_message', msg)
        }
    })



    soc.on('add_admin',(adminInfo) => {
        delete adminInfo.email
        delete adminInfo.password
        admin = adminInfo
        admin.socketId = soc.id  
        io.emit('activeSeller', allSeller) 

     })

    soc.on('disconnect',() => {
        console.log('user disconnect')
        remove(soc.id)
        io.emit('activeSeller', allSeller) 
    })

    // Commission update broadcasting
    soc.on('commission_updated', (commissionData) => {
        console.log('Commission updated, broadcasting to all clients:', commissionData);
        io.emit('commission_changed', commissionData);
    })

})


app.use(bodyParser.json())
app.use(cookieParser())
 
app.use('/api/home',require('./routes/home/homeRoutes'))
app.use('/api/home/commission',require('./routes/home/commissionRoutes'))
app.use('/api',require('./routes/authRoutes'))
app.use('/api',require('./routes/order/orderRoutes'))
app.use('/api',require('./routes/home/cardRoutes'))
app.use('/api',require('./routes/dashboard/categoryRoutes'))
app.use('/api',require('./routes/dashboard/productRoutes'))
app.use('/api',require('./routes/dashboard/sellerRoutes'))
app.use('/api/seller',require('./routes/dashboard/sellerFeaturesRoutes'))
app.use('/api',require('./routes/home/customerAuthRoutes'))
app.use('/api',require('./routes/chatRoutes'))
app.use('/api',require('./routes/paymentRoutes'))
app.use('/api',require('./routes/dashboard/dashboardRoutes'))
app.use('/api',require('./routes/priceDetailRoutes'))

// Excel routes
app.use('/api/excel',require('./routes/excelRoutes'))

// Admin-only routes
app.use('/api',require('./routes/admin/adminProductRoutes'))
app.use('/api',require('./routes/admin/adminCategoryRoutes'))
app.use('/api/admin/commission',require('./routes/admin/commissionRoutes'))
app.use('/api/admin',require('./routes/admin/commodityRoutes'))
app.use('/api/admin',require('./routes/admin/buyerRoutes'))
app.use('/api/admin',require('./routes/admin/reportsRoutes'))
app.use('/api/admin',require('./routes/admin/analyticsRoutes'))

// New Admin Features Routes
app.use('/api/admin/commodity', require('./routes/admin/adminCommodityRoutes'))
app.use('/api/admin/users', require('./routes/admin/adminUserVerificationRoutes'))
app.use('/api/admin/reports', require('./routes/admin/adminReportsRoutes'))
app.use('/api/admin/analytics', require('./routes/admin/adminAnalyticsRoutes'))
app.use('/api/admin', require('./routes/admin/adminActivitiesRoutes'))

// Seeder Routes
app.use('/api/admin', require('./routes/seedRealDataRoutes'))

// Temporary seeding route (REMOVE AFTER SEEDING)
// app.use('/api',require('./routes/seedRoutes'))

app.get('/',(req,res) => res.send('Hello Server'))

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const connectionState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        res.json({
            status: 'success',
            connectionState: states[connectionState],
            dbUrl: process.env.DB_URL ? 'Set' : 'Not Set',
            cloudinary: process.env.cloud_name ? 'Set' : 'Not Set'
        });
    } catch (error) {
        res.json({
            status: 'error',
            error: error.message
        });
    }
})
const port = 5000; // Local development port
global.io = io; // Make io available globally

// Connect to MongoDB
dbConnect();

// Start server
server.listen(port, () => {
    console.log('✅ Server is running on port:', port);
    console.log('🌐 Backend API: http://localhost:5000');
    console.log('📁 Static files: http://localhost:5000/uploads');
    console.log('');
    console.log('💡 Make sure MongoDB is running: mongod');
    console.log('🔗 Frontend should run on: http://localhost:3001');
    console.log('📊 Dashboard should run on: http://localhost:3000');
});