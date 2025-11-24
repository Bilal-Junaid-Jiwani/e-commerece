import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import Button from '../components/Button';

const Cart = () => {
    const cart = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const dispatch = useDispatch();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your Cart is Empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/shop">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="flex-1 space-y-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{item.category}</p>
                                        {item.selectedColor && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Color:</span>
                                                <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600" style={{ backgroundColor: item.selectedColor }}></div>
                                            </div>
                                        )}
                                        {item.selectedSize && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Size: {item.selectedSize}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
                                        <button
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                            className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors text-gray-600 dark:text-gray-300"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                            className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors text-gray-600 dark:text-gray-300"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <p className="font-bold text-xl text-gray-900 dark:text-white">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-96">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link to="/checkout">
                            <Button variant="primary" className="w-full flex justify-center items-center gap-2 group">
                                Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
