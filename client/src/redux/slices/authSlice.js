import { createSlice } from '@reduxjs/toolkit';
import API_URL from '../../utils/api';

const loadUser = () => {
    try {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
        return null;
    }
};

const initialState = {
    user: loadUser(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        updateProfileSuccess: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
});

export const { loginSuccess, logout, updateProfileSuccess } = authSlice.actions;

// Thunks for async API logic
export const loginUser = (email, password) => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(loginSuccess(data));
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Login failed' };
        }
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const registerUser = (userData) => async (dispatch) => {
    try {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(loginSuccess(data));
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Registration failed' };
        }
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const updateUserProfile = (updatedData) => async (dispatch, getState) => {
    const { auth } = getState();
    const currentUser = auth.user;

    if (!currentUser) return { success: false, message: 'Not logged in' };

    try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email, ...updatedData }),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(updateProfileSuccess(data));
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Update failed' };
        }
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
