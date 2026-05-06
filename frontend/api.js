// API Service for SoleStyle E-commerce
// This file handles all communication with the backend

const API_BASE_URL = 'http://localhost:3000/api';

// Store auth token
let authToken = localStorage.getItem('authToken') || null;

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTH API ====================

const AuthAPI = {
    async register(userData) {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return data;
    },

    async login(email, password) {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return data;
    },

    logout() {
        authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    isLoggedIn() {
        return !!authToken;
    },

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
};

// ==================== PROFILE API ====================

const ProfileAPI = {
    async getProfile() {
        return await apiCall('/profile');
    },

    async updateProfile(profileData) {
        const data = await apiCall('/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        localStorage.setItem('currentUser', JSON.stringify(data));
        return data;
    },

    async changePassword(currentPassword, newPassword) {
        return await apiCall('/profile/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    },

    async updateSettings(settings) {
        return await apiCall('/profile/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    },

    async deleteAccount() {
        const data = await apiCall('/profile', {
            method: 'DELETE'
        });
        AuthAPI.logout();
        return data;
    }
};

// ==================== PRODUCTS API ====================

const ProductsAPI = {
    async getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        
        const queryString = params.toString();
        return await apiCall(`/products${queryString ? '?' + queryString : ''}`);
    },

    async getById(id) {
        return await apiCall(`/products/${id}`);
    },

    async search(query) {
        return await apiCall(`/search?q=${encodeURIComponent(query)}`);
    }
};

// ==================== CART API ====================

const CartAPI = {
    async getCart() {
        if (!AuthAPI.isLoggedIn()) {
            return this.getLocalCart();
        }
        return await apiCall('/cart');
    },

    async addToCart(productId, quantity = 1) {
        if (!AuthAPI.isLoggedIn()) {
            return this.addToLocalCart(productId, quantity);
        }
        return await apiCall('/cart', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    },

    async updateQuantity(productId, quantity) {
        if (!AuthAPI.isLoggedIn()) {
            return this.updateLocalCart(productId, quantity);
        }
        return await apiCall(`/cart/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    },

    async removeFromCart(productId) {
        if (!AuthAPI.isLoggedIn()) {
            return this.removeFromLocalCart(productId);
        }
        return await apiCall(`/cart/${productId}`, {
            method: 'DELETE'
        });
    },

    async clearCart() {
        if (!AuthAPI.isLoggedIn()) {
            localStorage.removeItem('localCart');
            return [];
        }
        return await apiCall('/cart', {
            method: 'DELETE'
        });
    },

    // Local cart methods for non-logged in users
    getLocalCart() {
        const cart = localStorage.getItem('localCart');
        return cart ? JSON.parse(cart) : [];
    },

    addToLocalCart(productId, quantity = 1) {
        const cart = this.getLocalCart();
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
        
        localStorage.setItem('localCart', JSON.stringify(cart));
        return cart;
    },

    updateLocalCart(productId, quantity) {
        let cart = this.getLocalCart();
        
        if (quantity <= 0) {
            cart = cart.filter(item => item.productId !== productId);
        } else {
            const item = cart.find(item => item.productId === productId);
            if (item) {
                item.quantity = quantity;
            }
        }
        
        localStorage.setItem('localCart', JSON.stringify(cart));
        return cart;
    },

    removeFromLocalCart(productId) {
        let cart = this.getLocalCart();
        cart = cart.filter(item => item.productId !== productId);
        localStorage.setItem('localCart', JSON.stringify(cart));
        return cart;
    }
};

// ==================== ORDERS API ====================

const OrdersAPI = {
    async getOrders() {
        return await apiCall('/orders');
    },

    async getOrder(orderId) {
        return await apiCall(`/orders/${orderId}`);
    },

    async checkout() {
        return await apiCall('/orders', {
            method: 'POST'
        });
    }
};

// ==================== NEWSLETTER API ====================

const NewsletterAPI = {
    async subscribe(email) {
        return await apiCall('/newsletter', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }
};

// Export all APIs
window.API = {
    Auth: AuthAPI,
    Profile: ProfileAPI,
    Products: ProductsAPI,
    Cart: CartAPI,
    Orders: OrdersAPI,
    Newsletter: NewsletterAPI
};
