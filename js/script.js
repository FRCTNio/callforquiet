(function setRandomAccent() {
    const accentPalette = [
        '#ccff00', // electric lime (current default)
//      '#ff5ecb', // hot pink
//      '#00e5ff', // cyan
//      '#ff8a00', // amber
//      '#CC6BFB', // violet
//      '#EFF436',
    ];

    const chosen = accentPalette[Math.floor(Math.random() * accentPalette.length)];
    document.documentElement.style.setProperty('--accent', chosen);
})();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quietContactForm');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');

    // Prevent letters/alphabetical characters from being typed in phone input
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let cleaned = this.value.replace(/[A-Za-z]/g, '');
            if (this.value !== cleaned) {
                this.value = cleaned;
            }
        });
    }

    // Real-time formatting feedback on blur for email
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !this.value.includes('@')) {
                this.classList.add('invalid');
                emailError.style.display = 'block';
            } else {
                this.classList.remove('invalid');
                emailError.style.display = 'none';
            }
        });
    }

    // Form submission validation safeguard + async Formspree handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            let valid = true;

            if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
                emailInput.classList.add('invalid');
                emailError.style.display = 'block';
                valid = false;
            }

            if (!valid) {
                e.preventDefault(); 
                emailInput.focus();
                return; // Stop execution if validation fails
            }

            // If valid, stop default form redirect and submit via fetch
            e.preventDefault();
            
            const data = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.innerHTML = `
                        <div style="text-align: center; padding: 3rem 0;">
                            <h3 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-main);">Message received.</h3>
                            <p style="color: var(--text-muted); font-size: 1.1rem;">Thanks for reaching out. We'll review your notes and get back to you shortly.</p>
                        </div>
                    `;
                } else {
                    alert("Oops! There was a problem submitting your form. Please try emailing directly.");
                }
            } catch (error) {
                alert("Oops! There was a network error. Please try again later.");
            }
        });
    }

    // Mobile Burger Navigation Toggle
    const burger = document.querySelector('.nav-burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinksItems = document.querySelectorAll('.nav-links a, .nav-cta');

    if (burger && navMenu) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = burger.classList.contains('active');
            burger.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when any navigation link is clicked
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // HTML-Driven Accordion & Mobile Slide-Up Drawer Logic for Multiple Sections
    const sections = document.querySelectorAll('.scenarios');

    sections.forEach(section => {
        const cards = section.querySelectorAll('.scope-card');
        const drawer = section.querySelector('.scope-drawer');
        const drawerContent = section.querySelector('.drawer-content');

        if (cards.length > 0 && drawer && drawerContent) {
            let activeCard = null;

            cards.forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.scope-drawer')) return;

                    const targetId = this.getAttribute('data-target');
                    const templateContent = document.getElementById(targetId);

                    if (activeCard === this) {
                        drawer.classList.remove('open');
                        cards.forEach(c => c.classList.remove('active'));
                        activeCard = null;
                        return;
                    }

                    cards.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    activeCard = this;

                    if (templateContent) {
                        drawerContent.innerHTML = templateContent.innerHTML;
                        drawer.classList.add('open');

                        // Bind the mobile close button
                        const closeBtn = drawerContent.querySelector('.drawer-close');
                        if (closeBtn) {
                            closeBtn.addEventListener('click', function() {
                                drawer.classList.remove('open');
                                cards.forEach(c => c.classList.remove('active'));
                                activeCard = null;
                            });
                        }
                    }
                });
            });
        }
    });
});