// ========================================
// GLOBAL VARIABLES
// ========================================
let cartCount = 0;
let cartItems = [];

// ========================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// CART FUNCTIONALITY
// ========================================
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Get book details
        const bookCard = this.closest('.book-card');
        const bookTitle = bookCard.querySelector('.book-title').textContent;
        const bookPrice = bookCard.querySelector('.book-price').textContent;
        
        // Add to cart
        cartCount++;
        cartItems.push({
            title: bookTitle,
            price: bookPrice
        });
        
        // Update cart count display
        document.querySelector('.cart-count').textContent = cartCount;
        
        // Button animation and feedback
        const originalText = this.textContent;
        this.textContent = '✓ Added!';
        this.style.background = '#48bb78';
        this.style.transform = 'scale(1.1)';
        
        // Animate cart icon
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.style.animation = 'none';
        setTimeout(() => {
            cartIcon.style.animation = 'cartBounce 0.5s ease';
        }, 10);
        
        // Reset button after 2 seconds
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.transform = 'scale(1)';
        }, 2000);
        
        // Show notification
        showNotification(`${bookTitle} added to cart!`);
    });
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes cartBounce {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// CATEGORY FILTER FUNCTIONALITY
// ========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const bookCards = document.querySelectorAll('.book-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter category
        const filterValue = this.getAttribute('data-filter');
        
        // Filter books
        bookCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeInScale 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ========================================
// CATEGORY CARD CLICK TO FILTER
// ========================================
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Scroll to books section
        document.querySelector('#books').scrollIntoView({
            behavior: 'smooth'
        });
        
        // Activate corresponding filter button after scroll
        setTimeout(() => {
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
        }, 800);
    });
});

// ========================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.book-card, .category-card, .feature-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
    observer.observe(element);
});

// ========================================
// CONTACT FORM SUBMISSION
// ========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        // Show success message
        showNotification('Thank you! Your message has been sent successfully.');
        
        // Reset form
        this.reset();
        
        // In a real application, you would send this data to a server
        console.log('Form Data:', { name, email, phone, message });
    });
}

// ========================================
// CART ICON CLICK - SHOW CART DETAILS
// ========================================
document.querySelector('.cart-icon').addEventListener('click', function() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Create cart summary
    let cartSummary = 'Items in Cart:\n\n';
    let total = 0;
    
    cartItems.forEach((item, index) => {
        const price = parseInt(item.price.replace('₹', ''));
        total += price;
        cartSummary += `${index + 1}. ${item.title} - ${item.price}\n`;
    });
    
    cartSummary += `\nTotal: ₹${total}`;
    
    alert(cartSummary);
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// BOOK CARD HOVER EFFECT - SHOW MORE INFO
// ========================================
document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const bookCover = this.querySelector('.book-cover');
        bookCover.style.transform = 'rotateY(10deg) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
        const bookCover = this.querySelector('.book-cover');
        bookCover.style.transform = 'rotateY(0deg) scale(1)';
    });
});

// ========================================
// LOADING ANIMATION ON PAGE LOAD
// ========================================
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// CONSOLE MESSAGE FOR DEVELOPERS
// ========================================
console.log('%c📚 Book6All Website', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cDeveloped for College Project', 'color: #764ba2; font-size: 14px;');
console.log('%cAll features are working! Enjoy browsing.', 'color: #48bb78; font-size: 12px;');