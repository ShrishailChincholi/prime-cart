// Update quantity function for cart
function updateQuantity(button, change) {
    const input = button.closest('.quantity-control').querySelector('input');
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    input.value = value;
}

// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});

// Add to cart form submission with loading state
document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const button = this.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        }
    });
});

// Confirm before destructive actions
document.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', function(e) {
        if (!confirm('Are you sure you want to perform this action?')) {
            e.preventDefault();
        }
    });
});

// Product image error handler
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = '/images/default-product.jpg';
    });
});

// Search form auto-submit on category change
document.querySelectorAll('.filter-btn').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('href');
        window.location.href = url;
    });
});

// Price formatting
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

// Update all price displays
document.querySelectorAll('.product-price, .price, .item-price, .total-price').forEach(el => {
    const text = el.textContent.trim();
    if (text.startsWith('$')) {
        const price = parseFloat(text.replace('$', ''));
        if (!isNaN(price)) {
            el.textContent = formatPrice(price);
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (for responsive navigation)
const createMobileMenu = function() {
    const nav = document.querySelector('.nav-links');
    const header = document.querySelector('.header-actions');
    
    // Check if mobile menu already exists
    if (document.querySelector('.mobile-menu-toggle')) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    header.insertBefore(toggleBtn, nav);
    
    toggleBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
        this.innerHTML = nav.style.display === 'none' ? 
            '<i class="fas fa-bars"></i>' : 
            '<i class="fas fa-times"></i>';
    });
    
    // Handle responsive
    const handleResponsive = function() {
        if (window.innerWidth <= 768) {
            toggleBtn.style.display = 'block';
            nav.style.display = 'none';
        } else {
            toggleBtn.style.display = 'none';
            nav.style.display = 'flex';
        }
    };
    
    window.addEventListener('resize', handleResponsive);
    handleResponsive();
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', createMobileMenu);

// Add loading spinner to buttons
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtns = this.querySelectorAll('button[type="submit"]');
        submitBtns.forEach(btn => {
            if (!btn.classList.contains('no-loading')) {
                const originalText = btn.innerHTML;
                btn.disabled = true;
                btn.dataset.originalText = originalText;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                // Reset after form submission (will be reset by page reload)
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }, 10000);
            }
        });
    });
});

// Logging utility
function log(message, type = 'info') {
    const colors = {
        info: '#667eea',
        success: '#48bb78',
        error: '#fc8181',
        warning: '#f6ad55'
    };
    
    console.log(`%c[${type.toUpperCase()}] ${message}`, 
        `color: ${colors[type] || '#333'}; font-weight: bold;`);
}

// Example usage
log('Application loaded successfully', 'success');
