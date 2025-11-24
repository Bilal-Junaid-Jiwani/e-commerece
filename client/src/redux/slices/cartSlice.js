import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            if (quantity < 1) {
                state.items = state.items.filter(item => item.id !== id);
            } else {
                const item = state.items.find(item => item.id === id);
                if (item) {
                    item.quantity = quantity;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

export default cartSlice.reducer;
