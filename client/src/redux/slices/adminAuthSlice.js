import { createSlice } from '@reduxjs/toolkit';

const loadAdminUser = () => {
    try {
        const savedAdmin = localStorage.getItem('adminUser');
        return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch (e) {
        return null;
    }
};

const initialState = {
    adminUser: loadAdminUser(),
};

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        adminLoginSuccess: (state, action) => {
            state.adminUser = action.payload;
            localStorage.setItem('adminUser', JSON.stringify(action.payload));
        },
        adminLogout: (state) => {
            state.adminUser = null;
            localStorage.removeItem('adminUser');
        },
    },
});

export const { adminLoginSuccess, adminLogout } = adminAuthSlice.actions;

// Thunks for async API logic
export const loginAdmin = (email, password) => async (dispatch) => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(adminLoginSuccess(data));
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Login failed' };
        }
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const registerAdmin = (userData) => async (dispatch) => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch(adminLoginSuccess(data));
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Registration failed' };
        }
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const selectAdminUser = (state) => state.adminAuth.adminUser;

export default adminAuthSlice.reducer;
