import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { User, Lock, Mail, Camera } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: null
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let result;

        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            if (!isLogin && (!formData.name || !formData.email || !formData.password)) {
                setError('Please fill in all fields');
                return;
            }
            result = await register(formData);
        }

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-md transition-colors duration-300">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4 text-blue-600 dark:text-blue-400 relative overflow-hidden border-2 border-blue-100 dark:border-blue-800">
                        {preview ? (
                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{isLogin ? 'Enter your details to access your account' : 'Sign up to get started'}</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-3 rounded-lg mb-6 text-sm text-center border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                                <div className="relative">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="avatar-upload" />
                                    <label htmlFor="avatar-upload" className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
                                        <Camera size={20} className="mr-2" />
                                        <span>Upload Photo</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button variant="primary" className="w-full !py-4 text-lg shadow-lg shadow-blue-500/30">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '', avatar: null });
                                setPreview(null);
                            }}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
