// Function to load cart from localStorage
const loadCartFromLocalStorage = () => {
    try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')); // Lấy giỏ hàng từ localStorage
        return cartItems || []; // Nếu không có, trả về mảng rỗng
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return []; // Nếu có lỗi, trả về mảng rỗng
    }
};

// Initial State
const initialState = {
    items: loadCartFromLocalStorage(), // Tải giỏ hàng từ localStorage
    statusTab: false, // Giả sử bạn cần có trạng thái của tab này
};

// Action Types
const ADD_TO_CART = 'ADD_TO_CART';
const TOGGLE_STATUS_TAB = 'TOGGLE_STATUS_TAB';
const DELETE_FROM_CART = 'DELETE_FROM_CART';

// Reducer
const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.productId === productId);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    items: [...state.items, action.payload],
                };
            }
        }
        case DELETE_FROM_CART:
            return {
                ...state,
                items: state.items.filter(item => item.productId !== action.payload.productId),
            };
        case TOGGLE_STATUS_TAB:
            return { ...state, statusTab: !state.statusTab };
        default:
            return state;
    }
};

// Action creators
const addToCart = (productId, quantity) => ({
    type: ADD_TO_CART,
    payload: { productId, quantity }
});

const toggleStatusTab = () => ({
    type: TOGGLE_STATUS_TAB
});

const deleteFromCart = (productId) => ({
    type: DELETE_FROM_CART,
    payload: { productId },
});

// Export
export default cartReducer;
export { initialState, addToCart, toggleStatusTab, deleteFromCart, loadCartFromLocalStorage };
