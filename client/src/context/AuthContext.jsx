import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, loginUser, logout, registerUser, updateUserProfile } from '../redux/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const login = async (email, password) => {
        return await dispatch(loginUser(email, password));
    };

    const register = async (userData) => {
        return await dispatch(registerUser(userData));
    };

    const signOut = () => {
        dispatch(logout());
    };

    const updateProfile = async (data) => {
        return await dispatch(updateUserProfile(data));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout: signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
