import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAdminUser } from '../redux/slices/adminAuthSlice';

const AdminProtectedRoute = ({ children }) => {
    const adminUser = useSelector(selectAdminUser);

    if (!adminUser) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
