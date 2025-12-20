/**
 * KARUNEX CO. PVT. LTD. - FORM VALIDATION
 * Handles form validation, submission, and user input
 * Version: 1.0.0
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== FORM VALIDATION CONFIGURATION ==========
    const validationConfig = {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\+]?[1-9][\d]{0,15}$/,
        nameRegex: /^[a-zA-Z\s]{2,50}$/,
        minMessageLength: 10,
        maxMessageLength: 1000
    };
    
    // ========== FORM VALIDATION FUNCTIONS ==========
    
    /**
     * Validate email address
     */
    function validateEmail(email) {
        return validationConfig.emailRegex.test(email);
    }
    
    /**
     * Validate phone number (international format)
     */
    function validatePhone(phone) {
        // Remove all non-digit characters except plus sign
        const cleaned = phone.replace(/[^\d+]/g, '');
        return validationConfig.phoneRegex.test(cleaned);
    }
    
    /**
     * Validate name (letters and spaces only)
     */
    function validateName(name) {
        return validationConfig.nameRegex.test(name.trim());
    }
    
    /**
     * Validate message length
     */
    function validateMessage(message) {
        const trimmed = message.trim();
        return trimmed.length >= validationConfig.minMessageLength && 
               trimmed.length <= validationConfig.maxMessageLength;
    }
    
    /**
     * Show validation error
     */
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        hideError(input);
        
        // Add error class
        formGroup.classList.add('has-error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        
        // Insert after input
        input.insertAdjacentElement('afterend', errorElement);
        
        // Focus on the input
        input.focus();
        
        // Log for debugging
        console.log(`Validation error on ${input.name}: ${message}`);
    }
    
    /**
     * Hide validation error
     */
    function hideError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('has-error');
            
            // Remove error message
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    /**
     * Show success state
     */
    function showSuccess(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('has-error');
            formGroup.classList.add('has-success');
        }
    }
    
    /**
     * Format phone number as user types
     */
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length <= 10) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        input.value = value;
    }
    
    // ========== CONTACT FORM HANDLING ==========
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        console.log('Contact form found, initializing validation...');
        
        // Get form elements
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const phoneInput = contactForm.querySelector('input[name="phone"]');
        const companyInput = contactForm.querySelector('input[name="company"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // ========== REAL-TIME VALIDATION ==========
        
        // Name validation
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (this.value.trim() && !validateName(this.value)) {
                    showError(this, 'Please enter a valid name (letters and spaces only, 2-50 characters)');
                } else {
                    hideError(this);
                    if (this.value.trim()) showSuccess(this);
                }
            });
            
            nameInput.addEventListener('input', function() {
                if (this.value.trim() && validateName(this.value)) {
                    hideError(this);
                    showSuccess(this);
                }
            });
        }
        
        // Email validation
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value.trim() && !validateEmail(this.value)) {
                    showError(this, 'Please enter a valid email address');
                } else {
                    hideError(this);
                    if (this.value.trim()) showSuccess(this);
                }
            });
            
            emailInput.addEventListener('input', function() {
                if (this.value.trim() && validateEmail(this.value)) {
                    hideError(this);
                    showSuccess(this);
                }
            });
        }
        
        // Phone validation and formatting
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                formatPhoneNumber(this);
                if (this.value.trim() && validatePhone(this.value)) {
                    hideError(this);
                    showSuccess(this);
                }
            });
            
            phoneInput.addEventListener('blur', function() {
                if (this.value.trim() && !validatePhone(this.value)) {
                    showError(this, 'Please enter a valid phone number');
                } else {
                    hideError(this);
                    if (this.value.trim()) showSuccess(this);
                }
            });
        }
        
        // Message validation
        if (messageInput) {
            const charCount = document.createElement('div');
            charCount.className = 'char-count';
            charCount.textContent = `0/${validationConfig.maxMessageLength}`;
            messageInput.insertAdjacentElement('afterend', charCount);
            
            messageInput.addEventListener('input', function() {
                const length = this.value.length;
                charCount.textContent = `${length}/${validationConfig.maxMessageLength}`;
                
                if (length > validationConfig.maxMessageLength) {
                    charCount.classList.add('error');
                } else {
                    charCount.classList.remove('error');
                }
                
                if (this.value.trim() && validateMessage(this.value)) {
                    hideError(this);
                    showSuccess(this);
                }
            });
            
            messageInput.addEventListener('blur', function() {
                if (this.value.trim() && !validateMessage(this.value)) {
                    showError(this, `Message must be between ${validationConfig.minMessageLength} and ${validationConfig.maxMessageLength} characters`);
                } else {
                    hideError(this);
                    if (this.value.trim()) showSuccess(this);
                }
            });
        }
        
        // ========== FORM SUBMISSION ==========
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submission started...');
            
            // Validate all fields
            let isValid = true;
            const formData = {};
            
            // Validate name
            if (nameInput) {
                if (!nameInput.value.trim() || !validateName(nameInput.value)) {
                    showError(nameInput, 'Please enter your name');
                    isValid = false;
                } else {
                    hideError(nameInput);
                    formData.name = nameInput.value.trim();
                }
            }
            
            // Validate email
            if (emailInput) {
                if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                    showError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    hideError(emailInput);
                    formData.email = emailInput.value.trim();
                }
            }
            
            // Validate message
            if (messageInput) {
                if (!messageInput.value.trim() || !validateMessage(messageInput.value)) {
                    showError(messageInput, `Please enter a message (${validationConfig.minMessageLength}-${validationConfig.maxMessageLength} characters)`);
                    isValid = false;
                } else {
                    hideError(messageInput);
                    formData.message = messageInput.value.trim();
                }
            }
            
            // Optional fields
            if (phoneInput && phoneInput.value.trim()) {
                if (!validatePhone(phoneInput.value)) {
                    showError(phoneInput, 'Please enter a valid phone number');
                    isValid = false;
                } else {
                    hideError(phoneInput);
                    formData.phone = phoneInput.value.trim();
                }
            }
            
            if (companyInput && companyInput.value.trim()) {
                formData.company = companyInput.value.trim();
            }
            
            // If validation failed, stop here
            if (!isValid) {
                console.log('Form validation failed');
                
                // Scroll to first error
                const firstError = contactForm.querySelector('.has-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                return;
            }
            
            console.log('Form validation passed, preparing submission...', formData);
            
            // Show loading state
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Disable all inputs during submission
            const allInputs = contactForm.querySelectorAll('input, textarea, button');
            allInputs.forEach(input => input.disabled = true);
            
            try {
                // In a real application, you would send this to your server
                // For now, we'll simulate an API call
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate successful submission
                console.log('Form data would be sent to server:', formData);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-content">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h3>Thank You!</h3>
                            <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                            <p>A confirmation email has been sent to ${formData.email}.</p>
                        </div>
                    </div>
                `;
                successMessage.setAttribute('role', 'alert');
                successMessage.setAttribute('aria-live', 'polite');
                
                // Replace form with success message
                contactForm.style.display = 'none';
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Track form submission in analytics
                if (typeof trackEvent === 'function') {
                    trackEvent('form', 'submit', 'contact');
                }
                
                // Reset form (hidden but still in DOM)
                contactForm.reset();
                
                // Re-enable inputs (though form is hidden)
                allInputs.forEach(input => input.disabled = false);
                
                // Send data to server (example using fetch)
                /*
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const result = await response.json();
                console.log('Server response:', result);
                */
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.innerHTML = `
                    <div class="error-content">
                        <i class="fas fa-exclamation-circle"></i>
                        <div>
                            <h3>Oops! Something went wrong</h3>
                            <p>There was an error sending your message. Please try again or contact us directly.</p>
                            <button class="btn btn-small retry-button">Try Again</button>
                        </div>
                    </div>
                `;
                
                contactForm.parentNode.insertBefore(errorMessage, contactForm);
                
                // Add retry functionality
                const retryButton = errorMessage.querySelector('.retry-button');
                retryButton.addEventListener('click', function() {
                    errorMessage.remove();
                    contactForm.style.display = 'block';
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    allInputs.forEach(input => input.disabled = false);
                });
                
                // Track error in analytics
                if (typeof trackEvent === 'function') {
                    trackEvent('form', 'error', 'contact_submission');
                }
            } finally {
                // Restore button state if form is still visible
                if (contactForm.style.display !== 'none') {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    allInputs.forEach(input => input.disabled = false);
                }
            }
        });
        
        // ========== FORM RESET HANDLING ==========
        
        const resetButton = contactForm.querySelector('button[type="reset"]');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // Clear all validation states
                const formGroups = contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.classList.remove('has-error', 'has-success');
                });
                
                // Clear all error messages
                const errorMessages = contactForm.querySelectorAll('.error-message');
                errorMessages.forEach(msg => msg.remove());
                
                // Reset character count
                const charCount = contactForm.querySelector('.char-count');
                if (charCount) {
                    charCount.textContent = `0/${validationConfig.maxMessageLength}`;
                    charCount.classList.remove('error');
                }
                
                console.log('Form reset');
            });
        }
    }
    
    // ========== QUOTE REQUEST FORM ==========
    
    const quoteForm = document.querySelector('form#quote-form');
    
    if (quoteForm) {
        console.log('Quote form found, initializing...');
        
        // Get quote form elements
        const quoteProductSelect = quoteForm.querySelector('select[name="product"]');
        const quoteQuantityInput = quoteForm.querySelector('input[name="quantity"]');
        const quoteDeadlineInput = quoteForm.querySelector('input[name="deadline"]');
        const quoteDesignUpload = quoteForm.querySelector('input[name="design"]');
        const quoteEstimateElement = quoteForm.querySelector('.price-estimate');
        
        // Update price estimate based on selection
        if (quoteProductSelect && quoteQuantityInput && quoteEstimateElement) {
            const prices = {
                't-shirt': 12.99,
                'hoodie': 34.99,
                'mug': 8.99,
                'tote': 9.99,
                'cap': 14.99,
                'pen': 2.99
            };
            
            function updateEstimate() {
                const product = quoteProductSelect.value;
                const quantity = parseInt(quoteQuantityInput.value) || 1;
                
                if (prices[product]) {
                    const basePrice = prices[product];
                    let total = basePrice * quantity;
                    
                    // Bulk discount
                    if (quantity >= 100) total *= 0.9; // 10% discount
                    else if (quantity >= 50) total *= 0.95; // 5% discount
                    
                    // Format currency
                    const formatted = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    }).format(total);
                    
                    quoteEstimateElement.textContent = `Estimated cost: ${formatted}`;
                } else {
                    quoteEstimateElement.textContent = 'Select a product to see estimate';
                }
            }
            
            // Update estimate on changes
            quoteProductSelect.addEventListener('change', updateEstimate);
            quoteQuantityInput.addEventListener('input', updateEstimate);
            
            // Initial estimate
            updateEstimate();
        }
        
        // Handle design file upload
        if (quoteDesignUpload) {
            quoteDesignUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Check file size (max 5MB)
                    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                    
                    if (file.size > maxSize) {
                        showError(quoteDesignUpload, 'File size must be less than 5MB');
                        quoteDesignUpload.value = ''; // Clear the input
                    } else {
                        hideError(quoteDesignUpload);
                        
                        // Check file type
                        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/svg+xml'];
                        if (!allowedTypes.includes(file.type)) {
                            showError(quoteDesignUpload, 'Please upload JPG, PNG, GIF, PDF, or SVG files only');
                            quoteDesignUpload.value = '';
                        } else {
                            console.log('Design file uploaded:', file.name, file.size, 'bytes');
                        }
                    }
                }
            });
        }
        
        // Validate deadline date
        if (quoteDeadlineInput) {
            quoteDeadlineInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    showError(this, 'Please select a future date');
                } else {
                    hideError(this);
                }
            });
        }
    }
    
    // ========== NEWSLETTER SUBSCRIPTION ==========
    
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (!emailInput || !validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            // Show loading state
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Success
                emailInput.value = '';
                submitButton.innerHTML = '<i class="fas fa-check"></i>';
                submitButton.style.backgroundColor = 'var(--success-color)';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonHTML;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 2000);
                
                console.log('Newsletter subscription successful');
                
                // Track subscription
                if (typeof trackEvent === 'function') {
                    trackEvent('newsletter', 'subscribe', 'footer');
                }
                
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showError(emailInput, 'Subscription failed. Please try again.');
                submitButton.innerHTML = originalButtonHTML;
                submitButton.disabled = false;
            }
        });
    });
    
    // ========== FORM AUTOSAVE (for longer forms) ==========
    
    const autoSaveForms = document.querySelectorAll('.form-autosave');
    
    autoSaveForms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        const saveKey = `autosave_${form.id || 'form'}`;
        
        // Load saved data
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                inputs.forEach(input => {
                    if (data[input.name]) {
                        input.value = data[input.name];
                    }
                });
                console.log('Form data restored from autosave');
            } catch (e) {
                console.error('Error loading autosave:', e);
            }
        }
        
        // Save on input
        inputs.forEach(input => {
            input.addEventListener('input', debounce(function() {
                const formData = {};
                inputs.forEach(inp => {
                    if (inp.name) {
                        formData[inp.name] = inp.value;
                    }
                });
                
                localStorage.setItem(saveKey, JSON.stringify(formData));
                console.log('Form data autosaved');
            }, 1000));
        });
        
        // Clear autosave on successful submission
        form.addEventListener('submit', function() {
            localStorage.removeItem(saveKey);
            console.log('Autosave cleared after submission');
        });
    });
    
    // ========== FORM ACCESSIBILITY ==========
    
    // Add aria-labels to form inputs without labels
    const unlabeledInputs = document.querySelectorAll('input:not([id]), textarea:not([id])');
    unlabeledInputs.forEach(input => {
        if (!input.hasAttribute('aria-label')) {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder) {
                input.setAttribute('aria-label', placeholder);
            }
        }
    });
    
    // Focus management for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeForm = document.querySelector('.form-modal.active');
            if (activeForm) {
                closeFormModal(activeForm);
            }
        }
    });
    
    // ========== FORM MODAL FUNCTIONALITY ==========
    
    function openFormModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus on first input
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
            
            // Trap focus inside modal
            trapFocus(modal);
        }
    }
    
    function closeFormModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to trigger element
        const trigger = document.querySelector(`[data-modal="${modal.id}"]`);
        if (trigger) trigger.focus();
    }
    
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
    
    // ========== INITIALIZATION COMPLETE ==========
    
    console.log('Form validation system initialized');
    
    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('forms:ready'));
});

// ========== GLOBAL FORM UTILITIES ==========

/**
 * Export form validation functions for use in other modules
 */
window.KarunexForms = {
    validateEmail,
    validatePhone,
    validateName,
    validateMessage,
    showError,
    hideError,
    showSuccess
};

// ========== POLYFILLS FOR OLDER BROWSERS ==========

// String.trim() polyfill
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

// Element.closest() polyfill
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Element.matches() polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}
