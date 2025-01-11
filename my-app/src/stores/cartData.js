import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    statusTab: false // Sửa chính tả
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
                state.items.push({ productId, quantity });
            }
        },
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

export const { addToCart, changeQuanlity, toggleStatusTab } = cartData.actions;
export default cartData.reducer;
