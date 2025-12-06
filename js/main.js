// main.js - Main Program Entry

// General utility functions
const Utils = {
    // Debounce function
    debounce: function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: function (func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format price
    formatPrice: function (price) {
        return new Intl.NumberFormat('en-CN', {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Get URL parameter
    getUrlParameter: function (name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(window.location.href);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    // Set URL parameter
    setUrlParameter: function (key, value) {
        const url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    },

    // Remove URL parameter
    removeUrlParameter: function (key) {
        const url = new URL(window.location.href);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    },

    // Show notification
    showNotification: function (message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add close event
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });

        // Auto disappear
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },

    // Validate email
    validateEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone: function (phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    },

    // Load JSON data
    loadJSON: async function (url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            return null;
        }
    },

    // Save to local storage
    saveToLocalStorage: function (key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Load from local storage
    loadFromLocalStorage: function (key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }
};

// Notification styles
const addNotificationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            background-color: white;
        }
        
        .notification-info {
            border-left: 4px solid #4a90e2;
        }
        
        .notification-success {
            border-left: 4px solid #28a745;
        }
        
        .notification-warning {
            border-left: 4px solid #ffc107;
        }
        
        .notification-error {
            border-left: 4px solid #dc3545;
        }
        
        .notification-message {
            flex: 1;
            margin-right: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        
        .notification-close:hover {
            background-color: #f0f0f0;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize after page loads
document.addEventListener('DOMContentLoaded', function () {
    // Add notification styles
    addNotificationStyles();

    // Initialize back to top button
    initBackToTopButton();

    // Initialize contact forms
    initContactForms();

    // Initialize favorites
    initFavorites();

    // Initialize breadcrumb navigation (if exists)
    initBreadcrumb();

    // Add page load animation
    addPageLoadAnimation();
});

// Initialize back to top button
function initBackToTopButton() {
    // Create button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.title = 'Back to Top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(backToTopButton);

    // Scroll event
    window.addEventListener('scroll', Utils.throttle(function () {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }, 100));

    // Click event
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize contact forms
function initContactForms() {
    const contactForms = document.querySelectorAll('form[id*="contact"]');

    contactForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = form.querySelector('input[name="name"]');
            const email = form.querySelector('input[name="email"]');
            const message = form.querySelector('textarea[name="message"]');

            // Simple validation
            if (name && name.value.trim() === '') {
                Utils.showNotification('Please enter your name', 'warning');
                name.focus();
                return;
            }

            if (email && !Utils.validateEmail(email.value)) {
                Utils.showNotification('Please enter a valid email address', 'warning');
                email.focus();
                return;
            }

            if (message && message.value.trim() === '') {
                Utils.showNotification('Please enter your message', 'warning');
                message.focus();
                return;
            }

            // Simulate form submission
            Utils.showNotification('Thank you for your message! We will reply to you as soon as possible.', 'success');

            // Reset form
            form.reset();
        });
    });
}

// Initialize favorites
function initFavorites() {
    // Check if current page has favorite buttons
    const favoriteButtons = document.querySelectorAll('.btn-favorite');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const dogId = this.dataset.id;
            let favorites = Utils.loadFromLocalStorage('dog_favorites') || [];

            if (!favorites.includes(dogId)) {
                favorites.push(dogId);
                Utils.saveToLocalStorage('dog_favorites', favorites);
                this.innerHTML = 'Favorited';
                this.classList.add('favorited');
                Utils.showNotification('Successfully added to favorites!', 'success');
            } else {
                // Remove from favorites
                favorites = favorites.filter(id => id !== dogId);
                Utils.saveToLocalStorage('dog_favorites', favorites);
                this.innerHTML = 'Add to Favorites';
                this.classList.remove('favorited');
                Utils.showNotification('Removed from favorites!', 'info');
            }
        });

        // Initialize button state
        const dogId = button.dataset.id;
        const favorites = Utils.loadFromLocalStorage('dog_favorites') || [];
        if (favorites.includes(dogId)) {
            button.innerHTML = 'Favorited';
            button.classList.add('favorited');
        }
    });
}

// Initialize breadcrumb navigation
function initBreadcrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumb');

    if (!breadcrumbContainer) return;

    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '') || 'index';

    const breadcrumbMap = {
        'index': 'Home',
        'dogs': 'Dogs',
        'about': 'About Us',
        'dog-detail': 'Dog Details'
    };

    let breadcrumbHTML = '<a href="index.html">Home</a>';

    if (pageName !== 'index') {
        breadcrumbHTML += ` › <span>${breadcrumbMap[pageName] || pageName}</span>`;
    }

    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Add page load animation
function addPageLoadAnimation() {
    // Add loading class to body
    document.body.classList.add('page-loading');

    // Remove loading class after page loads
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.body.classList.remove('page-loading');
        }, 300);
    });
}

// Image lazy loading
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Keyboard shortcut support
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // ESC key closes all modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
            });
        }

        // / key focuses search box
        if (e.key === '/' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const searchInput = document.getElementById('search-input');
            if (searchInput && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
}

// Initialize keyboard shortcuts
initKeyboardShortcuts();

// Export utility functions for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}