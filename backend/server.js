const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'solestyle-secret-key-2025';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory database (replace with real database in production)
const db = {
    users: [],
    products: [
        { id: 1, name: "Air Max Runner", category: "men", price: 149.99, oldPrice: 199.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", badge: "Sale", stock: 50, description: "Premium running shoes with air cushioning" },
        { id: 2, name: "Classic Sneakers", category: "men", price: 89.99, oldPrice: null, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", badge: "New", stock: 35, description: "Timeless classic sneakers for everyday wear" },
        { id: 3, name: "Elegant Heels", category: "women", price: 129.99, oldPrice: 159.99, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400", badge: "Sale", stock: 25, description: "Elegant heels for special occasions" },
        { id: 4, name: "Sporty Sneakers", category: "women", price: 99.99, oldPrice: null, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400", badge: "Trending", stock: 40, description: "Comfortable sporty sneakers for active women" },
        { id: 5, name: "Kids Fun Runners", category: "kids", price: 59.99, oldPrice: 79.99, image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400", badge: "Sale", stock: 60, description: "Fun and colorful runners for kids" },
        { id: 6, name: "Kids School Shoes", category: "kids", price: 49.99, oldPrice: null, image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400", badge: "Best Seller", stock: 45, description: "Durable school shoes for everyday use" },
        { id: 7, name: "Formal Oxford", category: "men", price: 179.99, oldPrice: null, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400", badge: "Premium", stock: 20, description: "Premium formal oxford shoes" },
        { id: 8, name: "Ballet Flats", category: "women", price: 79.99, oldPrice: 99.99, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400", badge: "Sale", stock: 30, description: "Comfortable ballet flats for everyday elegance" },
    ],
    orders: [],
    carts: {},
    newsletters: []
};

// Helper function to generate user ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Optional authentication (doesn't fail if no token)
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: generateId(),
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone: phone || '',
            address: '',
            city: '',
            zipcode: '',
            country: 'US',
            dob: '',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            createdAt: new Date().toISOString(),
            settings: {
                emailNotif: true,
                smsNotif: false,
                orderNotif: true,
                promoNotif: true
            }
        };

        db.users.push(user);
        db.carts[user.id] = [];

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== USER/PROFILE ROUTES ====================

// Get profile
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// Update profile
app.put('/api/profile', authenticateToken, (req, res) => {
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { firstName, lastName, phone, address, city, zipcode, country, dob, avatar } = req.body;

    // Update user fields
    if (firstName) db.users[userIndex].firstName = firstName;
    if (lastName) db.users[userIndex].lastName = lastName;
    if (phone !== undefined) db.users[userIndex].phone = phone;
    if (address !== undefined) db.users[userIndex].address = address;
    if (city !== undefined) db.users[userIndex].city = city;
    if (zipcode !== undefined) db.users[userIndex].zipcode = zipcode;
    if (country !== undefined) db.users[userIndex].country = country;
    if (dob !== undefined) db.users[userIndex].dob = dob;
    if (avatar !== undefined) db.users[userIndex].avatar = avatar;

    const { password: _, ...userWithoutPassword } = db.users[userIndex];
    res.json(userWithoutPassword);
});

// Change password
app.put('/api/profile/password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated successfully' });
});

// Update settings
app.put('/api/profile/settings', authenticateToken, (req, res) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { emailNotif, smsNotif, orderNotif, promoNotif } = req.body;
    
    user.settings = {
        emailNotif: emailNotif !== undefined ? emailNotif : user.settings.emailNotif,
        smsNotif: smsNotif !== undefined ? smsNotif : user.settings.smsNotif,
        orderNotif: orderNotif !== undefined ? orderNotif : user.settings.orderNotif,
        promoNotif: promoNotif !== undefined ? promoNotif : user.settings.promoNotif
    };

    res.json(user.settings);
});

// Delete account
app.delete('/api/profile', authenticateToken, (req, res) => {
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Remove user data
    db.users.splice(userIndex, 1);
    delete db.carts[req.user.id];
    
    // Remove user orders
    db.orders = db.orders.filter(o => o.userId !== req.user.id);

    res.json({ message: 'Account deleted successfully' });
});

// ==================== PRODUCTS ROUTES ====================

// Get all products
app.get('/api/products', (req, res) => {
    const { category, search, minPrice, maxPrice } = req.query;
    
    let filteredProducts = [...db.products];

    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }

    if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    res.json(filteredProducts);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const product = db.products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// ==================== CART ROUTES ====================

// Get cart
app.get('/api/cart', authenticateToken, (req, res) => {
    const cart = db.carts[req.user.id] || [];
    
    // Populate cart with product details
    const populatedCart = cart.map(item => {
        const product = db.products.find(p => p.id === item.productId);
        return {
            ...item,
            product
        };
    });

    res.json(populatedCart);
});

// Add to cart
app.post('/api/cart', authenticateToken, (req, res) => {
    const { productId, quantity = 1 } = req.body;

    const product = db.products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (!db.carts[req.user.id]) {
        db.carts[req.user.id] = [];
    }

    const existingItem = db.carts[req.user.id].find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        db.carts[req.user.id].push({
            id: generateId(),
            productId,
            quantity
        });
    }

    res.json(db.carts[req.user.id]);
});

// Update cart item
app.put('/api/cart/:productId', authenticateToken, (req, res) => {
    const { quantity } = req.body;
    const productId = parseInt(req.params.productId);

    if (!db.carts[req.user.id]) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = db.carts[req.user.id].findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (quantity <= 0) {
        db.carts[req.user.id].splice(itemIndex, 1);
    } else {
        db.carts[req.user.id][itemIndex].quantity = quantity;
    }

    res.json(db.carts[req.user.id]);
});

// Remove from cart
app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
    const productId = parseInt(req.params.productId);

    if (!db.carts[req.user.id]) {
        return res.status(404).json({ error: 'Cart not found' });
    }

    db.carts[req.user.id] = db.carts[req.user.id].filter(item => item.productId !== productId);
    res.json(db.carts[req.user.id]);
});

// Clear cart
app.delete('/api/cart', authenticateToken, (req, res) => {
    db.carts[req.user.id] = [];
    res.json({ message: 'Cart cleared' });
});

// ==================== ORDER ROUTES ====================

// Get user orders
app.get('/api/orders', authenticateToken, (req, res) => {
    const userOrders = db.orders.filter(o => o.userId === req.user.id);
    res.json(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Get single order
app.get('/api/orders/:id', authenticateToken, (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id && o.userId === req.user.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});

// Create order (checkout)
app.post('/api/orders', authenticateToken, (req, res) => {
    const cart = db.carts[req.user.id] || [];
    
    if (cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const user = db.users.find(u => u.id === req.user.id);
    
    // Calculate totals
    let subtotal = 0;
    const items = cart.map(item => {
        const product = db.products.find(p => p.id === item.productId);
        subtotal += product.price * item.quantity;
        return {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.image
        };
    });

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;

    // Create order
    const order = {
        id: 'ORD-' + generateId().toUpperCase(),
        userId: req.user.id,
        items,
        subtotal,
        shipping,
        tax,
        total,
        status: 'Processing',
        shippingAddress: {
            name: `${user.firstName} ${user.lastName}`,
            address: user.address,
            city: user.city,
            zipcode: user.zipcode,
            country: user.country,
            phone: user.phone
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    db.orders.push(order);

    // Clear cart
    db.carts[req.user.id] = [];

    // Update product stock
    items.forEach(item => {
        const product = db.products.find(p => p.id === item.productId);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    res.status(201).json(order);
});

// ==================== NEWSLETTER ROUTE ====================

app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if (db.newsletters.includes(email)) {
        return res.status(400).json({ error: 'Email already subscribed' });
    }

    db.newsletters.push(email);
    res.json({ message: 'Successfully subscribed to newsletter' });
});

// ==================== SEARCH ROUTE ====================

app.get('/api/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.json([]);
    }

    const searchLower = q.toLowerCase();
    const results = db.products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );

    res.json(results);
});

// ==================== SERVE FRONTEND ====================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SoleStyle server running on http://localhost:${PORT}`);
    console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
});
