/**
 * Shared title line style helpers for uniXedu blocks (editor).
 * Loaded before block `index.js` via block.json `editorScript` dependency.
 */
(function (w) {
  'use strict';

  if (w.unixeduTitleLineStyles) {
    return;
  }

  var ALLOWED = [
    'default',
    'lime',
    'white',
    'dark-on-white',
    'dark-on-lime',
    'lime-fg-on-dark',
    'white-on-dark',
  ];

  var TITLE_LINE_STYLE_OPTIONS = [
    { label: 'Default (inherit)', value: 'default' },
    { label: 'Lime text', value: 'lime' },
    { label: 'White text', value: 'white' },
    { label: 'Dark on white (pill)', value: 'dark-on-white' },
    { label: 'Dark on lime (pill)', value: 'dark-on-lime' },
    { label: 'Lime on dark (pill)', value: 'lime-fg-on-dark' },
    { label: 'White on dark (pill)', value: 'white-on-dark' },
  ];

  var HERO_TITLE_ALLOWED = [
    'default',
    'black',
    'white',
    'lime',
    'dark-on-white',
    'dark-on-lime',
    'lime-fg-on-dark',
    'white-on-dark',
  ];

  var HERO_TITLE_STYLE_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Black text', value: 'black' },
    { label: 'White text', value: 'white' },
    { label: 'Lime text', value: 'lime' },
    { label: 'Dark on white (pill)', value: 'dark-on-white' },
    { label: 'Dark on lime (pill)', value: 'dark-on-lime' },
    { label: 'Lime on dark (pill)', value: 'lime-fg-on-dark' },
    { label: 'White on dark (pill)', value: 'white-on-dark' },
  ];

  function normalizeStyle(v) {
    var x = String(v || '');
    if (x === 'lime-on-dark') {
      return 'dark-on-lime';
    }
    return ALLOWED.indexOf(x) !== -1 ? x : 'default';
  }

  function bemSuffix(v) {
    var s = normalizeStyle(v);
    return s === 'lime-fg-on-dark' ? 'lime-on-dark' : s;
  }

  function normalizeHeroTitleStyle(v) {
    var x = String(v || '');
    if (x === 'lime-on-black') {
      return 'lime-fg-on-dark';
    }
    if (x === 'lime-on-dark') {
      return 'dark-on-lime';
    }
    return HERO_TITLE_ALLOWED.indexOf(x) !== -1 ? x : 'default';
  }

  function heroTitleBemSuffix(v) {
    var s = normalizeHeroTitleStyle(v);
    return s === 'lime-fg-on-dark' ? 'lime-on-dark' : s;
  }

  w.unixeduTitleLineStyles = {
    TITLE_LINE_STYLE_OPTIONS: TITLE_LINE_STYLE_OPTIONS,
    HERO_TITLE_STYLE_OPTIONS: HERO_TITLE_STYLE_OPTIONS,
    normalizeStyle: normalizeStyle,
    bemSuffix: bemSuffix,
    normalizeHeroTitleStyle: normalizeHeroTitleStyle,
    heroTitleBemSuffix: heroTitleBemSuffix,
  };
})(window);
(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, SelectControl, TextareaControl, TextControl, Button } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light gray (#F5F5F5)', value: 'light-gray' },
    { label: 'Black', value: 'black' },
  ];

  const TLS = window.unixeduTitleLineStyles;
  const TITLE_LINE_STYLE_OPTIONS = TLS.TITLE_LINE_STYLE_OPTIONS;

  const CARD_TONE_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Lime', value: 'lime' },
    { label: 'Dark', value: 'dark' },
  ];

  function normalizeBg(v) {
    const x = String(v || '');
    return ['white', 'light-gray', 'black'].includes(x) ? x : 'white';
  }

  function normalizeLineStyle(v) {
    return TLS.normalizeStyle(v);
  }

  function titleLineBemSuffix(v) {
    return TLS.bemSuffix(v);
  }

  function normalizeTone(v) {
    const x = String(v || '');
    return ['default', 'lime', 'dark'].includes(x) ? x : 'default';
  }

  function ensureCards(cards) {
    if (Array.isArray(cards) && cards.length) return cards;
    return [
      {
        eyebrow: 'University placements',
        price: '£800 – £2,500',
        subtext: 'per student placed',
        details: 'UG · PG · Foundation · IYO · Pre-Master\nUK, EU, NA, AUS & NZ',
        urlText: 'View institutions →',
        url: '',
        tone: 'lime',
      },
      {
        eyebrow: 'Language schools',
        price: '15 – 30%',
        subtext: 'commission',
        details: 'General English · Exam Prep\nBusiness · Junior',
        urlText: 'View schools →',
        url: '',
        tone: 'default',
      },
      {
        eyebrow: 'Summer schools',
        price: '10 – 25%',
        subtext: 'commission',
        details: 'Residential & Day · Ages 8–17\nBuild long-term client relationships',
        urlText: 'View programmes →',
        url: '',
        tone: 'default',
      },
      {
        eyebrow: 'High school & boarding',
        price: '£2,000 – £5,000',
        subtext: 'per student placed',
        details: 'Premium boarding & private\nhigh schools worldwide',
        urlText: 'View institutions →',
        url: '',
        tone: 'dark',
      },
    ];
  }

  registerBlockType('unixedu/segments', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const bg = normalizeBg(attrs.background);
      const cards = ensureCards(attrs.cards);

      if (!Array.isArray(attrs.cards) || !attrs.cards.length) {
        setAttributes({ cards });
      }

      function updateCard(idx, patch) {
        const next = cards.map((c, i) => (i === idx ? { ...c, ...patch } : c));
        setAttributes({ cards: next });
      }

      const wrapperClasses = [
        'unixedu-segments',
        `unixedu-segments--bg-${bg}`,
        'is-editor-preview',
      ].join(' ');

      const titleLines = [
        { text: (attrs.titleLine1 || '').trim(), style: attrs.titleLine1Style },
        { text: (attrs.titleLine2 || '').trim(), style: attrs.titleLine2Style },
        { text: (attrs.titleLine3 || '').trim(), style: attrs.titleLine3Style },
      ].filter((l) => l.text);

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
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Header', initialOpen: true },
            wp.element.createElement(TextareaControl, {
              label: 'Eyebrow',
              value: attrs.eyebrow || '',
              rows: 2,
              onChange: (value) => setAttributes({ eyebrow: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 1',
              value: attrs.titleLine1 || '',
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
              rows: 2,
              onChange: (value) => setAttributes({ titleLine3: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 3 style',
              value: normalizeLineStyle(attrs.titleLine3Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine3Style: normalizeLineStyle(value) }),
            })
          )
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses },
          wp.element.createElement(
            'div',
            { className: 'unixedu-segments__inner' },
            wp.element.createElement(
              'header',
              { className: 'unixedu-section-header__head' },
              (attrs.eyebrow || '').trim()
                ? wp.element.createElement('p', { className: 'unixedu-section-header__eyebrow' }, attrs.eyebrow)
                : null,
              wp.element.createElement(
                'h2',
                { className: 'unixedu-section-header__title' },
                (titleLines.length ? titleLines : [{ text: 'Section title', style: 'default' }]).map((l, i) =>
                  wp.element.createElement(
                    'span',
                    {
                      key: i,
                      className: `unixedu-section-header__title-line unixedu-section-header__title-line--${titleLineBemSuffix(l.style)}`,
                    },
                    l.text
                  )
                )
              )
            ),
            wp.element.createElement(
              'div',
              { className: 'segment-grid unixedu-segments__grid' },
              cards.map((c, idx) => {
                const tone = normalizeTone(c.tone);
                const cardClasses = [
                  'segment-card',
                  tone === 'dark' ? 'segment-card--dark' : '',
                  tone === 'lime' ? 'segment-card--lime' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return wp.element.createElement(
                  'article',
                  { key: idx, className: cardClasses },
                  wp.element.createElement('p', { className: 'unixedu-segments__card-eyebrow' }, c.eyebrow || 'Eyebrow'),
                  wp.element.createElement('div', { className: 'segment-card__price' }, c.price || '—'),
                  wp.element.createElement('p', { className: 'unixedu-segments__card-subtext' }, c.subtext || ''),
                  wp.element.createElement('div', { className: 'unixedu-segments__divider', 'aria-hidden': 'true' }),
                  wp.element.createElement(
                    'p',
                    { className: 'unixedu-segments__details' },
                    String(c.details || '').trim()
                      ? String(c.details).split('\n').map((line, i) =>
                          wp.element.createElement(
                            'span',
                            { key: i, className: 'unixedu-segments__details-line' },
                            line
                          )
                        )
                      : null
                  ),
                  c.urlText ? wp.element.createElement('p', { className: 'unixedu-segments__card-link' }, c.urlText) : null,
                  wp.element.createElement(
                    'div',
                    { className: 'unixedu-segments__card-editor' },
                    wp.element.createElement(TextControl, {
                      label: `Card ${idx + 1} eyebrow`,
                      value: c.eyebrow || '',
                      onChange: (value) => updateCard(idx, { eyebrow: value }),
                    }),
                    wp.element.createElement(TextControl, {
                      label: `Card ${idx + 1} price`,
                      value: c.price || '',
                      onChange: (value) => updateCard(idx, { price: value }),
                    }),
                    wp.element.createElement(TextControl, {
                      label: `Card ${idx + 1} subtext`,
                      value: c.subtext || '',
                      onChange: (value) => updateCard(idx, { subtext: value }),
                    }),
                    wp.element.createElement(TextareaControl, {
                      label: `Card ${idx + 1} details (2 lines)`,
                      value: c.details || '',
                      rows: 2,
                      help: 'Use a new line to separate lines.',
                      onChange: (value) => updateCard(idx, { details: value }),
                    }),
                    wp.element.createElement(TextControl, {
                      label: `Card ${idx + 1} link text`,
                      value: c.urlText || '',
                      onChange: (value) => updateCard(idx, { urlText: value }),
                    }),
                    wp.element.createElement(TextControl, {
                      label: `Card ${idx + 1} link URL`,
                      value: c.url || '',
                      onChange: (value) => updateCard(idx, { url: value }),
                    }),
                    wp.element.createElement(SelectControl, {
                      label: `Card ${idx + 1} tone`,
                      value: tone,
                      options: CARD_TONE_OPTIONS,
                      onChange: (value) => updateCard(idx, { tone: normalizeTone(value) }),
                    }),
                    wp.element.createElement(Button, {
                      variant: 'secondary',
                      onClick: () => updateCard(idx, { tone: tone === 'dark' ? 'default' : 'dark' }),
                      style: { display: 'none' },
                    })
                  )
                );
              })
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

