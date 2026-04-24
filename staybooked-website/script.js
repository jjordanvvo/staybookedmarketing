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
   6. CONTACT FORM — Formspree submission with inline success
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

    fetch('https://formspree.io/f/mnjllyyg', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    })
      .then(function (response) {
        if (response.ok) {
          form.hidden    = true;
          success.hidden = false;
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = originalText;
        alert('Something went wrong. Please try again or call us at (408) 712-0017.');
      });
  });
})();

/* ============================================================
   7. TESTIMONIAL CAROUSEL — data-driven, 150 reviews
   ============================================================ */
(function initCarousel() {

  /* ── Review data ── */
  var reviews = [
    /* Roofing */
    { text: 'We were spending $3,000 a month with another agency and had nothing to show for it. Stay Booked came in, cut our ad spend in half, and tripled our leads. I wish I found them a year ago.', name: 'Mike R.', detail: 'Roofing Contractor — Sacramento, CA' },
    { text: 'We were invisible on Google. Now we\'re the first company people call when a storm rolls through. Complete 180 from where we were six months ago.', name: 'Tom B.', detail: 'Roofing Company Owner — Phoenix, AZ' },
    { text: 'Ran Google Ads on my own for two years and never got it right. Stay Booked figured it out in week one. Haven\'t had a slow week since.', name: 'Kevin D.', detail: 'Roofing Contractor — Las Vegas, NV' },
    { text: 'Booked 22 roof replacements in our first month working with them. Had to hire two more crews just to keep up.', name: 'Steve W.', detail: 'Roofing Co. Owner — Houston, TX' },
    { text: 'They know exactly what homeowners search for after a hailstorm. Our cost per lead dropped 68% and close rate went up.', name: 'James P.', detail: 'Roofing Contractor — Denver, CO' },
    { text: 'Best investment I\'ve made in my business. Period. The leads are real, they\'re local, and they actually want to talk to us.', name: 'Randy S.', detail: 'Roofing & Gutters — Portland, OR' },
    { text: 'I\'ve worked with three marketing agencies. These are the only ones who actually understand what a roofing job is worth and how to price ads around it.', name: 'Derek H.', detail: 'Roofing Contractor — Dallas, TX' },
    { text: 'Shoulder season used to kill us. Stay Booked kept the phone ringing through November and December. That\'s never happened before.', name: 'Phil C.', detail: 'Residential Roofer — Chicago, IL' },
    { text: 'Our ads used to get clicks from people in the wrong city. Now every lead is within 15 miles and actually ready to buy.', name: 'Nate F.', detail: 'Roofing Specialist — Nashville, TN' },
    { text: 'Within 90 days we went from 4 jobs a week to 11. I had to turn work down. That\'s a problem I\'ll take every day.', name: 'Luis V.', detail: 'Roofing Contractor — San Antonio, TX' },
    { text: 'They built us a new website and it loads so fast our bounce rate dropped in half. More people calling, more jobs closed.', name: 'Aaron M.', detail: 'Full-Service Roofing — Atlanta, GA' },
    { text: 'First agency to ever show me what my actual return on ad spend is. Everything is tracked and reported clearly. No guessing.', name: 'Brian T.', detail: 'Roofing & Siding — Minneapolis, MN' },
    { text: 'We added two new service areas and filled both within the first six weeks. Stay Booked made expansion feel easy.', name: 'Cody R.', detail: 'Storm Restoration Roofing — Oklahoma City, OK' },
    { text: 'They handle everything. I forward them a photo of a completed job and they turn it into an ad. It actually works.', name: 'Eric N.', detail: 'Roofing Contractor — Tampa, FL' },
    { text: 'Five stars isn\'t enough. We scaled from 2 crews to 6 in one year. Stay Booked is a big reason why.', name: 'Marcus L.', detail: 'Commercial & Residential Roofing — Charlotte, NC' },
    /* HVAC */
    { text: 'My wife handles our books and she was the one who said we needed to try this. Best call we ever made. They run everything and we just show up and do the work.', name: 'Carlos M.', detail: 'HVAC Contractor — Bay Area, CA' },
    { text: 'We used to go dark every spring and fall. Stay Booked helped us build demand during shoulder season. Calendar is full year-round now.', name: 'Tony R.', detail: 'HVAC Company Owner — Phoenix, AZ' },
    { text: 'Launched our maintenance plan promotion through them and signed up 80 new customers in the first month. Recurring revenue changes everything.', name: 'Greg S.', detail: 'HVAC & Refrigeration — Las Vegas, NV' },
    { text: 'Cut my cost per booked appointment from $180 down to $42. I didn\'t think that was possible.', name: 'Kevin A.', detail: 'Heating & Cooling — Denver, CO' },
    { text: 'Our Google reviews went from 12 to 94 in four months. Stay Booked set up the whole review system and it runs on autopilot.', name: 'Rob P.', detail: 'HVAC Technician — Sacramento, CA' },
    { text: 'Summer used to be chaos and winter was dead. Now both seasons are packed. I finally feel like I have a real business.', name: 'Frank D.', detail: 'Air Conditioning & Heat — Tucson, AZ' },
    { text: 'They rebuilt our website from scratch. Looks professional, loads instantly, and the contact form actually converts. Night and day.', name: 'Matt C.', detail: 'HVAC Services — Austin, TX' },
    { text: 'I was running the same old ads for years with mediocre results. Stay Booked refreshed everything and calls doubled inside 60 days.', name: 'Don V.', detail: 'Residential HVAC — San Diego, CA' },
    { text: 'The targeting is so specific that we almost never get calls from outside our service area. Every lead is a real opportunity.', name: 'Joey B.', detail: 'HVAC Contractor — Orlando, FL' },
    { text: 'We compete with three big companies in our market. Stay Booked helped us punch way above our weight on Google.', name: 'Al S.', detail: 'Independent HVAC Tech — Houston, TX' },
    { text: 'They understood our business within the first conversation. These aren\'t marketers pretending to know trades. They actually get it.', name: 'Chris T.', detail: 'HVAC & Plumbing — Nashville, TN' },
    { text: 'ROI is real and measurable. For every dollar we spend on ads, we make $9 back. I\'ve never seen numbers like that before.', name: 'Walt M.', detail: 'Commercial HVAC — Dallas, TX' },
    { text: 'They set up a follow-up system for leads who don\'t answer the first time. That alone recovered thousands in lost revenue.', name: 'Rick J.', detail: 'HVAC Company — Atlanta, GA' },
    { text: 'Our no-show rate on installs dropped significantly after they rewrote our confirmation texts and emails. Smart people.', name: 'Barry N.', detail: 'HVAC Installation — Seattle, WA' },
    { text: 'Signed up seven commercial maintenance contracts from one campaign. That\'s $84,000 in recurring annual revenue.', name: 'Sam K.', detail: 'Commercial HVAC — Chicago, IL' },
    /* Plumbing */
    { text: 'I tried running Google Ads myself and burned through $2,000 with nothing to show for it. Stay Booked had everything dialed in within a week. We booked 14 jobs in the first month alone.', name: 'Sarah K.', detail: 'Plumbing Company Owner — Fresno, CA' },
    { text: 'Emergency calls used to be random. Now they\'re consistent because we show up first every time someone searches for a plumber near me.', name: 'Dave H.', detail: 'Emergency Plumber — Los Angeles, CA' },
    { text: 'We went from relying on word-of-mouth to having a full pipeline of booked jobs. The difference in stress alone is worth it.', name: 'Tom L.', detail: 'Plumbing Contractor — San Jose, CA' },
    { text: 'Water heater installs went from 3 a week to 9. Stay Booked targeted exactly the right people at exactly the right time.', name: 'Ray V.', detail: 'Plumber — Riverside, CA' },
    { text: 'I hired them for ads but they also fixed our Google Business Profile. We started getting calls from the map pack almost immediately.', name: 'Ed C.', detail: 'Plumbing Services — Bakersfield, CA' },
    { text: 'Three months in and our revenue is up 61%. I don\'t know how I ran this business before without them.', name: 'Nick P.', detail: 'Plumbing & Drain — San Francisco, CA' },
    { text: 'They wrote our ad copy and it actually sounds like us. Not corporate junk. Real language that our customers respond to.', name: 'Stan F.', detail: 'Family Plumbing — Portland, OR' },
    { text: 'My dispatcher told me call volume doubled and the quality of callers went up too. People are calling ready to schedule, not just browsing.', name: 'Pete M.', detail: 'Plumbing Contractor — Seattle, WA' },
    { text: 'We\'re a small operation but Stay Booked made us look like the biggest player in our market. Our reviews and rankings back it up.', name: 'Carl R.', detail: 'Two-Truck Plumbing Co. — Stockton, CA' },
    { text: 'Seasonal dips are basically gone. Even the slow months are busier than our best months used to be.', name: 'Hank W.', detail: 'Plumbing & Gas Lines — Sacramento, CA' },
    { text: 'My son runs the ads side with Stay Booked\'s help. Keeps the family business growing without me having to learn all this tech stuff.', name: 'Gene A.', detail: 'A&A Plumbing — Oakland, CA' },
    { text: 'Cost per lead went from $95 to $28. Numbers like that make you feel like a genius for making the call to hire them.', name: 'Russ T.', detail: 'Plumber — Modesto, CA' },
    /* Electrical */
    { text: 'Panel upgrades are our bread and butter. Stay Booked put us in front of exactly that customer and we\'re booked out six weeks.', name: 'Bill E.', detail: 'Licensed Electrician — Sacramento, CA' },
    { text: 'We went from struggling to find work to turning away jobs. I have a waiting list now — something I never thought I\'d say.', name: 'Wayne S.', detail: 'Electrical Contractor — Phoenix, AZ' },
    { text: 'EV charger installs have exploded for us since they started running those ads. Perfect timing on the targeting.', name: 'Jake R.', detail: 'Electrician — San Jose, CA' },
    { text: 'Our competitors don\'t even show up when I Google our services anymore. Stay Booked basically owns the local search results for us.', name: 'Paul M.', detail: 'Electrical Services — Los Angeles, CA' },
    { text: 'Every campaign they run has a purpose. I always know what we\'re spending, what we\'re testing, and what\'s working. No surprises.', name: 'Rich C.', detail: 'Master Electrician — Denver, CO' },
    { text: 'Our biggest month ever was month three with Stay Booked. We hit a number I thought would take three more years to reach.', name: 'Keith D.', detail: 'Electrical & Panel Upgrades — Las Vegas, NV' },
    { text: 'I\'ve been in business 18 years and marketing has always been my weak point. These guys fixed that completely.', name: 'Ben J.', detail: 'Residential Electrician — Portland, OR' },
    { text: 'Commercial jobs are up. Residential is up. Referrals are up because we have more customers. Everything just compounds.', name: 'Tim N.', detail: 'Commercial & Residential Electric — Dallas, TX' },
    { text: 'They set up our online booking and it filled up with appointments the first week. Customers love being able to book online.', name: 'Sal V.', detail: 'Electrician — Fresno, CA' },
    { text: 'Stay Booked turned our slow winter into our strongest quarter ever. Didn\'t think that was possible in our market.', name: 'Larry F.', detail: 'Electrical Contractor — Chicago, IL' },
    /* Landscaping */
    { text: 'We doubled our service area and filled our entire spring schedule before the season even started. The ads look like our actual business, not some generic template.', name: 'Maria S.', detail: 'Landscaping & Hardscape — Modesto, CA' },
    { text: 'Signed 14 new lawn care contracts in March alone. That\'s recurring revenue every single month. Changed how I think about my business.', name: 'Jose G.', detail: 'Lawn Care & Landscaping — Fresno, CA' },
    { text: 'We\'re booked out for new installs through the summer. First time that\'s ever happened in 12 years running this company.', name: 'Andy B.', detail: 'Landscape Design & Install — San Diego, CA' },
    { text: 'Our photos in the ads are doing the selling for us. Stay Booked knows how to make our work look elite.', name: 'Marco V.', detail: 'Hardscape & Landscape — Los Angeles, CA' },
    { text: 'They specifically targeted homeowners with high-value properties in our area. Our average job ticket jumped by $800.', name: 'Chris W.', detail: 'Landscape Contractor — Bay Area, CA' },
    { text: 'Spring season was the best we\'ve ever had. We\'re thinking about a second location because of the demand they\'re creating.', name: 'Ray P.', detail: 'Full-Service Landscaping — Sacramento, CA' },
    { text: 'We landed a $45,000 commercial account through a lead from their campaign. One job paid for months of marketing.', name: 'Luis M.', detail: 'Commercial Landscaping — San Jose, CA' },
    { text: 'Our lawn maintenance route is full and we\'ve started a waiting list. A year ago I was worried about making payroll.', name: 'Aaron F.', detail: 'Lawn Service — Stockton, CA' },
    { text: 'They know the difference between a lead looking for a $200 cleanup and one wanting a $15,000 yard renovation. They get us the second one.', name: 'Dani R.', detail: 'Landscape Design — Orange County, CA' },
    { text: 'We\'ve had more referrals this year than ever before because we have more customers. It just snowballs in the best way.', name: 'Felix T.', detail: 'Irrigation & Landscaping — Bakersfield, CA' },
    /* Auto Repair */
    { text: 'I was skeptical. Every marketing company I\'ve talked to sounds the same. But these guys actually know my trade — they talk about ROs and service calls, not brand awareness. First month: 53 new customers.', name: 'Dave T.', detail: 'Auto Repair Shop Owner — San Diego, CA' },
    { text: 'We used to depend on Yelp. Stay Booked helped us build our own pipeline that we control. Night and day difference.', name: 'Mike S.', detail: 'Auto Repair — Sacramento, CA' },
    { text: 'My service manager noticed the phone ringing more within two weeks. We added a third lift just to handle the volume.', name: 'Omar J.', detail: 'Full-Service Auto Shop — Los Angeles, CA' },
    { text: 'Oil change specials used to drag in people who never came back. Stay Booked helps us attract customers who are loyal and do everything.', name: 'Paul D.', detail: 'Auto Repair & Tires — Phoenix, AZ' },
    { text: 'We compete with dealer service departments and chain shops. Stay Booked made us the obvious local choice online.', name: 'Tony G.', detail: 'Independent Auto Repair — San Jose, CA' },
    { text: 'Revenue is up 38% year over year since we started with them. Worth every penny and then some.', name: 'Kyle R.', detail: 'Auto Service Center — Portland, OR' },
    { text: 'They understand the auto repair customer journey. The messaging hits at exactly the right moment when someone needs us.', name: 'Mark V.', detail: 'Auto Repair — Fresno, CA' },
    { text: 'We\'re getting calls from neighborhoods we\'ve never heard from before. Our service radius has basically doubled.', name: 'Dan F.', detail: 'Transmission & General Repair — Las Vegas, NV' },
    /* General Contracting */
    { text: 'These guys don\'t just run ads — they track every lead back to a real job. I know exactly what I\'m spending and exactly what I\'m making. That kind of clarity is worth everything.', name: 'Jason L.', detail: 'General Contractor — San Jose, CA' },
    { text: 'Renovation inquiries tripled in 90 days. We had to hire two project managers just to handle the estimate workload.', name: 'Bob C.', detail: 'General Contractor — San Francisco, CA' },
    { text: 'We used to scramble between jobs. Now we have six months of projects lined up at any given time. Business feels completely different.', name: 'Steve A.', detail: 'Remodeling Contractor — Sacramento, CA' },
    { text: 'Our average project size went up because they attract customers who are serious about big renovations, not small patch jobs.', name: 'Will T.', detail: 'Home Remodeling — Bay Area, CA' },
    { text: 'Kitchen remodel leads went up 3x. Bathroom remodel leads up 2x. Every single category improved since we started.', name: 'Ryan M.', detail: 'Remodeling Specialist — Los Angeles, CA' },
    { text: 'I\'ve been in construction 20 years and Stay Booked is the first marketing partner that made me feel like my money wasn\'t being wasted.', name: 'Doug S.', detail: 'General Contractor — San Diego, CA' },
    { text: 'They helped us get featured in local articles and Google searches. Our brand credibility jumped and so did our project size.', name: 'Chris H.', detail: 'Custom Home Builder — Orange County, CA' },
    { text: 'Added $400k in annual revenue in our first year with them. I tell every contractor I know to call Stay Booked.', name: 'Frank L.', detail: 'General Contractor — Phoenix, AZ' },
    { text: 'We were losing jobs to competitors who looked more professional online. Stay Booked fixed that. Now we win the quote more often.', name: 'Tim P.', detail: 'Residential Contractor — Denver, CO' },
    { text: 'My estimator went from doing 5 quotes a week to 14. Good problem to have. Close rate stayed the same so revenue exploded.', name: 'Nate R.', detail: 'Remodeling Company — Seattle, WA' },
    /* Painting */
    { text: 'Exterior painting season is short in our market. Stay Booked helped us fill our calendar before it even started. Booked 8 weeks out by April.', name: 'Ed P.', detail: 'Painting Contractor — Portland, OR' },
    { text: 'The before/after photos in our ads do all the work. Stay Booked set up the whole system and it runs itself.', name: 'Tony C.', detail: 'Interior & Exterior Painting — Sacramento, CA' },
    { text: 'We tripled our crew size this year because of the lead volume. Couldn\'t have done that without a reliable marketing system.', name: 'Sam R.', detail: 'Residential Painter — Los Angeles, CA' },
    { text: 'Our per-job revenue went up because they target homeowners with higher budgets. Fewer cheap jobs, more premium clients.', name: 'Mike L.', detail: 'Painting Services — San Diego, CA' },
    { text: 'I was doing everything through HomeAdvisor and getting garbage leads. Stay Booked is completely different — real, exclusive leads.', name: 'Dave M.', detail: 'Painting Contractor — Denver, CO' },
    { text: 'Interior painting leads in winter were basically zero before. Stay Booked\'s campaigns changed that completely.', name: 'Ben C.', detail: 'Painting Specialist — Chicago, IL' },
    { text: 'Within 45 days we were booked three weeks out. That\'s the fastest we\'ve ever hit capacity since starting the business.', name: 'Carl S.', detail: 'Paint & Drywall — Phoenix, AZ' },
    { text: 'Our cost per lead from Stay Booked is about a third of what HomeAdvisor and Angi were charging for worse leads.', name: 'Glen T.', detail: 'Painting Contractor — Las Vegas, NV' },
    /* Pest Control */
    { text: 'Termite inspection leads are our highest-value service. Stay Booked put us right in front of that exact customer. Bookings doubled.', name: 'Al B.', detail: 'Pest Control Owner — Fresno, CA' },
    { text: 'We were getting outbid on Google by the big national companies. Stay Booked found a smarter approach and now we beat them.', name: 'Rob W.', detail: 'Pest Control — Sacramento, CA' },
    { text: 'Monthly treatment plans are up 70%. Recurring revenue is what makes this business sustainable and they understood that.', name: 'Fred S.', detail: 'Pest & Rodent Control — San Jose, CA' },
    { text: 'Mosquito season was our biggest yet because they started the campaign six weeks before season started. Perfect timing.', name: 'Jack M.', detail: 'Mosquito & Pest Control — Houston, TX' },
    { text: 'We operate in three counties and they manage separate targeted campaigns for each one. Organized and effective.', name: 'Walt C.', detail: 'Multi-County Pest Services — Central Valley, CA' },
    { text: 'Bed bug treatment calls tripled. I don\'t know how they know who to target but it works incredibly well.', name: 'Bruce T.', detail: 'Pest Control Specialist — Los Angeles, CA' },
    { text: 'Best money I spend in my business every single month. Consistent quality leads, no nonsense, great reporting.', name: 'Hank J.', detail: 'Pest & Weed Control — Phoenix, AZ' },
    { text: 'Our cancellation rate on annual contracts went way down because we\'re attracting better customers from the start.', name: 'Dave F.', detail: 'Residential Pest Control — San Diego, CA' },
    /* Pool & Spa */
    { text: 'Pool season starts earlier every year and we\'re always ready because Stay Booked has us fully booked by March.', name: 'Marco G.', detail: 'Pool Service & Repair — Phoenix, AZ' },
    { text: 'Weekly pool cleaning accounts are up 45 this year alone. Pure recurring revenue that compounds every month.', name: 'Rick A.', detail: 'Pool Cleaning — Los Angeles, CA' },
    { text: 'Repair calls doubled. Pool renovation inquiries tripled. Stay Booked targets both services perfectly.', name: 'Carl D.', detail: 'Pool & Spa Service — San Diego, CA' },
    { text: 'We had to stop taking new weekly clients mid-summer because we were at capacity. Never turned away work before.', name: 'Jeff S.', detail: 'Pool Care — Riverside, CA' },
    { text: 'Our Google ranking for pool repair went from page 3 to the top three in four months. Calls followed immediately.', name: 'Pete L.', detail: 'Pool Repair Specialist — Scottsdale, AZ' },
    { text: 'They built a landing page specifically for pool equipment replacement. That single page has generated $80k in jobs.', name: 'Tom W.', detail: 'Pool Equipment & Service — Las Vegas, NV' },
    { text: 'Stay Booked helped us package a pool opening special that books solid every spring. Consistent revenue, zero effort on our end.', name: 'Gary N.', detail: 'Pool Opening & Closing — Denver, CO' },
    /* Solar */
    { text: 'Solar leads from referrals were drying up. Stay Booked replaced that volume with paid leads that actually close at a good rate.', name: 'Alex R.', detail: 'Solar Installer — Sacramento, CA' },
    { text: 'We went from 3 installs a month to 11. The cost per installed watt on our marketing went way down.', name: 'Ben S.', detail: 'Solar Energy — San Jose, CA' },
    { text: 'Their targeting finds homeowners who already have high electric bills and are actively researching solar. These leads close fast.', name: 'Chris V.', detail: 'Residential Solar — Los Angeles, CA' },
    { text: 'Commercial solar pipeline has never been stronger. Stay Booked understands how to market a longer sales cycle.', name: 'Dan T.', detail: 'Commercial Solar — Bay Area, CA' },
    { text: 'We used to spend all our marketing budget on door-to-door. Stay Booked showed us inbound is more efficient and way less exhausting.', name: 'Mike F.', detail: 'Solar Contractor — San Diego, CA' },
    { text: 'Customer acquisition cost dropped by 44%. We\'re closing the same number of deals but spending far less to get there.', name: 'Rob J.', detail: 'Solar Installation — Phoenix, AZ' },
    /* Flooring */
    { text: 'Hardwood floor refinishing leads are up 300%. Stay Booked found a way to reach homeowners right when they\'re ready to remodel.', name: 'Nick C.', detail: 'Flooring Contractor — San Francisco, CA' },
    { text: 'We sell a premium product and their ads attract premium buyers. No more tire-kickers looking for the cheapest option.', name: 'Jen T.', detail: 'Hardwood & Tile Flooring — Sacramento, CA' },
    { text: 'LVP installation requests went through the roof this year. We\'re the go-to name in our market now.', name: 'Kevin W.', detail: 'Flooring Specialist — Los Angeles, CA' },
    { text: 'Commercial flooring contracts doubled because they helped us target property managers and new construction developers.', name: 'Mark A.', detail: 'Commercial Flooring — Bay Area, CA' },
    { text: 'Our showroom foot traffic is up 40% and most people come in saying they found us on Google. That\'s all Stay Booked.', name: 'Lisa R.', detail: 'Flooring Showroom — San Diego, CA' },
    { text: 'We used to compete on price. Now we compete on reputation and our ads reflect that. Average job size jumped $600.', name: 'Dan H.', detail: 'Premium Flooring — Orange County, CA' },
    /* Fencing */
    { text: 'Spring fencing season used to sneak up on us. Now we\'re fully booked before it starts. Deposit calendar fills in March.', name: 'Jake B.', detail: 'Fencing Contractor — Sacramento, CA' },
    { text: 'Vinyl fence installs are our highest-margin service. Stay Booked targeted exactly that job type and it shows.', name: 'Tim C.', detail: 'Fencing & Gates — Los Angeles, CA' },
    { text: 'We added commercial fencing to our services and Stay Booked had leads rolling in within two weeks of launching.', name: 'Ed V.', detail: 'Fencing Company — San Diego, CA' },
    { text: 'Our before/after fence photos in ads get incredible engagement. Stay Booked knows how to use our work as the marketing.', name: 'Ray S.', detail: 'Wood & Vinyl Fencing — Bay Area, CA' },
    { text: 'I was spending $2,000/month on mailers and getting maybe 3 leads. Same budget with Stay Booked gets 25+ leads. Not close.', name: 'Gus L.', detail: 'Fencing Specialist — Fresno, CA' },
    /* Tree Service */
    { text: 'Storm season is our Super Bowl. Stay Booked makes sure we capture every lead when people are searching urgently.', name: 'Cole T.', detail: 'Tree Service — Houston, TX' },
    { text: 'Tree removal and trimming bookings are up 55% year over year. We had to buy a new truck to keep up.', name: 'Lance M.', detail: 'Tree Removal — Sacramento, CA' },
    { text: 'We show up first when someone searches for emergency tree removal near me. That\'s worth thousands every single month.', name: 'Ron F.', detail: 'Tree & Stump Service — Portland, OR' },
    { text: 'Their local targeting is so good that we barely waste money on calls outside our service area anymore. Pure efficiency.', name: 'Dan C.', detail: 'Tree Trimming & Removal — Los Angeles, CA' },
    { text: 'Winter was our slowest season. Stay Booked changed that with a dormant trimming campaign. We stayed busy all year.', name: 'Todd R.', detail: 'Tree Service — Denver, CO' },
    /* Pressure Washing */
    { text: 'Soft wash roof cleaning is our bread and butter. Stay Booked targets that specific service and our bookings reflect it.', name: 'Mike V.', detail: 'Pressure Washing — Tampa, FL' },
    { text: 'We went from 12 jobs a week to 27. Had to bring on two more employees inside the first three months.', name: 'Sam H.', detail: 'Pressure Washing & Exterior Cleaning — Atlanta, GA' },
    { text: 'Commercial pressure washing accounts found through Stay Booked are worth 10x a residential job. Amazing targeting.', name: 'Kyle B.', detail: 'Commercial Pressure Washing — Dallas, TX' },
    { text: 'Spring driveway sealing package marketed by Stay Booked sold out in two weeks. First time that\'s ever happened.', name: 'Neil T.', detail: 'Pressure Washing — Nashville, TN' },
    { text: 'Their ads get us into HOA communities where the jobs are plentiful and the customers want premium service. Perfect fit.', name: 'Brent S.', detail: 'Exterior Cleaning Services — Phoenix, AZ' },
    /* Concrete & Hardscape */
    { text: 'Stamped concrete patio requests are through the roof since Stay Booked started running our campaigns. Best year ever.', name: 'Joe M.', detail: 'Concrete & Patio — Sacramento, CA' },
    { text: 'Driveway replacement leads doubled and our average job went from $4k to $7k because they target the right neighborhoods.', name: 'Rob A.', detail: 'Concrete Contractor — Los Angeles, CA' },
    { text: 'We added pavers to our services last year and Stay Booked had us booked two months out within six weeks. Incredible.', name: 'Pat C.', detail: 'Hardscape & Concrete — San Diego, CA' },
    { text: 'Commercial concrete jobs are up 40% because they know how to reach property developers and business owners.', name: 'Vince T.', detail: 'Commercial Concrete — Bay Area, CA' },
    { text: 'Every dollar we spend comes back multiplied. Stay Booked is the easiest business decision I\'ve ever made.', name: 'Frank B.', detail: 'Concrete & Foundation — Phoenix, AZ' },
    /* Deck & Patio */
    { text: 'Deck season lasts six months in our market. Stay Booked makes sure we\'re booked solid for all six before spring hits.', name: 'Dan W.', detail: 'Deck Builder — Seattle, WA' },
    { text: 'Composite deck installs are our highest-margin service and that\'s exactly what the leads ask for. Great targeting.', name: 'Evan R.', detail: 'Custom Decks & Patios — Portland, OR' },
    { text: 'We went from 2 deck projects a month to 8. Had to hire a full second crew to meet demand.', name: 'Tyler K.', detail: 'Deck & Pergola Builder — Denver, CO' },
    { text: 'Our photo gallery gets people excited before they even call us. Stay Booked uses that gallery as ad content masterfully.', name: 'Chad L.', detail: 'Outdoor Living & Decks — Sacramento, CA' },
    { text: 'Outdoor kitchen installs have become a major revenue line because of the leads Stay Booked generates. New service, instant demand.', name: 'Cole N.', detail: 'Deck & Outdoor Kitchen — Las Vegas, NV' },
    /* Window, Gutter & Misc */
    { text: 'Gutter cleaning and gutter guard install is our most profitable season. Stay Booked makes sure we own it every fall.', name: 'Zach P.', detail: 'Gutter Services — Portland, OR' },
    { text: 'Window cleaning schedule fills up two weeks faster than it used to. We don\'t do any other advertising anymore.', name: 'Steve L.', detail: 'Window Cleaning — Bay Area, CA' },
    { text: 'Handyman services are competitive everywhere. Stay Booked got us to the top and we\'ve stayed there for eight months.', name: 'Bob H.', detail: 'Handyman Services — Sacramento, CA' },
    { text: 'Garage door repair and replacement calls are steady and predictable now. Used to be all feast or famine.', name: 'Joe R.', detail: 'Garage Door Service — Phoenix, AZ' },
    { text: 'We\'re a moving company and summer is our peak. Stay Booked had us at capacity every weekend from May through September.', name: 'Marcus T.', detail: 'Moving Company — Los Angeles, CA' },
    { text: 'Carpet cleaning accounts we got through Stay Booked turn into long-term customers. Retention rate is incredible.', name: 'Ken B.', detail: 'Carpet Cleaning — San Diego, CA' },
    { text: 'Appliance repair is a competitive space. They found the exact Google search moment when customers need us most. Calls are up 90%.', name: 'Walt F.', detail: 'Appliance Repair — Sacramento, CA' },
    { text: 'Chimney sweep and inspection calls go up every October. Stay Booked starts the campaign in September so we\'re first in line.', name: 'Russ C.', detail: 'Chimney & Fireplace Services — Chicago, IL' },
    { text: 'Locksmith calls doubled, commercial lock installs tripled. Both services grew because of smart, targeted campaigns.', name: 'Abe S.', detail: 'Locksmith — Las Vegas, NV' },
    { text: 'Tile and grout cleaning seems like a niche service. Stay Booked proved there\'s huge demand if you get in front of people right.', name: 'Ivan R.', detail: 'Tile Cleaning & Restoration — Los Angeles, CA' },
    /* Final block — extra variety */
    { text: 'I\'ve never had a marketing partner that actually worried about my ROI as much as I do. Stay Booked genuinely cares about results.', name: 'Shane W.', detail: 'Contractor — Sacramento, CA' },
    { text: 'We tried Facebook ads, we tried mailers, we tried Yelp. Nothing compared to what Stay Booked does with Google. Not even close.', name: 'Craig V.', detail: 'Service Business Owner — San Diego, CA' },
    { text: 'The fact that they only work with contractors is what sold me. They\'re not trying to figure out my industry — they already know it.', name: 'Brad T.', detail: 'Trade Contractor — Phoenix, AZ' },
    { text: 'Our busy season got 40% busier and our slow season barely exists anymore. That\'s the magic of having the right marketing system.', name: 'Glen A.', detail: 'Contractor — Denver, CO' },
    { text: 'I send them my job photos and they turn them into compelling ads within 24 hours. The process is so smooth it feels effortless.', name: 'Neil K.', detail: 'Specialty Contractor — Bay Area, CA' },
    { text: 'We scaled from $800k to $1.4M in annual revenue in 18 months. Marketing was the variable that changed. Stay Booked is that marketing.', name: 'Carl F.', detail: 'Remodeling Company — Los Angeles, CA' },
    { text: 'My phone never stops. I used to worry about where the next job was coming from. That anxiety is completely gone now.', name: 'Vince R.', detail: 'Service Contractor — Fresno, CA' },
    { text: 'Every report they send is clear and honest. Good months and learning months — they show me both and explain what they\'re adjusting.', name: 'Stan M.', detail: 'Multi-Service Contractor — Seattle, WA' },
    { text: 'The biggest thing Stay Booked gave us wasn\'t just leads — it was predictability. Knowing the phone will ring changes how you run a business.', name: 'Ty B.', detail: 'Trades Business Owner — Austin, TX' },
    { text: 'Referred them to two other contractors I know. Both are getting the same results I am. I tell everyone who asks about marketing.', name: 'Walt S.', detail: 'Contractor — Nashville, TN' }
  ];

  /* ── Build cards × 2 for seamless infinite loop ── */
  var marquee = document.getElementById('tcMarquee');
  if (!marquee) return;

  function makeCard(r) {
    var card = document.createElement('article');
    card.className = 'testimonial-card';
    card.innerHTML =
      '<div class="testimonial-quote-mark" aria-hidden="true">\u201c</div>' +
      '<blockquote class="testimonial-text">' + r.text + '</blockquote>' +
      '<div class="testimonial-stars" aria-label="5 stars">\u2605\u2605\u2605\u2605\u2605</div>' +
      '<footer class="testimonial-author">' +
        '<strong class="testimonial-name">' + r.name + '</strong>' +
        '<span class="testimonial-detail">' + r.detail + '</span>' +
      '</footer>';
    return card;
  }

  var frag = document.createDocumentFragment();
  /* Set A + Set B — animating to -50% lands back at the start of Set A */
  reviews.forEach(function (r) { frag.appendChild(makeCard(r)); });
  reviews.forEach(function (r) { frag.appendChild(makeCard(r)); });
  marquee.appendChild(frag);
})();

/* ============================================================
   8. SMOOTH SCROLL for nav links (polyfill for browsers
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
