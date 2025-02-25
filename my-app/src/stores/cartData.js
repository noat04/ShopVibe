// Function to load cart from localStorage
const loadCartFromLocalStorage = () => {
    try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')); // Get cart from localStorage
        return cartItems || []; // Return empty array if no items
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return []; // If error occurs, return empty array
    }
};

// Initial State
const initialState = {
    items: loadCartFromLocalStorage(), // Load cart from localStorage,
    statusTab: false, // Tab status (if needed)
};

// Action Types
const ADD_TO_CART = 'ADD_TO_CART';
const DELETE_FROM_CART = 'DELETE_FROM_CART';
const TOGGLE_STATUS_TAB = 'TOGGLE_STATUS_TAB';

// Reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { product, quantity, color, size } = action.payload;

            // Check if the product with the same attributes already exists in the cart
            const existingItemIndex = state.items.findIndex(item =>
                item.product.productId === product.productId
            );

            if (existingItemIndex !== -1) {
                // If product already in cart, increase the quantity
                const updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity } // Increase quantity
                        : item
                );
                // Update cart in localStorage
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                return { ...state, items: updatedItems };
            } else {
                // Add new item to the cart
                const updatedItems = [...state.items, { ...action.payload }];
                // Update cart in localStorage
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                return { ...state, items: updatedItems };
            }
        }

        case DELETE_FROM_CART: {
            const updatedItems = state.items.filter(item =>
                item.productId !== action.payload.productId ||
                item.color !== action.payload.color ||
                item.size !== action.payload.size
            );
            // Update cart in localStorage after item deletion
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            return { ...state, items: updatedItems };
        }


        case TOGGLE_STATUS_TAB:
            return { ...state, statusTab: !state.statusTab };

        default:
            return state;
    }
};

// Action creators
const addToCart = (product, quantity, color, size) => ({
    type: ADD_TO_CART,
    payload: { product, quantity, color, size }
});

const deleteFromCart = (productId, color, size) => ({
    type: DELETE_FROM_CART,
    payload: { productId, color, size },
});

const toggleStatusTab = () => ({
    type: TOGGLE_STATUS_TAB
});

// Export
export default cartReducer;
export { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage };
