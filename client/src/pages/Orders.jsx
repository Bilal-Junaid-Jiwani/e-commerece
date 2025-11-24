import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import { Package, Clock, CheckCircle } from 'lucide-react';

const Orders = () => {
    const user = useSelector(selectUser);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/api/orders?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data.reverse()); // Show newest first
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch orders', err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) return <div className="text-center py-20">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Package size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-4">No Orders Yet</h2>
                <p className="text-gray-500">You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Order History</h1>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Order Placed</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Total</p>
                                    <p className="font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Order #</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm font-bold">
                                <Clock size={16} />
                                {order.status}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
