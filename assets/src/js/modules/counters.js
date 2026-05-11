function parseCounterValue(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return null;

  // Extract first numeric token (supports "9,999+", "12000+", "50", "70%").
  // Do not allow spaces inside the token — otherwise "14 days" becomes "14 " + "days" and the space is lost.
  const match = trimmed.match(/(\d[\d,.]*)/);
  if (!match) return null;

  const numberToken = match[1];
  const suffix = trimmed.slice(match.index + numberToken.length);
  const digitsOnly = numberToken.replace(/[^\d]/g, '');
  const target = digitsOnly ? Number(digitsOnly) : NaN;
  if (!Number.isFinite(target)) return null;

  return { target, suffix };
}

function formatInteger(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el, { target, suffix }, { durationMs = 1200 } = {}) {
  if (!el || el.dataset.unixeduCounterAnimated === '1') return;
  el.dataset.unixeduCounterAnimated = '1';

  const start = 0;
  const startTs = performance.now();

  // Start from 0 on first reveal.
  el.textContent = `${formatInteger(0)}${suffix || ''}`;

  function step(now) {
    const t = Math.min(1, (now - startTs) / durationMs);
    const eased = easeOutCubic(t);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = `${formatInteger(current)}${suffix || ''}`;

    if (t < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
}

window.initCounters = function initCounters() {
  const els = Array.from(document.querySelectorAll('[data-unixedu-counter]'));
  if (!els.length) return;

  const items = els
    .map((el) => {
      const parsed = parseCounterValue(el.getAttribute('data-unixedu-counter') || el.textContent);
      return parsed ? { el, parsed } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(({ el, parsed }) => animateCounter(el, parsed, { durationMs: 1000 }));
    return;
  }

  // If page loads with counters already visible (reload / restored scroll), animate immediately.
  // Run after layout settles to avoid false negatives.
  window.setTimeout(() => {
    items.forEach(({ el, parsed }) => {
      if (el.dataset.unixeduCounterAnimated === '1') return;
      if (isInViewport(el)) animateCounter(el, parsed);
    });
  }, 60);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const parsed = items.find((i) => i.el === el)?.parsed;
        if (parsed) {
          // Slight delay so it starts a bit after the section appears.
          window.setTimeout(() => animateCounter(el, parsed), 160);
        }
        io.unobserve(el);
      });
    },
    // Trigger when element is near the bottom of the viewport.
    { threshold: 0.15, rootMargin: '0px 0px -70% 0px' }
  );

  items.forEach(({ el }) => io.observe(el));
};

