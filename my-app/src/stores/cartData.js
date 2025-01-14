import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [], // Lấy từ localStorage nếu có
    statusTab: false,
};

const cartData = createSlice({
    name: 'cartData',
    initialState,
    reducers: {
        addToCart(state, action) {
            const { productId, quantity } = action.payload;

            // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
            const existingItem = state.items.find(item => item.productId === productId);

            if (existingItem) {
                // Cập nhật số lượng
                existingItem.quantity += quantity;
            } else {
                // Thêm sản phẩm mới vào giỏ hàng
                state.items.push(action.payload);
            }
            // Cập nhật vào localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.items));

        },
        deleteToCart(state, action) {
            const { productId } = action.payload;
            console.log('Deleting productId:', productId);

            // Make sure you access the correct structure and mutate it properly
            const existingItemIndex = state.items.findIndex(item => item.product.productId === productId);

            if (existingItemIndex !== -1) {
                // Remove the item from the cart
                state.items.splice(existingItemIndex, 1);
                console.log('Product removed, updated cart:', state.items);
            } else {
                console.error('Product not found in cart');
            }

            // Store updated cart to localStorage
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        }
        ,
        // Không nên có reducer trả về giá trị, nên thay vào đó là action
        loadCartFromLocalStorage(state) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            state.items = cartItems; // Cập nhật trạng thái với cartItems lấy từ localStorage
        }
        ,
        changeQuanlity(state, action) {
            const { productId, quantity } = action.payload;

            // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
            const existingItem = state.items.find(item => item.productId === productId);

            if (existingItem) {
                if (quantity > 0) {
                    existingItem.quantity = quantity; // Cập nhật số lượng
                } else {
                    // Xóa sản phẩm nếu số lượng bằng 0
                    state.items = state.items.filter(item => item.productId !== productId);
                }
            }
        },
        toggleStatusTab(state) {
            state.statusTab = !state.statusTab; // Toggle trạng thái
        }
    }
});

export const { addToCart, deleteToCart, changeQuanlity, toggleStatusTab, loadCartFromLocalStorage } = cartData.actions;
export default cartData.reducer;
