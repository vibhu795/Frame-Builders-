/**
 * FRAME BUILDERS - DYNAMIC SITE LOGIC
 * Interactivity: 3D Tilting, Hover Spotlight, Slider, Stats Count, Portfolio Filter, Calendly Integration
 */

// Configuration
const CALENDLY_URL = 'https://calendly.com/framebuilders/30min';
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
  initServiceCardsClick();
  initWhyChooseStack();
  initAboutStack();
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

    if (e.type === 'touchstart') {
      stack.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
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

    // Remove drag listeners
    stack.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

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

  // Touch drag events
  stack.addEventListener('touchstart', handleDragStart, { passive: true });

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

    // Play on hover (desktop only)
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 768) {
        video.play().catch(err => {
          console.log('Video play blocked or interrupted:', err);
        });
      }
    });

    // Pause on mouse leave (desktop only)
    card.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 768) {
        video.pause();
      }
    });

    // Toggle play/pause on click/tap (mobile and desktop manual click)
    card.addEventListener('click', (e) => {
      // If the click is inside a link, let the browser handle navigation
      if (e.target.closest('a')) return;

      if (video.paused) {
        // Pause all other portfolio videos first
        document.querySelectorAll('.portfolio-card video').forEach(v => {
          if (v !== video) v.pause();
        });
        
        video.play().catch(err => {
          console.log('Video play blocked on click:', err);
        });
      } else {
        video.pause();
      }
    });
  });
}

/* ==========================================================================

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

    if (e.type === 'touchstart') {
      stack.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
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

    // Remove drag listeners
    stack.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

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

  // Touch drag events
  stack.addEventListener('touchstart', handleDragStart, { passive: true });

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

    if (e.type === 'touchstart') {
      stack.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
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

    // Remove drag listeners
    stack.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

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

  // Touch drag events
  stack.addEventListener('touchstart', handleDragStart, { passive: true });

  // Initial layout render
  updateStack();
}

/* ==========================================================================
   13. About Us Founders Stack (Swipe & Navigation supported)
   ========================================================================== */
function initAboutStack() {
  const stack = document.getElementById('about-card-stack');
  const cards = document.querySelectorAll('.about-card.stack-card');
  const btnPrev = document.getElementById('about-prev-btn');
  const btnNext = document.getElementById('about-next-btn');
  const dotsContainer = document.getElementById('about-dots-container');

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

  const dots = document.querySelectorAll('#about-dots-container .stack-dot');

  // Update layout and 3D transforms for cards
  const updateStack = () => {
    cards.forEach((card, idx) => {
      // Calculate relative index relative to active card
      let relIdx = (idx - currentIndex + cardCount) % cardCount;

      // Clear inline transform & opacity styles so CSS styles can take over
      card.style.transform = '';
      card.style.opacity = '';

      // Clear existing position classes
      card.classList.remove('stack-pos-0', 'stack-pos-1', 'stack-hidden');

      // Assign position classes
      if (relIdx === 0) {
        card.classList.add('stack-pos-0');
      } else if (relIdx === 1) {
        card.classList.add('stack-pos-1');
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

    if (e.type === 'touchstart') {
      stack.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
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

    // Remove drag listeners
    stack.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

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

  // Touch drag events
  stack.addEventListener('touchstart', handleDragStart, { passive: true });

  // Initial layout render
  updateStack();
}



