import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { User, Lock, Mail, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, updateProfile } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: user.password || '',
                avatar: user.avatar || null
            });
            setPreviewUrl(user.avatar);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.type === 'file' ? 'avatar' : e.target.type]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const result = await updateProfile(formData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
        }
    };

    if (!user) return <div className="text-center py-20">Please log in to view settings.</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Account Settings</h1>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4 text-blue-600 dark:text-blue-400 relative overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} />
                        )}
                    </div>
                    <div className="relative inline-block">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="avatar-upload-settings"
                        />
                        <label htmlFor="avatar-upload-settings" className="text-sm text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:text-blue-700 dark:hover:text-blue-300">
                            Change Profile Photo
                        </label>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 ml-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter new password"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button variant="primary" className="w-full !py-3 text-lg flex items-center justify-center gap-2">
                            <Save size={20} />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
