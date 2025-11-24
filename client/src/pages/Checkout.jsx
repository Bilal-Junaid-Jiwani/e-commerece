import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/slices/cartSlice';
import { selectUser } from '../redux/slices/authSlice';
import Button from '../components/Button';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Checkout = () => {
    const cart = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [shipping, setShipping] = useState({
        address: '',
        city: '',
        zip: '',
        country: ''
    });
    const [payment, setPayment] = useState({
        cardNumber: '',
        expiry: '',
        cvc: ''
    });
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const { addNotification } = useNotification();

    const handleApplyPromo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/promo-codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode })
            });
            const data = await response.json();

            if (data.valid) {
                setDiscount(total * (data.discount / 100));
                addNotification('Promo code applied!', 'success');
            } else {
                setDiscount(0);
                addNotification(data.message || 'Invalid Promo Code', 'error');
            }
        } catch (error) {
            console.error('Error validating promo code:', error);
            addNotification('Failed to validate promo code', 'error');
        }
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            user: user ? { id: user.id, email: user.email } : 'Guest',
            items: cart,
            total: total - discount,
            shipping,
            payment: { method: 'Credit Card', last4: payment.cardNumber.slice(-4) },
            date: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                setStep(3);
                dispatch(clearCart());
                addNotification('Order placed successfully!', 'success');
            } else {
                addNotification('Order failed', 'error');
            }
        } catch (error) {
            console.error('Order error:', error);
            addNotification('Network error', 'error');
        }
    };

    if (cart.length === 0 && step !== 3) {
        return <div className="text-center py-20">Your cart is empty.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Forms */}
                <div className="md:col-span-2 space-y-8">
                    {/* Steps Indicator */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                            Shipping
                        </div>
                        <div className="h-1 w-12 bg-gray-200">
                            <div className={`h-full bg-blue-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                            Payment
                        </div>
                        <div className="h-1 w-12 bg-gray-200">
                            <div className={`h-full bg-blue-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                            Done
                        </div>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleShippingSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                <Truck className="text-blue-600" /> Shipping Address
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    required
                                    type="text"
                                    value={shipping.address}
                                    onChange={e => setShipping({ ...shipping, address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="123 Main St"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        required
                                        type="text"
                                        value={shipping.city}
                                        onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={shipping.zip}
                                        onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <input
                                    required
                                    type="text"
                                    value={shipping.country}
                                    onChange={e => setShipping({ ...shipping, country: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="United States"
                                />
                            </div>
                            <Button variant="primary" className="w-full !py-3">Continue to Payment</Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handlePaymentSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                <CreditCard className="text-blue-600" /> Payment Details
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                <input
                                    required
                                    type="text"
                                    value={payment.cardNumber}
                                    onChange={e => setPayment({ ...payment, cardNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                    <input
                                        required
                                        type="text"
                                        value={payment.expiry}
                                        onChange={e => setPayment({ ...payment, expiry: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                                    <input
                                        required
                                        type="text"
                                        value={payment.cvc}
                                        onChange={e => setPayment({ ...payment, cvc: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="123"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-colors"
                                >
                                    Back
                                </button>
                                <Button variant="primary" className="flex-1 !py-3">Pay ${(total - discount).toFixed(2)}</Button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900">Order Confirmed!</h2>
                            <p className="text-gray-500">Thank you for your purchase. Your order has been placed successfully.</p>
                            <Button variant="primary" onClick={() => navigate('/')}>Continue Shopping</Button>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                {step !== 3 && (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">Order Summary</h3>
                            <div className="space-y-4 max-h-96 overflow-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold line-clamp-1 text-gray-900">{item.title}</h4>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-blue-600">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code Section */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="Promo Code"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleApplyPromo}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {discount > 0 && (
                                    <p className="text-green-600 text-xs mt-2 font-bold">Promo code applied! You saved ${discount.toFixed(2)}</p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-bold text-green-600">Free</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold">
                                        <span>Discount</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-black pt-2 text-gray-900">
                                    <span>Total</span>
                                    <span>${(total - discount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
