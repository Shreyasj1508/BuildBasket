import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 

export const place_order = createAsyncThunk(
    'order/place_order',
    async({ price,products,shipping_fee,items,shippingInfo,userId,navigate}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/home/order/place-order',{
                price,products,shipping_fee,items,shippingInfo,userId,navigate
            })
            navigate('/payment',{
                state: {
                    price:price + shipping_fee,
                    items,
                    orderId: data.orderId 
                }
            })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to place order' })
        }
    }
)
// End Method 

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async({customerId,status}, { rejectWithValue,fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/customer/get-orders/${customerId}/${status}`) 
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch orders' })
        }
    }
)
// End Method 

export const get_order_details = createAsyncThunk(
    'order/get_order_details',
    async(orderId , { rejectWithValue,fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/customer/get-order-details/${orderId}`) 
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch order details' })
        }
    }
)
// End Method 

export const get_customer_dashboard_data = createAsyncThunk(
    'order/get_customer_dashboard_data',
    async(userId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/customer/get-dashboard-data/${userId}`) 
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch dashboard data' })
        }
    }
)
// End Method 

export const track_order = createAsyncThunk(
    'order/track_order',
    async(orderId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/customer/get-order-details/${orderId}`) 
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Order not found' })
        }
    }
)
// End Method 

export const orderReducer = createSlice({
    name: 'order',
    initialState:{
        myOrders : [], 
        errorMessage : '',
        successMessage: '',  
        myOrder : {},
        dashboardData: {
            recentOrders: [],
            pendingOrder: 0,
            totalOrder: 0,
            cancelledOrder: 0
        },
        trackedOrder: null,
        loader: false
    },
    reducers : {
        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
        clearTrackedOrder: (state) => {
            state.trackedOrder = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(place_order.pending, (state) => {
            state.loader = true
            state.errorMessage = ''
        })
        .addCase(place_order.fulfilled, (state, { payload }) => { 
            state.loader = false
            state.successMessage = payload.message || 'Order placed successfully'
        })
        .addCase(place_order.rejected, (state, { payload }) => { 
            state.loader = false
            state.errorMessage = payload?.error || 'Failed to place order'
        })
        
        .addCase(get_orders.pending, (state) => {
            state.loader = true
        })
        .addCase(get_orders.fulfilled, (state, { payload }) => { 
            state.loader = false
            state.myOrders = payload.orders; 
        })
        .addCase(get_orders.rejected, (state, { payload }) => { 
            state.loader = false
            state.errorMessage = payload?.error || 'Failed to fetch orders'
        })
        
        .addCase(get_order_details.pending, (state) => {
            state.loader = true
        })
        .addCase(get_order_details.fulfilled, (state, { payload }) => { 
            state.loader = false
            state.myOrder = payload.order; 
        })
        .addCase(get_order_details.rejected, (state, { payload }) => { 
            state.loader = false
            state.errorMessage = payload?.error || 'Failed to fetch order details'
        })
        
        .addCase(get_customer_dashboard_data.pending, (state) => {
            state.loader = true
        })
        .addCase(get_customer_dashboard_data.fulfilled, (state, { payload }) => { 
            state.loader = false
            state.dashboardData = payload
        })
        .addCase(get_customer_dashboard_data.rejected, (state, { payload }) => { 
            state.loader = false
            state.errorMessage = payload?.error || 'Failed to fetch dashboard data'
        })
        
        .addCase(track_order.pending, (state) => {
            state.loader = true
            state.errorMessage = ''
        })
        .addCase(track_order.fulfilled, (state, { payload }) => { 
            state.loader = false
            state.trackedOrder = payload.order
        })
        .addCase(track_order.rejected, (state, { payload }) => { 
            state.loader = false
            state.errorMessage = payload?.error || 'Order not found'
        })
    }
})
export const {messageClear, clearTrackedOrder} = orderReducer.actions
export default orderReducer.reducer