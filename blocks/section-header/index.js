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
  const { PanelBody, SelectControl, TextareaControl } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light gray (#F5F5F5)', value: 'light-gray' },
    { label: 'Black', value: 'black' },
  ];

  const RENDER_MODE_OPTIONS = [
    { label: 'Inside section (header only)', value: 'inner' },
    { label: 'Standalone section', value: 'section' },
  ];

  const MAX_WIDTH_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Compact', value: 'compact' },
    { label: 'Wide', value: 'wide' },
  ];

  const TLS = window.unixeduTitleLineStyles;
  const TITLE_LINE_STYLE_OPTIONS = TLS.TITLE_LINE_STYLE_OPTIONS;

  const CONTENT_FONT_WEIGHT_OPTIONS = [
    { label: '400', value: 400 },
    { label: '500', value: 500 },
    { label: '600', value: 600 },
    { label: '700', value: 700 },
  ];

  function normalizeRenderMode(v) {
    const x = String(v || '');
    return ['inner', 'section'].includes(x) ? x : 'inner';
  }

  function normalizeMaxWidth(v) {
    const x = String(v || '');
    return ['default', 'compact', 'wide'].includes(x) ? x : 'default';
  }

  function normalizeLineStyle(v) {
    return TLS.normalizeStyle(v);
  }

  function titleLineBemSuffix(v) {
    return TLS.bemSuffix(v);
  }

  function toInt(value, fallback) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalizeBg(v) {
    const x = String(v || '');
    return ['white', 'light-gray', 'black'].includes(x) ? x : 'white';
  }

  function TitlePreview({ attrs }) {
    const lines = [
      { text: (attrs.titleLine1 || '').trim(), style: attrs.titleLine1Style },
      { text: (attrs.titleLine2 || '').trim(), style: attrs.titleLine2Style },
      { text: (attrs.titleLine3 || '').trim(), style: attrs.titleLine3Style },
    ].filter((l) => l.text);

    const previewLines = lines.length
      ? lines
      : [{ text: 'Section title', style: 'default' }];

    return wp.element.createElement(
      'h2',
      { className: 'unixedu-section-header__title' },
      previewLines.map((l, idx) =>
        wp.element.createElement(
          'span',
          {
            key: idx,
            className: `unixedu-section-header__title-line unixedu-section-header__title-line--${titleLineBemSuffix(l.style)}`,
          },
          l.text
        )
      )
    );
  }

  registerBlockType('unixedu/section-header', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const renderMode = normalizeRenderMode(attrs.renderMode);
      const maxWidth = normalizeMaxWidth(attrs.maxWidth);
      const bg = normalizeBg(attrs.background);

      const wrapperClasses = [
        'unixedu-section-header',
        `unixedu-section-header--bg-${bg}`,
        `unixedu-section-header--mode-${renderMode}`,
        `unixedu-section-header--width-${maxWidth}`,
        'is-editor-preview',
      ].join(' ');

      const eyebrowPreview = (attrs.eyebrow || '').trim() ? attrs.eyebrow : 'Eyebrow';

      const headerEl = wp.element.createElement(
        'header',
        { className: 'unixedu-section-header__head' },
        wp.element.createElement('p', { className: 'unixedu-section-header__eyebrow' }, eyebrowPreview),
        wp.element.createElement(TitlePreview, { attrs }),
        (attrs.text || '').trim()
          ? wp.element.createElement('p', { className: 'unixedu-section-header__text' }, attrs.text)
          : null,
        (attrs.content || '').trim()
          ? wp.element.createElement(
              'div',
              {
                className: 'unixedu-section-header__content',
                style: { fontWeight: String(attrs.contentFontWeight || 500) },
              },
              attrs.content
            )
          : null
      );

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
              onChange: (value) => setAttributes({ background: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Render mode',
              value: renderMode,
              options: RENDER_MODE_OPTIONS,
              onChange: (value) => setAttributes({ renderMode: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Max width',
              value: maxWidth,
              options: MAX_WIDTH_OPTIONS,
              onChange: (value) => setAttributes({ maxWidth: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Content', initialOpen: true },
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
              value: normalizeLineStyle(attrs.titleLine1Style),
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
              value: normalizeLineStyle(attrs.titleLine2Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine2Style: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Title line 3',
              value: attrs.titleLine3 || '',
              rows: 2,
              onChange: (value) => setAttributes({ titleLine3: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Title line 3 style',
              value: normalizeLineStyle(attrs.titleLine3Style),
              options: TITLE_LINE_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ titleLine3Style: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Text (optional)',
              value: attrs.text || '',
              placeholder: 'Optional text',
              rows: 4,
              onChange: (value) => setAttributes({ text: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Content (optional)',
              value: attrs.content || '',
              placeholder: 'Optional content',
              rows: 3,
              onChange: (value) => setAttributes({ content: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Content font weight',
              value: attrs.contentFontWeight || 500,
              options: CONTENT_FONT_WEIGHT_OPTIONS,
              onChange: (value) => setAttributes({ contentFontWeight: toInt(value, 500) }),
            })
          )
        ),
        renderMode === 'section'
          ? wp.element.createElement(
              'section',
              { className: wrapperClasses },
              wp.element.createElement('div', { className: 'unixedu-section-header__inner' }, headerEl)
            )
          : wp.element.createElement('div', { className: wrapperClasses }, headerEl)
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp);

