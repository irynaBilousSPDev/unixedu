window.initLogoMarquee = function initLogoMarquee() {
  const blocks = Array.from(document.querySelectorAll('.unixedu-logo-marquee'));
  if (!blocks.length) return;

  function ensureCloned(track) {
    if (!track || track.dataset.cloned === 'true') return;
    const originals = Array.from(track.children);
    if (originals.length < 2) return;

    originals.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      // Prevent cloned links from being focusable/clickable.
      const link = clone.querySelector('a');
      if (link) {
        link.setAttribute('tabindex', '-1');
        link.setAttribute('aria-hidden', 'true');
        link.addEventListener('click', (e) => e.preventDefault());
      }
      track.appendChild(clone);
    });

    track.dataset.cloned = 'true';
  }

  function removeClones(track) {
    if (!track || track.dataset.cloned !== 'true') return;
    const children = Array.from(track.children);
    const half = Math.floor(children.length / 2);
    // Remove the second half (clones).
    for (let i = children.length - 1; i >= half; i--) {
      track.removeChild(children[i]);
    }
    track.dataset.cloned = 'false';
  }

  function updateBlock(block) {
    const viewport = block.querySelector('.unixedu-logo-marquee__viewport');
    const track = block.querySelector('.unixedu-logo-marquee__track');
    if (!viewport || !track) return;

    // Measure using original items only.
    removeClones(track);
    const viewportWidth = viewport.clientWidth;
    const trackWidth = track.scrollWidth;
    const shouldMarquee = trackWidth > viewportWidth + 2;

    block.classList.toggle('unixedu-logo-marquee--marquee', shouldMarquee);
    block.classList.toggle('unixedu-logo-marquee--static', !shouldMarquee);

    if (shouldMarquee) {
      ensureCloned(track);
    }
  }

  function updateAll() {
    blocks.forEach(updateBlock);
  }

  // Initial measure (after images load).
  if (document.readyState === 'complete') {
    updateAll();
  } else {
    window.addEventListener('load', updateAll, { once: true });
  }

  // Re-measure on resize.
  let raf = 0;
  window.addEventListener('resize', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateAll);
  });
};

