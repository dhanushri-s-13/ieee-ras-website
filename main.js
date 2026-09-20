// ============================================================
// IEEE RAS — "Engineering in Motion" interaction layer
// Vanilla JS, no build step. Sections: boot sequence, custom
// cursor, magnetic buttons, nav/scroll behavior, scroll
// indicator, reveal system, domain modules, signal pipeline,
// schematic (digital-twin-lite), FAQ, ambient particle field.
// Everything respects prefers-reduced-motion.
// ============================================================

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------- BOOT SEQUENCE ---------------- */
(function () {
  var screen = document.getElementById('boot-screen');
  if (!screen) return;
  var lines = screen.querySelectorAll('.boot-line');
  var bar = screen.querySelector('.boot-progress-bar');
  document.body.style.overflow = 'hidden';

  function finish() {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(function () { screen.remove(); }, 500);
  }

  if (reduceMotion) {
    lines.forEach(function (l) { l.classList.add('shown'); });
    if (bar) bar.style.width = '100%';
    setTimeout(finish, 400);
    return;
  }

  var i = 0;
  function nextLine() {
    if (i < lines.length) {
      lines[i].classList.add('shown');
      if (bar) bar.style.width = Math.round(((i + 1) / lines.length) * 100) + '%';
      i++;
      setTimeout(nextLine, 260);
    } else {
      setTimeout(finish, 350);
    }
  }
  setTimeout(nextLine, 200);
})();

/* ---------------- CUSTOM CURSOR ---------------- */
(function () {
  if (!hasFinePointer) return;
  document.documentElement.classList.add('has-custom-cursor');
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  window.addEventListener('mousemove', function (e) {
    dot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    ring.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
  });

  var interactiveSelector = 'a, button, .domain-module, .twin-node, .signal-stage, input, textarea';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      ring.classList.add('is-active');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      ring.classList.remove('is-active');
    }
  });
})();

/* ---------------- MAGNETIC BUTTONS ---------------- */
(function () {
  if (!hasFinePointer || reduceMotion) return;
  document.querySelectorAll('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2);
      var y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = 'translate(' + (x * 0.18) + 'px,' + (y * 0.28) + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });
})();

/* ---------------- NAV: scroll state + mobile menu ---------------- */
var siteHeader = document.querySelector('header');
function updateHeaderState() {
  if (!siteHeader) return;
  if (window.scrollY > 40) siteHeader.classList.add('scrolled');
  else siteHeader.classList.remove('scrolled');
}
window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

var navToggle = document.getElementById('navToggle');
var mobileMenu = document.getElementById('mobile-menu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', function () { mobileMenu.classList.add('open'); });
  mobileMenu.querySelectorAll('a, .mobile-menu-close').forEach(function (el) {
    el.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
  });
}

/* ---------------- SCROLL PROGRESS BAR ---------------- */
var scrollBar = document.getElementById('scroll-bar');
function updateScrollBar() {
  if (!scrollBar) return;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var pct = docHeight > 0 ? window.scrollY / docHeight : 0;
  scrollBar.style.transform = 'scaleX(' + pct + ')';
}
window.addEventListener('scroll', updateScrollBar, { passive: true });
updateScrollBar();

/* ---------------- SCROLL INDICATOR (numbered) ---------------- */
(function () {
  var numEl = document.querySelector('.scroll-indicator-num');
  var fillEl = document.querySelector('.scroll-indicator-fill');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main > section'));
  if (!numEl || !sections.length) return;

  function onScroll() {
    var mid = window.scrollY + window.innerHeight * 0.4;
    var idx = 0;
    sections.forEach(function (sec, i) {
      if (sec.offsetTop <= mid) idx = i;
    });
    numEl.textContent = String(idx + 1).padStart(2, '0');
    if (fillEl) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      fillEl.style.height = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------------- REVEAL SYSTEM ---------------- */
var revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add('is-visible'); });
}

/* ---------------- ANIMATED GLANCE COUNTERS ---------------- */
var counters = document.querySelectorAll('[data-target]');
function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-target'), 10) || 0;
  var suffix = el.getAttribute('data-suffix') || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  var startTime = null, duration = 1100;
  function step(ts) {
    if (startTime === null) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}
if ('IntersectionObserver' in window && counters.length) {
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { counterObserver.observe(el); });
}

/* ---------------- DOMAIN MODULES ---------------- */
document.querySelectorAll('.domain-module').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var isActive = btn.classList.contains('active');
    document.querySelectorAll('.domain-module.active').forEach(function (m) { m.classList.remove('active'); m.setAttribute('aria-expanded', 'false'); });
    if (!isActive) { btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
  });
});

/* ---------------- SIGNAL PIPELINE ---------------- */
(function () {
  var stages = document.querySelectorAll('.signal-stage');
  var dot = document.querySelector('.signal-dot');
  var inputEl = document.getElementById('signal-input');
  var processEl = document.getElementById('signal-process');
  var outputEl = document.getElementById('signal-output');
  var techEl = document.getElementById('signal-tech');
  if (!stages.length) return;

  function setActive(stage, index) {
    stages.forEach(function (s) { s.classList.remove('active'); s.setAttribute('aria-selected', 'false'); });
    stage.classList.add('active');
    stage.setAttribute('aria-selected', 'true');
    if (dot) dot.style.left = (index / (stages.length - 1)) * 100 + '%';
    if (inputEl) inputEl.textContent = stage.getAttribute('data-input') || '';
    if (processEl) processEl.textContent = stage.getAttribute('data-process') || '';
    if (outputEl) outputEl.textContent = stage.getAttribute('data-output') || '';
    if (techEl) techEl.textContent = 'TECHNOLOGIES: ' + (stage.getAttribute('data-tech') || '');
  }
  stages.forEach(function (stage, index) {
    stage.addEventListener('click', function () { setActive(stage, index); });
  });
  setActive(stages[0], 0);
})();

/* ---------------- SCHEMATIC (digital-twin-lite) ---------------- */
(function () {
  var nodes = document.querySelectorAll('.twin-node');
  var titleEl = document.getElementById('schematic-title');
  var descEl = document.getElementById('schematic-desc');
  if (!nodes.length) return;

  function setActive(node) {
    nodes.forEach(function (n) { n.classList.remove('active'); });
    node.classList.add('active');
    if (titleEl) titleEl.textContent = node.getAttribute('data-title') || '';
    if (descEl) descEl.textContent = node.getAttribute('data-desc') || '';
  }
  nodes.forEach(function (node) {
    node.addEventListener('click', function () { setActive(node); });
  });
  setActive(nodes[0]);
})();

/* ---------------- FAQ ACCORDION ---------------- */
document.querySelectorAll('.faq-question').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.closest('.faq-item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (openItem) { openItem.classList.remove('open'); });
    if (!wasOpen) item.classList.add('open');
  });
});

/* ---------------- AMBIENT PARTICLE FIELD ---------------- */
(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w, h, particles;
  var COUNT = 50;
  var COLORS = ['255,122,26', '52,224,255'];
  var mouse = { x: -9999, y: -9999 };

  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  function makeParticles() {
    particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, c: COLORS[i % 2] });
    }
  }
  if (hasFinePointer) {
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var dxm = p.x - mouse.x, dym = p.y - mouse.y;
      var dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 130) { var f = (130 - dm) / 130 * 0.04; p.vx += (dxm / (dm || 1)) * f; p.vy += (dym / (dm || 1)) * f; }
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = 'rgba(' + p.c + ',' + (0.1 * (1 - dist / 130)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(' + p.c + ',0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  resize(); makeParticles();
  window.addEventListener('resize', function () { resize(); makeParticles(); });
  frame();
})();
   
