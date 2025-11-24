import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAdmin, registerAdmin } from '../redux/slices/adminAuthSlice';
import Button from '../components/Button';
import { Lock, Mail, User, Shield } from 'lucide-react';

const AdminLogin = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        staffCode: '' // Special code for staff verification
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = isSignup
            ? await dispatch(registerAdmin(formData))
            : await dispatch(loginAdmin(formData.email, formData.password));

        setLoading(false);

        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-4">
                        <Shield className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        {isSignup ? 'Staff Registration' : 'Admin Login'}
                    </h1>
                    <p className="text-gray-500">
                        {isSignup ? 'Create your staff account' : 'Access the admin dashboard'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSignup && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="admin@fusionkuiper.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {isSignup && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Staff Verification Code
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        required
                                        type="text"
                                        value={formData.staffCode}
                                        onChange={(e) => setFormData({ ...formData, staffCode: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Enter staff code"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Contact your administrator for the staff code
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            variant="primary"
                            className="w-full !py-3"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            {isSignup ? 'Already have an account? Sign In' : 'Need an account? Register'}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
