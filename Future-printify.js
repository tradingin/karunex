/**
 * KARUNEX CO. PVT. LTD. - PRINTIFY INTEGRATION MODULE
 * Placeholder for future Printify API integration
 * Version: 1.0.0
 * Ready for Phase 2 implementation
 */

const KarunexPrintify = (function() {
    // ========== CONFIGURATION ==========
    const config = {
        apiVersion: 'v1',
        baseUrl: 'https://api.printify.com',
        endpoints: {
            shops: '/shops',
            products: '/products.json',
            orders: '/orders.json',
            uploads: '/uploads/images.json',
            shipping: '/shipping/rates.json'
        },
        defaultHeaders: {
            'Content-Type': 'application/json;charset=utf-8',
            'User-Agent': 'Karunex-Integration/1.0.0'
        }
    };
    
    // ========== STATE MANAGEMENT ==========
    let state = {
        isInitialized: false,
        apiKey: null,
        shopId: null,
        connected: false,
        lastSync: null,
        productCount: 0,
        orderCount: 0
    };
    
    // ========== CORE FUNCTIONS ==========
    
    /**
     * Initialize the Printify integration
     */
    function init(apiKey, shopId, options = {}) {
        if (!apiKey || !shopId) {
            console.error('Printify: API Key and Shop ID are required');
            return false;
        }
        
        state.apiKey = apiKey;
        state.shopId = shopId;
        state.isInitialized = true;
        
        // Merge custom options
        if (options.baseUrl) config.baseUrl = options.baseUrl;
        
        console.log('Printify Integration initialized:', {
            shopId,
            apiVersion: config.apiVersion,
            baseUrl: config.baseUrl
        });
        
        // Dispatch initialization event
        window.dispatchEvent(new CustomEvent('printify:initialized', {
            detail: { shopId, timestamp: new Date().toISOString() }
        }));
        
        return true;
    }
    
    /**
     * Test connection to Printify API
     */
    async function testConnection() {
        if (!state.isInitialized) {
            console.error('Printify: Not initialized. Call init() first.');
            return { success: false, error: 'Not initialized' };
        }
        
        try {
            const response = await makeRequest(`${config.endpoints.shops}`);
            
            if (response && Array.isArray(response)) {
                const shop = response.find(s => s.id === state.shopId);
                if (shop) {
                    state.connected = true;
                    return {
                        success: true,
                        shop: {
                            id: shop.id,
                            title: shop.title,
                            sales_channel: shop.sales_channel
                        },
                        message: 'Connection successful'
                    };
                }
            }
            
            return { success: false, error: 'Shop not found' };
            
        } catch (error) {
            console.error('Printify: Connection test failed:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }
    }
    
    /**
     * Get products from Printify
     */
    async function getProducts(options = {}) {
        if (!state.isInitialized) {
            console.error('Printify: Not initialized');
            return { success: false, error: 'Not initialized' };
        }
        
        const params = new URLSearchParams();
        if (options.limit) params.append('limit', options.limit);
        if (options.page) params.append('page', options.page);
        
        const queryString = params.toString();
        const url = `${config.endpoints.products}${queryString ? `?${queryString}` : ''}`;
        
        try {
            const products = await makeRequest(url);
            state.productCount = products?.length || 0;
            
            // Dispatch products loaded event
            window.dispatchEvent(new CustomEvent('printify:productsLoaded', {
                detail: { count: state.productCount, timestamp: new Date().toISOString() }
            }));
            
            return {
                success: true,
                products: products || [],
                count: state.productCount,
                pagination: options
            };
            
        } catch (error) {
            console.error('Printify: Failed to get products:', error);
            return {
                success: false,
                error: error.message,
                products: []
            };
        }
    }
    
    /**
     * Create a new product in Printify
     */
    async function createProduct(productData) {
        if (!state.isInitialized) {
            console.error('Printify: Not initialized');
            return { success: false, error: 'Not initialized' };
        }
        
        const requiredFields = ['title', 'description', 'blueprint_id', 'print_providers', 'variants'];
        const missingFields = requiredFields.filter(field => !productData[field]);
        
        if (missingFields.length > 0) {
            return {
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            };
        }
        
        try {
            const response = await makeRequest(config.endpoints.products, {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            
            console.log('Printify: Product created successfully:', response.id);
            
            // Dispatch product created event
            window.dispatchEvent(new CustomEvent('printify:productCreated', {
                detail: {
                    productId: response.id,
                    title: response.title,
                    timestamp: new Date().toISOString()
                }
            }));
            
            return {
                success: true,
                product: response,
                message: 'Product created successfully'
            };
            
        } catch (error) {
            console.error('Printify: Failed to create product:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }
    }
    
    /**
     * Submit an order to Printify
     */
    async function submitOrder(orderData) {
        if (!state.isInitialized) {
            console.error('Printify: Not initialized');
            return { success: false, error: 'Not initialized' };
        }
        
        const requiredFields = ['external_id', 'label', 'line_items', 'shipping_method', 'send_shipping_notification'];
        const missingFields = requiredFields.filter(field => !orderData[field]);
        
        if (missingFields.length > 0) {
            return {
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            };
        }
        
        try {
            const response = await makeRequest(config.endpoints.orders, {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
            
            console.log('Printify: Order submitted successfully:', response.id);
            state.orderCount++;
            
            // Dispatch order submitted event
            window.dispatchEvent(new CustomEvent('printify:orderSubmitted', {
                detail: {
                    orderId: response.id,
                    externalId: response.external_id,
                    total: response.total_price,
                    timestamp: new Date().toISOString()
                }
            }));
            
            return {
                success: true,
                order: response,
                message: 'Order submitted successfully'
            };
            
        } catch (error) {
            console.error('Printify: Failed to submit order:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }
    }
    
    /**
     * Upload image to Printify
     */
    async function uploadImage(imageFile) {
        if (!state.isInitialized) {
            console.error('Printify: Not initialized');
            return { success: false, error: 'Not initialized' };
        }
        
        // Check file size (Printify limit is 15MB)
        const maxSize = 15 * 1024 * 1024;
        if (imageFile.size > maxSize) {
            return {
                success: false,
                error: `File size exceeds 15MB limit (${(imageFile.size / 1024 / 1024).toFixed(2)}MB)`
            };
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        if (!allowedTypes.includes(imageFile.type)) {
            return {
                success: false,
                error: 'Invalid file type. Allowed: JPEG, PNG, GIF, SVG'
            };
        }
        
        try {
            const formData = new FormData();
            formData.append('file_name', imageFile.name);
            formData.append('contents', imageFile);
            
            // Note: This would need to use different headers for FormData
            const response = await makeRequest(config.endpoints.uploads, {
                method: 'POST',
                body: formData,
                headers: {} // Will be set in makeRequest
            });
            
            console.log('Printify: Image uploaded successfully:', response.id);
            
            return {
                success: true,
                image: response,
                message: 'Image uploaded successfully'
            };
            
        } catch (error) {
            console.error('Printify: Failed to upload image:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }
    }
    
    /**
     * Get shipping rates
     */
    async function getShippingRates(orderData) {
        if (!state.isInitialized) {
            console.error('Printify: Not initialized');
            return { success: false, error: 'Not initialized' };
        }
        
        try {
            const response = await makeRequest(config.endpoints.shipping, {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
            
            return {
                success: true,
                rates: response,
                message: 'Shipping rates retrieved'
            };
            
        } catch (error) {
            console.error('Printify: Failed to get shipping rates:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }
    }
    
    /**
     * Sync local products with Printify
     */
    async function syncProducts(localProducts, strategy = 'merge') {
        if (!state.isInitialized) {
            console.error('Printify: Not initialized');
            return { success: false, error: 'Not initialized' };
        }
        
        console.log(`Printify: Starting product sync (strategy: ${strategy})`);
        
        try {
            const remoteProducts = await getProducts();
            
            if (!remoteProducts.success) {
                throw new Error('Failed to fetch remote products');
            }
            
            let syncResults = {
                created: 0,
                updated: 0,
                skipped: 0,
                errors: []
            };
            
            // Implementation would vary based on sync strategy
            switch (strategy) {
                case 'merge':
                    // Merge local and remote products
                    // This is a placeholder implementation
                    syncResults.message = 'Merge sync strategy selected';
                    break;
                    
                case 'replace':
                    // Replace remote with local
                    syncResults.message = 'Replace sync strategy selected';
                    break;
                    
                case 'update':
                    // Update remote with local changes
                    syncResults.message = 'Update sync strategy selected';
                    break;
                    
                default:
                    syncResults.errors.push(`Unknown sync strategy: ${strategy}`);
            }
            
            state.lastSync = new Date().toISOString();
            
            // Dispatch sync complete event
            window.dispatchEvent(new CustomEvent('printify:syncComplete', {
                detail: {
                    strategy,
                    results: syncResults,
                    timestamp: state.lastSync
                }
            }));
            
            return {
                success: true,
                ...syncResults,
                lastSync: state.lastSync
            };
            
        } catch (error) {
            console.error('Printify: Sync failed:', error);
            return {
                success: false,
                error: error.message,
                details: error
            };
        }
    }
    
    /**
     * Make API request to Printify
     */
    async function makeRequest(endpoint, options = {}) {
        if (!state.isInitialized) {
            throw new Error('Printify: Not initialized');
        }
        
        const url = `${config.baseUrl}/v1/shops/${state.shopId}${endpoint}`;
        
        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                ...config.defaultHeaders,
                'Authorization': `Bearer ${state.apiKey}`,
                ...options.headers
            },
            ...options
        };
        
        // Remove Content-Type header for FormData
        if (options.body instanceof FormData) {
            delete requestOptions.headers['Content-Type'];
        }
        
        console.log(`Printify: Making ${requestOptions.method} request to ${endpoint}`);
        
        try {
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Printify: Request failed:', error);
            throw error;
        }
    }
    
    // ========== UTILITY FUNCTIONS ==========
    
    /**
     * Get integration status
     */
    function getStatus() {
        return {
            ...state,
            config: {
                apiVersion: config.apiVersion,
                baseUrl: config.baseUrl
            }
        };
    }
    
    /**
     * Reset integration state
     */
    function reset() {
        state = {
            isInitialized: false,
            apiKey: null,
            shopId: null,
            connected: false,
            lastSync: null,
            productCount: 0,
            orderCount: 0
        };
        
        console.log('Printify: Integration reset');
    }
    
    /**
     * Validate Printify product data
     */
    function validateProductData(productData) {
        const errors = [];
        
        if (!productData.title || productData.title.length < 3) {
            errors.push('Title must be at least 3 characters');
        }
        
        if (!productData.description || productData.description.length < 10) {
            errors.push('Description must be at least 10 characters');
        }
        
        if (!productData.blueprint_id) {
            errors.push('Blueprint ID is required');
        }
        
        if (!productData.print_providers || !Array.isArray(productData.print_providers) || productData.print_providers.length === 0) {
            errors.push('At least one print provider is required');
        }
        
        if (!productData.variants || !Array.isArray(productData.variants) || productData.variants.length === 0) {
            errors.push('At least one variant is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Validate Printify order data
     */
    function validateOrderData(orderData) {
        const errors = [];
        
        if (!orderData.external_id) {
            errors.push('External ID is required');
        }
        
        if (!orderData.label) {
            errors.push('Order label is required');
        }
        
        if (!orderData.line_items || !Array.isArray(orderData.line_items) || orderData.line_items.length === 0) {
            errors.push('At least one line item is required');
        }
        
        if (!orderData.shipping_method) {
            errors.push('Shipping method is required');
        }
        
        if (typeof orderData.send_shipping_notification !== 'boolean') {
            errors.push('Send shipping notification must be a boolean');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // ========== EVENT HANDLERS ==========
    
    /**
     * Setup event listeners for Printify integration
     */
    function setupEventListeners() {
        // Listen for product creation requests
        window.addEventListener('printify:createProductRequest', async (event) => {
            const { productData, callback } = event.detail;
            const result = await createProduct(productData);
            
            if (callback && typeof callback === 'function') {
                callback(result);
            }
        });
        
        // Listen for order submission requests
        window.addEventListener('printify:submitOrderRequest', async (event) => {
            const { orderData, callback } = event.detail;
            const result = await submitOrder(orderData);
            
            if (callback && typeof callback === 'function') {
                callback(result);
            }
        });
        
        // Listen for sync requests
        window.addEventListener('printify:syncRequest', async (event) => {
            const { products, strategy, callback } = event.detail;
            const result = await syncProducts(products, strategy);
            
            if (callback && typeof callback === 'function') {
                callback(result);
            }
        });
        
        console.log('Printify: Event listeners setup complete');
    }
    
    // ========== PUBLIC API ==========
    return {
        // Core functions
        init,
        testConnection,
        getStatus,
        reset,
        
        // Product management
        getProducts,
        createProduct,
        validateProductData,
        
        // Order management
        submitOrder,
        validateOrderData,
        getShippingRates,
        
        // File management
        uploadImage,
        
        // Sync operations
        syncProducts,
        
        // Configuration
        getConfig: () => ({ ...config }),
        
        // Event system
        setupEventListeners,
        
        // Utility
        validate: {
            product: validateProductData,
            order: validateOrderData
        }
    };
})();

// ========== AUTO-INITIALIZATION ==========

// Check for Printify credentials in environment (for Phase 2)
document.addEventListener('DOMContentLoaded', function() {
    // This would be loaded from a s
