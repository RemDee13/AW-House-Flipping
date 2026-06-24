/* Ashwood Revival — site chrome: nav, counters, reveals, form, ribbon */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* portfolio ribbon dismiss */
  var ribbon = document.getElementById('ribbon');
  var ribbonClose = document.getElementById('ribbon-close');
  if (ribbon && ribbonClose) {
    if (sessionStorage.getItem('aw-ribbon') === 'closed') ribbon.hidden = true;
    ribbonClose.addEventListener('click', function () {
      ribbon.hidden = true;
      try { sessionStorage.setItem('aw-ribbon', 'closed'); } catch (e) {}
    });
  }

  /* nav: shrink on scroll + mobile menu */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('nav-burger');
  var menu = document.getElementById('nav-menu');
  function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* animated counters */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function animate(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var dur = 1400, start = null;
    if (reduce) { el.textContent = prefix + target.toLocaleString('en-US') + suffix; return; }
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* scroll-in reveals + counter trigger */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target.hasAttribute('data-count')) animate(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.25 }) : null;

  if (io) {
    counters.forEach(function (c) { io.observe(c); });
    [].slice.call(document.querySelectorAll('.reveal-up')).forEach(function (el) { io.observe(el); });
  } else {
    counters.forEach(animate);
  }

  /* contact form (Formspree if configured, else mailto fallback) */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var endpoint = form.getAttribute('action') || '';
      var status = document.getElementById('form-status');
      if (!endpoint || endpoint.indexOf('formspree.io/f/REPLACE') !== -1) {
        // no backend configured -> mailto fallback
        e.preventDefault();
        var data = new FormData(form);
        var body = 'Name: ' + (data.get('name') || '') + '\nEmail: ' + (data.get('email') || '') +
          '\nProperty: ' + (data.get('property') || '') + '\n\n' + (data.get('message') || '');
        window.location.href = 'mailto:hello@ashwoodrevival.example?subject=Estimate%20request&body=' + encodeURIComponent(body);
        if (status) status.textContent = 'Opening your email app…';
        return;
      }
      // real Formspree async submit
      e.preventDefault();
      if (status) status.textContent = 'Sending…';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { form.reset(); if (status) status.textContent = 'Thanks — we’ll be in touch within one business day.'; }
          else if (status) status.textContent = 'Something went wrong. Email us at hello@ashwoodrevival.example.';
        })
        .catch(function () { if (status) status.textContent = 'Network error. Please email us directly.'; });
    });
  }
})();
