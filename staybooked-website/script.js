'use strict';

/* ============================================================
   1. SLIDE-OUT NAVIGATION
   ============================================================ */
(function initNav() {
  var hamburger   = document.getElementById('hamburger');
  var slideMenu   = document.getElementById('slideMenu');
  var closeBtn    = document.getElementById('slideMenuClose');
  var overlay     = document.getElementById('slideOverlay');
  var slideLinks  = document.querySelectorAll('.slide-link');

  if (!hamburger || !slideMenu) return;

  function openMenu() {
    slideMenu.classList.add('open');
    overlay.classList.add('active');
    slideMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    slideMenu.classList.remove('open');
    overlay.classList.remove('active');
    slideMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  slideLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && slideMenu.classList.contains('open')) closeMenu();
  });
})();

/* ============================================================
   2. HERO SLIDESHOW
   ============================================================ */
(function initHero() {
  var slides     = document.querySelectorAll('.hero-slide');
  var dots       = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  var current    = 0;
  var total      = slides.length;
  var timer      = null;
  var INTERVAL   = 6000;

  function goTo(index) {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + total) % total;

    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  startAuto();
})();

/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   4. STAT COUNTERS
   ============================================================ */
(function initStats() {
  var grid = document.getElementById('statsGrid');
  if (!grid) return;

  var counters  = grid.querySelectorAll('.stat-num[data-target]');
  var triggered = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function fmt(value, format, prefix, suffix) {
    var display;
    if (format === 'comma') {
      display = Math.round(value).toLocaleString('en-US');
    } else if (format === 'decimal') {
      display = value.toFixed(1);
    } else {
      display = Math.round(value).toString();
    }
    return prefix + display + suffix;
  }

  function animateCounter(el) {
    var target   = parseFloat(el.dataset.target);
    var prefix   = el.dataset.prefix  || '';
    var suffix   = el.dataset.suffix  || '';
    var format   = el.dataset.format  || 'int';
    var duration = 2000;
    var start    = null;

    requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = fmt(target * easeOut(progress), format, prefix, suffix);
      if (progress < 1) requestAnimationFrame(step);
    });
  }

  var obs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      counters.forEach(animateCounter);
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  obs.observe(grid);
})();

/* ============================================================
   5. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = question.getAttribute('aria-expanded') === 'true';

      items.forEach(function (other) {
        var q = other.querySelector('.faq-question');
        var a = other.querySelector('.faq-answer');
        if (q && a && other !== item) {
          q.setAttribute('aria-expanded', 'false');
          a.classList.remove('open');
        }
      });

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
   6. CONTACT FORM
   ============================================================ */
(function initContact() {
  var form    = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var required = form.querySelectorAll('[required]');
    var valid    = true;

    required.forEach(function (f) {
      f.style.borderColor = '';
      if (!f.value.trim()) {
        f.style.borderColor = 'rgba(184, 151, 106, 0.8)';
        valid = false;
      }
    });

    if (!valid) return;

    var btn  = form.querySelector('[type="submit"]');
    var orig = btn.textContent;
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    fetch('https://formspree.io/f/mnjllyyg', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) {
        if (res.ok) {
          form.hidden    = true;
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else { throw new Error(); }
      })
      .catch(function () {
        btn.disabled    = false;
        btn.textContent = orig;
        alert('Something went wrong. Please try again or call us at (916) 606-9970.');
      });
  });
})();

/* ============================================================
   7. SMOOTH SCROLL
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href   = a.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var navH   = document.querySelector('.navbar');
      var offset = navH ? navH.offsetHeight + 8 : 0;
      var top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
