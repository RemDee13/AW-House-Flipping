/* Ashwood Revival — signature reveal interaction
 * - Cursor-following circular mask reveals the OLD house under the NEW one.
 * - Pulsing hotspots pin the spotlight to an element and open the info panel.
 * - Keyboard + touch friendly, respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  var stage   = document.getElementById('hero-stage');
  var newImg  = document.getElementById('house-new');
  var layer   = document.getElementById('hotspot-layer');
  var panel   = document.getElementById('info-panel');
  var hintEl  = document.getElementById('reveal-hint');
  var toggle  = document.getElementById('reveal-all');
  if (!stage || !newImg || !layer || !panel) return;

  var HOTSPOTS = window.AW_HOTSPOTS || [];
  var DEFAULT_R = 150, FOCUS_R = 195;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var lockId = null, hoverId = null, freeze = false, interacted = false;
  var last = { x: 0, y: 0 };
  var rafPending = false;

  var GRAND_TOTAL = HOTSPOTS.reduce(function (s, h) { return s + h.cost; }, 0);
  var fmt = function (n) { return '$' + n.toLocaleString('en-US'); };

  /* ---------- spotlight ---------- */
  function setSpot(x, y, r) {
    newImg.style.setProperty('--x', x + 'px');
    newImg.style.setProperty('--y', y + 'px');
    newImg.style.setProperty('--r', r + 'px');
  }
  function rectOf() { return stage.getBoundingClientRect(); }
  function centerOf(h) {
    var r = rectOf();
    return { x: h.x / 100 * r.width, y: h.y / 100 * r.height };
  }
  function activeId() { return lockId || hoverId; }

  /* ---------- info panel ---------- */
  function panelDefault() {
    panel.innerHTML =
      '<div class="panel-head">' +
        '<p class="panel-eyebrow">The transformation</p>' +
        '<h3 class="panel-title">Hover the house</h3>' +
      '</div>' +
      '<p class="panel-lede">Drag your cursor across the home to peel back the renovation and see the wreck we started with. Tap a glowing point to inspect each repair.</p>' +
      '<ul class="panel-legend">' +
        '<li><span class="legend-dot before"></span>Before — storm-damaged &amp; derelict</li>' +
        '<li><span class="legend-dot after"></span>After — fully restored</li>' +
      '</ul>' +
      '<div class="panel-total"><span>Total invested in this flip</span><strong>' + fmt(GRAND_TOTAL) + '</strong></div>';
  }
  function panelFor(h) {
    var list = h.work.map(function (w) {
      return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>' + w + '</li>';
    }).join('');
    panel.innerHTML =
      '<button class="panel-close" type="button" aria-label="Close details">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="panel-head">' +
        '<p class="panel-eyebrow">Restored element</p>' +
        '<h3 class="panel-title">' + h.label + '</h3>' +
      '</div>' +
      '<div class="panel-before"><span class="tag tag-before">Before</span><p>' + h.before + '</p></div>' +
      '<div class="panel-after"><span class="tag tag-after">What we did</span><ul class="panel-work">' + list + '</ul></div>' +
      '<div class="panel-cost"><span>Cost of this repair</span><strong>' + fmt(h.cost) + '</strong></div>';
    var x = panel.querySelector('.panel-close');
    if (x) x.addEventListener('click', function () { release(true); });
  }

  /* ---------- render ---------- */
  function render() {
    var id = activeId();
    var btns = layer.querySelectorAll('.hotspot');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].dataset.id === id;
      btns[i].classList.toggle('is-active', on);
      btns[i].setAttribute('aria-pressed', btns[i].dataset.id === lockId ? 'true' : 'false');
    }
    if (id) {
      var h = byId(id), c = centerOf(h);
      freeze = true;
      stage.classList.add('has-active');
      setSpot(c.x, c.y, FOCUS_R);
      panelFor(h);
    } else {
      freeze = false;
      stage.classList.remove('has-active');
      setSpot(last.x, last.y, DEFAULT_R);
      panelDefault();
    }
  }
  function byId(id) { for (var i = 0; i < HOTSPOTS.length; i++) if (HOTSPOTS[i].id === id) return HOTSPOTS[i]; }
  function release(focusBack) {
    var prev = lockId;
    lockId = null; hoverId = null; render();
    if (focusBack && prev) { var b = layer.querySelector('[data-id="' + prev + '"]'); if (b) b.focus(); }
  }

  /* ---------- pointer ---------- */
  function onMove(e) {
    var r = rectOf();
    last.x = e.clientX - r.left;
    last.y = e.clientY - r.top;
    markInteracted();
    if (!freeze && !rafPending) {
      rafPending = true;
      requestAnimationFrame(function () { rafPending = false; if (!freeze) setSpot(last.x, last.y, DEFAULT_R); });
    }
  }
  function markInteracted() {
    if (interacted) return;
    interacted = true;
    stage.classList.add('touched');
    if (idleRAF) cancelAnimationFrame(idleRAF);
  }

  stage.addEventListener('pointermove', onMove, { passive: true });
  stage.addEventListener('pointerdown', function (e) {
    if (!e.target.closest('.hotspot')) release(false);
  });
  window.addEventListener('resize', function () { if (activeId()) render(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') release(true); });

  /* ---------- build hotspots ---------- */
  HOTSPOTS.forEach(function (h) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'hotspot';
    b.dataset.id = h.id;
    b.style.left = h.x + '%';
    b.style.top = h.y + '%';
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', h.label + ' — see before and after, ' + fmt(h.cost));
    b.innerHTML =
      '<span class="hotspot-pulse" aria-hidden="true"></span>' +
      '<span class="hotspot-dot" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + h.icon + '</svg></span>' +
      '<span class="hotspot-tip">' + h.label + '</span>';

    b.addEventListener('pointerenter', function () { if (!lockId) { hoverId = h.id; render(); } });
    b.addEventListener('pointerleave', function () { if (hoverId === h.id) { hoverId = null; render(); } });
    b.addEventListener('focus', function () { if (!lockId) { hoverId = h.id; render(); } });
    b.addEventListener('blur', function () { if (hoverId === h.id) { hoverId = null; render(); } });
    b.addEventListener('click', function (e) {
      e.preventDefault(); markInteracted();
      lockId = (lockId === h.id) ? null : h.id;
      hoverId = null; render();
    });
    layer.appendChild(b);
  });

  /* ---------- reveal-all toggle ---------- */
  if (toggle) {
    toggle.addEventListener('click', function () {
      var on = stage.classList.toggle('reveal-all');
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      toggle.querySelector('.toggle-label').textContent = on ? 'Show the after' : 'Reveal the before';
      markInteracted();
    });
  }

  /* ---------- idle hint drift ---------- */
  var idleRAF = null, t0 = null;
  function idle(ts) {
    if (interacted) return;
    if (t0 === null) t0 = ts;
    var t = (ts - t0) / 1000;
    var r = rectOf();
    var x = r.width * (0.5 + 0.22 * Math.sin(t * 0.9));
    var y = r.height * (0.55 + 0.16 * Math.sin(t * 0.6 + 1));
    last.x = x; last.y = y;
    setSpot(x, y, DEFAULT_R);
    idleRAF = requestAnimationFrame(idle);
  }

  /* ---------- init ---------- */
  function init() {
    var r = rectOf();
    last.x = r.width / 2; last.y = r.height * 0.55;
    setSpot(last.x, last.y, reduce ? 240 : DEFAULT_R);
    panelDefault();
    if (!reduce) idleRAF = requestAnimationFrame(idle);
    else stage.classList.add('touched'); // static, no auto-drift
    // hide the hint once the user engages
    ['pointerdown', 'pointermove', 'touchstart', 'keydown'].forEach(function (ev) {
      stage.addEventListener(ev, function () { if (hintEl) hintEl.classList.add('is-hidden'); }, { once: true, passive: true });
    });
  }
  init();
})();
