import {configureStore} from '@reduxjs/toolkit'
import rootReducer from './rootReducer'

// Enhanced store configuration with better error handling
const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false
        })
    },
    devTools: true,
    preloadedState: {
        home: {
            categorys: [],
            products: [],
            totalProduct: 0,
            parPage: 3,
            latest_product: [],
            topRated_product: [],
            discount_product: [],
            priceRange: { low: 0, high: 100 },
            product: {},
            relatedProducts: [],
            moreProducts: [],
            errorMessage: '',
            successMessage: '',
            totalReview: 0,
            rating_review: [],
            reviews: [],
            banners: []
        },
        auth: {
            userInfo: null
        },
        card: {
            card_product_count: 0,
            wishlist_count: 0,
            errorMessage: '',
            successMessage: ''
        },
        order: {
            myOrders: [],
            myOrder: {}
        },
        dashboard: {
            recentOrders: [],
            totalOrder: 0,
            pendingOrder: 0,
            cancelledOrder: 0
        },
        chat: {
            fb_messages: [],
            currentFd: {},
            my_friends: [],
            successMessage: ''
        }
    }
})

// Enhanced error monitoring for store
store.subscribe(() => {
    try {
        const state = store.getState();
        
        // Check if state exists
        if (!state) {
            console.error('Redux store state is null or undefined');
            return;
        }
        
        // Log initial state for debugging
        if (state.home && state.home.products && state.home.products.length === 0) {
            console.log('Redux store initialized successfully with empty arrays');
        }
        
        // Check if home state exists and has required properties
        if (!state.home) {
            console.error('Home state is missing from Redux store');
            return;
        }
        
        // Check if required properties exist in home state
        const requiredHomeProps = ['categorys', 'products', 'latest_product', 'banners'];
        for (const prop of requiredHomeProps) {
            if (!(prop in state.home)) {
                console.warn(`Home state missing property: ${prop}`);
            } else {
                console.log(`Home state property ${prop} exists:`, Array.isArray(state.home[prop]) ? `Array with ${state.home[prop].length} items` : typeof state.home[prop]);
            }
        }
        
        // Check auth state
        if (!state.auth) {
            console.error('Auth state is missing from Redux store');
        }
        
        // Check card state
        if (!state.card) {
            console.error('Card state is missing from Redux store');
        }
        
    } catch (error) {
        console.error('Error accessing Redux store state:', error);
    }
});

export default store