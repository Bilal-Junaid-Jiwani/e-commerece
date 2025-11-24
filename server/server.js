const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { Product, User, Order, PromoCode, Staff, Banner, Settings, Review } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err)
        process.exit(1);
    });

const STAFF_CODE = 'ADMIN2024';

// Routes

// Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        const newProduct = new Product({ ...req.body, id: newId });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const result = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
        if (result) res.json({ message: 'Product deleted' });
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Related Products
app.get('/api/products/:id/related', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const related = await Product.find({
            category: product.category,
            id: { $ne: product.id }
        }).limit(4);

        res.json(related);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reviews
app.get('/api/products/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: parseInt(req.params.id) }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products/:id/reviews', async (req, res) => {
    try {
        const { userId, userName, rating, comment } = req.body;
        const newReview = new Review({
            id: Date.now(),
            productId: parseInt(req.params.id),
            userId,
            userName,
            rating,
            comment
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Users
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const newUser = new User({
            id: Date.now(),
            name,
            email,
            password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) res.json(user);
        else res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/auth/profile', async (req, res) => {
    try {
        const { email, ...updates } = req.body;
        const user = await User.findOneAndUpdate(
            { email },
            updates,
            { new: true }
        );
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Wishlist
app.get('/api/wishlist/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ id: parseInt(req.params.userId) });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const wishlistProducts = await Product.find({ id: { $in: user.wishlist || [] } });
        res.json(wishlistProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/wishlist', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await User.findOne({ id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.wishlist) user.wishlist = [];
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        const wishlistProducts = await Product.find({ id: { $in: user.wishlist } });
        res.json(wishlistProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/wishlist/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const user = await User.findOne({ id: parseInt(userId) });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.wishlist) {
            user.wishlist = user.wishlist.filter(id => id !== parseInt(productId));
            await user.save();
        }

        const wishlistProducts = await Product.find({ id: { $in: user.wishlist } });
        res.json(wishlistProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin
app.post('/api/admin/register', async (req, res) => {
    try {
        const { name, email, password, staffCode } = req.body;
        if (staffCode !== STAFF_CODE) return res.status(403).json({ message: 'Invalid staff code' });

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) return res.status(400).json({ message: 'Email already registered' });

        const newStaff = new Staff({
            id: Date.now(),
            name,
            email,
            password,
            role: 'admin'
        });
        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Staff.findOne({ email, password });
        if (admin) res.json(admin);
        else res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order({
            id: Date.now(),
            ...req.body
        });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (order) res.json(order);
        else res.status(404).json({ message: 'Order not found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Promo Codes
app.get('/api/promo-codes', async (req, res) => {
    try {
        const codes = await PromoCode.find();
        res.json(codes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/promo-codes/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const promo = await PromoCode.findOne({ code: code.toUpperCase() });

        if (promo) {
            res.json({ valid: true, discount: promo.discount });
        } else {
            res.json({ valid: false, message: 'Invalid promo code' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/promo-codes', async (req, res) => {
    try {
        const newCode = new PromoCode(req.body);
        await newCode.save();
        res.status(201).json(newCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/promo-codes/:code', async (req, res) => {
    try {
        const result = await PromoCode.findOneAndDelete({ code: req.params.code });
        if (result) res.json({ message: 'Promo code deleted' });
        else res.status(404).json({ message: 'Promo code not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await User.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/customers/:id', async (req, res) => {
    try {
        const customer = await User.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (customer) res.json(customer);
        else res.status(404).json({ message: 'Customer not found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Banners
app.get('/api/banners', async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/banners', async (req, res) => {
    try {
        const lastBanner = await Banner.findOne().sort({ id: -1 });
        const newId = lastBanner ? lastBanner.id + 1 : 1;
        const newBanner = new Banner({ ...req.body, id: newId });
        await newBanner.save();
        res.status(201).json(newBanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/banners/:id', async (req, res) => {
    try {
        const result = await Banner.findOneAndDelete({ id: parseInt(req.params.id) });
        if (result) res.json({ message: 'Banner deleted' });
        else res.status(404).json({ message: 'Banner not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Settings
app.get('/api/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({
                storeName: 'Fusion Kuiper',
                storeEmail: 'contact@fusionkuiper.com',
                currency: 'USD',
                taxRate: 10
            });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;
        const settings = await Settings.findOneAndUpdate({}, updateData, { new: true, upsert: true });
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Settings update error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Analytics
app.get('/api/analytics/stats', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

        const pendingOrders = await Order.countDocuments({ status: 'Processing' });
        const completedOrders = await Order.countDocuments({ status: 'Delivered' });

        res.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
            pendingOrders,
            completedOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating stats' });
    }
});

app.get('/api/analytics/revenue-chart', async (req, res) => {
    try {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // This is a simple approximation. For production, use MongoDB aggregation
            const startOfDay = new Date(dateStr);
            const endOfDay = new Date(dateStr);
            endOfDay.setHours(23, 59, 59, 999);

            const dayOrders = await Order.find({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            last7Days.push({
                date: dateStr,
                revenue: dayOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
                orders: dayOrders.length
            });
        }
        res.json(last7Days);
    } catch (error) {
        res.json([]);
    }
});

// CSV Export (Simplified for MongoDB)
app.get('/api/export/orders', async (req, res) => {
    const orders = await Order.find();
    let csv = 'Order ID,Customer,Date,Total,Status\n';
    orders.forEach(order => {
        csv += `${order.id},"${order.user?.email || 'Guest'}","${order.createdAt}",${order.total},"${order.status}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(csv);
});

app.get('/api/export/products', async (req, res) => {
    const products = await Product.find();
    let csv = 'ID,Title,Price,Category,Stock\n';
    products.forEach(product => {
        csv += `${product.id},"${product.title}",${product.price},"${product.category}",${product.stock || 0}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    res.send(csv);
});

app.get('/api/export/customers', async (req, res) => {
    const customers = await User.find();
    let csv = 'ID,Name,Email,Joined Date,Status\n';
    customers.forEach(customer => {
        csv += `${customer.id},"${customer.name}","${customer.email}","${customer.createdAt}","${customer.status}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csv);
});

module.exports = app;
