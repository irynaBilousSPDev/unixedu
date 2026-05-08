(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
  const { PanelBody, SelectControl, TextareaControl, TextControl, Button, ToggleControl, RangeControl } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light gray', value: 'light-gray' },
    { label: 'Black', value: 'black' },
  ];

  const ACCENT_OPTIONS = [
    { label: 'Lime', value: 'lime' },
    { label: 'Gray', value: 'gray' },
  ];

  const ACCENT_SCHEME_OPTIONS = [
    { label: 'All lime', value: 'all-lime' },
    { label: 'All gray', value: 'all-gray' },
    { label: 'Column 1 lime / Column 2 gray (alternate)', value: 'col1-lime-col2-gray' },
    { label: 'Column 1 gray / Column 2 lime (alternate)', value: 'col1-gray-col2-lime' },
  ];

  const TITLE_LINE_STYLE_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Lime', value: 'lime' },
    { label: 'White', value: 'white' },
    { label: 'Lime on dark', value: 'lime-on-dark' },
  ];

  const LOGO_POS_OPTIONS = [
    { label: 'Top right', value: 'top-right' },
    { label: 'Top left', value: 'top-left' },
  ];

  function normalizeBg(v) {
    const x = String(v || '');
    return ['white', 'light-gray', 'black'].includes(x) ? x : 'white';
  }

  function normalizeAccent(v) {
    const x = String(v || '');
    return ['lime', 'gray'].includes(x) ? x : 'lime';
  }

  // Kept for backwards compatibility with older block content;
  // new behavior uses accentScheme.
  function normalizeAccentScheme(v) {
    const x = String(v || '');
    return ['all-lime', 'all-gray', 'col1-lime-col2-gray', 'col1-gray-col2-lime'].includes(x) ? x : 'all-lime';
  }

  function clampNumber(n, min, max, fallback) {
    const x = Number(n);
    if (!Number.isFinite(x)) return fallback;
    return Math.min(max, Math.max(min, x));
  }

  function normalizeLineStyle(v) {
    const x = String(v || '');
    return ['default', 'lime', 'white', 'lime-on-dark'].includes(x) ? x : 'default';
  }

  function normalizeLogoPos(v) {
    const x = String(v || '');
    return ['top-right', 'top-left'].includes(x) ? x : 'top-right';
  }

  function ensureItems(items) {
    if (Array.isArray(items) && items.length) return items;
    return [
      { title: 'Feature title', text: 'Short description of the feature.' },
      { title: 'Feature title', text: 'Short description of the feature.' },
      { title: 'Feature title', text: 'Short description of the feature.' },
      { title: 'Feature title', text: 'Short description of the feature.' },
    ];
  }

  registerBlockType('unixedu/feature-list-media', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const bg = normalizeBg(attrs.background);
      const accent = normalizeAccent(attrs.accent);
      const items = ensureItems(attrs.items);

      if (!Array.isArray(attrs.items) || !attrs.items.length) {
        setAttributes({ items });
      }

      const showAccent = attrs.showAccent !== false;

      function updateItem(idx, patch) {
        const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
        setAttributes({ items: next });
      }

      function addItem() {
        setAttributes({ items: [...items, { title: '', text: '' }] });
      }

      function removeItem(idx) {
        setAttributes({ items: items.filter((_, i) => i !== idx) });
      }

      const titleLines = [
        { text: (attrs.titleLine1 || '').trim(), style: normalizeLineStyle(attrs.titleLine1Style) },
        { text: (attrs.titleLine2 || '').trim(), style: normalizeLineStyle(attrs.titleLine2Style) },
        { text: (attrs.titleLine3 || '').trim(), style: normalizeLineStyle(attrs.titleLine3Style) },
      ].filter((l) => l.text);

      const wrapperClasses = [
        'unixedu-feature-list-media',
        `unixedu-feature-list-media--bg-${bg}`,
        `unixedu-feature-list-media--accent-${accent}`,
        `unixedu-feature-list-media--scheme-${normalizeAccentScheme(attrs.accentScheme)}`,
        (!attrs.showMedia ? 'unixedu-feature-list-media--no-media' : ''),
        (attrs.showDividers === false ? 'unixedu-feature-list-media--no-dividers' : ''),
        (showAccent ? '' : 'unixedu-feature-list-media--no-accent'),
        'is-editor-preview',
      ].filter(Boolean).join(' ');

      const accentWidth = clampNumber(attrs.accentWidth, 0, 20, 6);
      const accentGap = clampNumber(attrs.accentGap, 0, 60, 20);
      const listColumns = clampNumber(attrs.listColumns, 1, 3, 2);
      const sectionStyle = {
        '--flm-accent-w': `${accentWidth}px`,
        '--flm-accent-gap': `${accentGap}px`,
        '--flm-accent-col-w': showAccent ? `${Math.max(10, accentWidth + 4)}px` : '0px',
        '--flm-cols': String(listColumns),
      };

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: 'Layout', initialOpen: true },
            wp.element.createElement(SelectControl, {
              label: 'Background',
              value: bg,
              options: BG_OPTIONS,
              onChange: (value) => setAttributes({ background: normalizeBg(value) }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Accent border',
              value: accent,
              options: ACCENT_OPTIONS,
              onChange: (value) => setAttributes({ accent: normalizeAccent(value) }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Accent color scheme (by column)',
              value: normalizeAccentScheme(attrs.accentScheme),
              options: ACCENT_SCHEME_OPTIONS,
              onChange: (value) => setAttributes({ accentScheme: normalizeAccentScheme(value) }),
            }),
            wp.element.createElement(ToggleControl, {
              label: 'Show left accent border',
              checked: showAccent,
              onChange: (value) => setAttributes({ showAccent: !!value }),
            }),
            wp.element.createElement(ToggleControl, {
              label: 'Show divider lines',
              checked: attrs.showDividers !== false,
              onChange: (value) => setAttributes({ showDividers: !!value }),
            }),
            showAccent
              ? wp.element.createElement(
                  Fragment,
                  null,
                  wp.element.createElement(RangeControl, {
                    label: 'Accent width (px)',
                    min: 1,
                    max: 16,
                    value: accentWidth,
                    onChange: (value) => setAttributes({ accentWidth: clampNumber(value, 1, 16, 6) }),
                  }),
                  wp.element.createElement(RangeControl, {
                    label: 'Gap to text (px)',
                    min: 8,
                    max: 48,
                    value: accentGap,
                    onChange: (value) => setAttributes({ accentGap: clampNumber(value, 8, 48, 20) }),
                  }),
                  wp.element.createElement(RangeControl, {
                    label: 'List columns',
                    min: 1,
                    max: 3,
                    value: listColumns,
                    onChange: (value) => setAttributes({ listColumns: clampNumber(value, 1, 3, 2) }),
                  })
                )
              : null
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Header', initialOpen: true },
            wp.element.createElement(TextareaControl, {
              label: 'Eyebrow',
              value: attrs.eyebrow || '',
              placeholder: 'Section eyebrow (optional)',
              rows: 2,
              onChange: (value) => setAttributes({ eyebrow: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 1',
              value: attrs.titleLine1 || '',
              placeholder: 'Section title line 1',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine1: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 1 style',
              value: normalizeLineStyle(attrs.titleLine1Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine1Style: normalizeLineStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 2',
              value: attrs.titleLine2 || '',
              placeholder: 'Section title line 2 (optional)',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine2: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 2 style',
              value: normalizeLineStyle(attrs.titleLine2Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine2Style: normalizeLineStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 3 (optional)',
              value: attrs.titleLine3 || '',
              placeholder: 'Section title line 3 (optional)',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine3: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 3 style',
              value: normalizeLineStyle(attrs.titleLine3Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine3Style: normalizeLineStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Text',
              value: attrs.text || '',
              placeholder: 'Add a short intro paragraph for this section.',
              rows: 3,
              onChange: (value) => setAttributes({ text: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Media', initialOpen: false },
            wp.element.createElement(ToggleControl, {
              label: 'Show media image',
              checked: !!attrs.showMedia,
              onChange: (value) => setAttributes({ showMedia: !!value }),
            }),
            !!attrs.showMedia
              ? wp.element.createElement(
                  Fragment,
                  null,
                  wp.element.createElement(MediaUploadCheck, null,
                    wp.element.createElement(MediaUpload, {
                      onSelect: (media) => {
                        if (!media) return;
                        setAttributes({
                          mediaImageId: media.id || 0,
                          mediaImageUrl: media.url || '',
                          mediaImageAlt: media.alt || media.title || '',
                        });
                      },
                      allowedTypes: ['image'],
                      value: attrs.mediaImageId || 0,
                      render: ({ open }) =>
                        wp.element.createElement(
                          'div',
                          null,
                          wp.element.createElement(Button, { variant: 'secondary', onClick: open }, (attrs.mediaImageUrl || '').trim() ? 'Replace image' : 'Select image'),
                          (attrs.mediaImageUrl || '').trim()
                            ? wp.element.createElement(
                                Button,
                                { variant: 'link', isDestructive: true, onClick: () => setAttributes({ mediaImageId: 0, mediaImageUrl: '', mediaImageAlt: '' }) },
                                'Remove'
                              )
                            : null
                        ),
                    })
                  ),
                  wp.element.createElement(ToggleControl, {
                    label: 'Show logo overlay',
                    checked: !!attrs.showLogo,
                    onChange: (value) => setAttributes({ showLogo: !!value }),
                  }),
                  !!attrs.showLogo
                    ? wp.element.createElement(
                        Fragment,
                        null,
                        wp.element.createElement(MediaUploadCheck, null,
                          wp.element.createElement(MediaUpload, {
                            onSelect: (media) => {
                              if (!media) return;
                              setAttributes({
                                logoImageId: media.id || 0,
                                logoImageUrl: media.url || '',
                                logoImageAlt: media.alt || media.title || '',
                              });
                            },
                            allowedTypes: ['image'],
                            value: attrs.logoImageId || 0,
                            render: ({ open }) =>
                              wp.element.createElement(
                                'div',
                                null,
                                wp.element.createElement(Button, { variant: 'secondary', onClick: open }, (attrs.logoImageUrl || '').trim() ? 'Replace logo' : 'Select logo'),
                                (attrs.logoImageUrl || '').trim()
                                  ? wp.element.createElement(
                                      Button,
                                      { variant: 'link', isDestructive: true, onClick: () => setAttributes({ logoImageId: 0, logoImageUrl: '', logoImageAlt: '' }) },
                                      'Remove'
                                    )
                                  : null
                              ),
                          })
                        ),
                        wp.element.createElement(SelectControl, {
                          label: 'Logo position',
                          value: normalizeLogoPos(attrs.logoPosition),
                          options: LOGO_POS_OPTIONS,
                          onChange: (value) => setAttributes({ logoPosition: normalizeLogoPos(value) }),
                        })
                      )
                    : null
                )
              : null
          )
          ,
          wp.element.createElement(
            PanelBody,
            { title: 'Item icon', initialOpen: false },
            wp.element.createElement(ToggleControl, {
              label: 'Show icon in each item',
              checked: !!attrs.showItemIcon,
              onChange: (value) => setAttributes({ showItemIcon: !!value }),
            }),
            !!attrs.showItemIcon
              ? wp.element.createElement(
                  Fragment,
                  null,
                  wp.element.createElement(MediaUploadCheck, null,
                    wp.element.createElement(MediaUpload, {
                      onSelect: (media) => {
                        if (!media) return;
                        setAttributes({
                          itemIconId: media.id || 0,
                          itemIconUrl: media.url || '',
                          itemIconAlt: media.alt || media.title || '',
                        });
                      },
                      allowedTypes: ['image'],
                      value: attrs.itemIconId || 0,
                      render: ({ open }) =>
                        wp.element.createElement(
                          'div',
                          null,
                          wp.element.createElement(Button, { variant: 'secondary', onClick: open }, (attrs.itemIconUrl || '').trim() ? 'Replace icon' : 'Select icon'),
                          (attrs.itemIconUrl || '').trim()
                            ? wp.element.createElement(
                                Button,
                                { variant: 'link', isDestructive: true, onClick: () => setAttributes({ itemIconId: 0, itemIconUrl: '', itemIconAlt: '' }) },
                                'Remove'
                              )
                            : null
                        ),
                    })
                  )
                )
              : null
          )
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses, style: sectionStyle },
          wp.element.createElement(
            'div',
            { className: 'unixedu-feature-list-media__inner' },
            wp.element.createElement(
              'div',
              { className: 'unixedu-feature-list-media__main' },
              wp.element.createElement(
                'header',
                { className: 'unixedu-section-header__head' },
                (attrs.eyebrow || '').trim()
                  ? wp.element.createElement('p', { className: 'unixedu-section-header__eyebrow' }, attrs.eyebrow)
                  : null,
                wp.element.createElement(
                  'h2',
                  { className: 'unixedu-section-header__title' },
                  (titleLines.length ? titleLines : [{ text: 'Section title (edit in sidebar)', style: 'default' }]).map((l, i) =>
                    wp.element.createElement(
                      'span',
                      { key: i, className: `unixedu-section-header__title-line unixedu-section-header__title-line--${l.style}` },
                      l.text
                    )
                  )
                ),
                (attrs.text || '').trim()
                  ? wp.element.createElement('p', { className: 'unixedu-feature-list-media__text' }, attrs.text)
                  : wp.element.createElement('p', { className: 'unixedu-feature-list-media__text' }, 'Section intro text (optional).')
              ),
              wp.element.createElement(
                'div',
                { className: 'unixedu-feature-list-media__grid' },
                items.map((it, idx) =>
                  wp.element.createElement(
                    'div',
                    { key: idx, className: `unixedu-feature-list-media__item unixedu-feature-list-media__item--col-${(idx % listColumns) + 1}` },
                    showAccent ? wp.element.createElement('div', { className: 'unixedu-feature-list-media__item-accent', 'aria-hidden': 'true' }) : null,
                    wp.element.createElement(
                      'div',
                      { className: 'unixedu-feature-list-media__item-body' },
                      wp.element.createElement(
                        'div',
                        { className: 'unixedu-feature-list-media__item-head' },
                        (attrs.showItemIcon && (attrs.itemIconUrl || '').trim())
                          ? wp.element.createElement('img', { className: 'unixedu-feature-list-media__item-icon', src: attrs.itemIconUrl, alt: attrs.itemIconAlt || '' })
                          : null,
                        wp.element.createElement('h3', { className: 'unixedu-feature-list-media__item-title' }, it.title || 'Feature title')
                      ),
                      wp.element.createElement('p', { className: 'unixedu-feature-list-media__item-text' }, it.text || 'Feature description.')
                    ),
                    wp.element.createElement(
                      'div',
                      { className: 'unixedu-feature-list-media__item-editor' },
                      wp.element.createElement(TextControl, {
                        label: `Item ${idx + 1} title`,
                        value: it.title || '',
                        placeholder: 'Feature title',
                        onChange: (value) => updateItem(idx, { title: value }),
                      }),
                      wp.element.createElement(TextControl, {
                        label: `Item ${idx + 1} text`,
                        value: it.text || '',
                        placeholder: 'Feature description',
                        onChange: (value) => updateItem(idx, { text: value }),
                      }),
                      wp.element.createElement(
                        'div',
                        { style: { marginTop: '8px' } },
                        wp.element.createElement(Button, { variant: 'link', isDestructive: true, onClick: () => removeItem(idx) }, 'Remove item')
                      )
                    )
                  )
                )
              ),
              wp.element.createElement(Button, { variant: 'secondary', onClick: addItem, style: { marginTop: '14px' } }, 'Add item')
            ),
            !!attrs.showMedia
              ? wp.element.createElement(
                  'div',
                  { className: 'unixedu-feature-list-media__media' },
                  (attrs.mediaImageUrl || '').trim()
                    ? wp.element.createElement(
                        'div',
                        { className: 'unixedu-feature-list-media__media-frame' },
                        wp.element.createElement('img', { className: 'unixedu-feature-list-media__media-img', src: attrs.mediaImageUrl, alt: attrs.mediaImageAlt || '' }),
                        (attrs.showLogo && (attrs.logoImageUrl || '').trim())
                          ? wp.element.createElement('img', {
                              className: `unixedu-feature-list-media__logo unixedu-feature-list-media__logo--${normalizeLogoPos(attrs.logoPosition)}`,
                              src: attrs.logoImageUrl,
                              alt: attrs.logoImageAlt || '',
                            })
                          : null
                      )
                    : wp.element.createElement('div', { className: 'unixedu-feature-list-media__media-ph' })
                )
              : null
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp);

