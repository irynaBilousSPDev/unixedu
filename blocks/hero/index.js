(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
  const {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    TextareaControl,
    Button,
  } = wp.components;
  const { Fragment } = wp.element;

  const VARIANT_OPTIONS = [
    { label: 'Home', value: 'home' },
    { label: 'For Students', value: 'students' },
    { label: 'For Partners', value: 'partners' },
    { label: 'For Institutions', value: 'institutions' },
    { label: 'Custom', value: 'custom' },
  ];

  const TEXT_STYLE_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
    { label: 'Lime', value: 'lime' },
    { label: 'Lime on black', value: 'lime-on-black' },
  ];

  const BUTTON_STYLE_OPTIONS = [
    { label: 'Lime', value: 'lime' },
    { label: 'Dark', value: 'dark' },
    { label: 'Outline', value: 'outline' },
  ];

  const STATS_COUNT_OPTIONS = [
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ];

  function toInt(value, fallback) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalizeTextStyle(v) {
    const x = String(v || '');
    return ['default', 'black', 'white', 'lime', 'lime-on-black'].includes(x) ? x : 'default';
  }

  function TitlePreview({ attrs }) {
    const rawLines = [attrs.titleLine1, attrs.titleLine2, attrs.titleLine3, attrs.titleLine4];
    const lines = rawLines.map((l) => (l || '').trim()).filter(Boolean);
    const previewLines = lines.length ? lines : ['Hero title'];
    const threeOrMore = previewLines.length >= 3;

    return wp.element.createElement(
      'h2',
      {
        className: [
          'unixedu-hero__title',
          threeOrMore ? 'unixedu-hero__title--three-plus' : '',
        ]
          .filter(Boolean)
          .join(' '),
      },
      previewLines.map((line, idx) => {
        const isHighlight = false;
        const mixedLime =
          false &&
          (attrs.variant === 'partners') &&
          (idx === 0 || idx === 1);

        const styleKeyRaw =
          idx === 0 ? attrs.titleLine1Style :
          idx === 1 ? attrs.titleLine2Style :
          idx === 2 ? attrs.titleLine3Style :
          idx === 3 ? attrs.titleLine4Style :
          'default';
        const styleKey = normalizeTextStyle(styleKeyRaw);

        const lineClasses = [
          'unixedu-hero__title-line',
          styleKey !== 'default' ? `unixedu-hero__title-line--${styleKey}` : '',
          isHighlight ? 'is-highlight' : '',
          mixedLime ? 'is-lime' : '',
          styleKey === 'lime-on-black' ? 'is-lime-on-black' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return wp.element.createElement(
          'span',
          { key: idx, className: lineClasses },
          isHighlight
            ? wp.element.createElement('span', { className: 'unixedu-hero__title-highlight' }, line)
            : line
        );
      })
    );
  }

  registerBlockType('unixedu/hero', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const editedPostTitle =
        wp &&
        wp.data &&
        wp.data.select &&
        wp.data.select('core/editor') &&
        typeof wp.data.select('core/editor').getEditedPostAttribute === 'function'
          ? String(wp.data.select('core/editor').getEditedPostAttribute('title') || '')
          : '';
      const pageTitle = editedPostTitle.trim() || 'Current page';
      const showOnlyHomeCrumb = pageTitle.toLowerCase() === 'home';

      const wrapperClasses = [
        'unixedu-hero',
        `unixedu-hero--${attrs.variant || 'home'}`,
      ].join(' ');

      const showImage = Boolean(attrs.heroImageUrl);
      const statsBottomOffset = Number.isFinite(Number(attrs.statsBottomOffset)) ? Number(attrs.statsBottomOffset) : -80;
      const statsGap = statsBottomOffset < 0 ? Math.max(Math.abs(statsBottomOffset), 120) : 0;
      const wrapperStyleBase = {
        // Editor preview should not block the inserter (+). Keep it visually similar but safe.
        ...(showImage
          ? {
              backgroundImage: `url(${attrs.heroImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}),
        // Slight white overlay to keep text readable in editor preview when using bright images.
        ...(showImage ? { boxShadow: 'inset 0 0 0 9999px rgba(255,255,255,0.78)' } : {}),
        // Disable negative docking in editor preview to avoid covering other blocks/inserter.
        '--unixedu-hero-stats-bottom': `0px`,
        '--unixedu-hero-stats-gap': `0px`,
        // Keep preview height reasonable inside editor.
        minHeight: '520px',
      };
      const wrapperStyle = Object.keys(wrapperStyleBase).length ? wrapperStyleBase : undefined;

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: 'Settings', initialOpen: true },
            wp.element.createElement('p', { style: { marginTop: 0 } }, 'Hero settings')
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Breadcrumbs', initialOpen: false },
            wp.element.createElement(ToggleControl, {
              label: 'Show breadcrumbs',
              checked: !!attrs.showBreadcrumbs,
              help: 'Breadcrumbs are generated automatically from the current page.',
              onChange: (value) => setAttributes({ showBreadcrumbs: !!value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Content', initialOpen: false },
            wp.element.createElement(TextareaControl, {
              label: 'Eyebrow',
              value: attrs.eyebrow,
              placeholder: 'Optional short label (e.g. “For Students”)',
              rows: 2,
              onChange: (value) => setAttributes({ eyebrow: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Eyebrow color',
              value: normalizeTextStyle(attrs.eyebrowStyle),
              options: TEXT_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ eyebrowStyle: normalizeTextStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 1',
              value: attrs.titleLine1,
              placeholder: 'Hero title line 1',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine1: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 1 color',
              value: normalizeTextStyle(attrs.titleLine1Style),
              options: TEXT_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine1Style: normalizeTextStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 2',
              value: attrs.titleLine2,
              placeholder: 'Hero title line 2 (optional)',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine2: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 2 color',
              value: normalizeTextStyle(attrs.titleLine2Style),
              options: TEXT_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine2Style: normalizeTextStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 3',
              value: attrs.titleLine3,
              placeholder: 'Hero title line 3 (optional)',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine3: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 3 color',
              value: normalizeTextStyle(attrs.titleLine3Style),
              options: TEXT_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine3Style: normalizeTextStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 4',
              value: attrs.titleLine4,
              placeholder: 'Hero title line 4 (optional)',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine4: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 4 color',
              value: normalizeTextStyle(attrs.titleLine4Style),
              options: TEXT_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine4Style: normalizeTextStyle(value) }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Text',
              value: attrs.text,
              placeholder: 'Optional short paragraph under the title',
              onChange: (value) => setAttributes({ text: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Buttons', initialOpen: false },
            wp.element.createElement(TextControl, {
              label: 'Primary button text',
              value: attrs.primaryButtonText,
              placeholder: 'Learn more',
              onChange: (value) => setAttributes({ primaryButtonText: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Primary button URL',
              value: attrs.primaryButtonUrl,
              placeholder: 'https://… or /page',
              onChange: (value) => setAttributes({ primaryButtonUrl: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Primary button style',
              value: attrs.primaryButtonStyle,
              options: BUTTON_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ primaryButtonStyle: value }),
            }),
            wp.element.createElement(ToggleControl, {
              label: 'Show secondary button',
              checked: !!attrs.showSecondaryButton,
              onChange: (value) => setAttributes({ showSecondaryButton: !!value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Secondary button text',
              value: attrs.secondaryButtonText,
              placeholder: 'Contact us',
              onChange: (value) => setAttributes({ secondaryButtonText: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Secondary button URL',
              value: attrs.secondaryButtonUrl,
              placeholder: 'https://… or /contact',
              onChange: (value) => setAttributes({ secondaryButtonUrl: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Secondary button style',
              value: attrs.secondaryButtonStyle,
              options: BUTTON_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ secondaryButtonStyle: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Media', initialOpen: false },
            wp.element.createElement(MediaUploadCheck, null,
              wp.element.createElement(MediaUpload, {
                onSelect: (media) => {
                  if (!media) return;
                  setAttributes({
                    heroImageId: media.id || 0,
                    heroImageUrl: media.url || '',
                    heroImageAlt: media.alt || media.title || '',
                  });
                },
                allowedTypes: ['image'],
                value: attrs.heroImageId || 0,
                render: ({ open }) =>
                  wp.element.createElement(
                    'div',
                    null,
                    wp.element.createElement(
                      Button,
                      { variant: 'secondary', onClick: open },
                      showImage ? 'Replace image' : 'Select image'
                    ),
                    showImage
                      ? wp.element.createElement(
                          Button,
                          {
                            variant: 'link',
                            isDestructive: true,
                            onClick: () => setAttributes({ heroImageId: 0, heroImageUrl: '', heroImageAlt: '' }),
                          },
                          'Remove image'
                        )
                      : null
                  ),
              })
            )
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Stats', initialOpen: false },
            wp.element.createElement(ToggleControl, {
              label: 'Show stats',
              checked: !!attrs.showStats,
              onChange: (value) => setAttributes({ showStats: !!value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stats bottom offset (px)',
              help: 'Negative values move it below the hero. Default: -80',
              type: 'number',
              value: attrs.statsBottomOffset,
              onChange: (value) => setAttributes({ statsBottomOffset: toInt(value, -80) }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Stats count',
              value: attrs.statsCount,
              options: STATS_COUNT_OPTIONS,
              onChange: (value) => setAttributes({ statsCount: toInt(value, 3) }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 1 value',
              value: attrs.stat1Value,
              placeholder: 'e.g. 120+',
              onChange: (value) => setAttributes({ stat1Value: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 1 label',
              value: attrs.stat1Label,
              placeholder: 'e.g. Integrations',
              onChange: (value) => setAttributes({ stat1Label: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 2 value',
              value: attrs.stat2Value,
              placeholder: 'e.g. 24/7',
              onChange: (value) => setAttributes({ stat2Value: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 2 label',
              value: attrs.stat2Label,
              placeholder: 'e.g. Support',
              onChange: (value) => setAttributes({ stat2Label: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 3 value',
              value: attrs.stat3Value,
              placeholder: 'e.g. 3 days',
              onChange: (value) => setAttributes({ stat3Value: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 3 label',
              value: attrs.stat3Label,
              placeholder: 'e.g. Setup time',
              onChange: (value) => setAttributes({ stat3Label: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 4 value',
              value: attrs.stat4Value,
              placeholder: 'Optional',
              onChange: (value) => setAttributes({ stat4Value: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Stat 4 label',
              value: attrs.stat4Label,
              placeholder: 'Optional',
              onChange: (value) => setAttributes({ stat4Label: value }),
            })
          )
        ),
        wp.element.createElement(
          'section',
          { className: `${wrapperClasses} is-editor-preview`, style: wrapperStyle },
          wp.element.createElement(
            'div',
            { className: 'unixedu-hero__inner' },
            wp.element.createElement(
              'div',
              { className: 'unixedu-hero__content' },
              attrs.showBreadcrumbs
                ? wp.element.createElement(
                    'div',
                    { className: 'unixedu-hero__breadcrumbs' },
                    showOnlyHomeCrumb ? 'Home' : `Home / ${pageTitle}`
                  )
                : null,
              wp.element.createElement(
                'p',
                {
                  className: [
                    'unixedu-hero__eyebrow',
                    normalizeTextStyle(attrs.eyebrowStyle) !== 'default' ? `unixedu-hero__eyebrow--${normalizeTextStyle(attrs.eyebrowStyle)}` : '',
                    normalizeTextStyle(attrs.eyebrowStyle) === 'lime-on-black' ? 'is-lime-on-black' : '',
                  ]
                    .filter(Boolean)
                    .join(' '),
                },
                (attrs.eyebrow || '').trim() ? attrs.eyebrow : 'Optional eyebrow'
              ),
              wp.element.createElement(TitlePreview, { attrs }),
              (attrs.text || '').trim()
                ? wp.element.createElement('p', { className: 'unixedu-hero__text' }, attrs.text)
                : wp.element.createElement('p', { className: 'unixedu-hero__text' }, 'Optional intro text goes here.'),
              wp.element.createElement(
                'div',
                { className: 'unixedu-hero__actions' },
                attrs.primaryButtonText && attrs.primaryButtonUrl
                  ? wp.element.createElement(
                      'a',
                      { className: `unixedu-hero__button unixedu-hero__button--${attrs.primaryButtonStyle || 'lime'}`, href: attrs.primaryButtonUrl },
                      attrs.primaryButtonText
                    )
                  : null,
                attrs.showSecondaryButton && attrs.secondaryButtonText && attrs.secondaryButtonUrl
                  ? wp.element.createElement(
                      'a',
                      { className: `unixedu-hero__button unixedu-hero__button--${attrs.secondaryButtonStyle || 'dark'}`, href: attrs.secondaryButtonUrl },
                      attrs.secondaryButtonText
                    )
                  : null
              )
            )
          ),
          attrs.showStats
            ? wp.element.createElement(
                'div',
                // In editor, keep stats in normal flow so it doesn't cover the inserter.
                { className: 'unixedu-hero__stats', style: { position: 'relative', bottom: 'auto', marginTop: '28px' } },
                wp.element.createElement(
                  'div',
                  { className: `unixedu-hero__stats-inner is-count-${attrs.statsCount || 3}` },
                  wp.element.createElement('div', { className: 'unixedu-hero__stat' },
                    wp.element.createElement('span', { className: 'unixedu-hero__stat-value' }, attrs.stat1Value || ''),
                    wp.element.createElement('span', { className: 'unixedu-hero__stat-label' }, attrs.stat1Label || '')
                  ),
                  wp.element.createElement('div', { className: 'unixedu-hero__stat' },
                    wp.element.createElement('span', { className: 'unixedu-hero__stat-value' }, attrs.stat2Value || ''),
                    wp.element.createElement('span', { className: 'unixedu-hero__stat-label' }, attrs.stat2Label || '')
                  ),
                  wp.element.createElement('div', { className: 'unixedu-hero__stat' },
                    wp.element.createElement('span', { className: 'unixedu-hero__stat-value' }, attrs.stat3Value || ''),
                    wp.element.createElement('span', { className: 'unixedu-hero__stat-label' }, attrs.stat3Label || '')
                  ),
                  (attrs.statsCount === 4)
                    ? wp.element.createElement('div', { className: 'unixedu-hero__stat' },
                        wp.element.createElement('span', { className: 'unixedu-hero__stat-value' }, attrs.stat4Value || ''),
                        wp.element.createElement('span', { className: 'unixedu-hero__stat-label' }, attrs.stat4Label || '')
                      )
                    : null
                )
              )
            : null
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp);

