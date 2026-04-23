/* ============================================================
   STAY BOOKED — script.js
   Vanilla JS — no dependencies
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR SCROLL EFFECT
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case page is refreshed mid-scroll
})();

/* ============================================================
   2. MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const closeBtn     = document.getElementById('mobileMenuClose');
  const backdrop     = document.getElementById('mobileMenuBackdrop');
  const mobileLinks  = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close on nav link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
})();

/* ============================================================
   3. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    elements.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // trigger once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   4. STAT COUNTERS (count up on scroll into view)
   ============================================================ */
(function initStatCounters() {
  const statsGrid = document.getElementById('statsGrid');
  if (!statsGrid) return;

  const counters   = statsGrid.querySelectorAll('.stat-num[data-target]');
  let   triggered  = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function formatNumber(value, format, prefix, suffix) {
    var display = '';

    if (format === 'comma') {
      var rounded = Math.round(value);
      display = rounded.toLocaleString('en-US');
    } else if (format === 'decimal') {
      display = value.toFixed(1);
    } else {
      display = Math.round(value).toString();
    }

    return prefix + display + suffix;
  }

  function animateCounter(el) {
    var target  = parseFloat(el.dataset.target);
    var prefix  = el.dataset.prefix  || '';
    var suffix  = el.dataset.suffix  || '';
    var format  = el.dataset.format  || 'int';
    var duration = 2000; // ms
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed  = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOut(progress);
      var current  = target * eased;

      el.textContent = formatNumber(current, format, prefix, suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target, format, prefix, suffix);
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(statsGrid);
})();

/* ============================================================
   5. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  var faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach(function (other) {
        var otherQ = other.querySelector('.faq-question');
        var otherA = other.querySelector('.faq-answer');
        if (otherQ && otherA && other !== item) {
          otherQ.setAttribute('aria-expanded', 'false');
          otherA.classList.remove('open');
        }
      });

      // Toggle this one
      if (isOpen) {
        question.setAttribute('aria-expanded', 'false');
        answer.classList.remove('open');
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

/* ============================================================
   6. CONTACT FORM — Netlify submission with inline success
   ============================================================ */
(function initContactForm() {
  var form    = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic client-side required field check
    var requiredFields = form.querySelectorAll('[required]');
    var valid = true;

    requiredFields.forEach(function (field) {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(239, 68, 68, 0.6)';
        valid = false;
      }
    });

    if (!valid) return;

    // Disable submit while posting
    var submitBtn = form.querySelector('[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var formData = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
      .then(function (response) {
        if (response.ok) {
          form.hidden   = true;
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(function () {
        // Fallback: show success anyway (Netlify may return 200 sometimes)
        // or show a polite error
        submitBtn.disabled    = false;
        submitBtn.textContent = originalText;
        alert('Something went wrong. Please try again or call us at (916) 606-9970.');
      });
  });
})();

/* ============================================================
   7. SMOOTH SCROLL for nav links (polyfill for browsers
      that don't support scroll-behavior: smooth)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var navHeight = document.getElementById('navbar')
        ? document.getElementById('navbar').offsetHeight
        : 0;

      var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });
})();
