const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MONGO_URI = process.env.MONGO_URI;
const useDatabase = MONGO_URI && !MONGO_URI.includes('YOUR_MONGODB_CONNECTION_STRING');

let data_source;

const initializeData = async () => {
    if (useDatabase) {
        console.log('✅ Using MongoDB as data source');
        try {
            await mongoose.connect(MONGO_URI);
            console.log('✅ Connected to MongoDB');
            const { Product, User, Order, PromoCode, Staff, Banner, Settings, Review } = require('./models');
            data_source = {
                Product, User, Order, PromoCode, Staff, Banner, Settings, Review,
                isDb: true
            };
        } catch (err) {
            console.error('❌ MongoDB Connection Error:', err);
            process.exit(1);
        }
    } else {
        console.log('⚠️ Using local JSON files as data source. Data will not be persisted.');
        const dataPath = path.join(__dirname, 'data');
        let products = [];
        try {
            const productsData = fs.readFileSync(path.join(dataPath, 'products.js'), 'utf8');
            products = eval(productsData);
        } catch (err) {
            console.error("Error reading products.js:", err);
        }

        const readJson = (fileName) => {
            try {
                return JSON.parse(fs.readFileSync(path.join(dataPath, fileName), 'utf8'));
            } catch (err) {
                console.error(`Error reading ${fileName}:`, err);
                return [];
            }
        };

        data_source = {
            products,
            users: readJson('users.json'),
            orders: readJson('orders.json'),
            promoCodes: readJson('promoCodes.json'),
            staff: readJson('staff.json'),
            banners: readJson('banners.json'),
            settings: readJson('settings.json')[0] || {},
            isDb: false
        };
    }
};

const STAFF_CODE = 'ADMIN2024';

// Middleware to wait for data initialization
app.use(async (req, res, next) => {
    if (!data_source) {
        await initializeData();
    }
    next();
});


// #############################################
// #                 ROUTES                    #
// #############################################

// Products
app.get('/api/products', async (req, res) => {
    try {
        const products = data_source.isDb ? await data_source.Product.find() : data_source.products;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = data_source.isDb
            ? await data_source.Product.findOne({ id: productId })
            : data_source.products.find(p => p.id === productId);

        if (product) res.json(product);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        let newProduct;
        if (data_source.isDb) {
            const lastProduct = await data_source.Product.findOne().sort({ id: -1 });
            const newId = lastProduct ? lastProduct.id + 1 : 1;
            newProduct = new data_source.Product({ ...req.body, id: newId });
            await newProduct.save();
        } else {
            const lastProduct = data_source.products[data_source.products.length - 1];
            const newId = lastProduct ? lastProduct.id + 1 : 1;
            newProduct = { ...req.body, id: newId };
            data_source.products.push(newProduct);
        }
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        let updatedProduct;
        if (data_source.isDb) {
            updatedProduct = await data_source.Product.findOneAndUpdate({ id: productId }, req.body, { new: true });
        } else {
            const productIndex = data_source.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                data_source.products[productIndex] = { ...data_source.products[productIndex], ...req.body };
                updatedProduct = data_source.products[productIndex];
            }
        }
        if (updatedProduct) res.json(updatedProduct);
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        let result;
        if (data_source.isDb) {
            result = await data_source.Product.findOneAndDelete({ id: productId });
        } else {
            const productIndex = data_source.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                data_source.products.splice(productIndex, 1);
                result = { message: 'Product deleted' };
            }
        }
        if (result) res.json({ message: 'Product deleted' });
        else res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Related Products
app.get('/api/products/:id/related', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = data_source.isDb
            ? await data_source.Product.findOne({ id: productId })
            : data_source.products.find(p => p.id === productId);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const related = data_source.isDb
            ? await data_source.Product.find({ category: product.category, id: { $ne: product.id } }).limit(4)
            : data_source.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

        res.json(related);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Settings
app.get('/api/settings', async (req, res) => {
    try {
        let settings;
        if (data_source.isDb) {
            settings = await data_source.Settings.findOne();
            if (!settings) {
                settings = await data_source.Settings.create({
                    storeName: 'Fusion Kuiper',
                    storeEmail: 'contact@fusionkuiper.com',
                    currency: 'USD',
                    taxRate: 10
                });
            }
        } else {
            settings = data_source.settings;
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Banners
app.get('/api/banners', async (req, res) => {
    try {
        const banners = data_source.isDb ? await data_source.Banner.find() : data_source.banners;
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = data_source.isDb
            ? await data_source.User.findOne({ email, password })
            : data_source.users.find(u => u.email === email && u.password === password);

        if (user) res.json(user);
        else res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = data_source.isDb
            ? await data_source.Staff.findOne({ email, password })
            : data_source.staff.find(s => s.email === email && s.password === password);
        if (admin) res.json(admin);
        else res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// All other routes can be added here following the same pattern...


app.listen(PORT, async () => {
    await initializeData();
    console.log(`✅ Server is running on port ${PORT}`);
});

module.exports = app;