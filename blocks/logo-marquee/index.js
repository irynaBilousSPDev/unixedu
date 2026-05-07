(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
  const { PanelBody, SelectControl, TextControl, Button, ButtonGroup } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light gray (#F5F5F5)', value: 'light-gray' },
    { label: 'Black', value: 'black' },
  ];

  function normalizeBg(v) {
    const x = String(v || '');
    return ['white', 'light-gray', 'black'].includes(x) ? x : 'white';
  }

  function sanitizeLogo(logo) {
    if (!logo || typeof logo !== 'object') return null;
    const id = Number.isFinite(Number(logo.id)) ? Number(logo.id) : 0;
    const url = String(logo.url || '');
    if (!url) return null;
    return {
      id,
      url,
      alt: String(logo.alt || ''),
      linkUrl: String(logo.linkUrl || ''),
    };
  }

  registerBlockType('unixedu/logo-marquee', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const bg = normalizeBg(attrs.background);
      const logos = Array.isArray(attrs.logos) ? attrs.logos.map(sanitizeLogo).filter(Boolean) : [];

      const staticBase =
        (window.unixeduTheme && typeof window.unixeduTheme.staticBase === 'string' && window.unixeduTheme.staticBase) || '';

      const DEFAULT_STATIC_LOGOS = staticBase
        ? [
            { id: 0, url: `${staticBase}images/logo-marquee/oxford.png`, alt: 'University of Oxford', linkUrl: '' },
            { id: 0, url: `${staticBase}images/logo-marquee/ata.png`, alt: 'ATA', linkUrl: '' },
            { id: 0, url: `${staticBase}images/logo-marquee/yale.png`, alt: 'Yale', linkUrl: '' },
            { id: 0, url: `${staticBase}images/logo-marquee/mit.png`, alt: 'MIT', linkUrl: '' },
            { id: 0, url: `${staticBase}images/logo-marquee/mudt.png`, alt: 'mudt', linkUrl: '' },
            { id: 0, url: `${staticBase}images/logo-marquee/harvard.png`, alt: 'Harvard University', linkUrl: '' },
          ].map(sanitizeLogo).filter(Boolean)
        : [];

      function setLogos(next) {
        setAttributes({ logos: next });
      }

      function addLogosFromMedia(mediaItems) {
        const items = Array.isArray(mediaItems) ? mediaItems : [mediaItems];
        const mapped = items
          .map((m) => {
            if (!m) return null;
            return sanitizeLogo({
              id: m.id || 0,
              url: m.url || '',
              alt: m.alt || m.title || '',
              linkUrl: '',
            });
          })
          .filter(Boolean);
        if (!mapped.length) return;
        setLogos([...logos, ...mapped]);
      }

      function updateLogo(idx, patch) {
        const next = logos.map((l, i) => (i === idx ? { ...l, ...patch } : l));
        setLogos(next);
      }

      function removeLogo(idx) {
        setLogos(logos.filter((_, i) => i !== idx));
      }

      function moveLogo(idx, dir) {
        const next = [...logos];
        const to = idx + dir;
        if (to < 0 || to >= next.length) return;
        const tmp = next[idx];
        next[idx] = next[to];
        next[to] = tmp;
        setLogos(next);
      }

      const wrapperClasses = [
        'unixedu-logo-marquee',
        `unixedu-logo-marquee--${bg}`,
        'is-editor-preview',
      ].join(' ');

      const titlePreview = (attrs.title || '').trim() ? attrs.title : 'Section title';

      // Auto-populate with theme static logos once (so user can reorder/delete in admin).
      if (!attrs.hasInitializedDefaults && !logos.length && DEFAULT_STATIC_LOGOS.length) {
        setAttributes({ logos: DEFAULT_STATIC_LOGOS, hasInitializedDefaults: true });
      }

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: 'Section', initialOpen: true },
            wp.element.createElement(SelectControl, {
              label: 'Background',
              value: bg,
              options: BG_OPTIONS,
              onChange: (value) => setAttributes({ background: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Title',
              value: attrs.title || '',
              placeholder: 'Section title',
              onChange: (value) => setAttributes({ title: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Logos', initialOpen: true },
            wp.element.createElement(MediaUploadCheck, null,
              wp.element.createElement(MediaUpload, {
                onSelect: addLogosFromMedia,
                allowedTypes: ['image'],
                multiple: true,
                gallery: true,
                render: ({ open }) =>
                  wp.element.createElement(
                    Button,
                    { variant: 'secondary', onClick: open },
                    logos.length ? 'Add logos' : 'Select logos'
                  ),
              })
            ),
            logos.length
              ? wp.element.createElement(
                  'div',
                  { style: { marginTop: '12px' } },
                  logos.map((logo, idx) =>
                    wp.element.createElement(
                      'div',
                      {
                        key: `${logo.id || logo.url}-${idx}`,
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '72px 1fr auto',
                          gap: '10px',
                          alignItems: 'center',
                          padding: '10px 0',
                          borderTop: idx === 0 ? '0' : '1px solid rgba(0,0,0,0.08)',
                        },
                      },
                      wp.element.createElement('img', {
                        src: logo.url,
                        alt: logo.alt || '',
                        style: { width: '72px', height: '40px', objectFit: 'contain', background: 'rgba(0,0,0,0.03)' },
                      }),
                      wp.element.createElement(TextControl, {
                        label: `Logo ${idx + 1} link URL (optional)`,
                        value: logo.linkUrl || '',
                        placeholder: 'https://…',
                        onChange: (value) => updateLogo(idx, { linkUrl: value }),
                      }),
                      wp.element.createElement(
                        'div',
                        { style: { display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' } },
                        wp.element.createElement(
                          ButtonGroup,
                          null,
                          wp.element.createElement(
                            Button,
                            { variant: 'tertiary', onClick: () => moveLogo(idx, -1), disabled: idx === 0 },
                            'Up'
                          ),
                          wp.element.createElement(
                            Button,
                            { variant: 'tertiary', onClick: () => moveLogo(idx, 1), disabled: idx === logos.length - 1 },
                            'Down'
                          )
                        ),
                        wp.element.createElement(
                          Button,
                          { variant: 'tertiary', isDestructive: true, onClick: () => removeLogo(idx) },
                          'Remove'
                        )
                      )
                    )
                  )
                )
              : wp.element.createElement('p', { style: { marginTop: '10px', opacity: 0.7 } }, 'No logos selected yet.')
          )
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses },
          wp.element.createElement(
            'div',
            { className: 'unixedu-logo-marquee__inner' },
            wp.element.createElement(
              'p',
              { className: 'unixedu-logo-marquee__title' },
              titlePreview
            ),
            wp.element.createElement(
              'div',
              { className: 'unixedu-logo-marquee__viewport' },
              wp.element.createElement(
                'div',
                { className: 'unixedu-logo-marquee__track', style: { animationPlayState: 'paused' } },
                (logos.length ? logos : new Array(6).fill(0).map((_, i) => ({ url: '', alt: '', linkUrl: '', __placeholder: i }))).map(
                  (logo, idx) =>
                    wp.element.createElement(
                      'div',
                      { className: 'unixedu-logo-marquee__item', key: logo.__placeholder ? `ph-${idx}` : `${logo.id || logo.url}-${idx}` },
                      logo.url
                        ? wp.element.createElement('img', { className: 'unixedu-logo-marquee__img', src: logo.url, alt: logo.alt || '' })
                        : wp.element.createElement('div', {
                            className: 'unixedu-logo-marquee__ph',
                            'aria-hidden': 'true',
                          })
                    )
                )
              )
            )
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp);

