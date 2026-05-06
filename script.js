// Products Data
const products = [
    { id: 1, name: "Air Max Runner", category: "men", price: 149.99, oldPrice: 199.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", badge: "Sale" },
    { id: 2, name: "Classic Sneakers", category: "men", price: 89.99, oldPrice: null, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", badge: "New" },
    { id: 3, name: "Elegant Heels", category: "women", price: 129.99, oldPrice: 159.99, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400", badge: "Sale" },
    { id: 4, name: "Sporty Sneakers", category: "women", price: 99.99, oldPrice: null, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400", badge: "Trending" },
    { id: 5, name: "Kids Fun Runners", category: "kids", price: 59.99, oldPrice: 79.99, image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400", badge: "Sale" },
    { id: 6, name: "Kids School Shoes", category: "kids", price: 49.99, oldPrice: null, image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400", badge: "Best Seller" },
    { id: 7, name: "Formal Oxford", category: "men", price: 179.99, oldPrice: null, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400", badge: "Premium" },
    { id: 8, name: "Ballet Flats", category: "women", price: 79.99, oldPrice: 99.99, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400", badge: "Sale" },
];

// Cart Data
let cart = [];

// Current filter state
let currentFilter = 'all';

// Profile Data (with localStorage persistence)
let profileData = JSON.parse(localStorage.getItem('profileData')) || {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Street',
    city: 'New York',
    zipcode: '10001',
    country: 'US',
    dob: '1990-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
};

// Orders Data
let orders = JSON.parse(localStorage.getItem('orders')) || [
    { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: 249.98, items: [
        { name: 'Air Max Runner', qty: 1, price: 149.99 },
        { name: 'Sporty Sneakers', qty: 1, price: 99.99 }
    ]},
    { id: 'ORD-002', date: '2024-01-10', status: 'Shipped', total: 179.99, items: [
        { name: 'Formal Oxford', qty: 1, price: 179.99 }
    ]},
    { id: 'ORD-003', date: '2024-01-05', status: 'Processing', total: 59.99, items: [
        { name: 'Kids Fun Runners', qty: 1, price: 59.99 }
    ]}
];

// Settings Data
let settings = JSON.parse(localStorage.getItem('settings')) || {
    emailNotif: true,
    smsNotif: false,
    orderNotif: true,
    promoNotif: true
};

// Get cart quantity for a product
function getCartQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
}

// Render Products
function renderProducts(filter = 'all') {
    const grid = document.getElementById('products-grid');
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    grid.innerHTML = filteredProducts.map(product => {
        const quantity = getCartQuantity(product.id);
        const cartButton = quantity > 0 
            ? `<div class="flex items-center gap-2 bg-indigo-100 rounded-full px-2 py-1">
                <button onclick="updateCartFromGrid(${product.id}, -1)" class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
                    <i class="fas fa-minus text-xs"></i>
                </button>
                <span class="font-bold text-indigo-600 w-6 text-center">${quantity}</span>
                <button onclick="updateCartFromGrid(${product.id}, 1)" class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition">
                    <i class="fas fa-plus text-xs"></i>
                </button>
            </div>`
            : `<button onclick="addToCart(${product.id})" class="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                Add to Cart
            </button>`;
        
        return `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden card-hover transition duration-300 group">
            <div class="relative overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover group-hover:scale-110 transition duration-500">
                ${product.badge ? `<span class="absolute top-4 left-4 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">${product.badge}</span>` : ''}
                ${quantity > 0 ? `<span class="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full"><i class="fas fa-check mr-1"></i>In Cart</span>` : ''}
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button onclick="addToCart(${product.id})" class="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="p-5">
                <span class="text-xs text-indigo-600 uppercase font-semibold">${product.category}</span>
                <h3 class="text-lg font-semibold text-gray-800 mt-1">${product.name}</h3>
                <div class="flex items-center mt-2">
                    <div class="flex text-yellow-400">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                    <span class="text-gray-500 text-sm ml-2">(4.5)</span>
                </div>
                <div class="flex items-center justify-between mt-4">
                    <div>
                        <span class="text-xl font-bold text-indigo-600">₹${product.price}</span>
                        ${product.oldPrice ? `<span class="text-gray-400 line-through ml-2">₹${product.oldPrice}</span>` : ''}
                    </div>
                    ${cartButton}
                </div>
            </div>
        </div>
    `}).join('');
}

// Filter Products
function filterProducts(category) {
    currentFilter = category;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-indigo-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
        // Update the correct filter button based on category
        if (btn.textContent.trim().toLowerCase() === category || 
            (category === 'all' && btn.textContent.trim().toLowerCase() === 'all')) {
            btn.classList.remove('bg-gray-200', 'text-gray-700');
            btn.classList.add('active', 'bg-indigo-600', 'text-white');
        }
    });
    renderProducts(category);
}

// Go to Category - scrolls to featured section and filters
function goToCategory(category) {
    // Scroll to featured section
    const featuredSection = document.getElementById('featured');
    featuredSection.scrollIntoView({ behavior: 'smooth' });
    
    // Filter products after a small delay to allow scroll to complete
    setTimeout(() => {
        filterProducts(category);
    }, 100);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    renderCart();
    renderProducts(currentFilter);
    showToast(`${product.name} added to cart!`);
}

// Update Cart from Product Grid
function updateCartFromGrid(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            const product = products.find(p => p.id === productId);
            cart = cart.filter(i => i.id !== productId);
            showToast(`${product.name} removed from cart`);
        }
        updateCartCount();
        renderCart();
        renderProducts(currentFilter);
    }
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartFooter = document.getElementById('cart-footer');
    
    if (cart.length === 0) {
        cartItems.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        cartFooter.classList.add('hidden');
        return;
    }
    
    cartItems.classList.remove('hidden');
    emptyCart.classList.add('hidden');
    cartFooter.classList.remove('hidden');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="flex gap-4 p-3 bg-gray-50 rounded-lg mb-3">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${item.name}</h4>
                <p class="text-indigo-600 font-bold">₹${item.price}</p>
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="updateQuantity(${item.id}, -1)" class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="font-medium w-8 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                    <button onclick="removeFromCart(${item.id})" class="ml-auto text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartTotals();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
            renderProducts(currentFilter);
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(i => i.id !== productId);
    updateCartCount();
    renderCart();
    renderProducts(currentFilter);
    showToast(`${item.name} removed from cart`);
}

// Update Cart Totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;
    
    document.getElementById('cart-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
}

// Toggle Cart
function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            sidebar.classList.remove('translate-x-full');
        }, 10);
    } else {
        overlay.classList.add('opacity-0');
        sidebar.classList.add('translate-x-full');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
    renderCart();
}

// Clear Cart
function clearCart() {
    cart = [];
    updateCartCount();
    renderCart();
    renderProducts(currentFilter);
    showToast('Cart cleared!');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;
    
    // Create new order
    const newOrder = {
        id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        total: total,
        items: cart.map(item => ({ name: item.name, qty: item.quantity, price: item.price }))
    };
    
    orders.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    cart = [];
    updateCartCount();
    renderCart();
    renderProducts(currentFilter);
    toggleCart();
    showToast('Order placed successfully! Check your orders in profile.');
}

// Toggle Profile
function toggleProfile() {
    const overlay = document.getElementById('profile-overlay');
    const modal = document.getElementById('profile-modal');
    
    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            modal.classList.remove('scale-95', 'opacity-0');
        }, 10);
        loadProfileData();
        renderOrders();
        loadSettings();
    } else {
        overlay.classList.add('opacity-0');
        modal.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
            modal.classList.add('hidden');
        }, 300);
    }
}

// Switch Profile Tab
function switchProfileTab(tab) {
    document.querySelectorAll('.profile-tab').forEach(t => {
        t.classList.remove('active', 'text-indigo-600', 'border-b-2', 'border-indigo-600');
        t.classList.add('text-gray-500');
    });
    event.target.classList.add('active', 'text-indigo-600', 'border-b-2', 'border-indigo-600');
    event.target.classList.remove('text-gray-500');
    
    document.querySelectorAll('.profile-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    
    if (tab === 'orders') renderOrders();
}

// Load Profile Data
function loadProfileData() {
    document.getElementById('firstName').value = profileData.firstName;
    document.getElementById('lastName').value = profileData.lastName;
    document.getElementById('email').value = profileData.email;
    document.getElementById('phone').value = profileData.phone;
    document.getElementById('address').value = profileData.address;
    document.getElementById('city').value = profileData.city;
    document.getElementById('zipcode').value = profileData.zipcode;
    document.getElementById('country').value = profileData.country;
    document.getElementById('dob').value = profileData.dob;
    document.getElementById('profile-avatar').src = profileData.avatar;
}

// Save Profile
function saveProfile(e) {
    e.preventDefault();
    profileData.firstName = document.getElementById('firstName').value;
    profileData.lastName = document.getElementById('lastName').value;
    profileData.email = document.getElementById('email').value;
    profileData.phone = document.getElementById('phone').value;
    profileData.address = document.getElementById('address').value;
    profileData.city = document.getElementById('city').value;
    profileData.zipcode = document.getElementById('zipcode').value;
    profileData.country = document.getElementById('country').value;
    profileData.dob = document.getElementById('dob').value;
    
    localStorage.setItem('profileData', JSON.stringify(profileData));
    showToast('Profile saved successfully!');
}

// Reset Profile
function resetProfile() {
    loadProfileData();
    showToast('Profile reset to saved values');
}

// Change Profile Picture
function changeProfilePic(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            profileData.avatar = event.target.result;
            document.getElementById('profile-avatar').src = event.target.result;
            localStorage.setItem('profileData', JSON.stringify(profileData));
            showToast('Profile picture updated!');
        };
        reader.readAsDataURL(file);
    }
}

// Render Orders
function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No orders yet</p>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="border rounded-lg overflow-hidden">
            <div class="bg-gray-50 p-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <span class="font-bold text-gray-800">${order.id}</span>
                    <span class="text-gray-500 text-sm ml-2">${order.date}</span>
                </div>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                }">${order.status}</span>
            </div>
            <div class="p-4">
                ${order.items.map(item => `
                    <div class="flex justify-between py-2 border-b last:border-0">
                        <span class="text-gray-700">${item.name} x${item.qty}</span>
                        <span class="font-medium">₹${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                `).join('')}
                <div class="flex justify-between pt-3 mt-2 border-t">
                    <span class="font-bold">Total</span>
                    <span class="font-bold text-indigo-600">₹${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Settings
function loadSettings() {
    document.getElementById('emailNotif').checked = settings.emailNotif;
    document.getElementById('smsNotif').checked = settings.smsNotif;
    document.getElementById('orderNotif').checked = settings.orderNotif;
    document.getElementById('promoNotif').checked = settings.promoNotif;
}

// Save Settings
function saveSettings() {
    settings.emailNotif = document.getElementById('emailNotif').checked;
    settings.smsNotif = document.getElementById('smsNotif').checked;
    settings.orderNotif = document.getElementById('orderNotif').checked;
    settings.promoNotif = document.getElementById('promoNotif').checked;
    
    localStorage.setItem('settings', JSON.stringify(settings));
    showToast('Settings saved!');
}

// Change Password
function changePassword(e) {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (!current || !newPass || !confirm) {
        showToast('Please fill all password fields');
        return;
    }
    
    if (newPass !== confirm) {
        showToast('New passwords do not match!');
        return;
    }
    
    if (newPass.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
    
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showToast('Password updated successfully!');
}

// Delete Account
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        localStorage.clear();
        cart = [];
        orders = [];
        profileData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            address: '123 Fashion Street',
            city: 'New York',
            zipcode: '10001',
            country: 'US',
            dob: '1990-01-15',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        };
        updateCartCount();
        renderProducts(currentFilter);
        toggleProfile();
        showToast('Account deleted successfully');
    }
}

// Show Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Newsletter
function subscribeNewsletter(e) {
    e.preventDefault();
    showToast('Successfully subscribed to newsletter!');
    e.target.reset();
}

// Countdown Timer
function countdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    function update() {
        const now = new Date();
        const diff = endDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    update();
    setInterval(update, 1000);
}

// Mobile Menu Toggle
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    countdown();
});
