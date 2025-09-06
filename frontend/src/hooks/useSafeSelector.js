import { useSelector } from 'react-redux';

// Custom hook to safely access Redux state
export const useSafeSelector = (selector, defaultValue = null) => {
    try {
        const state = useSelector(selector);
        // Additional check to ensure state is not undefined
        if (state === undefined || state === null) {
            console.warn('Redux state is undefined, using default value:', defaultValue);
            return defaultValue;
        }
        return state;
    } catch (error) {
        console.error('Error accessing Redux state:', error);
        return defaultValue;
    }
};

// Specific hooks for different parts of the state
export const useHomeState = () => {
    return useSafeSelector(state => state.home, {
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
    });
};

export const useAuthState = () => {
    return useSafeSelector(state => state.auth, {
        userInfo: null
    });
};

export const useCardState = () => {
    return useSafeSelector(state => state.card, {
        card_product_count: 0,
        wishlist_count: 0,
        errorMessage: '',
        successMessage: ''
    });
};
