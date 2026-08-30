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

    // CAPTCHA Elements (Modern 3x3 Image Selection Widget)
    const captchaCard = document.getElementById('captcha-card');
    const captchaGrid = document.getElementById('captcha-image-grid');
    const captchaCounterBadge = document.getElementById('captcha-counter-badge');
    const captchaRefreshBtn = document.getElementById('captcha-refresh-btn');
    const captchaVerifyBtn = document.getElementById('captcha-verify-btn');
    const captchaError = document.getElementById('captcha-error');
    const captchaInfoBtn = document.getElementById('captcha-info-btn');
    const captchaInfoBox = document.getElementById('captcha-info-box');

    let isCaptchaVerified = false;
    let currentGridTiles = [];

    // Sound Synthesizer for Interactive Feedback
    const playCaptchaTone = (freq, type, duration, vol = 0.12) => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // Audio optional / silent fallback
      }
    };

    // Item Pool: MP40 Variants (Targets)
    const mp40Pool = [
      {
        id: 'mp40-cobra',
        name: 'MP40 - Predatory Cobra',
        isTarget: true,
        label: 'MP40 Cobra',
        image: 'assets/captcha/mp40-cobra.png'
      },
      {
        id: 'mp40-classic',
        name: 'MP40 - Classic Tactical Steel',
        isTarget: true,
        label: 'MP40 Classic',
        image: 'assets/captcha/mp40-classic.png'
      },
      {
        id: 'mp40-poker',
        name: 'MP40 - Royal Flush Spade',
        isTarget: true,
        label: 'MP40 Poker',
        image: 'assets/captcha/mp40-poker.png'
      }
    ];

    // Item Pool: Distractors (Battle Royale Non-MP40 Items)
    const distractorPool = [
      {
        id: 'survivor-avatar',
        name: 'Battle Royale Survivor',
        isTarget: false,
        label: 'Survivor Avatar',
        image: 'assets/captcha/survivor-avatar.png'
      },
      {
        id: 'cast-iron-pan',
        name: 'Cast Iron Frying Pan',
        isTarget: false,
        label: 'Cast Iron Pan',
        image: 'assets/captcha/cast-iron-pan.png'
      },
      {
        id: 'awm-sniper',
        name: 'AWM - Arctic Sniper',
        isTarget: false,
        label: 'AWM Sniper',
        image: 'assets/captcha/awm-sniper.png'
      },
      {
        id: 'field-medkit',
        name: 'Military Field Medkit',
        isTarget: false,
        label: 'Field Medkit',
        image: 'assets/captcha/field-medkit.png'
      },
      {
        id: 'm416-glacier',
        name: 'M416 - Glacier Ice Skin',
        isTarget: false,
        label: 'M416 Glacier',
        image: 'assets/captcha/m416-glacier.png'
      },
      {
        id: 'level-3-helmet',
        name: 'Level 3 Spetsnaz Helmet',
        isTarget: false,
        label: 'Level 3 Helmet',
        image: 'assets/captcha/level-3-helmet.png'
      }
    ];

    // Fisher-Yates Array Shuffle Algorithm
    const shuffleArray = (array) => {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    // Update Counter text and styling & Enable/Disable Verify Button
    const updateCaptchaCounter = () => {
      if (!captchaCounterBadge) return;
      const selectedCount = currentGridTiles.filter(t => t.selected).length;
      captchaCounterBadge.textContent = `${selectedCount} selected`;

      if (selectedCount === 3) {
        captchaCounterBadge.classList.add('is-three');
        if (captchaVerifyBtn && !isCaptchaVerified) {
          captchaVerifyBtn.disabled = false;
        }
      } else {
        captchaCounterBadge.classList.remove('is-three');
        if (captchaVerifyBtn && !isCaptchaVerified) {
          captchaVerifyBtn.disabled = true;
        }
      }
    };

    // Reset Verification State
    const resetVerificationState = () => {
      isCaptchaVerified = false;
      if (captchaVerifyBtn) {
        captchaVerifyBtn.textContent = 'VERIFY';
        captchaVerifyBtn.classList.remove('verified');
        const selectedCount = currentGridTiles.filter(t => t.selected).length;
        captchaVerifyBtn.disabled = selectedCount !== 3;
      }
      if (captchaCard) {
        captchaCard.classList.remove('verified');
      }
    };

    // Initialize/Randomize the 3x3 CAPTCHA Grid
    const generateCaptchaGrid = () => {
      if (!captchaGrid) return;
      captchaGrid.innerHTML = '';
      resetVerificationState();

      // 1. Pick 3 distinct random MP40 variants
      const shuffledMP40 = shuffleArray(mp40Pool).slice(0, 3);

      // 2. Pick 6 distinct random distractors
      const shuffledDistractors = shuffleArray(distractorPool).slice(0, 6);

      // 3. Combine and shuffle across all 9 slots randomly (Do NOT hardcode positions!)
      const combinedItems = shuffleArray([...shuffledMP40, ...shuffledDistractors]);

      currentGridTiles = combinedItems.map((item, index) => ({
        ...item,
        gridIndex: index,
        selected: false
      }));

      // Render 9 Tiles
      currentGridTiles.forEach((tile, index) => {
        const tileBtn = document.createElement('button');
        tileBtn.type = 'button';
        tileBtn.className = 'captcha-tile';
        tileBtn.id = `captcha-tile-${index}`;
        tileBtn.setAttribute('role', 'checkbox');
        tileBtn.setAttribute('aria-checked', 'false');
        tileBtn.setAttribute('aria-label', `${tile.name}`);

        tileBtn.innerHTML = `
          <div class="tile-visual-wrapper">
            <img class="captcha-tile-img" src="${tile.image}" alt="${tile.name}" loading="eager" decoding="async" onerror="this.parentElement.parentElement.classList.add('has-error')" />
            <div class="tile-fallback-view" aria-hidden="true">
              <span>⚠️ Image Missing</span>
              <small>${tile.label}</small>
            </div>
            <span class="tile-badge-label">${tile.label}</span>
          </div>
          <div class="tile-checkmark-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        `;

        tileBtn.addEventListener('click', () => {
          toggleTile(index);
        });

        captchaGrid.appendChild(tileBtn);
      });

      updateCaptchaCounter();
      if (captchaError) captchaError.textContent = '';
    };

    // Toggle Individual Tile Selection
    const toggleTile = (index) => {
      const tile = currentGridTiles[index];
      if (!tile) return;

      tile.selected = !tile.selected;
      const tileBtn = document.getElementById(`captcha-tile-${index}`);
      if (tileBtn) {
        tileBtn.classList.toggle('selected', tile.selected);
        tileBtn.setAttribute('aria-checked', tile.selected ? 'true' : 'false');
        tileBtn.setAttribute('aria-label', `${tile.name}${tile.selected ? ', selected' : ''}`);
      }

      playCaptchaTone(tile.selected ? 580 : 420, 'sine', 0.06, 0.1);
      updateCaptchaCounter();

      // If user toggles tiles after verifying, require re-verification
      if (isCaptchaVerified) {
        resetVerificationState();
      }

      if (captchaError) captchaError.textContent = '';
    };

    // Verify Selection Handler
    const verifyCaptchaSelection = () => {
      const selectedTargets = currentGridTiles.filter(t => t.isTarget && t.selected).length;
      const selectedNonTargets = currentGridTiles.filter(t => !t.isTarget && t.selected).length;
      const totalSelected = currentGridTiles.filter(t => t.selected).length;

      // Exactly all 3 MP40 tiles and 0 distractors
      if (selectedTargets === 3 && selectedNonTargets === 0 && totalSelected === 3) {
        isCaptchaVerified = true;
        playCaptchaTone(523.25, 'triangle', 0.12, 0.15);
        setTimeout(() => playCaptchaTone(659.25, 'triangle', 0.15, 0.15), 90);
        setTimeout(() => playCaptchaTone(783.99, 'triangle', 0.22, 0.2), 180);

        if (captchaVerifyBtn) {
          captchaVerifyBtn.textContent = 'VERIFIED ✓';
          captchaVerifyBtn.classList.add('verified');
          captchaVerifyBtn.disabled = false;
        }
        if (captchaCard) {
          captchaCard.classList.add('verified');
        }
        if (captchaError) {
          captchaError.textContent = '';
        }
        return true;
      } else {
        isCaptchaVerified = false;
        playCaptchaTone(240, 'sawtooth', 0.16, 0.2);
        if (captchaCard) {
          captchaCard.classList.remove('shake');
          void captchaCard.offsetWidth; // Restart CSS animation
          captchaCard.classList.add('shake');
        }
        if (captchaError) {
          if (totalSelected !== 3) {
            captchaError.textContent = `Please select exactly 3 MP40 gun images (${totalSelected} selected).`;
          } else {
            captchaError.textContent = 'Incorrect selection. Please ensure only the 3 MP40 weapon skins are selected.';
          }
        }
        return false;
      }
    };

    // Initial Grid Generation
    generateCaptchaGrid();

    // Event Listeners for Controls
    if (captchaRefreshBtn) {
      captchaRefreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playCaptchaTone(460, 'sine', 0.08, 0.1);
        captchaRefreshBtn.classList.add('rotating');
        setTimeout(() => captchaRefreshBtn.classList.remove('rotating'), 350);
        generateCaptchaGrid();
      });
    }

    if (captchaVerifyBtn) {
      captchaVerifyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        verifyCaptchaSelection();
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
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (input) input.classList.remove('invalid');
      });
      [nameError, emailError, subjectError, messageError, captchaError].forEach(error => {
        if (error) error.textContent = '';
      });
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

      // Validate Image CAPTCHA Verification
      if (!isCaptchaVerified) {
        const verifiedNow = verifyCaptchaSelection();
        if (!verifiedNow) {
          isValid = false;
          if (captchaCard) {
            captchaCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
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
          generateCaptchaGrid();
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
