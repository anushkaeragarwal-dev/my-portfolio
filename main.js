/**
 * Anushka Agarwal - Portfolio Website JavaScript
 * Clean, lightweight, dependency-free vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Toggle (Light / Dark Mode) ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('aa_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    // Keep light theme as default per requirements, but allow user toggle
    htmlElement.setAttribute('data-theme', 'light');
  } else {
    htmlElement.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('aa_portfolio_theme', newTheme);
    });
  }

  // --- 2. Mobile Navigation Drawer ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileNav = () => {
    if (mobileNavOverlay && mobileToggle) {
      mobileNavOverlay.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileNav = () => {
    if (mobileNavOverlay && mobileToggle) {
      mobileNavOverlay.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileNav);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) {
        closeMobileNav();
      }
    });
  }

  // Close drawer when clicking any mobile link
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOverlay?.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // --- 3. Active Nav Link on Scroll (Intersection Observer) ---
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // --- 4. Copy Email Address Button ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const emailPlaceholderText = document.getElementById('emailPlaceholderText');

  if (copyEmailBtn && copyFeedback && emailPlaceholderText) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailToCopy = emailPlaceholderText.textContent.replace(/[\[\]]/g, '').trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback method
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        copyFeedback.textContent = 'Copied!';
        copyEmailBtn.style.borderColor = 'var(--accent-emerald)';
        copyEmailBtn.style.color = 'var(--accent-emerald)';

        setTimeout(() => {
          copyFeedback.textContent = 'Copy';
          copyEmailBtn.style.borderColor = '';
          copyEmailBtn.style.color = '';
        }, 2500);
      } catch (err) {
        copyFeedback.textContent = 'Copy failed';
        setTimeout(() => {
          copyFeedback.textContent = 'Copy';
        }, 2000);
      }
    });
  }

  // --- 5. Contact Form Client-side Handler ---
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName')?.value.trim();
      const emailInput = document.getElementById('senderEmail')?.value.trim();
      const messageInput = document.getElementById('messageBody')?.value.trim();

      if (!nameInput || !emailInput || !messageInput) {
        formFeedback.textContent = 'Please fill out all required fields.';
        formFeedback.className = 'form-feedback error';
        formFeedback.classList.remove('hidden');
        return;
      }

      // Simulate sending
      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = `
          <span>Sending...</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        `;
      }

      setTimeout(() => {
        formFeedback.textContent = 'Thank you for reaching out, ' + nameInput + '! Your message was recorded. (Connect with Anushka once socials/email are updated!)';
        formFeedback.className = 'form-feedback success';
        formFeedback.classList.remove('hidden');

        contactForm.reset();

        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = `
            <span>Message Sent!</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          `;

          setTimeout(() => {
            formSubmitBtn.innerHTML = `
              <span>Send Message</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            `;
          }, 3500);
        }
      }, 700);
    });
  }

  // --- 6. Scroll To Top Floating Button ---
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 7. Subtle Reveal Animation for Cards ---
  const revealCards = document.querySelectorAll('.card, .skill-card, .edp-card, .learning-item-card, .goal-card, .cert-card');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.45s ease-out, transform 0.45s ease-out, box-shadow 0.25s ease, border-color 0.25s ease';
    revealObserver.observe(card);
  });
});
