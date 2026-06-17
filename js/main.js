/**
 * FRAME BUILDERS - DYNAMIC SITE LOGIC
 * Interactivity: 3D Tilting, Hover Spotlight, Slider, Stats Count, Portfolio Filter, Calendly Integration
 */

// Configuration
const CALENDLY_URL = 'https://calendly.com/vaibhavjain7890/30min';
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyk7Fv8074ZQVY_-9JGgoNjnBkIhDpgOdDw8L_KjPdLhiXb2Jdb3A3DObntmNvC2iO7/exec";
const PAYEE_UPI_ID = "vaibhavjain7890@okaxis";
const PAYEE_NAME = "Frame Builders";
const ADMIN_PHONE = "918146065407";
const PAYPAL_CLIENT_ID = "sb";

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  init3DParallax();
  initSpotlightEffect();
  initPortfolioFilter();
  initStatsCounter();
  initDynamicReviewsAndTestimonialsSlider();
  initScrollReveal();
  initCalendly();
  initPortfolioVideos();
  initInstagramGrowthServices();
  initServiceCardsClick();
  initWhyChooseStack();
  initPortfolioVFXStack();
});

/* ==========================================================================
   1. Header Scroll States & Active Nav Link Tracking
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Track active section to update nav link highlighting
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the active middle portion of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

/* ==========================================================================
   2. Mobile Hamburger Menu
   ========================================================================== */
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.contains('open');
    navMenu.classList.toggle('open');
    navToggle.innerHTML = isOpen ? '&#9776;' : '&times;';
    document.body.style.overflow = isOpen ? '' : 'hidden'; // Stop scrolling when menu is open
  };

  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Close menu on resize to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.innerHTML = '&#9776;';
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   3. Interactive 3D Parallax Tilt (Hero Container)
   ========================================================================== */
function init3DParallax() {
  const container = document.querySelector('.hero-3d-container');
  const core = document.querySelector('.interactive-3d-core');

  if (!container || !core) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside container
    const y = e.clientY - rect.top;  // y position inside container

    // Normalize coordinates (-0.5 to 0.5)
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    // Calculate maximum degrees of tilt rotation
    const maxRotateX = 15; // rotate around X-axis (vertical lean)
    const maxRotateY = 15; // rotate around Y-axis (horizontal lean)

    const rotateX = -normalizedY * maxRotateX; // Negative so mouse-up tilts up
    const rotateY = normalizedX * maxRotateY;

    // Apply tilt transform on container
    container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Parallax displacement on the internal core element
    const coreX = normalizedX * 24;
    const coreY = normalizedY * 24;
    core.style.transform = `translate3d(${coreX}px, ${coreY}px, 50px) rotateX(${-rotateX * 0.5}deg) rotateY(${-rotateY * 0.5}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    // Smoothly reset transformations on leave
    container.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    core.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    core.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';

    // Remove transitions after they finish so mousemove remains snappy
    setTimeout(() => {
      container.style.transition = '';
      core.style.transition = '';
    }, 800);
  });
}

/* ==========================================================================
   4. Mouse Spotlight Overlay Effect (Service Cards)
   ========================================================================== */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.service-card, .pricing-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. Portfolio Filtering Logic
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (filterBtns.length === 0 || portfolioCards.length === 0) return;

  const applyFilter = (filterValue, immediate = false) => {
    const vfxSlider = document.getElementById('vfx-portfolio-slider');
    const portGrid = document.querySelector('.portfolio-grid');

    if (vfxSlider && portGrid) {
      if (filterValue === 'vfx') {
        portGrid.style.display = 'none';
        vfxSlider.style.display = 'flex';
        if (immediate) {
          vfxSlider.style.opacity = '1';
          vfxSlider.style.transform = 'translateY(0)';
          vfxSlider.classList.add('active');
        } else {
          setTimeout(() => {
            vfxSlider.style.opacity = '1';
            vfxSlider.style.transform = 'translateY(0)';
            vfxSlider.classList.add('active');
          }, 50);
        }
      } else {
        portGrid.style.display = 'grid';
        vfxSlider.style.display = 'none';
      }
    }

    portfolioCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const isVertical = card.querySelector('.vertical-ratio') !== null;

      if (immediate) {
        card.style.transition = 'none';
      } else {
        card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      }

      if ((filterValue === 'all' && !isVertical) || cardCategory === filterValue) {
        card.classList.remove('hide');
        if (immediate) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          // Brief timeout to trigger reflow and scale animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        }
      } else {
        if (immediate) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          card.classList.add('hide');
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          // Wait for fadeout animation to complete, then add class to remove from layout flow
          setTimeout(() => {
            card.classList.add('hide');
          }, 400);
        }
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      applyFilter(filterValue);
    });
  });

  // Apply initial filter state immediately to avoid initial flash of vertical cards in 'all' view
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    const initialFilter = activeBtn.getAttribute('data-filter');
    applyFilter(initialFilter, true);
  }
}

/* ==========================================================================
   6. Intersection Observer Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');

  if (stats.length === 0) return;

  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-count'));
    const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
    const duration = 2000; // 2 seconds
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentVal = (easeProgress * target).toFixed(decimals);

      element.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    };

    window.requestAnimationFrame(step);
  };

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target); // Trigger count animation once only
      }
    });
  }, observerOptions);

  stats.forEach(stat => {
    observer.observe(stat);
  });
}

/* ==========================================================================
   7. Testimonials Slider (Touch and Auto-play supported)
   ========================================================================== */
function initTestimonialsSlider() {
  const stack = document.getElementById('testimonials-card-stack');
  const cards = document.querySelectorAll('.testimonial-card.stack-card');
  const btnPrev = document.getElementById('slider-prev-btn');
  const btnNext = document.getElementById('slider-next-btn');
  const dotsContainer = document.getElementById('slider-dots-container');

  if (!stack || cards.length === 0) return;

  let currentIndex = 0;
  const cardCount = cards.length;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let dragCard = null;
  let autoplayInterval;

  // Generate navigation indicator dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < cardCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateStack();
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll('.slider-dot');

  // Update layout and 3D transforms for cards
  const updateStack = () => {
    cards.forEach((card, idx) => {
      // Calculate relative index relative to active card
      let relIdx = (idx - currentIndex + cardCount) % cardCount;

      // Clear inline transform & opacity styles so CSS styles can take over
      card.style.transform = '';
      card.style.opacity = '';

      // Clear existing position classes
      card.classList.remove('stack-pos-0', 'stack-pos-1', 'stack-pos-2', 'stack-hidden');

      // Assign position classes
      if (relIdx === 0) {
        card.classList.add('stack-pos-0');
      } else if (relIdx === 1) {
        card.classList.add('stack-pos-1');
      } else if (relIdx === 2) {
        card.classList.add('stack-pos-2');
      } else {
        card.classList.add('stack-hidden');
      }
    });

    // Update dots indicator active class
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  // Click controls
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cardCount;
      updateStack();
      resetAutoplay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cardCount) % cardCount;
      updateStack();
      resetAutoplay();
    });
  }

  // Swipe/Drag Event Handlers
  const handleDragStart = (e) => {
    // Only allow dragging on top card
    dragCard = cards[currentIndex];
    if (!dragCard) return;

    // Pause autoplay during drag
    clearInterval(autoplayInterval);

    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    dragCard.classList.add('dragging');
  };

  const handleDragMove = (e) => {
    if (!isDragging || !dragCard) return;

    currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let deltaX = currentX - startX;

    // Stop scrolling page on mobile when swiping
    if (e.cancelable) e.preventDefault();

    // Rotate slightly during drag
    let rotate = deltaX * 0.08;
    dragCard.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg)`;
  };

  const handleDragEnd = () => {
    if (!isDragging || !dragCard) return;

    isDragging = false;
    dragCard.classList.remove('dragging');

    let deltaX = currentX - startX;
    let threshold = 120; // swipe threshold in px

    if (Math.abs(deltaX) > threshold) {
      // Swipe out left or right
      let direction = deltaX > 0 ? 1 : -1;

      dragCard.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      dragCard.style.transform = `translate3d(${direction * 600}px, 0, 0) rotate(${direction * 30}deg)`;
      dragCard.style.opacity = '0';

      const swipedCard = dragCard;
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % cardCount;
        swipedCard.style.transition = '';
        updateStack();
        resetAutoplay();
      }, 300);
    } else {
      // Snap back
      updateStack();
      startAutoplay();
    }

    dragCard = null;
  };

  // Mouse drag events
  stack.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);

  // Touch drag events
  stack.addEventListener('touchstart', handleDragStart, { passive: true });
  document.addEventListener('touchmove', handleDragMove, { passive: false });
  document.addEventListener('touchend', handleDragEnd);

  // Autoplay functionality
  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cardCount;
      updateStack();
    }, 6000); // Shift every 6s
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  // Pause on hover
  stack.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  stack.addEventListener('mouseleave', startAutoplay);

  // Initial layout render
  updateStack();
  startAutoplay();
}

/* ==========================================================================
   8. Scroll Reveal Animations (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is centered
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  reveals.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   9. Calendly Booking Widget Setup
   ========================================================================== */
function initCalendly() {
  const bookingButtons = [
    document.getElementById('btn-cta-submit'),
    document.getElementById('btn-hero-primary'),
    document.getElementById('btn-header-cta'),
    document.getElementById('link-nav-cta')
  ];

  bookingButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else {
        // Fallback to mailto link if Calendly script isn't loaded/blocked
        window.location.href = 'mailto:framebuildersss@gmail.com?subject=Project Inquiry';
      }
    });
  });
}

/* ==========================================================================
   10. Hover Play/Pause Logic for Video Cards
   ========================================================================== */
function initPortfolioVideos() {
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    // Play on hover
    card.addEventListener('mouseenter', () => {
      video.play().catch(err => {
        console.log('Video play blocked or interrupted:', err);
      });
    });

    // Pause on mouse leave
    card.addEventListener('mouseleave', () => {
      video.pause();
    });
  });
}

/* ==========================================================================
   11. Instagram Growth Services (Tabs, Modals, WhatsApp Ordering)
   ========================================================================== */
function initInstagramGrowthServices() {
  // (CONFIGURATIONS have been moved to the top of the file as global constants)

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.services-tab-content');
  const buyBtns = document.querySelectorAll('.buy-btn');
  const modal = document.getElementById('order-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');

  // Forms and Steps
  const detailsForm = document.getElementById('order-details-form');
  const paymentForm = document.getElementById('order-payment-form');
  const modalSteps = document.querySelectorAll('.modal-step');

  // Step 1 Details elements
  const modalTitle = document.getElementById('modal-service-title');
  const modalSubtitle = document.getElementById('modal-service-subtitle');
  const summaryPackage = document.getElementById('summary-package');
  const summaryPrice = document.getElementById('summary-price');
  const labelTargetInput = document.getElementById('lbl-target-input');
  const orderTargetInput = document.getElementById('order-target-input');
  const targetInputHint = document.getElementById('target-input-hint');
  const orderContactInput = document.getElementById('order-contact-input');

  // Payment Selection inputs & containers
  const payMethodUpi = document.getElementById('pay-method-upi');
  const payMethodPaypal = document.getElementById('pay-method-paypal');
  const lblPayMethodUpi = document.getElementById('lbl-pay-method-upi');
  const lblPayMethodPaypal = document.getElementById('lbl-pay-method-paypal');
  const paymentUpiContainer = document.getElementById('payment-method-upi-container');
  const paymentPaypalContainer = document.getElementById('payment-method-paypal-container');
  const paypalAmountText = document.getElementById('paypal-amount-text');
  const paypalButtonContainer = document.getElementById('paypal-button-container');

  // Step 2 Payment elements
  const qrImage = document.getElementById('payment-qr-image');
  const qrSpinner = document.getElementById('payment-qr-spinner');
  const qrAmountText = document.getElementById('payment-qr-amount');
  const merchantUpiDisplay = document.getElementById('merchant-upi-display');
  const utrInput = document.getElementById('order-utr-input');
  const btnConfirmPayment = document.getElementById('btn-confirm-payment');

  // Step 3 Success elements
  const successOrderIdText = document.getElementById('success-order-id');
  const btnCopyOrder = document.getElementById('btn-copy-order-id');
  const btnSuccessClose = document.getElementById('btn-success-close');

  let activePackage = {
    service: 'followers',
    quantity: '1000',
    price: '179',
    priceUsd: '2.15'
  };

  let generatedOrderId = '';
  let collectedTarget = '';
  let collectedContact = '';

  const updatePaymentMethodSelectionUI = () => {
    if (payMethodUpi && payMethodUpi.checked) {
      if (lblPayMethodUpi) lblPayMethodUpi.classList.add('active');
      if (lblPayMethodPaypal) lblPayMethodPaypal.classList.remove('active');
    } else if (payMethodPaypal && payMethodPaypal.checked) {
      if (lblPayMethodPaypal) lblPayMethodPaypal.classList.add('active');
      if (lblPayMethodUpi) lblPayMethodUpi.classList.remove('active');
    }
  };

  if (payMethodUpi) payMethodUpi.addEventListener('change', updatePaymentMethodSelectionUI);
  if (payMethodPaypal) payMethodPaypal.addEventListener('change', updatePaymentMethodSelectionUI);

  // Platform Selector Toggling
  const platformBtns = document.querySelectorAll('.platform-btn');
  const instagramTabs = document.getElementById('instagram-tabs-container');
  const youtubeTabs = document.getElementById('youtube-tabs-container');

  platformBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-platform');

      platformBtns.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');

      if (platform === 'instagram') {
        if (instagramTabs) instagramTabs.style.display = 'flex';
        if (youtubeTabs) youtubeTabs.style.display = 'none';

        const firstInstaTab = document.getElementById('tab-followers');
        if (firstInstaTab) firstInstaTab.click();
      } else {
        if (instagramTabs) instagramTabs.style.display = 'none';
        if (youtubeTabs) youtubeTabs.style.display = 'flex';

        const firstYtTab = document.getElementById('tab-yt-subscribers');
        if (firstYtTab) firstYtTab.click();
      }
    });
  });

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Toggle tab buttons active status inside both containers
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle tab contents active status
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === `content-${targetTab}`) {
          content.classList.add('active');
        }
      });
    });
  });

  // Switch between modal steps helper
  const goToStep = (stepNumber) => {
    modalSteps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.getAttribute('data-step')) === stepNumber) {
        step.classList.add('active');
      }
    });
  };

  // Open modal on buy click (re-bind to ensure all dynamic elements receive listeners)
  const bindBuyButtons = () => {
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const service = btn.getAttribute('data-service');
        const quantity = btn.getAttribute('data-quantity');
        const price = btn.getAttribute('data-price');
        const priceUsd = btn.getAttribute('data-price-usd');

        activePackage = { service, quantity, price, priceUsd };

        const formattedQty = parseInt(quantity).toLocaleString('en-IN');
        if (service === 'followers') {
          modalTitle.textContent = 'Amplify Your Audience';
          modalSubtitle.textContent = 'Strengthen your digital authority with high-quality profiles delivered organically.';
          summaryPackage.textContent = `${formattedQty} High-Quality Connections`;
          labelTargetInput.textContent = 'Instagram Username';
          orderTargetInput.setAttribute('placeholder', '@yourusername');
          targetInputHint.textContent = 'Your account must be public during delivery.';
        } else if (service === 'views') {
          modalTitle.textContent = 'Boost Content Reach';
          modalSubtitle.textContent = 'Supercharge your Reel visibility and kickstart algorithm distribution.';
          summaryPackage.textContent = `${formattedQty} Target Content Views`;
          labelTargetInput.textContent = 'Instagram Reel URL';
          orderTargetInput.setAttribute('placeholder', 'https://www.instagram.com/reel/...');
          targetInputHint.textContent = 'Paste the full link to your public Reel.';
        } else if (service === 'likes') {
          modalTitle.textContent = 'Optimize Post Engagement';
          modalSubtitle.textContent = 'Gain authentic social validation and increase feed placement potential.';
          summaryPackage.textContent = `${formattedQty} Target Post Likes`;
          labelTargetInput.textContent = 'Instagram Post URL';
          orderTargetInput.setAttribute('placeholder', 'https://www.instagram.com/p/...');
          targetInputHint.textContent = 'Paste the full link to your public Instagram post.';
        } else if (service === 'yt-subscribers') {
          modalTitle.textContent = 'Amplify YouTube Channel';
          modalSubtitle.textContent = 'Grow your channel subscribers organically with safe and secure delivery.';
          summaryPackage.textContent = `${formattedQty} Real Channel Subscribers`;
          labelTargetInput.textContent = 'YouTube Channel Link / Username';
          orderTargetInput.setAttribute('placeholder', 'https://www.youtube.com/@yourchannel');
          targetInputHint.textContent = 'Your subscriber count must not be hidden.';
        } else if (service === 'yt-views') {
          modalTitle.textContent = 'Boost Video Reach';
          modalSubtitle.textContent = 'Supercharge your YouTube video views and reach more audiences.';
          summaryPackage.textContent = `${formattedQty} High-Quality Video Views`;
          labelTargetInput.textContent = 'YouTube Video URL';
          orderTargetInput.setAttribute('placeholder', 'https://www.youtube.com/watch?v=...');
          targetInputHint.textContent = 'Provide a valid link to a public video.';
        } else if (service === 'yt-likes') {
          modalTitle.textContent = 'Optimize Video Engagement';
          modalSubtitle.textContent = 'Increase likes on your YouTube video to boost algorithmic authority.';
          summaryPackage.textContent = `${formattedQty} Real Video Likes`;
          labelTargetInput.textContent = 'YouTube Video URL';
          orderTargetInput.setAttribute('placeholder', 'https://www.youtube.com/watch?v=...');
          targetInputHint.textContent = 'Provide a valid link to a public video.';
        }

        summaryPrice.innerHTML = `₹${price} <span class="price-usd-modal">/ $${priceUsd}</span>`;

        // Clear inputs & Reset step
        orderTargetInput.value = '';
        orderContactInput.value = '';
        if (utrInput) utrInput.value = '';
        if (payMethodUpi) {
          payMethodUpi.checked = true;
          updatePaymentMethodSelectionUI();
        }
        goToStep(1);

        // Display Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      });
    });
  };

  bindBuyButtons();

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll lock
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close on clicking outside content
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Helper to load PayPal SDK dynamically
  const loadPayPalSDK = (clientId, callback) => {
    if (window.paypal) {
      callback();
      return;
    }

    let script = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
    if (script) {
      script.addEventListener('load', callback);
      return;
    }

    script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = callback;
    script.onerror = () => {
      alert('Failed to load PayPal SDK. Please check your internet connection.');
    };
    document.head.appendChild(script);
  };

  // Render PayPal buttons dynamically
  const renderPayPalButtons = () => {
    if (!window.paypal || !paypalButtonContainer) return;

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: activePackage.priceUsd,
              currency_code: 'USD'
            },
            description: `Frame Builders - ${activePackage.quantity} ${activePackage.service} (${generatedOrderId})`
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          submitPayPalOrder(details.id);
        });
      },
      onError: (err) => {
        console.error('PayPal checkout error:', err);
        alert('An error occurred during PayPal checkout. Please try again.');
      }
    }).render('#paypal-button-container');
  };

  // Submit PayPal Order to Google Sheets & WhatsApp Redirect
  const submitPayPalOrder = (transactionId) => {
    if (paypalButtonContainer) {
      paypalButtonContainer.innerHTML = `
        <div style="text-align:center; padding: 20px;">
          <div class="spinner" style="margin: 0 auto 10px auto;"></div>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Logging order, please wait...</p>
        </div>
      `;
    }

    const orderData = {
      orderId: generatedOrderId,
      service: activePackage.service,
      quantity: activePackage.quantity,
      price: `$${activePackage.priceUsd}`,
      target: collectedTarget,
      contact: collectedContact,
      utr: `${transactionId} (PayPal)`
    };

    const handlePayPalSuccess = () => {
      successOrderIdText.textContent = generatedOrderId;
      goToStep(3);

      let serviceLabel = 'Instagram Followers';
      if (activePackage.service === 'views') {
        serviceLabel = 'Instagram Reel Views';
      } else if (activePackage.service === 'likes') {
        serviceLabel = 'Instagram Likes';
      } else if (activePackage.service === 'yt-subscribers') {
        serviceLabel = 'YouTube Subscribers';
      } else if (activePackage.service === 'yt-views') {
        serviceLabel = 'YouTube Views';
      } else if (activePackage.service === 'yt-likes') {
        serviceLabel = 'YouTube Likes';
      }
      const formattedQty = parseInt(activePackage.quantity).toLocaleString('en-IN');

      const waMessage = `I am sending you the payment details and the screenshot please proceed with my order soon (PayPal Payment):

📦 Service: ${serviceLabel}
📈 Quantity: ${formattedQty}
💰 Amount Paid: $${activePackage.priceUsd}
🔗 Username/Link: ${collectedTarget}
📱 Contact WhatsApp: ${collectedContact}
🔑 PayPal Transaction ID: ${transactionId}
🆔 Order ID: ${generatedOrderId}

Please verify my payment and start the order. Thank you!`;

      const waUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(waMessage)}`;
      const btnSendWa = document.getElementById('btn-send-whatsapp');
      if (btnSendWa) {
        btnSendWa.setAttribute('href', waUrl);
      }

      try {
        window.open(waUrl, '_blank');
      } catch (e) {
        console.log('WhatsApp auto-redirect blocked. User can click the manual button.');
      }
    };

    const handlePayPalFailure = (msg) => {
      console.error('PayPal logging failed:', msg);
      if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        setTimeout(handlePayPalSuccess, 1000);
      } else {
        alert("Unable to register PayPal order on server: " + msg + ". Proceeding with local verification.");
        setTimeout(handlePayPalSuccess, 1000);
      }
    };

    if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
      setTimeout(handlePayPalSuccess, 1200);
    } else {
      fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(orderData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            handlePayPalSuccess();
          } else {
            handlePayPalFailure(data.message || 'Server error');
          }
        })
        .catch(err => {
          handlePayPalFailure(err.message || 'Network error');
        });
    }
  };

  // Step 1: Submit Details & Proceed to Payment Screen (UPI or PayPal)
  if (detailsForm) {
    detailsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      collectedTarget = orderTargetInput.value.trim();
      collectedContact = orderContactInput.value.trim();

      if (!collectedTarget || !collectedContact) return;

      // 1. Generate Order ID
      generatedOrderId = 'FB-' + Math.floor(100000 + Math.random() * 900000);

      const isUpi = payMethodUpi && payMethodUpi.checked;

      if (isUpi) {
        // Show UPI container and hide PayPal container
        if (paymentUpiContainer) paymentUpiContainer.style.display = 'block';
        if (paymentPaypalContainer) paymentPaypalContainer.style.display = 'none';

        if (utrInput) {
          utrInput.setAttribute('required', 'required');
          utrInput.value = '';
        }

        // Generate UPI URL
        const upiUrl = `upi://pay?pa=${PAYEE_UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${activePackage.price}&cu=INR&tn=${generatedOrderId}`;

        // Set QR Server API Endpoint
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

        // Update Step 2 DOM Elements
        if (qrAmountText) qrAmountText.textContent = `₹${activePackage.price}`;
        if (merchantUpiDisplay) merchantUpiDisplay.textContent = PAYEE_UPI_ID;

        // Load QR Image dynamically with loading spinner
        if (qrImage && qrSpinner) {
          qrImage.style.display = 'none';
          qrSpinner.style.display = 'flex';

          qrImage.onload = () => {
            qrSpinner.style.display = 'none';
            qrImage.style.display = 'block';
          };

          qrImage.onerror = () => {
            qrSpinner.style.display = 'none';
            alert('Failed to load QR code. Please pay directly to the UPI ID.');
          };

          qrImage.src = qrUrl;
        }

        goToStep(2);
      } else {
        // Show PayPal container and hide UPI container
        if (paymentUpiContainer) paymentUpiContainer.style.display = 'none';
        if (paymentPaypalContainer) paymentPaypalContainer.style.display = 'block';

        if (utrInput) {
          utrInput.removeAttribute('required');
        }

        if (paypalAmountText) {
          paypalAmountText.textContent = `$${activePackage.priceUsd}`;
        }

        if (paypalButtonContainer) {
          paypalButtonContainer.innerHTML = '';
        }

        goToStep(2);

        // Load PayPal SDK dynamically & render buttons
        loadPayPalSDK(PAYPAL_CLIENT_ID, () => {
          renderPayPalButtons();
        });
      }
    });
  }

  // Step 2: Back Button to Details (handles multiple back buttons)
  const backBtns = document.querySelectorAll('.btn-back-details');
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToStep(1);
    });
  });

  // Step 2: Confirm Payment & Submit UTR
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const utrVal = utrInput.value.trim();

      // Basic 12-digit format check
      if (!/^\d{12}$/.test(utrVal)) {
        alert('Please enter a valid 12-digit UPI UTR / Transaction ID.');
        return;
      }

      // Block obviously fake/dummy UTR patterns
      const isSequential = (str) => {
        const asc = "01234567890123456789";
        const desc = "98765432109876543210";
        return asc.includes(str) || desc.includes(str);
      };

      const isAllSameDigits = /^(\d)\1{11}$/.test(utrVal);
      const isSimpleRepeated = /^(\d{2})\2{5}$/.test(utrVal) || /^(\d{3})\3{3}$/.test(utrVal);

      if (isAllSameDigits || isSequential(utrVal) || isSimpleRepeated) {
        alert('This UTR number looks incorrect. Please enter the valid 12-digit UPI Transaction ID (UTR) from your payment app receipt.');
        return;
      }

      // Show processing state on button
      const originalBtnText = btnConfirmPayment.innerHTML;
      btnConfirmPayment.disabled = true;
      btnConfirmPayment.innerHTML = '<span>Processing...</span>';

      // Submit Data to Google Sheets Web App
      const orderData = {
        orderId: generatedOrderId,
        service: activePackage.service,
        quantity: activePackage.quantity,
        price: activePackage.price,
        target: collectedTarget,
        contact: collectedContact,
        utr: utrVal
      };

      const handleSuccess = () => {
        btnConfirmPayment.disabled = false;
        btnConfirmPayment.innerHTML = originalBtnText;
        successOrderIdText.textContent = generatedOrderId;
        goToStep(3);

        // Generate WhatsApp Redirect Link
        let serviceLabel = 'Instagram Followers';
        if (activePackage.service === 'views') {
          serviceLabel = 'Instagram Reel Views';
        } else if (activePackage.service === 'likes') {
          serviceLabel = 'Instagram Likes';
        } else if (activePackage.service === 'yt-subscribers') {
          serviceLabel = 'YouTube Subscribers';
        } else if (activePackage.service === 'yt-views') {
          serviceLabel = 'YouTube Views';
        } else if (activePackage.service === 'yt-likes') {
          serviceLabel = 'YouTube Likes';
        }
        const formattedQty = parseInt(activePackage.quantity).toLocaleString('en-IN');

        const waMessage = `I am sending you the payment details and the screenshot please proceed with my order soon (UPI Payment):

📦 Service: ${serviceLabel}
📈 Quantity: ${formattedQty}
💰 Amount Paid: ₹${activePackage.price} / $${activePackage.priceUsd}
🔗 Username/Link: ${collectedTarget}
📱 Contact WhatsApp: ${collectedContact}
🔑 UTR/Transaction ID: ${utrVal}
🆔 Order ID: ${generatedOrderId}

Please verify my payment and start the order. Thank you!`;

        const waUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(waMessage)}`;

        // Dynamically bind to the Step 3 WhatsApp button
        const btnSendWa = document.getElementById('btn-send-whatsapp');
        if (btnSendWa) {
          btnSendWa.setAttribute('href', waUrl);
        }

        // Try to open automatically, catch if browser popup blocker blocks it
        try {
          window.open(waUrl, '_blank');
        } catch (e) {
          console.log('WhatsApp auto-redirect blocked by browser popup blocker. User can click the manual button.');
        }
      };

      const handleFailure = (msg) => {
        console.error('Submission failed:', msg);
        // Fallback for Demo/Testing
        if (APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
          console.warn("Using simulation fallback. Please deploy and configure your Apps Script URL in js/main.js.");
          setTimeout(handleSuccess, 1000);
        } else {
          alert("Unable to process request: " + msg + ". Proceeding with local verification.");
          setTimeout(handleSuccess, 1000);
        }
      };

      if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        // Direct simulation
        setTimeout(handleSuccess, 1200);
      } else {
        // Send actual POST request with text/plain to avoid OPTIONS preflight CORS errors
        fetch(APPS_SCRIPT_WEB_APP_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(orderData)
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
              handleSuccess();
            } else {
              handleFailure(data.message || 'Server error');
            }
          })
          .catch(err => {
            handleFailure(err.message || 'Network error');
          });
      }
    });
  }

  // Step 3: Copy Order ID Clipboard logic
  if (btnCopyOrder) {
    btnCopyOrder.addEventListener('click', () => {
      navigator.clipboard.writeText(generatedOrderId).then(() => {
        // UI Feedback
        const originalSvg = btnCopyOrder.innerHTML;
        btnCopyOrder.innerHTML = '✓';
        btnCopyOrder.style.borderColor = '#10B981';
        btnCopyOrder.style.color = '#10B981';

        setTimeout(() => {
          btnCopyOrder.innerHTML = originalSvg;
          btnCopyOrder.style.borderColor = '';
          btnCopyOrder.style.color = '';
        }, 1500);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  }

  // Step 3: Close Success Screen & Smooth Scroll to Tracking
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      closeModal();

      const trackingSection = document.getElementById('tracking');
      if (trackingSection) {
        trackingSection.scrollIntoView({ behavior: 'smooth' });

        // Auto-fill tracking ID for the user convenience
        const trackingInput = document.getElementById('tracking-id-input');
        if (trackingInput) {
          trackingInput.value = generatedOrderId;
        }
      }
    });
  }

  // ==========================================
  // ORDER TRACKING CLIENT ENGINE
  // ==========================================
  const trackingForm = document.getElementById('tracking-form');
  const trackingInput = document.getElementById('tracking-id-input');
  const trackingLoader = document.getElementById('tracking-loader');
  const trackingError = document.getElementById('tracking-error');
  const trackingErrorMsg = document.getElementById('tracking-error-msg');
  const trackingResult = document.getElementById('tracking-result');

  // Result Fields
  const resOrderId = document.getElementById('tracking-result-order-id');
  const resService = document.getElementById('tracking-result-service');
  const resQty = document.getElementById('tracking-result-qty');
  const resPrice = document.getElementById('tracking-result-price');
  const resTarget = document.getElementById('tracking-result-target');

  // Progress Stepper nodes & bar
  const progressBar = document.getElementById('status-progress-bar');
  const nodePending = document.getElementById('step-node-pending');
  const nodeProcessing = document.getElementById('step-node-processing');
  const nodeCompleted = document.getElementById('step-node-completed');

  if (trackingForm) {
    trackingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const searchId = trackingInput.value.trim();
      if (!searchId) return;

      // Show loader, hide result/error
      trackingLoader.style.display = 'block';
      trackingError.style.display = 'none';
      trackingResult.style.display = 'none';

      const updateTrackingStepper = (status) => {
        // Reset classes
        const nodes = [nodePending, nodeProcessing, nodeCompleted];
        nodes.forEach(node => {
          if (node) {
            node.classList.remove('active', 'completed');
          }
        });
        if (progressBar) progressBar.style.width = '0%';

        const st = status ? status.toLowerCase() : 'pending';

        if (st === 'pending') {
          if (nodePending) nodePending.classList.add('active');
          if (progressBar) progressBar.style.width = '0%';
        } else if (st === 'processing') {
          if (nodePending) nodePending.classList.add('completed');
          if (nodeProcessing) nodeProcessing.classList.add('active');
          if (progressBar) progressBar.style.width = '50%';
        } else if (st === 'completed') {
          if (nodePending) nodePending.classList.add('completed');
          if (nodeProcessing) nodeProcessing.classList.add('completed');
          if (nodeCompleted) nodeCompleted.classList.add('completed');
          if (progressBar) progressBar.style.width = '100%';
        }
      };

      const displayOrderResult = (order) => {
        trackingLoader.style.display = 'none';

        if (resOrderId) resOrderId.textContent = order.orderId;
        if (resService) {
          let svcName = order.service;
          if (svcName === 'followers') svcName = 'Instagram Followers';
          else if (svcName === 'views') svcName = 'Instagram Reel Views';
          else if (svcName === 'likes') svcName = 'Instagram Likes';
          else if (svcName === 'yt-subscribers') svcName = 'YouTube Subscribers';
          else if (svcName === 'yt-views') svcName = 'YouTube Views';
          else if (svcName === 'yt-likes') svcName = 'YouTube Likes';
          resService.textContent = svcName;
        }
        if (resQty) resQty.textContent = Number(order.quantity).toLocaleString('en-IN');
        if (resPrice) {
          const priceStr = String(order.price);
          if (priceStr.startsWith('$') || priceStr.startsWith('₹')) {
            resPrice.textContent = priceStr;
          } else {
            resPrice.textContent = `₹${priceStr}`;
          }
        }
        if (resTarget) {
          resTarget.textContent = order.target;
          resTarget.setAttribute('title', order.target);
        }

        updateTrackingStepper(order.orderStatus);
        trackingResult.style.display = 'block';
      };

      const displayTrackingError = (msg) => {
        trackingLoader.style.display = 'none';
        if (trackingErrorMsg) trackingErrorMsg.textContent = msg;
        trackingError.style.display = 'block';
      };

      // Real or Simulated fetch
      if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        // Simulate database query for demonstration/testing
        console.warn("Using simulation fallback for order tracking.");
        setTimeout(() => {
          // If search ID has pattern FB-XXXXXX or is valid
          if (/^FB-\d{6}$/.test(searchId)) {
            // Generate deterministic mock data based on digits in order ID
            const digitSum = searchId.split('').reduce((acc, char) => isNaN(parseInt(char)) ? acc : acc + parseInt(char), 0);
            let simulatedStatus = 'Pending';
            if (digitSum % 3 === 1) simulatedStatus = 'Processing';
            else if (digitSum % 3 === 2) simulatedStatus = 'Completed';

            const mockOrder = {
              orderId: searchId,
              service: 'followers',
              quantity: '1000',
              price: '179',
              target: '@demohandle',
              orderStatus: simulatedStatus
            };
            displayOrderResult(mockOrder);
          } else {
            displayTrackingError('Order ID format invalid. Try searching a valid ID like FB-123456');
          }
        }, 1000);
      } else {
        // Fetch from actual Google Apps Script Web App
        fetch(`${APPS_SCRIPT_WEB_APP_URL}?action=trackOrder&orderId=${encodeURIComponent(searchId)}`)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
              displayOrderResult(data);
            } else if (data.status === 'not_found') {
              displayTrackingError('Order ID not found. Please double check the ID and verify payment.');
            } else {
              displayTrackingError(data.message || 'Error communicating with sheet');
            }
          })
          .catch(err => {
            displayTrackingError('Network error checking order: ' + (err.message || err));
          });
      }
    });
  }
}

/* ==========================================================================
   11.5. Service Cards Click redirection to Portfolio section with active filter
   ========================================================================== */
function initServiceCardsClick() {
  const cardFilters = {
    'service-video-editing': 'btn-filter-video',
    'service-video-prod': 'btn-filter-video',
    'service-content-creation': 'btn-filter-website',
    'service-web-dev': 'btn-filter-website',
    'service-thumb-creation': 'btn-filter-vfx',
    'service-cgi-ads': 'btn-filter-cgi'
  };

  Object.keys(cardFilters).forEach(cardId => {
    const card = document.getElementById(cardId);
    if (!card) return;

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // Scroll to portfolio section smoothly
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Programmatically click the corresponding filter button
      const filterBtnId = cardFilters[cardId];
      const filterBtn = document.getElementById(filterBtnId);
      if (filterBtn) {
        // Brief delay so scroll starts before filter animation triggers
        setTimeout(() => {
          filterBtn.click();
        }, 300);
      }
    });
  });
}

/* ==========================================================================
   12. Why Choose Us 3D Card Stack Slider (Swipe & Navigation supported)
   ========================================================================== */
function initWhyChooseStack() {
  const stack = document.getElementById('why-card-stack');
  const cards = document.querySelectorAll('.why-card.stack-card');
  const btnPrev = document.getElementById('stack-prev-btn');
  const btnNext = document.getElementById('stack-next-btn');
  const dotsContainer = document.getElementById('stack-dots-container');

  if (!stack || cards.length === 0) return;

  let currentIndex = 0;
  const cardCount = cards.length;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let dragCard = null;

  // Generate navigation indicator dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < cardCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('stack-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateStack();
    });
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll('.stack-dot');

  // Update layout and 3D transforms for cards
  const updateStack = () => {
    cards.forEach((card, idx) => {
      // Calculate relative index relative to active card
      let relIdx = (idx - currentIndex + cardCount) % cardCount;

      // Clear inline transform & opacity styles so CSS styles can take over
      card.style.transform = '';
      card.style.opacity = '';

      // Clear existing position classes
      card.classList.remove('stack-pos-0', 'stack-pos-1', 'stack-pos-2', 'stack-hidden');

      // Assign position classes
      if (relIdx === 0) {
        card.classList.add('stack-pos-0');
      } else if (relIdx === 1) {
        card.classList.add('stack-pos-1');
      } else if (relIdx === 2) {
        card.classList.add('stack-pos-2');
      } else {
        card.classList.add('stack-hidden');
      }
    });

    // Update dots indicator active class
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  // Click controls
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cardCount;
      updateStack();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cardCount) % cardCount;
      updateStack();
    });
  }

  // Swipe/Drag Event Handlers
  const handleDragStart = (e) => {
    // Only allow dragging on top card
    dragCard = cards[currentIndex];
    if (!dragCard) return;

    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    dragCard.classList.add('dragging');
  };

  const handleDragMove = (e) => {
    if (!isDragging || !dragCard) return;

    currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let deltaX = currentX - startX;

    // Stop scrolling page on mobile when swiping
    if (e.cancelable) e.preventDefault();

    // Rotate slightly during drag
    let rotate = deltaX * 0.08;
    dragCard.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg)`;
  };

  const handleDragEnd = () => {
    if (!isDragging || !dragCard) return;

    isDragging = false;
    dragCard.classList.remove('dragging');

    let deltaX = currentX - startX;
    let threshold = 120; // swipe threshold in px

    if (Math.abs(deltaX) > threshold) {
      // Swipe out left or right
      let direction = deltaX > 0 ? 1 : -1;

      dragCard.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      dragCard.style.transform = `translate3d(${direction * 600}px, 0, 0) rotate(${direction * 30}deg)`;
      dragCard.style.opacity = '0';

      const swipedCard = dragCard;
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % cardCount;
        swipedCard.style.transition = '';
        updateStack();
      }, 300);
    } else {
      // Snap back
      updateStack();
    }

    dragCard = null;
  };

  // Mouse drag events
  stack.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);

  // Touch drag events
  stack.addEventListener('touchstart', handleDragStart, { passive: true });
  document.addEventListener('touchmove', handleDragMove, { passive: false });
  document.addEventListener('touchend', handleDragEnd);

  // Initial layout render
  updateStack();
}

/* ==========================================================================
   16. Dynamic Reviews & Testimonials Integration
   ========================================================================== */
function initDynamicReviewsAndTestimonialsSlider() {
  const stack = document.getElementById('testimonials-card-stack');
  if (!stack) return;

  // Set up Write a Review button/form interactions
  initWriteReviewSystem();

  // Helper to render a review card
  const renderReviewCard = (rev, idx) => {
    const cardId = `user-review-${idx}`;
    const initials = rev.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

    let starsHtml = '';
    const ratingVal = parseInt(rev.rating, 10) || 5;
    for (let s = 0; s < ratingVal; s++) {
      starsHtml += '&#9733;';
    }

    const card = document.createElement('div');
    card.className = 'testimonial-card stack-card';
    card.id = cardId;
    card.innerHTML = `
      <blockquote class="testimonial-quote">
        "${rev.reviewText}"
      </blockquote>
      <div style="color: #FFB800; font-size: 1.1rem; margin: -5px 0 15px 0; text-align: left;">
        ${starsHtml}
      </div>
      <div class="testimonial-author">
        <div class="author-img-wrapper">
          <div class="author-fallback">${initials}</div>
        </div>
        <div>
          <div class="author-name">${rev.name}</div>
          <div class="author-info">${rev.role || 'Verified Customer'}</div>
        </div>
      </div>
    `;
    stack.appendChild(card);
  };

  // Load reviews from localStorage first
  let localReviews = [];
  try {
    localReviews = JSON.parse(localStorage.getItem('frame_builders_reviews')) || [];
  } catch (e) {
    console.error('Error reading local reviews:', e);
  }

  // If fallback dummy URL is present, just render local reviews and init slider
  if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    localReviews.forEach((rev, idx) => renderReviewCard(rev, `local-${idx}`));
    initTestimonialsSlider();
    return;
  }

  fetch(`${APPS_SCRIPT_WEB_APP_URL}?action=getReviews`)
    .then(res => res.json())
    .then(data => {
      // Set to track database review combinations to avoid duplicate displays
      const renderedKeys = new Set();

      if (data.status === 'success' && data.reviews && data.reviews.length > 0) {
        data.reviews.forEach((rev, idx) => {
          renderReviewCard(rev, `db-${idx}`);
          renderedKeys.add(`${rev.name.trim().toLowerCase()}-${rev.reviewText.trim().toLowerCase()}`);
        });
      }

      // Append local reviews that aren't synced in sheet database yet
      localReviews.forEach((rev, idx) => {
        const key = `${rev.name.trim().toLowerCase()}-${rev.reviewText.trim().toLowerCase()}`;
        if (!renderedKeys.has(key)) {
          renderReviewCard(rev, `local-${idx}`);
        }
      });

      initTestimonialsSlider();
    })
    .catch(err => {
      console.error('Failed to load dynamic reviews from DB, loading local reviews:', err);
      localReviews.forEach((rev, idx) => renderReviewCard(rev, `local-fallback-${idx}`));
      initTestimonialsSlider();
    });
}

function initWriteReviewSystem() {
  const btnWriteReview = document.getElementById('btn-write-review');
  const reviewModal = document.getElementById('review-modal');
  const closeReviewModalBtn = document.getElementById('btn-close-review-modal');
  const submitReviewForm = document.getElementById('submit-review-form');
  const stars = document.querySelectorAll('.star-input');
  const ratingInput = document.getElementById('review-rating-val');
  const btnSubmitReview = document.getElementById('btn-submit-review');

  if (!btnWriteReview || !reviewModal) return;

  // Open Write Review modal
  btnWriteReview.addEventListener('click', () => {
    // Reset stars to 5 by default
    stars.forEach(s => s.classList.add('active'));
    if (ratingInput) ratingInput.value = '5';
    if (submitReviewForm) submitReviewForm.reset();
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  });

  // Close Write Review modal
  const closeReviewModal = () => {
    reviewModal.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll lock
  };

  if (closeReviewModalBtn) {
    closeReviewModalBtn.addEventListener('click', closeReviewModal);
  }

  reviewModal.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
      closeReviewModal();
    }
  });

  // Stars click & hover selection logic
  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      const rating = parseInt(star.getAttribute('data-rating'), 10);
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-rating'), 10) <= rating) {
          s.classList.add('hovered');
        } else {
          s.classList.remove('hovered');
        }
      });
    });

    star.addEventListener('mouseout', () => {
      stars.forEach(s => s.classList.remove('hovered'));
    });

    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'), 10);
      if (ratingInput) ratingInput.value = rating;
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-rating'), 10) <= rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  // Submit Review Form
  if (submitReviewForm) {
    submitReviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('review-name-input').value.trim();
      const roleVal = document.getElementById('review-role-input').value.trim();
      const ratingVal = ratingInput ? ratingInput.value : '5';
      const textVal = document.getElementById('review-text-input').value.trim();

      if (!nameVal || !textVal) return;

      const originalBtnText = btnSubmitReview.innerHTML;
      btnSubmitReview.disabled = true;
      btnSubmitReview.innerHTML = '<span>Submitting...</span>';

      const reviewData = {
        action: 'addReview',
        name: nameVal,
        role: roleVal,
        rating: ratingVal,
        reviewText: textVal
      };

      const handleSuccess = () => {
        // Save review to localStorage immediately
        let localReviews = [];
        try {
          localReviews = JSON.parse(localStorage.getItem('frame_builders_reviews')) || [];
        } catch (e) { }

        localReviews.push({
          name: nameVal,
          role: roleVal,
          rating: ratingVal,
          reviewText: textVal,
          date: new Date().toISOString()
        });

        try {
          localStorage.setItem('frame_builders_reviews', JSON.stringify(localReviews));
        } catch (e) {
          console.error('Failed to save review in local storage:', e);
        }

        btnSubmitReview.disabled = false;
        btnSubmitReview.innerHTML = originalBtnText;
        closeReviewModal();
        alert('Thank you! Your review has been submitted successfully.');
        location.reload(); // Reload to fetch and display the review in the slider
      };

      const handleFailure = (msg) => {
        console.error('Failed to submit review:', msg);
        if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
          setTimeout(handleSuccess, 1000);
        } else {
          alert('Error submitting review: ' + msg + '. Proceeding with local simulation.');
          setTimeout(handleSuccess, 1000);
        }
      };

      if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        setTimeout(handleSuccess, 1200);
      } else {
        fetch(APPS_SCRIPT_WEB_APP_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(reviewData)
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === 'success') {
              handleSuccess();
            } else {
              handleFailure(data.message || 'Server error');
            }
          })
          .catch(err => {
            handleFailure(err.message || 'Network error');
          });
      }
    });
  }
}

/* ==========================================================================
   17. Portfolio VFX 3D Card Stack Slider (Swipe & Navigation supported)
   ========================================================================== */
function initPortfolioVFXStack() {
  const stack = document.getElementById('vfx-portfolio-card-stack');
  const cards = document.querySelectorAll('.portfolio-vfx-card');
  const btnPrev = document.getElementById('vfx-stack-prev-btn');
  const btnNext = document.getElementById('vfx-stack-next-btn');
  const dotsContainer = document.getElementById('vfx-stack-dots-container');

  if (!stack || cards.length === 0) return;

  let currentIndex = 0;
  const cardCount = cards.length;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let dragCard = null;

  // Generate navigation indicator dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < cardCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('stack-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateStack();
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.stack-dot');

  // Update layout and 3D transforms for cards
  const updateStack = () => {
    cards.forEach((card, idx) => {
      // Calculate relative index relative to active card
      let relIdx = (idx - currentIndex + cardCount) % cardCount;

      // Clear inline transform & opacity styles so CSS styles can take over
      card.style.transform = '';
      card.style.opacity = '';

      // Clear existing position classes
      card.classList.remove('stack-pos-0', 'stack-pos-1', 'stack-pos-2', 'stack-hidden');

      // Assign position classes
      if (relIdx === 0) {
        card.classList.add('stack-pos-0');
      } else if (relIdx === 1) {
        card.classList.add('stack-pos-1');
      } else if (relIdx === 2) {
        card.classList.add('stack-pos-2');
      } else {
        card.classList.add('stack-hidden');
      }
    });

    // Update dots indicator active class
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  // Click controls
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cardCount;
      updateStack();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cardCount) % cardCount;
      updateStack();
    });
  }

  // Swipe/Drag Event Handlers
  const handleDragStart = (e) => {
    // Only allow dragging on top card
    dragCard = cards[currentIndex];
    if (!dragCard) return;

    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    dragCard.classList.add('dragging');
  };

  const handleDragMove = (e) => {
    if (!isDragging || !dragCard) return;

    currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let deltaX = currentX - startX;

    // Stop scrolling page on mobile when swiping
    if (e.cancelable) e.preventDefault();

    // Rotate slightly during drag
    let rotate = deltaX * 0.08;
    dragCard.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg)`;
  };

  const handleDragEnd = () => {
    if (!isDragging || !dragCard) return;

    isDragging = false;
    dragCard.classList.remove('dragging');

    let deltaX = currentX - startX;
    let threshold = 120; // swipe threshold in px

    if (Math.abs(deltaX) > threshold) {
      // Swipe out left or right
      let direction = deltaX > 0 ? 1 : -1;

      dragCard.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      dragCard.style.transform = `translate3d(${direction * 600}px, 0, 0) rotate(${direction * 30}deg)`;
      dragCard.style.opacity = '0';

      const swipedCard = dragCard;
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % cardCount;
        swipedCard.style.transition = '';
        updateStack();
      }, 300);
    } else {
      // Snap back
      updateStack();
    }

    dragCard = null;
  };

  // Mouse drag events
  stack.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);

  // Touch drag events
  stack.addEventListener('touchstart', handleDragStart, { passive: true });
  document.addEventListener('touchmove', handleDragMove, { passive: false });
  document.addEventListener('touchend', handleDragEnd);

  // Initial layout render
  updateStack();
}



