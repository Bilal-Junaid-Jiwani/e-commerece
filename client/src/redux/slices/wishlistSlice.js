import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (userId) => {
    const response = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return await response.json();
});

export const toggleWishlist = createAsyncThunk('wishlist/toggleWishlist', async (product, { getState }) => {
    const { auth, wishlist } = getState();

    if (!auth.user) {
        return { product, isLocal: true };
    }

    const exists = wishlist.items.find(item => item.id === product.id);
    let response;

    if (exists) {
        response = await fetch(`http://localhost:5000/api/wishlist/${auth.user.id}/${product.id}`, {
            method: 'DELETE'
        });
    } else {
        response = await fetch('http://localhost:5000/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: auth.user.id, productId: product.id }),
        });
    }

    if (!response.ok) throw new Error('Failed to update wishlist');
    return await response.json();
});

const initialState = {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        // We can keep a clearWishlist reducer if needed on logout
        clearWishlist: (state) => {
            state.items = [];
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                if (action.payload.isLocal) {
                    // Local toggle logic
                    const product = action.payload.product;
                    const index = state.items.findIndex(item => item.id === product.id);
                    if (index >= 0) {
                        state.items.splice(index, 1);
                    } else {
                        state.items.push(product);
                    }
                } else {
                    // Cloud sync returns the full updated list
                    state.items = action.payload;
                }
            });
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export const selectWishlistItems = state => state.wishlist.items;
export const selectWishlistCount = state => state.wishlist.items.length;
export const selectIsInWishlist = (state, productId) => state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
