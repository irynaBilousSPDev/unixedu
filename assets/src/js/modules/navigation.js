window.initNavigation = function initNavigation() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  if (header.dataset.navigationInitialized === 'true') return;
  header.dataset.navigationInitialized = 'true';

  const toggle = header.querySelector('.site-header__toggle');
  const panel = document.getElementById('site-navigation');

  if (!toggle || !panel) return;

  const BODY_OPEN_CLASS = 'is-navigation-open';
  const submenuItems = panel.querySelectorAll('.site-header__panel-menu > .menu-item-has-children');

  function isOpen() {
    return document.body.classList.contains(BODY_OPEN_CLASS);
  }

  function setExpanded(expanded) {
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  function setSubmenuOpen(item, open) {
    item.classList.toggle('is-submenu-open', open);
    const button = item.querySelector(':scope > .site-header__submenu-toggle');
    if (!button) return;
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    const label = button.querySelector('.visually-hidden');
    if (label) {
      label.textContent = open ? 'Close submenu' : 'Open submenu';
    }
  }

  function closeSubmenus() {
    submenuItems.forEach((item) => setSubmenuOpen(item, false));
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
    closeSubmenus();
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

  submenuItems.forEach((item) => {
    const link = item.querySelector(':scope > a');
    const submenu = item.querySelector(':scope > .sub-menu');
    const button = item.querySelector(':scope > .site-header__submenu-toggle');
    if (!link || !submenu || !button) return;

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !item.classList.contains('is-submenu-open');
      closeSubmenus();
      if (willOpen) setSubmenuOpen(item, true);
    });

    link.addEventListener('click', (event) => {
      if (item.classList.contains('is-submenu-open')) return;
      event.preventDefault();
      closeSubmenus();
      setSubmenuOpen(item, true);
    });
  });
};
