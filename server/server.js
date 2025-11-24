const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Load data from JSON files
const dataPath = path.join(__dirname, 'data');
let products = [];
try {
    const productsData = fs.readFileSync(path.join(dataPath, 'products.js'), 'utf8');
    // This is a .js file, so we need to evaluate it
    products = eval(productsData);
} catch (err) {
    console.error("Error reading products.js:", err);
}

let users = [];
try {
    users = JSON.parse(fs.readFileSync(path.join(dataPath, 'users.json'), 'utf8'));
} catch (err) {
    console.error("Error reading users.json:", err);
}

let orders = [];
try {
    orders = JSON.parse(fs.readFileSync(path.join(dataPath, 'orders.json'), 'utf8'));
} catch (err) {
    console.error("Error reading orders.json:", err);
}

let promoCodes = [];
try {
    promoCodes = JSON.parse(fs.readFileSync(path.join(dataPath, 'promoCodes.json'), 'utf8'));
} catch (err) {
    console.error("Error reading promoCodes.json:", err);
}

let staff = [];
try {
    staff = JSON.parse(fs.readFileSync(path.join(dataPath, 'staff.json'), 'utf8'));
} catch (err) {
    console.error("Error reading staff.json:", err);
}

let banners = [];
try {
    banners = JSON.parse(fs.readFileSync(path.join(dataPath, 'banners.json'), 'utf8'));
} catch (err) {
    console.error("Error reading banners.json:", err);
}

let settings = {};
try {
    settings = JSON.parse(fs.readFileSync(path.join(dataPath, 'settings.json'), 'utf8'));
} catch (err) {
    console.error("Error reading settings.json:", err);
}


const STAFF_CODE = 'ADMIN2024';

// Routes

// Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.post('/api/products', (req, res) => {
    const lastProduct = products[products.length - 1];
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const newProduct = { ...req.body, id: newId };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...req.body };
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});


// Related Products
app.get('/api/products/:id/related', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    res.json(related);
});

// Reviews (mocked)
app.get('/api/products/:id/reviews', (req, res) => {
    res.json([]);
});

app.post('/api/products/:id/reviews', (req, res) => {
    res.status(201).json(req.body);
});


// Users
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        status: 'active',
        wishlist: []
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.put('/api/auth/profile', (req, res) => {
    const { email, ...updates } = req.body;
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


// Wishlist
app.get('/api/wishlist/:userId', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.userId));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));
    res.json(wishlistProducts);
});

app.post('/api/wishlist', (req, res) => {
    const { userId, productId } = req.body;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!users[userIndex].wishlist) {
        users[userIndex].wishlist = [];
    }
    if (!users[userIndex].wishlist.includes(productId)) {
        users[userIndex].wishlist.push(productId);
    }
    const wishlistProducts = products.filter(p => users[userIndex].wishlist.includes(p.id));
    res.json(wishlistProducts);
});

app.delete('/api/wishlist/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(userId));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (users[userIndex].wishlist) {
        users[userIndex].wishlist = users[userIndex].wishlist.filter(id => id !== parseInt(productId));
    }
    const wishlistProducts = products.filter(p => users[userIndex].wishlist.includes(p.id));
    res.json(wishlistProducts);
});


// Admin
app.post('/api/admin/register', (req, res) => {
    const { name, email, password, staffCode } = req.body;
    if (staffCode !== STAFF_CODE) {
        return res.status(403).json({ message: 'Invalid staff code' });
    }
    const existingStaff = staff.find(s => s.email === email);
    if (existingStaff) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    const newStaff = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'admin'
    };
    staff.push(newStaff);
    res.status(201).json(newStaff);
});

app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    const admin = staff.find(s => s.email === email && s.password === password);
    if (admin) {
        res.json(admin);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


// Orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: Date.now(),
        ...req.body
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...req.body };
        res.json(orders[orderIndex]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});


// Promo Codes
app.get('/api/promo-codes', (req, res) => {
    res.json(promoCodes);
});

app.post('/api/promo-codes/validate', (req, res) => {
    const { code } = req.body;
    const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (promo) {
        res.json({ valid: true, discount: promo.discount });
    } else {
        res.json({ valid: false, message: 'Invalid promo code' });
    }
});

app.post('/api/promo-codes', (req, res) => {
    const newCode = req.body;
    promoCodes.push(newCode);
    res.status(201).json(newCode);
});

app.delete('/api/promo-codes/:code', (req, res) => {
    const codeIndex = promoCodes.findIndex(c => c.code === req.params.code);
    if (codeIndex !== -1) {
        promoCodes.splice(codeIndex, 1);
        res.json({ message: 'Promo code deleted' });
    } else {
        res.status(404).json({ message: 'Promo code not found' });
    }
});


// Customers
app.get('/api/customers', (req, res) => {
    res.json(users);
});

app.put('/api/customers/:id', (req, res) => {
    const customerIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (customerIndex !== -1) {
        users[customerIndex] = { ...users[customerIndex], ...req.body };
        res.json(users[customerIndex]);
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
});


// Banners
app.get('/api/banners', (req, res) => {
    res.json(banners);
});

app.post('/api/banners', (req, res) => {
    const lastBanner = banners[banners.length - 1];
    const newId = lastBanner ? lastBanner.id + 1 : 1;
    const newBanner = { ...req.body, id: newId };
    banners.push(newBanner);
    res.status(201).json(newBanner);
});

app.delete('/api/banners/:id', (req, res) => {
    const bannerIndex = banners.findIndex(b => b.id === parseInt(req.params.id));
    if (bannerIndex !== -1) {
        banners.splice(bannerIndex, 1);
        res.json({ message: 'Banner deleted' });
    } else {
        res.status(404).json({ message: 'Banner not found' });
    }
});


// Settings
app.get('/api/settings', (req, res) => {
    res.json(settings);
});

app.put('/api/settings', (req, res) => {
    settings = { ...settings, ...req.body };
    res.json({ success: true, settings });
});

// Analytics (mocked)
app.get('/api/analytics/stats', (req, res) => {
    res.json({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        pendingOrders: 0,
        completedOrders: 0,
        averageOrderValue: 0
    });
});

app.get('/api/analytics/revenue-chart', (req, res) => {
    res.json([]);
});

// CSV Export (mocked)
app.get('/api/export/:type', (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.type}.csv`);
    res.send('data,data\n');
});


app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

module.exports = app;