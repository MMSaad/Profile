/* =====================================================================
   Mustafa Saad — profile interactions
   Vanilla JS, zero dependencies. Every effect degrades safely.
   ===================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ---------- 1. Theme -------------------------------------------- */
  var root = document.documentElement;

  function readStored() {
    try { return localStorage.getItem('ms-theme'); } catch (e) { return null; }
  }
  function store(v) {
    try { localStorage.setItem('ms-theme', v); } catch (e) {/* private mode */ }
  }
  function systemDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  var saved = readStored();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store(next);
      toggle.setAttribute('aria-label', 'Switch to ' + (next === 'dark' ? 'light' : 'dark') + ' theme');
    });
  }

  /* ---------- 2. Scroll progress + nav state ----------------------- */
  var bar = document.querySelector('.progress');
  var sections = [].slice.call(document.querySelectorAll('section[id]'));
  var navLinks = [].slice.call(document.querySelectorAll('.nav__links a'));
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (bar) bar.style.width = p + '%';

      var y = window.scrollY + window.innerHeight * 0.32;
      var active = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= y) active = sections[i].id;
      }
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Mobile menu -------------------------------------- */
  var inner = document.querySelector('.nav__inner');
  var burger = document.querySelector('.nav__burger');
  if (burger && inner) {
    burger.addEventListener('click', function () {
      var open = inner.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.forEach(function (a) {
      a.addEventListener('click', function () {
        inner.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!inner.contains(e.target)) {
        inner.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 4. Reveal on scroll (staggered) ---------------------- */
  var revealables = [].slice.call(document.querySelectorAll('.rv'));

  if (!('IntersectionObserver' in window) || reduced) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // auto-stagger siblings that share a parent
    var groups = new Map();
    revealables.forEach(function (el) {
      var key = el.parentElement;
      if (!groups.has(key)) groups.set(key, 0);
      var i = groups.get(key);
      if (!el.style.getPropertyValue('--d')) {
        el.style.setProperty('--d', Math.min(i * 80, 480) + 'ms');
      }
      groups.set(key, i + 1);
      io.observe(el);
    });
  }

  /* ---------- 5. Counters ----------------------------------------- */
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var dur = 1500;

    if (reduced) {
      el.textContent = prefix + target.toFixed(dec) + suffix;
      return;
    }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var v = target * easeOutExpo(t);
      el.textContent = prefix + v.toFixed(dec) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCount);
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCount(e.target);
        cio.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- 6. Typing headline ----------------------------------- */
  var roleEl = document.querySelector('.hero__role .typed');
  if (roleEl) {
    var phrases = JSON.parse(roleEl.dataset.phrases || '[]');
    if (reduced || !phrases.length) {
      roleEl.textContent = phrases[0] || '';
    } else {
      var pi = 0, ci = 0, deleting = false;
      (function tick() {
        var full = phrases[pi];
        ci += deleting ? -1 : 1;
        roleEl.textContent = full.slice(0, ci);
        var wait = deleting ? 34 : 62;
        if (!deleting && ci === full.length) { deleting = true; wait = 1900; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; wait = 320; }
        setTimeout(tick, wait);
      })();
    }
  }

  /* ---------- 7. Pointer tilt + edge glow -------------------------- */
  if (fine && !reduced) {
    document.body.classList.add('has-pointer');
    [].slice.call(document.querySelectorAll('.tilt')).forEach(function (card) {
      var raf = null;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--px', (x / r.width) * 100 + '%');
        card.style.setProperty('--py', (y / r.height) * 100 + '%');
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var rx = ((y / r.height) - 0.5) * -5;
          var ry = ((x / r.width) - 0.5) * 5;
          card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-6px)';
          raf = null;
        });
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });

    /* cursor spotlight */
    var spotRaf = null, mx = 0, my = 0;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(function () {
        root.style.setProperty('--mx', mx + 'px');
        root.style.setProperty('--my', my + 'px');
        spotRaf = null;
      });
    }, { passive: true });
  }

  /* ---------- 8. Smooth anchors (offset for the floating nav) ------ */
  [].slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ---------- 9. Marquee: duplicate track for a seamless loop ------ */
  var track = document.querySelector('.marquee__track');
  if (track && !reduced) {
    track.appendChild(track.firstElementChild.cloneNode(true));
  }

  /* ---------- 10. Year ------------------------------------------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
