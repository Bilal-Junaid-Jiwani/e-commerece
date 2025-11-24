import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Heart, LogOut, Package } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount } from '../redux/slices/cartSlice';
import { selectUser, logout } from '../redux/slices/authSlice';
import Button from './Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const cartCount = useSelector(selectCartCount);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [storeName, setStoreName] = useState('FUSION KUIPER');

    useEffect(() => {
        fetch('http://localhost:5000/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.storeName) setStoreName(data.storeName);
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 uppercase">
                            {storeName}
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        <Link to="/shop" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Shop</Link>
                        <Link to="/shop" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Categories</Link>
                    </div>

                    {/* Icons & CTA */}
                    <div className="hidden md:flex items-center space-x-6">
                        <form onSubmit={handleSearch} className="relative hidden lg:block">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="pl-4 pr-10 py-1 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-all text-gray-700"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                                <Search size={16} />
                            </button>
                        </form>

                        <Link to="/wishlist" className="text-gray-500 hover:text-rose-500 transition-colors">
                            <Heart size={20} />
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 overflow-hidden">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        )}
                                    </div>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <User size={16} />
                                        Settings
                                    </Link>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <Package size={16} />
                                        Orders
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                                    Log In
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" className="!py-2 !px-4 text-sm">Get Started</Button>
                                </Link>
                            </div>
                        )}

                        <Link to="/cart" className="relative text-gray-500 hover:text-blue-600 transition-colors">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600 focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <form onSubmit={handleSearch} className="mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-4 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                        </form>
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Shop</Link>

                        {user ? (
                            <>
                                <Link to="/wishlist" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Wishlist</Link>
                                <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Orders</Link>
                                <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Settings</Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Log In</Link>
                                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
