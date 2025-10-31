// ========================================
// Theme Toggle & LocalStorage
// ========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// ========================================
// Mobile Navigation Toggle
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========================================
// Smooth Scrolling for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Typing Animation for Hero
// ========================================
const typingText = document.getElementById('typingText');
const text = 'Arianit Rama';
let index = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const currentText = typingText.textContent;
    
    if (!isDeleting && index < text.length) {
        typingText.textContent = text.substring(0, index + 1);
        index++;
        typingSpeed = 100;
    } else if (isDeleting && index > 0) {
        typingText.textContent = text.substring(0, index - 1);
        index--;
        typingSpeed = 50;
    } else if (index === text.length) {
        // Wait before deleting
        typingSpeed = 2000;
        isDeleting = true;
    } else if (index === 0 && isDeleting) {
        // Start typing again
        isDeleting = false;
        typingSpeed = 100;
    }
    
    setTimeout(typeWriter, typingSpeed);
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// ========================================
// Active Navigation Link on Scroll
// ========================================
const sections = document.querySelectorAll('.section, .hero');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Navbar shadow on scroll
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// ========================================
// Scroll Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .project-card, .timeline-item, .cert-item, .skill-category').forEach(el => {
    observer.observe(el);
});

// ========================================
// Skill Bar Animation
// ========================================
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.width = width;
            }, 100);
            
            skillObserver.unobserve(progressBar);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ========================================
// Contact Form Validation
// ========================================
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input, textarea');

// Real-time validation
formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input);
        }
    });
});

function validateField(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    field.classList.remove('error');
    errorElement.textContent = '';

    // Required field check
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Name validation (min 2 characters)
    if (field.id === 'name' && field.value.trim().length < 2 && field.value.trim()) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters';
    }

    // Message validation (min 10 characters)
    if (field.id === 'message' && field.value.trim().length < 10 && field.value.trim()) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters';
    }

    if (!isValid) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Simulate API call
        setTimeout(() => {
            submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitButton.style.background = '#10b981';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        }, 1500);
    } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
});

// ========================================
// Project Modal
// ========================================
const projectModal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');

const projectDetails = {
    tailscale: {
        title: 'Zero-Trust Network with Tailscale',
        description: 'A comprehensive zero-trust network architecture implementation using Tailscale with custom access control lists (ACLs) for secure remote access and cloud storage synchronization.',
        features: [
            'Configured Tailscale mesh VPN for secure network connectivity',
            'Implemented custom ACLs for granular access control',
            'Set up secure remote access to homelab resources',
            'Configured cloud storage synchronization with encrypted connections',
            'Established network segmentation and isolation',
            'Maintained network monitoring and logging'
        ],
        technologies: ['Tailscale', 'Network Security', 'ACL Configuration', 'VPN', 'Network Segmentation']
    },
    nextcloud: {
        title: 'Private Cloud with NextCloud',
        description: 'A self-hosted private cloud solution deployed using NextCloud with SSSD authentication integration, LUKS disk encryption, Docker containerization, and Portainer for container management.',
        features: [
            'Deployed NextCloud in Docker containers for scalability',
            'Configured SSSD (System Security Services Daemon) for centralized authentication',
            'Implemented LUKS disk encryption for data at rest',
            'Set up Portainer for container orchestration and monitoring',
            'Configured automated backups and data redundancy',
            'Optimized performance with caching and CDN configuration'
        ],
        technologies: ['NextCloud', 'Docker', 'LUKS', 'Portainer', 'SSSD', 'Linux', 'Nginx']
    },
    security: {
        title: 'Security Testing Lab',
        description: 'A comprehensive security testing environment featuring OWASP Juice Shop for vulnerability assessment, session hijacking simulations, and various security analysis tools.',
        features: [
            'Deployed OWASP Juice Shop vulnerable web application',
            'Configured security testing environment with Docker',
            'Set up Nginx reverse proxy for service routing',
            'Conducted session hijacking and XSS vulnerability testing',
            'Implemented security monitoring and logging',
            'Documented security findings and remediation strategies'
        ],
        technologies: ['OWASP Juice Shop', 'Docker', 'Nginx', 'Security Testing', 'Penetration Testing', 'Vulnerability Assessment']
    }
};

function openProjectModal(projectKey) {
    const project = projectDetails[projectKey];
    if (!project) return;

    modalBody.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <h4 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--text-primary);">Key Features:</h4>
        <ul>
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <h4 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--text-primary);">Technologies Used:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on outside click
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeProjectModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});

// ========================================
// Performance Optimization
// ========================================
// Lazy load images when they enter viewport
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Scroll to Top on Page Load (for anchor links)
// ========================================
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// ========================================
// Keyboard Accessibility
// ========================================
// Ensure all interactive elements are keyboard accessible
document.querySelectorAll('.btn, .nav-link, .theme-toggle, .nav-toggle').forEach(element => {
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
        }
    });
});

// Focus management for modal
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to modal
if (projectModal) {
    trapFocus(projectModal);
}

// ========================================
// Console Welcome Message
// ========================================
console.log('%c👋 Welcome to Arianit Rama\'s Portfolio', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cIT Support Specialist | Homelab Enthusiast', 'color: #64748b; font-size: 14px;');

