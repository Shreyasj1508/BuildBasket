import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 

export const add_product = createAsyncThunk(
    'product/add_product',
    async(product,{rejectWithValue, fulfillWithValue}) => {
        
        try { 
            const {data} = await api.post('/product-add',product,{withCredentials: true}) 
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response?.data || { error: 'Network error occurred' })
        }
    }
)

// End Method 

export const get_products = createAsyncThunk(
    'product/get_products',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/products-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch products' })
        }
    }
)

  // End Method 

export const get_seller_products = createAsyncThunk(
    'product/get_seller_products',
    async(_,{rejectWithValue, fulfillWithValue}) => {
        
        try {
            const {data} = await api.get('/products-get',{withCredentials: true}) 
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch products' })
        }
    }
)

  // End Method 

  
export const get_product = createAsyncThunk(
    'product/get_product',
    async( productId ,{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/product-get/${productId}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch product' })
        }
    }
)

export const delete_product = createAsyncThunk(
    'product/delete_product',
    async(productId,{rejectWithValue, fulfillWithValue}) => {
        
        try {
            const {data} = await api.delete(`/product-delete/${productId}`,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to delete product' })
        }
    }
)

export const update_product = createAsyncThunk(
    async( product ,{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.post('/product-update', product,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response?.data || { error: 'Failed to update product' })
        }
    }
)

  // End Method 


  export const product_image_update = createAsyncThunk(
    'product/product_image_update',
    async( {oldImage,newImage,productId} ,{rejectWithValue, fulfillWithValue}) => {
        
        try {

            const formData = new FormData()
            formData.append('oldImage', oldImage)
            formData.append('newImage', newImage)
            formData.append('productId', productId)             
            const {data} = await api.post('/product-image-update', formData,{withCredentials: true}) 
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response?.data || { error: 'Failed to update product image' })
        }
    }
)

  // End Method 




 
export const productReducer = createSlice({
    name: 'product',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        loader: false,
        loading: false,
        products : [], 
        product : '',
        totalProduct: 0
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
        .addCase(add_product.pending, (state, { payload }) => {
            state.loader = true;
            state.errorMessage = '';
        })
        .addCase(add_product.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'Failed to add product'
        }) 
        .addCase(add_product.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload?.message || 'Product added successfully'
             
        })

        .addCase(get_products.fulfilled, (state, { payload }) => {
            state.totalProduct = payload?.totalProduct || 0;
            state.products = payload?.products || [];
             
        })
        .addCase(get_product.fulfilled, (state, { payload }) => {
            state.product = payload?.product || '';  
        })

        .addCase(get_seller_products.pending, (state) => {
            state.loading = true;
            state.errorMessage = '';
        })
        .addCase(get_seller_products.rejected, (state, { payload }) => {
            state.loading = false;
            state.errorMessage = payload?.error || 'Failed to fetch products';
        })
        .addCase(get_seller_products.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.products = payload?.products || [];
            state.totalProduct = payload?.totalProduct || 0;
        })

        .addCase(delete_product.pending, (state, { payload }) => {
            state.loader = true;
            state.errorMessage = '';
        })
        .addCase(delete_product.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'Failed to delete product'
        }) 
        .addCase(delete_product.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload?.message || 'Product deleted successfully'
            // Remove the deleted product from the products array
            state.products = state.products.filter(product => product._id !== payload?.productId)
        })

        .addCase(update_product.pending, (state, { payload }) => {
            state.loader = true;
            state.errorMessage = '';
        })
        .addCase(update_product.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'Failed to update product'
        }) 
        .addCase(update_product.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.product = payload?.product || ''
            state.successMessage = payload?.message || 'Product updated successfully'
             
        })

        .addCase(product_image_update.fulfilled, (state, { payload }) => { 
            state.product = payload?.product || ''
            state.successMessage = payload?.message || 'Product image updated successfully'
        })
 

    }

})
export const {messageClear} = productReducer.actions
export default productReducer.reducer