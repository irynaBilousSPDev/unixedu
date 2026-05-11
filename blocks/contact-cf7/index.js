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
  const { PanelBody, SelectControl, TextareaControl, TextControl } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'Lime', value: 'lime' },
    { label: 'White', value: 'white' },
    { label: 'Light gray', value: 'light-gray' },
    { label: 'Black', value: 'black' },
  ];

  const TLS = window.unixeduTitleLineStyles;
  const TITLE_LINE_STYLE_OPTIONS = TLS.TITLE_LINE_STYLE_OPTIONS;

  function normalizeBg(v) {
    const x = String(v || '');
    return ['lime', 'white', 'light-gray', 'black'].includes(x) ? x : 'lime';
  }

  function normalizeLineStyle(v) {
    return TLS.normalizeStyle(v);
  }

  function titleLineBemSuffix(v) {
    return TLS.bemSuffix(v);
  }

  registerBlockType('unixedu/contact-cf7', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const bg = normalizeBg(attrs.background);

      const titleLines = [
        { text: (attrs.titleLine1 || '').trim(), style: attrs.titleLine1Style },
        { text: (attrs.titleLine2 || '').trim(), style: attrs.titleLine2Style },
      ].filter((l) => l.text);

      const wrapperClasses = [
        'unixedu-contact-cf7',
        `unixedu-contact-cf7--bg-${bg}`,
        'is-editor-preview',
      ].join(' ');

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
              label: 'Title line 2 (optional)',
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
              label: 'Text',
              value: attrs.text || '',
              placeholder: 'Section intro text (optional).',
              rows: 3,
              onChange: (value) => setAttributes({ text: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Left card (contact info)', initialOpen: false },
            wp.element.createElement(TextControl, {
              label: 'Top label',
              value: attrs.leftLabel || '',
              placeholder: 'Partnerships Team',
              onChange: (value) => setAttributes({ leftLabel: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Email label',
              value: attrs.emailLabel || '',
              placeholder: 'Email',
              onChange: (value) => setAttributes({ emailLabel: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Email',
              value: attrs.email || '',
              placeholder: 'name@example.com',
              onChange: (value) => setAttributes({ email: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Phone label',
              value: attrs.phoneLabel || '',
              placeholder: 'Phone',
              onChange: (value) => setAttributes({ phoneLabel: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Phone',
              value: attrs.phone || '',
              placeholder: '+00 00 0000 0000',
              onChange: (value) => setAttributes({ phone: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'WhatsApp label',
              value: attrs.whatsappLabel || '',
              placeholder: 'WhatsApp',
              onChange: (value) => setAttributes({ whatsappLabel: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'WhatsApp',
              value: attrs.whatsapp || '',
              placeholder: '+00 00 0000 0000',
              onChange: (value) => setAttributes({ whatsapp: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Note line 1',
              value: attrs.noteLine1 || '',
              placeholder: 'Short note (optional)',
              onChange: (value) => setAttributes({ noteLine1: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Note line 2',
              value: attrs.noteLine2 || '',
              placeholder: 'Short note (optional)',
              onChange: (value) => setAttributes({ noteLine2: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Right card (form)', initialOpen: false },
            wp.element.createElement(TextControl, {
              label: 'Form title (optional)',
              value: attrs.formTitle || '',
              placeholder: 'Form title (optional)',
              onChange: (value) => setAttributes({ formTitle: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Contact Form 7 shortcode',
              help: 'Paste a Contact Form 7 shortcode, e.g. [contact-form-7 id="123" title="Contact form"]',
              value: attrs.cf7Shortcode || '',
              placeholder: '[contact-form-7 id="123" title="Contact form"]',
              rows: 2,
              onChange: (value) => setAttributes({ cf7Shortcode: value }),
            })
          )
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses },
          wp.element.createElement(
            'div',
            { className: 'unixedu-contact-cf7__inner' },
            wp.element.createElement(
              'header',
              { className: 'unixedu-section-header__head' },
              (attrs.eyebrow || '').trim() ? wp.element.createElement('p', { className: 'unixedu-section-header__eyebrow' }, attrs.eyebrow) : null,
              wp.element.createElement(
                'h2',
                { className: 'unixedu-section-header__title' },
                (titleLines.length ? titleLines : [{ text: 'Section title (edit in sidebar)', style: 'default' }]).map((l, i) =>
                  wp.element.createElement(
                    'span',
                    { key: i, className: `unixedu-section-header__title-line unixedu-section-header__title-line--${titleLineBemSuffix(l.style)}` },
                    l.text
                  )
                )
              ),
              (attrs.text || '').trim()
                ? wp.element.createElement('p', { className: 'unixedu-contact-cf7__text' }, attrs.text)
                : wp.element.createElement('p', { className: 'unixedu-contact-cf7__text' }, 'Section intro text (optional).')
            ),
            wp.element.createElement(
              'div',
              { className: 'unixedu-contact-cf7__grid' },
              wp.element.createElement(
                'div',
                { className: 'unixedu-contact-cf7__card unixedu-contact-cf7__card--left' },
                wp.element.createElement('div', { className: 'unixedu-contact-cf7__left-label' }, (attrs.leftLabel || 'Team').toUpperCase()),
                wp.element.createElement('div', { className: 'unixedu-contact-cf7__left-divider', 'aria-hidden': 'true' }),
                wp.element.createElement('div', { className: 'unixedu-contact-cf7__kv' },
                  wp.element.createElement('div', { className: 'unixedu-contact-cf7__k' }, (attrs.emailLabel || 'Email').toUpperCase()),
                  wp.element.createElement('div', { className: 'unixedu-contact-cf7__v' }, (attrs.email || 'name@example.com'))
                ),
                wp.element.createElement('div', { className: 'unixedu-contact-cf7__kv' },
                  wp.element.createElement('div', { className: 'unixedu-contact-cf7__k' }, (attrs.phoneLabel || 'Phone').toUpperCase()),
                  wp.element.createElement('div', { className: 'unixedu-contact-cf7__v' }, (attrs.phone || '+00 00 0000 0000'))
                ),
                wp.element.createElement('div', { className: 'unixedu-contact-cf7__kv' },
                  wp.element.createElement('div', { className: 'unixedu-contact-cf7__k' }, (attrs.whatsappLabel || 'WhatsApp').toUpperCase()),
                  wp.element.createElement('div', { className: 'unixedu-contact-cf7__v' }, (attrs.whatsapp || '+00 00 0000 0000'))
                ),
                (attrs.noteLine1 || attrs.noteLine2)
                  ? wp.element.createElement(
                      'div',
                      { className: 'unixedu-contact-cf7__notes' },
                      (attrs.noteLine1 || '').trim() ? wp.element.createElement('p', null, attrs.noteLine1) : null,
                      (attrs.noteLine2 || '').trim() ? wp.element.createElement('p', null, attrs.noteLine2) : null
                    )
                  : wp.element.createElement('div', { className: 'unixedu-contact-cf7__notes' },
                      wp.element.createElement('p', null, 'Optional note line.'),
                      wp.element.createElement('p', null, 'Optional note line.')
                    )
              ),
              wp.element.createElement(
                'div',
                { className: 'unixedu-contact-cf7__card unixedu-contact-cf7__card--right' },
                (attrs.formTitle || '').trim() ? wp.element.createElement('h3', { className: 'unixedu-contact-cf7__form-title' }, attrs.formTitle) : null,
                wp.element.createElement(
                  'div',
                  { className: 'unixedu-contact-cf7__form-ph' },
                  (attrs.cf7Shortcode || '').trim()
                    ? wp.element.createElement('code', null, attrs.cf7Shortcode)
                    : wp.element.createElement('p', null, 'Paste a Contact Form 7 shortcode in the sidebar.')
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

