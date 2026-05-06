window.initNavigation = function initNavigation() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  if (header.dataset.navigationInitialized === 'true') return;
  header.dataset.navigationInitialized = 'true';

  const toggle = header.querySelector('.site-header__toggle');
  const panel = document.getElementById('site-navigation');

  if (!toggle || !panel) return;

  const BODY_OPEN_CLASS = 'is-navigation-open';

  function isOpen() {
    return document.body.classList.contains(BODY_OPEN_CLASS);
  }

  function setExpanded(expanded) {
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function openMenu() {
    if (isOpen()) return;
    document.body.classList.add(BODY_OPEN_CLASS);
    panel.hidden = false;
    setExpanded(true);
  }

  function closeMenu() {
    if (!isOpen()) return;
    document.body.classList.remove(BODY_OPEN_CLASS);
    panel.hidden = true;
    setExpanded(false);
  }

  function toggleMenu() {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    toggleMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeMenu();
    toggle.focus();
  });

  document.addEventListener('click', (event) => {
    if (!isOpen()) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (header.contains(target)) return;
    closeMenu();
  });
};

