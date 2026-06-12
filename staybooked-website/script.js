'use strict';

/* ============================================================
   PAGE-TURN BLUR-TO-CLEAR REVEAL
   Each section sharpens into focus as it snaps into view, and
   resets when it leaves so the reveal replays on scroll back.
   ============================================================ */
(function initReveal() {
  var sections = document.querySelectorAll('.section-reveal');
  if (!sections.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    sections.forEach(function (s) {
      s.classList.add('visible');
      s.querySelectorAll('.stagger').forEach(function (el) {
        el.classList.add('visible');
      });
    });
    return;
  }

  var sectionObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        var staggers = entry.target.querySelectorAll('.stagger');
        staggers.forEach(function (el, i) {
          setTimeout(function () { el.classList.add('visible'); }, 150 + i * 120);
        });
      } else {
        entry.target.classList.remove('visible');
        entry.target.querySelectorAll('.stagger').forEach(function (el) {
          el.classList.remove('visible');
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function (s) { sectionObs.observe(s); });
})();

/* ============================================================
   HERO INTRO — hand off to the breath animation once settled
   Runs once on load; skipped entirely under reduced motion.
   ============================================================ */
(function initHeroIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('load', function () {
    setTimeout(function () {
      var logo = document.querySelector('.hero-logo');
      if (logo) logo.classList.add('settled');
    }, 1800);
  });
})();
