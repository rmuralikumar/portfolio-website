/**
 * ============================================================================
 * PORTFOLIO JAVASCRIPT
 * Developer: Murali Kumar R (Web Developer | WordPress Developer)
 * Technologies: Pure Vanilla JavaScript (ES6+)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Dynamic Copyright Year & Live Clock
  // --------------------------------------------------------------------------
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  const liveTimeEl = document.getElementById('live-time');
  const updateLiveTime = () => {
    if (!liveTimeEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    liveTimeEl.textContent = `${hours}:${minutes} ${ampm}`;
  };
  updateLiveTime();
  setInterval(updateLiveTime, 1000);

  // --------------------------------------------------------------------------
  // 2. Sticky Header Elevation on Scroll
  // --------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const handleScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer & Backdrop Handling
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  const openMobileMenu = () => {
    if (!mobileDrawer || !mobileToggle) return;
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileDrawer || !mobileToggle) return;
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Auto-close mobile drawer on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Smooth Anchor Link Scrolling with Header Offset
  // --------------------------------------------------------------------------
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeMobileMenu();
        }

        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4b. Phone Card Keyboard Accessibility (Space key support for anchor links)
  // --------------------------------------------------------------------------
  const phoneCard = document.getElementById('phone-contact-card') || document.querySelector('a[href^="tel:"]');
  if (phoneCard) {
    phoneCard.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        phoneCard.click();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. ScrollSpy (Active Navigation Link Highlighting)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileDrawerNavLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
        mobileDrawerNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
  highlightNavOnScroll();

  // --------------------------------------------------------------------------
  // 6. Project Category Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectBlocks = document.querySelectorAll('.nakula-project-block');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filterValue = this.getAttribute('data-filter');

      // Update active state on buttons
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Filter project cards smoothly
      projectBlocks.forEach(project => {
        const categories = project.getAttribute('data-categories') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          project.classList.remove('is-filtered-out');
        } else {
          project.classList.add('is-filtered-out');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Animations with IntersectionObserver
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay');
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, parseInt(delay, 10));
          } else {
            entry.target.classList.add('is-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 8. Singleton Toast Notification Handler (Prevents duplicate stacked toasts)
  // --------------------------------------------------------------------------
  let activeToastTimeout = null;

  const showToast = (message, type = 'success', duration = 5000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Clear any previous toast and timeout to ensure only ONE toast is displayed
    if (activeToastTimeout) {
      clearTimeout(activeToastTimeout);
      activeToastTimeout = null;
    }
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;

    const iconSvg = type === 'error'
      ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
           <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
         </svg>`
      : `<svg width="20" height="20" viewBox="0 0 20 20" fill="#000000" aria-hidden="true">
           <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
         </svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    activeToastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  };

  // --------------------------------------------------------------------------
  // 9. Contact Form Submission & Turnstile Verification (Anti-Spam & Submission Lock)
  // --------------------------------------------------------------------------
  const formStartTime = Date.now();
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const honeypotInput = document.getElementById('website') || document.getElementById('_hp_website');
    const submitBtn = document.getElementById('submit-btn');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');
    const turnstileError = document.getElementById('turnstile-error');
    const turnstileGroup = document.getElementById('turnstile-group');

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    let isSubmitting = false;
    let turnstileWidgetId = null;
    let activeTurnstileToken = '';

    // Initialize Cloudflare Turnstile
    const setupTurnstile = async () => {
      const widgetContainer = document.getElementById('cf-turnstile-widget');
      if (!widgetContainer) return;

      let siteKey = widgetContainer.getAttribute('data-sitekey') || window.TURNSTILE_SITE_KEY || '';

      // If siteKey is not hardcoded, fetch it from the backend configuration endpoint
      if (!siteKey) {
        try {
          const configRes = await fetch('/api/contact', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          if (configRes.ok) {
            const configData = await configRes.json();
            if (configData && configData.siteKey) {
              siteKey = configData.siteKey;
            }
          }
        } catch (err) {
          console.warn('[Turnstile] Could not load siteKey from /api/contact:', err);
        }
      }

      if (!siteKey) {
        console.warn('[Turnstile] No TURNSTILE_SITE_KEY available.');
        return;
      }

      // Wait for Cloudflare Turnstile script to load
      const renderWidget = () => {
        if (window.turnstile && typeof window.turnstile.render === 'function') {
          if (turnstileWidgetId !== null) return;
          try {
            turnstileWidgetId = window.turnstile.render('#cf-turnstile-widget', {
              sitekey: siteKey,
              action: 'contact-form',
              theme: 'dark',
              size: 'normal',
              callback: (token) => {
                activeTurnstileToken = token;
                if (turnstileError) turnstileError.textContent = '';
                if (turnstileGroup) turnstileGroup.classList.remove('has-error');
              },
              'expired-callback': () => {
                activeTurnstileToken = '';
                if (turnstileError) turnstileError.textContent = 'Verification expired. Please verify again.';
              },
              'error-callback': () => {
                activeTurnstileToken = '';
                if (turnstileError) turnstileError.textContent = 'Human verification encountered an issue. Please refresh.';
              }
            });
          } catch (err) {
            console.error('[Turnstile Render Error]:', err);
          }
        } else {
          setTimeout(renderWidget, 100);
        }
      };

      renderWidget();
    };

    setupTurnstile();

    const resetTurnstileWidget = () => {
      activeTurnstileToken = '';
      if (window.turnstile && turnstileWidgetId !== null) {
        try {
          window.turnstile.reset(turnstileWidgetId);
        } catch (e) {
          console.warn('[Turnstile Reset Warning]:', e);
        }
      }
    };

    const clearErrors = () => {
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (input) input.classList.remove('invalid');
      });
      [nameError, emailError, subjectError, messageError, turnstileError].forEach(error => {
        if (error) error.textContent = '';
      });
      if (turnstileGroup) turnstileGroup.classList.remove('has-error');
    };

    // Real-time error removal on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('invalid');
          const errorElement = document.getElementById(`${input.id}-error`);
          if (errorElement) errorElement.textContent = '';
        });
      }
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Prevent concurrent duplicate submissions while request is in flight
      if (isSubmitting) {
        return;
      }

      clearErrors();

      const rawName = nameInput ? nameInput.value.trim() : '';
      const rawEmail = emailInput ? emailInput.value.trim() : '';
      const rawSubject = subjectInput ? subjectInput.value.trim() : '';
      const rawMessage = messageInput ? messageInput.value.trim() : '';
      const honeypot = honeypotInput ? honeypotInput.value.trim() : '';
      const elapsedMs = Date.now() - formStartTime;

      // Extract current Turnstile token
      const currentToken = activeTurnstileToken || (
        window.turnstile && turnstileWidgetId !== null && typeof window.turnstile.getResponse === 'function'
          ? window.turnstile.getResponse(turnstileWidgetId)
          : ''
      );

      let isValid = true;

      // Validate Name (2 - 100 characters)
      if (!rawName) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      } else if (rawName.length < 2) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'Name must be at least 2 characters.';
        isValid = false;
      } else if (rawName.length > 100) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'Name cannot exceed 100 characters.';
        isValid = false;
      }

      // Validate Email (<= 254 characters and RFC 5322 regex)
      if (!rawEmail) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (rawEmail.length > 254 || !emailRegex.test(rawEmail)) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Subject (3 - 200 characters)
      if (!rawSubject) {
        subjectInput.classList.add('invalid');
        subjectError.textContent = 'Please enter a subject.';
        isValid = false;
      } else if (rawSubject.length < 3) {
        subjectInput.classList.add('invalid');
        subjectError.textContent = 'Subject must be at least 3 characters.';
        isValid = false;
      } else if (rawSubject.length > 200) {
        subjectInput.classList.add('invalid');
        subjectError.textContent = 'Subject cannot exceed 200 characters.';
        isValid = false;
      }

      // Validate Message (10 - 5000 characters)
      if (!rawMessage) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'Please enter your message.';
        isValid = false;
      } else if (rawMessage.length < 10) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'Message must be at least 10 characters long.';
        isValid = false;
      } else if (rawMessage.length > 5000) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'Message cannot exceed 5000 characters.';
        isValid = false;
      }

      // Validate Cloudflare Turnstile Human Verification Token
      if (!currentToken) {
        if (turnstileError) {
          turnstileError.textContent = 'Please verify that you are human and try again.';
        }
        if (turnstileGroup) {
          turnstileGroup.classList.add('has-error');
        }
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Set submission lock & button sending state
      isSubmitting = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>SENDING...</span>`;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: rawName,
            email: rawEmail,
            subject: rawSubject,
            message: rawMessage,
            website: honeypot,
            _hp_website: honeypot,
            formStartTime: formStartTime,
            elapsedMs: elapsedMs,
            turnstileToken: currentToken,
            'cf-turnstile-response': currentToken
          })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          contactForm.reset();
          showToast('Message sent successfully. Thanks for reaching out!', 'success');
        } else {
          // Display actual error returned by /api/contact
          let errorMessage = data.error;
          if (!errorMessage) {
            if (response.status === 405) {
              errorMessage = 'Contact API method not allowed. Please check the API configuration.';
            } else {
              errorMessage = `Error ${response.status}: Failed to send message.`;
            }
          }

          if (errorMessage.toLowerCase().includes('human verification') || errorMessage.toLowerCase().includes('turnstile')) {
            if (turnstileError) turnstileError.textContent = 'Human verification failed. Please try again.';
            if (turnstileGroup) turnstileGroup.classList.add('has-error');
          }

          showToast(errorMessage, 'error', 7000);
        }
      } catch (err) {
        console.error('Contact Form Fetch Error:', err);
        showToast('Network error: Unable to connect to /api/contact. Please try again or email muralicodex@gmail.com directly.', 'error', 7000);
      } finally {
        // Reset single-use Turnstile token and widget on every attempt
        resetTurnstileWidget();
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

});
