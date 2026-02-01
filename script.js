// Server status and player count functionality (now using real-time API)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize real-time player counter
    initializeRealTimeCounter();
    
    // Set up status dot animation based on real API
    setInterval(updateStatusDot, 5000); // Check every 5 seconds for status dot
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
    
    // Add animation to elements when they come into view
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
    
    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.stat-card, .rank-card, .item-card, .contact-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.buy-btn, .btn, .contact-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Initialize real-time player counter
function initializeRealTimeCounter() {
    console.log('Real-time Minecraft player counter initialized');
    
    // The mc-player-counter library will automatically handle the elements with data-playercounter-* attributes
    // We just need to set up the status dot animation
    setTimeout(updateStatusDot, 2000); // Initial check after 2 seconds
}

// Function to update status dot based on server status text
function updateStatusDot() {
    const statusDot = document.getElementById('statusDot');
    const serverStatus = document.getElementById('serverStatus');
    
    if (serverStatus) {
        const statusText = serverStatus.textContent.toLowerCase();
        
        if (statusText === 'online') {
            statusDot.classList.add('online');
            statusDot.style.background = '#4169e1';
        } else if (statusText === 'offline') {
            statusDot.classList.remove('online');
            statusDot.style.background = '#ff4444';
        } else {
            // Still checking or unknown
            statusDot.classList.remove('online');
            statusDot.style.background = '#ffaa00';
        }
    }
}

// Function to copy IP address
function copyIP() {
    const ipAddress = document.getElementById('serverIP').textContent;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(ipAddress).then(() => {
            showNotification('IP Address copied successfully!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(ipAddress);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(ipAddress);
    }
}

// Fallback copy function
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('IP Address copied successfully!', 'success');
        } else {
            showNotification('Failed to copy IP Address', 'error');
        }
    } catch (err) {
        showNotification('Failed to copy IP Address', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #4169e1, #2e4bc6)';
            notification.style.color = '#fff';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #333, #555)';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
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
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Additional configuration for mc-player-counter (if needed)
// You can also initialize player counters programmatically:
/*
document.addEventListener('DOMContentLoaded', function() {
    // Example of programmatic initialization
    new PlayerCounter({
        element: document.getElementById('playerCount'),
        ip: 'play.lythcraft.net:25565',
        format: '{online}',
        refreshRate: 30 * 1000 // 30 seconds
    });
    
    new PlayerCounter({
        element: document.getElementById('serverStatus'),
        ip: 'play.lythcraft.net:25565',
        format: '{status}', // Will show 'online' or 'offline'
        refreshRate: 30 * 1000
    });
});
*/ 