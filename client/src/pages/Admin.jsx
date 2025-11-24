import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, ShoppingBag, Tag, Plus, Edit, Trash, X, TrendingUp, DollarSign, Users, LogOut, Download, Search, Settings as SettingsIcon, Image as ImageIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../components/Button';
import { adminLogout, selectAdminUser } from '../redux/slices/adminAuthSlice';
import { useNotification } from '../context/NotificationContext';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [promoCodes, setPromoCodes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [banners, setBanners] = useState([]);
    const [settings, setSettings] = useState({});
    const [stats, setStats] = useState({});
    const [revenueData, setRevenueData] = useState([]);

    const [showProductModal, setShowProductModal] = useState(false);
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const [productForm, setProductForm] = useState({ title: '', price: '', category: '', image: '', description: '', stock: 0 });
    const [promoForm, setPromoForm] = useState({ code: '', discount: '' });
    const [bannerForm, setBannerForm] = useState({ title: '', image: '', link: '' });

    const adminUser = useSelector(selectAdminUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { addNotification } = useNotification();

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [productsRes, ordersRes, promosRes, customersRes, bannersRes, settingsRes, statsRes, revenueRes] = await Promise.all([
                fetch(`${API_URL}/api/products`),
                fetch(`${API_URL}/api/orders`),
                fetch(`${API_URL}/api/promo-codes`),
                fetch(`${API_URL}/api/customers`),
                fetch(`${API_URL}/api/banners`),
                fetch(`${API_URL}/api/settings`),
                fetch(`${API_URL}/api/analytics/stats`),
                fetch(`${API_URL}/api/analytics/revenue-chart`)
            ]);
            setProducts(await productsRes.json());
            setOrders(await ordersRes.json());
            setPromoCodes(await promosRes.json());
            setCustomers(await customersRes.json());
            setBanners(await bannersRes.json());
            setSettings(await settingsRes.json());
            setStats(await statsRes.json());
            setRevenueData(await revenueRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
            addNotification('Failed to fetch data', 'error');
        }
    };

    const handleLogout = () => { dispatch(adminLogout()); navigate('/admin/login'); };

    const handleAddProduct = async () => {
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productForm)
        });
        if (response.ok) {
            await fetchData();
            setShowProductModal(false);
            addNotification('Product added successfully');
        } else {
            addNotification('Failed to add product', 'error');
        }
    };

    const handleUpdateSettings = async () => {
        const response = await fetch('http://localhost:5000/api/settings', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings)
        });
        if (response.ok) {
            await fetchData();
            addNotification('Settings saved successfully');
        } else {
            addNotification('Failed to save settings', 'error');
        }
    };

    const handleExport = async (type) => {
        try {
            const response = await fetch(`${API_URL}/api/export/${type}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${type}.csv`;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); window.URL.revokeObjectURL(url);
            addNotification(`Exported ${type} successfully`);
        } catch (error) {
            addNotification('Failed to export', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500">Welcome, {adminUser?.name}</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600">
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-2 mb-6 overflow-x-auto bg-white rounded-lg p-2 shadow-sm">
                    {['dashboard', 'products', 'orders', 'customers', 'promos', 'banners', 'settings'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                                <DollarSign size={32} />
                                <h3 className="text-3xl font-black mt-2">${stats.totalRevenue?.toFixed(2) || 0}</h3>
                                <p className="text-blue-100">Total Revenue</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                                <ShoppingBag size={32} />
                                <h3 className="text-3xl font-black mt-2">{stats.totalOrders || 0}</h3>
                                <p className="text-green-100">Total Orders</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                                <Users size={32} />
                                <h3 className="text-3xl font-black mt-2">{stats.totalCustomers || 0}</h3>
                                <p className="text-purple-100">Total Customers</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
                                <Package size={32} />
                                <h3 className="text-3xl font-black mt-2">{stats.totalProducts || 0}</h3>
                                <p className="text-orange-100">Total Products</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-bold mb-4">Revenue (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-bold">Products</h2>
                            <div className="flex gap-2">
                                <button onClick={() => handleExport('products')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
                                    <Download size={18} /> Export CSV
                                </button>
                                <Button variant="primary" onClick={() => { setEditingProduct(null); setProductForm({ title: '', price: '', category: '', image: '', description: '', stock: 0 }); setShowProductModal(true); }}>
                                    <Plus size={18} /> Add Product
                                </Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-left font-bold">ID</th>
                                        <th className="p-4 text-left font-bold">Title</th>
                                        <th className="p-4 text-left font-bold">Price</th>
                                        <th className="p-4 text-left font-bold">Category</th>
                                        <th className="p-4 text-left font-bold">Stock</th>
                                        <th className="p-4 text-left font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">#{product.id}</td>
                                            <td className="p-4 font-medium">{product.title}</td>
                                            <td className="p-4 text-blue-600 font-bold">${product.price}</td>
                                            <td className="p-4">{product.category}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${(product.stock || 0) < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {product.stock || 0}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setEditingProduct(product); setProductForm({ title: product.title, price: product.price, category: product.category, image: product.image, description: product.description || '', stock: product.stock || 0 }); setShowProductModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-bold">Orders</h2>
                            <button onClick={() => handleExport('orders')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
                                <Download size={18} /> Export CSV
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-left font-bold">Order ID</th>
                                        <th className="p-4 text-left font-bold">Customer</th>
                                        <th className="p-4 text-left font-bold">Total</th>
                                        <th className="p-4 text-left font-bold">Status</th>
                                        <th className="p-4 text-left font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">#{order.id}</td>
                                            <td className="p-4">{order.user?.email || 'Guest'}</td>
                                            <td className="p-4 font-bold">${order.total?.toFixed(2)}</td>
                                            <td className="p-4">
                                                <select value={order.status || 'Processing'} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)} className="px-3 py-1 rounded border">
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <button onClick={() => { setViewingOrder(order); setShowOrderModal(true); }} className="text-blue-600 hover:underline font-bold">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'customers' && (
                    <div>
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-bold">Customers</h2>
                            <button onClick={() => handleExport('customers')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
                                <Download size={18} /> Export CSV
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-left font-bold">ID</th>
                                        <th className="p-4 text-left font-bold">Name</th>
                                        <th className="p-4 text-left font-bold">Email</th>
                                        <th className="p-4 text-left font-bold">Status</th>
                                        <th className="p-4 text-left font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(customer => (
                                        <tr key={customer.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">#{customer.id}</td>
                                            <td className="p-4 font-medium">{customer.name}</td>
                                            <td className="p-4">{customer.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${customer.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {customer.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button onClick={() => handleUpdateCustomer(customer.id, { status: customer.status === 'active' ? 'blocked' : 'active' })} className="text-blue-600 hover:underline font-bold">
                                                    {customer.status === 'active' ? 'Block' : 'Unblock'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'promos' && (
                    <div>
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-bold">Promo Codes</h2>
                            <Button variant="primary" onClick={() => setShowPromoModal(true)}>
                                <Plus size={18} /> Add Promo Code
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {promoCodes.map(promo => (
                                <div key={promo.code} className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                            <Tag className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg">{promo.code}</h3>
                                            <p className="text-sm text-gray-500">{promo.discount}% off</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeletePromo(promo.code)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                        <Trash size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'banners' && (
                    <div>
                        <div className="flex justify-between mb-6">
                            <h2 className="text-xl font-bold">Banners</h2>
                            <Button variant="primary" onClick={() => setShowBannerModal(true)}>
                                <Plus size={18} /> Add Banner
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {banners.map(banner => (
                                <div key={banner.id} className="bg-white p-4 rounded-xl shadow-sm border">
                                    <img src={banner.image} alt={banner.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold">{banner.title}</h3>
                                            <p className="text-sm text-gray-500">{banner.link}</p>
                                        </div>
                                        <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-bold mb-6">Store Settings</h2>
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Store Name</label>
                                <input type="text" value={settings.storeName || ''} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Store Email</label>
                                <input type="email" value={settings.storeEmail || ''} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Currency</label>
                                    <input type="text" value={settings.currency || ''} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                                    <input type="number" value={settings.taxRate || ''} onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                            </div>
                            <Button variant="primary" onClick={handleUpdateSettings} className="w-full">
                                Save Settings
                            </Button>
                        </div>
                    </div>
                )}

                {showProductModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                                <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                                <button onClick={() => setShowProductModal(false)}><X size={24} /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input type="text" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Price</label>
                                        <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Stock</label>
                                        <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL</label>
                                    <input type="text" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="primary" className="flex-1" onClick={editingProduct ? handleEditProduct : handleAddProduct}>
                                        {editingProduct ? 'Update' : 'Add'} Product
                                    </Button>
                                    <button onClick={() => setShowProductModal(false)} className="flex-1 px-6 py-3 bg-gray-200 rounded-full font-bold">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showOrderModal && viewingOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full">
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="text-xl font-bold">Order #{viewingOrder.id}</h3>
                                <button onClick={() => setShowOrderModal(false)}><X size={24} /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h4 className="font-bold mb-2">Customer</h4>
                                    <p>{viewingOrder.user?.email || 'Guest'}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Items</h4>
                                    {viewingOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded mb-2">
                                            <span>{item.title} x {item.quantity}</span>
                                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">${viewingOrder.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showPromoModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full">
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="text-xl font-bold">Add Promo Code</h3>
                                <button onClick={() => setShowPromoModal(false)}><X size={24} /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Code</label>
                                    <input type="text" value={promoForm.code} onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Discount (%)</label>
                                    <input type="number" value={promoForm.discount} onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="primary" className="flex-1" onClick={handleAddPromo}>Add Promo Code</Button>
                                    <button onClick={() => setShowPromoModal(false)} className="flex-1 px-6 py-3 bg-gray-200 rounded-full font-bold">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showBannerModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full">
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="text-xl font-bold">Add Banner</h3>
                                <button onClick={() => setShowBannerModal(false)}><X size={24} /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input type="text" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Image URL</label>
                                    <input type="text" value={bannerForm.image} onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Link</label>
                                    <input type="text" value={bannerForm.link} onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button variant="primary" className="flex-1" onClick={handleAddBanner}>Add Banner</Button>
                                    <button onClick={() => setShowBannerModal(false)} className="flex-1 px-6 py-3 bg-gray-200 rounded-full font-bold">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
