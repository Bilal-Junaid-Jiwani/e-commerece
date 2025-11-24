const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    category: String,
    image: String,
    description: String,
    stock: Number,
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: { type: String, unique: true },
    password: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'active' },
    wishlist: [{ type: Number }] // Array of Product IDs
});

const reviewSchema = new mongoose.Schema({
    id: Number,
    productId: Number,
    userId: Number,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    id: Number,
    user: Object, // Can be object or string (guest)
    items: Array,
    total: Number,
    shipping: Object,
    payment: Object,
    status: { type: String, default: 'Processing' },
    createdAt: { type: Date, default: Date.now }
});

const promoCodeSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    discount: Number
});

const staffSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
    createdAt: { type: Date, default: Date.now }
});

const bannerSchema = new mongoose.Schema({
    id: Number,
    title: String,
    image: String,
    link: String,
    createdAt: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
    storeName: String,
    storeEmail: String,
    currency: String,
    taxRate: Number
});

module.exports = {
    Product: mongoose.model('Product', productSchema),
    User: mongoose.model('User', userSchema),
    Order: mongoose.model('Order', orderSchema),
    PromoCode: mongoose.model('PromoCode', promoCodeSchema),
    Staff: mongoose.model('Staff', staffSchema),
    Banner: mongoose.model('Banner', bannerSchema),
    Settings: mongoose.model('Settings', settingsSchema),
    Review: mongoose.model('Review', reviewSchema)
};
