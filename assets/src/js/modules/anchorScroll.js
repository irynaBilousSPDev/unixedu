/**
 * Smooth scroll to #fragment for same-page links and after cross-page navigation.
 * Works with uniXedu block ids (e.g. #unixedu-hero-p42-i1) and any element id.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollToFragmentId(fragment, useSmooth) {
  if (!fragment) {
    return false;
  }
  const id = decodeURIComponent(fragment);
  const el = document.getElementById(id);
  if (!el) {
    return false;
  }
  const smooth = Boolean(useSmooth) && !prefersReducedMotion();
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  return true;
}

function initAnchorScroll() {
  const initialHash = window.location.hash;
  if (initialHash && initialHash.length > 1) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToFragmentId(initialHash.slice(1), true);
      });
    });
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target && event.target.closest ? event.target.closest('a[href*="#"]') : null;
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
      return;
    }
    const hrefAttr = anchor.getAttribute('href');
    if (!hrefAttr || hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:') || hrefAttr.startsWith('javascript:')) {
      return;
    }

    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (_) {
      return;
    }

    if (url.origin !== window.location.origin) {
      return;
    }
    if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
      return;
    }

    const fragment = url.hash ? url.hash.slice(1) : '';
    if (!fragment) {
      return;
    }

    if (scrollToFragmentId(fragment, true)) {
      event.preventDefault();
      if (window.history && typeof window.history.pushState === 'function') {
        window.history.pushState(null, '', url.hash);
      }
    }
  });
}

window.initAnchorScroll = initAnchorScroll;
