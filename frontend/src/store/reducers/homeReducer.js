import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";


export const get_category = createAsyncThunk(
    'product/get_category',
    async(_, { fulfillWithValue }) => {
        try {
            const {data} = await api.get('/home/get-categorys')
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)
// End Method 
export const get_products = createAsyncThunk(
    'product/get_products',
    async(_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const {data} = await api.get('/home/get-products')
             console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log('Error fetching products:', error.response || error.message)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// End Method 
export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async(_, { fulfillWithValue }) => {
        try {
            const {data} = await api.get('/home/price-range-latest-product')
             console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)

// End Method 


export const query_products = createAsyncThunk(
    'product/query_products',
    async(query , { fulfillWithValue }) => {
        try {
            const url = `/home/query-products?category=${encodeURIComponent(query.category)}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}&&searchValue=${query.searchValue ? encodeURIComponent(query.searchValue) : ''}`
            const {data} = await api.get(url)
            return fulfillWithValue(data)
        } catch (error) {
            console.log('❌ API Error:', error.response)
        }
    }
)
// End Method 

export const product_details = createAsyncThunk(
    'product/product_details',
    async(slug, { fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/product-details/${slug}`)
            //  console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }

)

// End Method 
export const customer_review = createAsyncThunk(
    'review/customer_review',
    async(info, { fulfillWithValue }) => {
        try {
            const {data} = await api.post('/home/customer/submit-review',info)
            //  console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)

// End Method 

export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async({productId, pageNumber}, { fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`)
            //  console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response)
        }
    }
)
// End Method 


export const get_banners = createAsyncThunk(
    'banner/get_banners',
    async( _ , { fulfillWithValue, rejectWithValue }) => {
        try {
            const {data} = await api.get(`/banners`)
            //  console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log('Error fetching banners:', error.response || error.message)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)
// End Method 




export const homeReducer = createSlice({
    name: 'home',
    initialState:{
        categorys : [],
        products : [],
        totalProduct : 0,
        parPage: 3,
        latest_product : [],
        topRated_product : [],
        discount_product : [],
        priceRange : {
            low: 0,
            high: 100
        },
        product: {},
        relatedProducts: [],
        moreProducts: [],
        errorMessage : '',
        successMessage: '',
        totalReview: 0,
        rating_review: [],
        reviews : [],
        banners: [] 
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
 
    },
    extraReducers: (builder) => {
        builder
        .addCase(get_category.fulfilled, (state, { payload }) => {
            state.categorys = payload?.categorys || [];
        })
        .addCase(get_products.fulfilled, (state, { payload }) => {
            state.products = payload?.products || [];
            state.latest_product = payload?.latest_product || [];
            state.topRated_product = payload?.topRated_product || [];
            state.discount_product = payload?.discount_product || [];
        })
        .addCase(get_products.rejected, (state, { payload }) => {
            console.error('Failed to fetch products:', payload);
            state.errorMessage = 'Failed to load products';
        })
        .addCase(price_range_product.fulfilled, (state, { payload }) => { 
            state.latest_product = payload?.latest_product || [];
            state.priceRange = payload?.priceRange || { low: 0, high: 100000 }; 
        })
        .addCase(query_products.fulfilled, (state, { payload }) => { 
            state.products = payload?.products || [];
            state.totalProduct = payload?.totalProduct || 0;
            state.parPage = payload?.parPage || 10; 
        })

        .addCase(product_details.fulfilled, (state, { payload }) => { 
            state.product = payload?.product || {};
            state.relatedProducts = payload?.relatedProducts || [];
            state.moreProducts = payload?.moreProducts || []; 
        })

        .addCase(customer_review.fulfilled, (state, { payload }) => {
            state.successMessage = payload?.message || 'Review submitted successfully';
        })

        .addCase(get_reviews.fulfilled, (state, { payload }) => {
            state.reviews = payload?.reviews || [];
            state.totalReview = payload?.totalReview || 0;
            state.rating_review = payload?.rating_review || {};
        })

        .addCase(get_banners.fulfilled, (state, { payload }) => {
            state.banners = payload?.banners || []; 
        })
        .addCase(get_banners.rejected, (state, { payload }) => {
            console.error('Failed to fetch banners:', payload);
            state.errorMessage = 'Failed to load banners';
        })

    }
})
export const {messageClear} = homeReducer.actions
export default homeReducer.reducer