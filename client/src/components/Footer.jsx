import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                            FUSION<span className="text-gray-900 dark:text-white">KUIPER</span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            Experience the future of shopping with our curated collection of premium products. Quality meets innovation in every item we offer.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-400 hover:text-white transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-600 hover:text-white transition-all">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/shop" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shop All</Link></li>
                            <li><Link to="/shop" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">New Arrivals</Link></li>
                            <li><Link to="/shop" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Best Sellers</Link></li>
                            <li><Link to="/wishlist" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQs</a></li>
                            <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-500 dark:text-gray-400">
                                <MapPin size={20} className="flex-shrink-0 text-blue-600 mt-1" />
                                <span>123 Innovation Drive,<br />Tech City, TC 90210</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <Phone size={20} className="flex-shrink-0 text-blue-600" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                <Mail size={20} className="flex-shrink-0 text-blue-600" />
                                <span>support@fusionkuiper.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} Fusion Kuiper. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
