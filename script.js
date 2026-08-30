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
  // 9. Contact Form Submission & Client-Side Validation (with Anti-Spam & Submission Lock)
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

    // CAPTCHA Elements
    const captchaCanvas = document.getElementById('captcha-canvas');
    const captchaInput = document.getElementById('captcha-input');
    const captchaError = document.getElementById('captcha-error');
    const captchaRefreshBtn = document.getElementById('captcha-refresh-btn');
    const captchaRequestLink = document.getElementById('captcha-request-link');
    const captchaInfoBtn = document.getElementById('captcha-info-btn');
    const captchaInfoBox = document.getElementById('captcha-info-box');

    let currentCaptchaCode = '';
    const CHAR_SET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

    const generateCaptchaCode = (length = 6) => {
      let code = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * CHAR_SET.length);
        code += CHAR_SET[randomIndex];
      }
      return code;
    };

    const drawCaptcha = () => {
      if (!captchaCanvas) return;
      const ctx = captchaCanvas.getContext('2d');
      if (!ctx) return;

      const width = 400;
      const height = 70;
      const dpr = window.devicePixelRatio || 1;

      captchaCanvas.width = width * dpr;
      captchaCanvas.height = height * dpr;
      if (ctx.resetTransform) {
        ctx.resetTransform();
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.scale(dpr, dpr);

      // 1. Clean White Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle light background grid lines
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = `rgba(226, 232, 240, ${Math.random() * 0.7 + 0.3})`;
        ctx.lineWidth = Math.random() * 1.5 + 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.bezierCurveTo(
          Math.random() * width, Math.random() * height,
          Math.random() * width, Math.random() * height,
          Math.random() * width, Math.random() * height
        );
        ctx.stroke();
      }

      // 3. Random noise speckles / dots
      const dotCount = 70;
      for (let i = 0; i < dotCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.4 + 0.6;
        const isDark = Math.random() > 0.45;
        ctx.fillStyle = isDark ? `rgba(15, 23, 42, ${Math.random() * 0.45 + 0.25})` : `rgba(148, 163, 184, ${Math.random() * 0.5 + 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Random 2-4 distortion interference lines across the text
      const lineCount = Math.floor(Math.random() * 3) + 2;
      const lineColors = [
        'rgba(30, 41, 59, 0.55)',
        'rgba(15, 23, 42, 0.6)',
        'rgba(51, 65, 85, 0.5)',
        'rgba(71, 85, 105, 0.45)'
      ];
      for (let i = 0; i < lineCount; i++) {
        ctx.strokeStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
        ctx.lineWidth = Math.random() * 1.5 + 1.2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 30, Math.random() * height);
        ctx.bezierCurveTo(
          Math.random() * (width * 0.35), Math.random() * height,
          Math.random() * (width * 0.75), Math.random() * height,
          width - Math.random() * 30, Math.random() * height
        );
        ctx.stroke();
      }

      // 5. Draw 6 Dark Characters with rotations, font variations, and distortion
      const code = currentCaptchaCode;
      const charFonts = ['Arial', 'Verdana', 'Georgia', 'Trebuchet MS', 'Impact', 'Courier New'];
      const charColors = ['#0a0a0c', '#18181b', '#0f172a', '#1e293b', '#1e1b4b', '#27272a'];

      // Usable width leaves room on right for the refresh button overlay
      const usableWidth = 295;
      const startX = 25;
      const charSpacing = usableWidth / code.length;

      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const font = charFonts[Math.floor(Math.random() * charFonts.length)];
        const fontSize = Math.floor(Math.random() * 6) + 30; // 30px - 35px
        const color = charColors[Math.floor(Math.random() * charColors.length)];
        const rotationAngle = (Math.random() * 0.5 - 0.25); // ~ -14deg to +14deg
        const x = startX + (i * charSpacing) + (Math.random() * 6 - 3);
        const y = 46 + (Math.random() * 8 - 4);

        ctx.save();
        ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'alphabetic';
        ctx.translate(x, y);
        ctx.rotate(rotationAngle);

        const skewX = (Math.random() * 0.2 - 0.1);
        ctx.transform(1, 0, skewX, 1, 0, 0);

        ctx.fillText(char, 0, 0);
        ctx.restore();
      }

      // 6. Final subtle foreground scratches
      for (let i = 0; i < 2; i++) {
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
      }
    };

    const resetCaptcha = () => {
      currentCaptchaCode = generateCaptchaCode(6);
      drawCaptcha();
      if (captchaInput) {
        captchaInput.value = '';
        captchaInput.classList.remove('invalid');
      }
      if (captchaError) {
        captchaError.textContent = '';
      }
    };

    // Initialize CAPTCHA immediately
    resetCaptcha();

    // Event listeners for Refresh & Request New CAPTCHA
    if (captchaRefreshBtn) {
      captchaRefreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        captchaRefreshBtn.classList.add('rotating');
        setTimeout(() => captchaRefreshBtn.classList.remove('rotating'), 350);
        resetCaptcha();
      });
    }

    if (captchaRequestLink) {
      captchaRequestLink.addEventListener('click', (e) => {
        e.preventDefault();
        resetCaptcha();
      });
    }

    // Toggle "(what is this?)" info box
    if (captchaInfoBtn && captchaInfoBox) {
      captchaInfoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = captchaInfoBox.hasAttribute('hidden');
        if (isHidden) {
          captchaInfoBox.removeAttribute('hidden');
          captchaInfoBtn.setAttribute('aria-expanded', 'true');
        } else {
          captchaInfoBox.setAttribute('hidden', '');
          captchaInfoBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    let isSubmitting = false;

    const clearErrors = () => {
      [nameInput, emailInput, subjectInput, messageInput, captchaInput].forEach(input => {
        if (input) input.classList.remove('invalid');
      });
      [nameError, emailError, subjectError, messageError, captchaError].forEach(error => {
        if (error) error.textContent = '';
      });
    };

    // Real-time error removal on input
    [nameInput, emailInput, subjectInput, messageInput, captchaInput].forEach(input => {
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
      const rawCaptcha = captchaInput ? captchaInput.value.trim() : '';
      const honeypot = honeypotInput ? honeypotInput.value.trim() : '';
      const elapsedMs = Date.now() - formStartTime;

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

      // Validate CAPTCHA (case-insensitive)
      if (!rawCaptcha || rawCaptcha.toUpperCase() !== currentCaptchaCode.toUpperCase()) {
        if (captchaInput) {
          captchaInput.classList.add('invalid');
          captchaInput.value = '';
          captchaInput.focus();
        }
        if (captchaError) {
          captchaError.textContent = "The CAPTCHA text doesn't match. Please try again.";
        }
        // Regenerate CAPTCHA for retry
        currentCaptchaCode = generateCaptchaCode(6);
        drawCaptcha();
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
            elapsedMs: elapsedMs
          })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          contactForm.reset();
          resetCaptcha();
          showToast('Message sent successfully. Thanks for reaching out!', 'success');
        } else {
          // Display actual error returned by /api/contact
          let errorMessage = data.error;
          if (!errorMessage) {
            if (response.status === 405) {
              errorMessage = 'Contact API method not allowed. Please check the API configuration (run via `vercel dev` for local serverless functions).';
            } else {
              errorMessage = `Error ${response.status}: Failed to send message.`;
            }
          }
          showToast(errorMessage, 'error', 7000);
        }
      } catch (err) {
        console.error('Contact Form Fetch Error:', err);
        showToast('Network error: Unable to connect to /api/contact. Please try again or email muralicodex@gmail.com directly.', 'error', 7000);
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

});
