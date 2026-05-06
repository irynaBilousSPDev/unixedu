function init() {
  if (typeof window.initNavigation === 'function') window.initNavigation();
  if (typeof window.initAccordions === 'function') window.initAccordions();
  if (typeof window.initCounters === 'function') window.initCounters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

