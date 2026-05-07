(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
  const {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    TextareaControl,
    RangeControl,
    Button,
    ButtonGroup,
  } = wp.components;
  const { Fragment } = wp.element;

  const BACKGROUND_MODE_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light gray (#F5F5F5)', value: 'light-gray' },
    { label: 'Black', value: 'black' },
    { label: 'Image', value: 'image' },
    { label: 'Image (dark overlay)', value: 'image-dark' },
  ];

  const TITLE_LINE_STYLE_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Lime', value: 'lime' },
    { label: 'White', value: 'white' },
    { label: 'Lime on dark', value: 'lime-on-dark' },
  ];

  const CARDS_TEXT_COLOR_MODE_OPTIONS = [
    { label: 'Auto', value: 'auto' },
    { label: 'Dark', value: 'dark' },
    { label: 'Light', value: 'light' },
  ];

  const CARDS_LAYOUT_OPTIONS = [
    { label: 'Four columns', value: 'four-columns' },
    { label: 'Two columns', value: 'two-columns' },
    { label: 'Stacked', value: 'stacked' },
  ];

  const CARDS_SURFACE_OPTIONS = [
    { label: 'Transparent', value: 'transparent' },
    { label: 'Panel (white translucent)', value: 'panel' },
  ];

  // NOTE: We intentionally keep the editor UI focused.
  // Content tone is auto-resolved from background + surface.

  const CARD_TYPE_OPTIONS = [
    { label: 'Numbers', value: 'numbers' },
    { label: 'Tier', value: 'tier' },
  ];

  const BADGE_STYLE_OPTIONS = [
    { label: 'Dark (bg #0D1A05, text #C8FF00)', value: 'dark' },
    { label: 'Lime (bg #C8FF00, text #0D1A05)', value: 'lime' },
  ];

  // Style-only presets: do NOT overwrite user content fields.
  const STYLE_PRESETS = [
    {
      key: 'white-transparent',
      label: 'White / Transparent Cards',
      styleAttrs: { backgroundMode: 'white', cardsSurface: 'transparent', contentTone: 'auto' },
    },
    {
      key: 'lightgray-transparent',
      label: 'Light Gray / Transparent Cards',
      styleAttrs: { backgroundMode: 'light-gray', cardsSurface: 'transparent', contentTone: 'auto' },
    },
    {
      key: 'black-transparent',
      label: 'Black / Transparent Cards',
      styleAttrs: { backgroundMode: 'black', cardsSurface: 'transparent', contentTone: 'auto' },
    },
    {
      key: 'image-transparent',
      label: 'Image / Transparent Cards',
      styleAttrs: { backgroundMode: 'image', cardsSurface: 'transparent', contentTone: 'auto' },
    },
    {
      key: 'image-panel',
      label: 'Image / White Panel',
      styleAttrs: { backgroundMode: 'image', cardsSurface: 'panel', contentTone: 'dark' },
    },
  ];

  function normalizeBackgroundMode(mode) {
    const v = String(mode || '');
    return ['white', 'light-gray', 'black', 'image', 'image-dark'].includes(v) ? v : 'light-gray';
  }

  function normalizeTitleLineStyle(style) {
    const v = String(style || '');
    return ['default', 'lime', 'white', 'lime-on-dark'].includes(v) ? v : 'default';
  }

  function normalizeCardsTextColorMode(mode) {
    const v = String(mode || '');
    return ['auto', 'dark', 'light'].includes(v) ? v : 'auto';
  }

  function normalizeCardsSurface(surface) {
    const v = String(surface || '');
    return ['transparent', 'panel'].includes(v) ? v : 'transparent';
  }

  function normalizeCardsLayout(layout) {
    const v = String(layout || '');
    return ['four-columns', 'two-columns', 'stacked'].includes(v) ? v : 'four-columns';
  }

  function getResolvedToneForPreview(attrs) {
    const bg = normalizeBackgroundMode(attrs.backgroundMode);
    const surface = normalizeCardsSurface(attrs.cardsSurface);
    if (surface === 'panel') return 'dark';
    if (bg === 'black' || bg === 'image-dark') return 'light';
    return 'dark';
  }

  function normalizeCardType(v) {
    const x = String(v || '');
    return ['numbers', 'tier'].includes(x) ? x : 'numbers';
  }

  function normalizeBadgeStyle(v) {
    const x = String(v || '');
    return ['dark', 'lime'].includes(x) ? x : 'dark';
  }

  function TitlePreview({ attrs, textMode }) {
    const lines = [
      { text: attrs.titleLine1, style: normalizeTitleLineStyle(attrs.titleLine1Style) },
      { text: attrs.titleLine2, style: normalizeTitleLineStyle(attrs.titleLine2Style) },
      { text: attrs.titleLine3, style: normalizeTitleLineStyle(attrs.titleLine3Style) },
    ].filter((l) => (l.text || '').trim());

    if (!lines.length) return null;

    const base = textMode === 'light' ? 'unixedu-process__title is-light' : 'unixedu-process__title';

    return wp.element.createElement(
      'h2',
      { className: base },
      lines.map((l, idx) =>
        wp.element.createElement(
          'span',
          {
            key: idx,
            className: `unixedu-process__title-line unixedu-process__title-line--${l.style}`,
          },
          l.text
        )
      )
    );
  }

  function StepControls({ index, attrs, setAttributes }) {
    const prefix = `step${index}`;
    const get = (key) => attrs[`${prefix}${key}`];
    const set = (key, value) => setAttributes({ [`${prefix}${key}`]: value });

    return wp.element.createElement(
      PanelBody,
      { title: `Step ${index}`, initialOpen: false },
      wp.element.createElement(TextControl, {
        label: 'Number',
        value: get('Number') || '',
        onChange: (value) => set('Number', value),
      }),
      wp.element.createElement(TextControl, {
        label: 'Tier label (for Tier type)',
        value: get('Tier') || '',
        onChange: (value) => set('Tier', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Title',
        value: get('Title') || '',
        rows: 2,
        onChange: (value) => set('Title', value),
      }),
      wp.element.createElement(TextControl, {
        label: 'Badge text (pill under title)',
        value: get('BadgeText') || '',
        placeholder: 'e.g. 10-50 / YEAR',
        onChange: (value) => set('BadgeText', value),
      }),
      wp.element.createElement(SelectControl, {
        label: 'Badge style',
        value: normalizeBadgeStyle(get('BadgeStyle')),
        options: BADGE_STYLE_OPTIONS,
        onChange: (value) => set('BadgeStyle', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Text',
        value: get('Text') || '',
        rows: 4,
        onChange: (value) => set('Text', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Link text (optional)',
        value: get('LinkText') || '',
        rows: 2,
        onChange: (value) => set('LinkText', value),
      }),
      wp.element.createElement(TextControl, {
        label: 'Link URL (optional)',
        value: get('LinkUrl') || '',
        onChange: (value) => set('LinkUrl', value),
      })
    );
  }

  registerBlockType('unixedu/process-steps', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;

      const bg = normalizeBackgroundMode(attrs.backgroundMode);
      const surface = normalizeCardsSurface(attrs.cardsSurface);
      const layout = normalizeCardsLayout(attrs.cardsLayout);
      const tone = getResolvedToneForPreview(attrs);
      const cardType = normalizeCardType(attrs.cardType);
      const hasImage = !!(attrs.backgroundImageUrl && String(attrs.backgroundImageUrl).trim());
      const showOverlay = bg === 'image-dark';
      const overlayOpacity = Number.isFinite(Number(attrs.overlayOpacity)) ? Number(attrs.overlayOpacity) : 0.55;

      const wrapperClasses = [
        'unixedu-process',
        `unixedu-process--bg-${bg}`,
        `unixedu-process--surface-${surface}`,
        `unixedu-process--layout-${layout}`,
        `unixedu-process--resolved-tone-${tone}`,
        `unixedu-process--card-type-${cardType}`,
        'is-editor-preview',
      ]
        .filter(Boolean)
        .join(' ');

      const sectionStyle =
        (bg === 'image' || bg === 'image-dark') && hasImage
          ? { backgroundImage: `url(${attrs.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined;

      const steps = [1, 2, 3, 4].map((i) => ({
        number: (attrs[`step${i}Number`] || '').trim(),
        tier: (attrs[`step${i}Tier`] || '').trim(),
        title: (attrs[`step${i}Title`] || '').trim(),
        badgeText: (attrs[`step${i}BadgeText`] || '').trim(),
        badgeStyle: normalizeBadgeStyle(attrs[`step${i}BadgeStyle`]),
        text: (attrs[`step${i}Text`] || '').trim(),
        linkText: (attrs[`step${i}LinkText`] || '').trim(),
        linkUrl: (attrs[`step${i}LinkUrl`] || '').trim(),
      }));

      function applyStylePreset(preset) {
        if (!preset || !preset.styleAttrs) return;
        setAttributes({ ...preset.styleAttrs });
      }

      const previewEyebrow = (attrs.eyebrow || '').trim() || 'Eyebrow';
      const previewTitle1 = (attrs.titleLine1 || '').trim() || 'Section title';
      const previewStepTitle = 'Step title';
      const previewStepText = 'Step description';

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: 'Background', initialOpen: false },
            wp.element.createElement(SelectControl, {
              label: 'Background mode',
              value: bg,
              options: BACKGROUND_MODE_OPTIONS,
              onChange: (value) => setAttributes({ backgroundMode: value }),
            }),
            (bg === 'image' || bg === 'image-dark')
              ? wp.element.createElement(
                  Fragment,
                  null,
                  wp.element.createElement(MediaUploadCheck, null,
                    wp.element.createElement(MediaUpload, {
                      onSelect: (media) => {
                        if (!media) return;
                        setAttributes({
                          backgroundImageId: media.id || 0,
                          backgroundImageUrl: media.url || '',
                          backgroundImageAlt: media.alt || media.title || '',
                        });
                      },
                      allowedTypes: ['image'],
                      value: attrs.backgroundImageId || 0,
                      render: ({ open }) =>
                        wp.element.createElement(
                          'div',
                          null,
                          wp.element.createElement(
                            Button,
                            { variant: 'secondary', onClick: open },
                            hasImage ? 'Replace background image' : 'Select background image'
                          ),
                          hasImage
                            ? wp.element.createElement(
                                Button,
                                {
                                  variant: 'link',
                                  isDestructive: true,
                                  onClick: () =>
                                    setAttributes({ backgroundImageId: 0, backgroundImageUrl: '', backgroundImageAlt: '' }),
                                },
                                'Remove image'
                              )
                            : null
                        ),
                    })
                  ),
                  bg === 'image-dark'
                    ? wp.element.createElement(RangeControl, {
                        label: 'Overlay opacity',
                        value: overlayOpacity,
                        min: 0,
                        max: 0.9,
                        step: 0.05,
                        onChange: (value) => setAttributes({ overlayOpacity: Number(value) }),
                      })
                    : null
                )
              : null,
            wp.element.createElement(SelectControl, {
              label: 'Cards surface',
              value: surface,
              options: CARDS_SURFACE_OPTIONS,
              onChange: (value) => setAttributes({ cardsSurface: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Layout', initialOpen: false },
            wp.element.createElement(SelectControl, {
              label: 'Card type',
              value: cardType,
              options: CARD_TYPE_OPTIONS,
              onChange: (value) => setAttributes({ cardType: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Cards layout',
              value: layout,
              options: CARDS_LAYOUT_OPTIONS,
              onChange: (value) => setAttributes({ cardsLayout: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Header', initialOpen: false },
            wp.element.createElement(TextareaControl, {
              label: 'Eyebrow',
              value: attrs.eyebrow || '',
              placeholder: 'Eyebrow',
              rows: 2,
              onChange: (value) => setAttributes({ eyebrow: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 1',
              value: attrs.titleLine1 || '',
              placeholder: 'Section title',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine1: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 1 style',
              value: normalizeTitleLineStyle(attrs.titleLine1Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine1Style: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 2',
              value: attrs.titleLine2 || '',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine2: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 2 style',
              value: normalizeTitleLineStyle(attrs.titleLine2Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine2Style: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 3 (optional)',
              value: attrs.titleLine3 || '',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine3: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 3 style',
              value: normalizeTitleLineStyle(attrs.titleLine3Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine3Style: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Intro text',
              value: attrs.introText || '',
              placeholder: 'Optional intro text',
              rows: 4,
              onChange: (value) => setAttributes({ introText: value }),
            })
          ),
          wp.element.createElement(PanelBody, { title: 'Cards', initialOpen: false },
            wp.element.createElement('p', { style: { marginTop: 0 } }, 'Configure 4 step cards. Number color is fixed (#C8FF00).')
          ),
          wp.element.createElement(StepControls, { index: 1, attrs, setAttributes }),
          wp.element.createElement(StepControls, { index: 2, attrs, setAttributes }),
          wp.element.createElement(StepControls, { index: 3, attrs, setAttributes }),
          wp.element.createElement(StepControls, { index: 4, attrs, setAttributes })
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses, style: sectionStyle },
          wp.element.createElement(
            'div',
            { className: 'unixedu-process__background' },
            showOverlay
              ? wp.element.createElement('div', {
                  className: 'unixedu-process__overlay',
                  style: { opacity: overlayOpacity },
                  'aria-hidden': 'true',
                })
              : null
          ),
          wp.element.createElement(
            'div',
            { className: 'unixedu-process__inner' },
            wp.element.createElement(
              'header',
              { className: `unixedu-process__head ${attrs.showUnderline ? 'has-underline' : ''}`.trim() },
              wp.element.createElement('p', { className: 'unixedu-process__eyebrow' }, (attrs.eyebrow || '').trim() ? attrs.eyebrow : previewEyebrow),
              wp.element.createElement(TitlePreview, {
                attrs: {
                  ...attrs,
                  titleLine1: (attrs.titleLine1 || '').trim() ? attrs.titleLine1 : previewTitle1,
                },
                textMode: tone,
              }),
              (attrs.introText || '').trim()
                ? wp.element.createElement('p', { className: 'unixedu-process__intro' }, attrs.introText)
                : null
            ),
            wp.element.createElement(
              'div',
              { className: `unixedu-process__cards ${surface === 'panel' ? 'is-panel' : ''}`.trim() },
              wp.element.createElement(
                'div',
                { className: 'unixedu-process__cards-grid' },
                steps.map((s, idx) =>
                  wp.element.createElement(
                    'article',
                    { className: 'unixedu-process__card', key: idx },
                    cardType === 'tier'
                      ? wp.element.createElement('div', { className: 'unixedu-process__tier' }, s.tier || `TIER ${idx + 1}`)
                      : (s.number ? wp.element.createElement('div', { className: 'unixedu-process__number' }, s.number) : null),
                    wp.element.createElement(
                      'h3',
                      { className: 'unixedu-process__card-title' },
                      s.title ? s.title : previewStepTitle
                    ),
                    s.badgeText
                      ? wp.element.createElement('div', { className: `unixedu-process__badge unixedu-process__badge--${s.badgeStyle}` }, s.badgeText)
                      : null,
                    wp.element.createElement(
                      'p',
                      { className: 'unixedu-process__card-text' },
                      s.text ? s.text : previewStepText
                    ),
                    s.linkText && s.linkUrl
                      ? wp.element.createElement('span', { className: 'unixedu-process__card-link' }, `${s.linkText} →`)
                      : null
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

