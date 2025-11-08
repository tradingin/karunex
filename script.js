// Karunex Co. E-commerce JavaScript
class KarunexStore {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('karunex-cart')) || [];
        this.products = [
            // ... your existing products array
        ];
        
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.displayProducts();
        this.updateCartCount();
        this.displayCartItems();
        this.setupEventListeners();
        console.log("🏢 Karunex Co. Store loaded successfully!");
    }

    displayProducts(filter = 'all') {
        const productsGrid = document.getElementById('productsGrid');
        const filteredProducts = filter === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === filter);
        
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-category">${product.category.toUpperCase()}</span>
                <p class="product-description">${product.description}</p>
                <p class="product-price">NPR ${product.price.toLocaleString('en-NP')}</p>
                <button class="add-to-cart" onclick="karunexStore.addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `).join('');
    }

    filterProducts(category) {
        this.currentFilter = category;
        this.displayProducts(category);
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({...product, quantity: 1});
        }
        
        this.saveCart();
        this.updateCartCount();
        this.displayCartItems();
        this.showNotification(`✅ ${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.displayCartItems();
        this.showNotification("🗑️ Item removed from cart");
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    displayCartItems() {
        const cartItems = document.getElementById('cartItems');
        const totalAmount = document.getElementById('totalAmount');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add some products!</p>';
            totalAmount.textContent = '0';
            return;
        }

        let total = 0;
        cartItems.innerHTML = this.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <p>NPR ${item.price.toLocaleString('en-NP')} × ${item.quantity}</p>
                        <p class="cart-item-price">NPR ${itemTotal.toLocaleString('en-NP')}</p>
                    </div>
                    <button class="remove-btn" onclick="karunexStore.removeFromCart(${item.id})">
                        Remove
                    </button>
                </div>
            `;
        }).join('');
        
        totalAmount.textContent = total.toLocaleString('en-NP');
    }

    saveCart() {
        localStorage.setItem('karunex-cart', JSON.stringify(this.cart));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px;
            background: #2c5aa0; color: white; padding: 1rem 2rem;
            border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000; animation: slideIn 0.3s ease; font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification("🛒 Please add some items to your cart first!");
            return;
        }

        // Save cart & total to localStorage
        localStorage.setItem('cart', JSON.stringify(this.cart));
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        localStorage.setItem('total', total);

        // Redirect to checkout page with payment options
        window.location.href = "checkout.html";
    }

    setupEventListeners() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification("📧 Thank you! We'll contact you soon.");
                contactForm.reset();
            });
        }

        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Cart checkout button now redirects to checkout page
        const checkoutBtn = document.getElementById("payment-button");
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }
}

// Global functions
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function filterProducts(category) {
    karunexStore.filterProducts(category);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize store
let karunexStore;
document.addEventListener('DOMContentLoaded', function() {
    karunexStore = new KarunexStore();
});
