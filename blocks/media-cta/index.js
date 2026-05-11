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
  const { InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
  const { PanelBody, SelectControl, TextareaControl, TextControl, Button } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light gray', value: 'light-gray' },
    { label: 'Black', value: 'black' },
    { label: 'Background image', value: 'image' },
  ];

  const BG_POS_OPTIONS = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  const CONTENT_PLACEMENT_OPTIONS = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  const TLS = window.unixeduTitleLineStyles;
  const TITLE_LINE_STYLE_OPTIONS = TLS.TITLE_LINE_STYLE_OPTIONS;

  const BUTTON_STYLE_OPTIONS = [
    { label: 'Lime', value: 'lime' },
    { label: 'Dark', value: 'dark' },
    { label: 'Black', value: 'black' },
    { label: 'Outline (light)', value: 'outline-light' },
    { label: 'Outline (dark)', value: 'outline-dark' },
  ];

  function normalizeBg(v) {
    const x = String(v || '');
    return ['white', 'light-gray', 'black', 'image'].includes(x) ? x : 'white';
  }

  function normalizeBgPos(v) {
    const x = String(v || '');
    return ['left', 'right', 'center'].includes(x) ? x : 'center';
  }

  function normalizeContentPlacement(v) {
    const x = String(v || '');
    return ['left', 'center', 'right'].includes(x) ? x : 'center';
  }

  function normalizeLineStyle(v) {
    return TLS.normalizeStyle(v);
  }

  function titleLineBemSuffix(v) {
    return TLS.bemSuffix(v);
  }

  function normalizeBtnStyle(v) {
    const x = String(v || '');
    return ['lime', 'dark', 'black', 'outline-light', 'outline-dark'].includes(x) ? x : 'lime';
  }

  registerBlockType('unixedu/media-cta', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const bg = normalizeBg(attrs.backgroundMode);
      const bgPos = normalizeBgPos(attrs.backgroundPosition);
      const contentPlacement = normalizeContentPlacement(attrs.contentPlacement);
      const btnStyle = normalizeBtnStyle(attrs.buttonStyle);
      const showButton = (attrs.buttonText || '').trim() && (attrs.buttonUrl || '').trim();

      const wrapperClasses = [
        'unixedu-media-cta',
        `unixedu-media-cta--bg-${bg}`,
        `unixedu-media-cta--content-${contentPlacement}`,
        'is-editor-preview',
      ].join(' ');

      const headerTitleLines = [
        { text: (attrs.titleLine1 || '').trim(), style: attrs.titleLine1Style },
        { text: (attrs.titleLine2 || '').trim(), style: attrs.titleLine2Style },
        { text: (attrs.titleLine3 || '').trim(), style: attrs.titleLine3Style },
      ].filter((l) => l.text);

      const style = {
        ...(bg === 'image' && (attrs.backgroundImageUrl || '').trim()
          ? { backgroundImage: `url(${attrs.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: bgPos }
          : {}),
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
              onChange: (value) => setAttributes({ backgroundMode: normalizeBg(value) }),
            }),
            bg === 'image'
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
                            (attrs.backgroundImageUrl || '').trim() ? 'Replace background image' : 'Select background image'
                          ),
                          (attrs.backgroundImageUrl || '').trim()
                            ? wp.element.createElement(
                                Button,
                                {
                                  variant: 'link',
                                  isDestructive: true,
                                  onClick: () => setAttributes({ backgroundImageId: 0, backgroundImageUrl: '', backgroundImageAlt: '' }),
                                },
                                'Remove'
                              )
                            : null
                        ),
                    })
                  )
                )
              : null,
            wp.element.createElement(SelectControl, {
              label: 'Background image position',
              value: bgPos,
              options: BG_POS_OPTIONS,
              onChange: (value) => setAttributes({ backgroundPosition: normalizeBgPos(value) }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Header placement',
              value: contentPlacement,
              options: CONTENT_PLACEMENT_OPTIONS,
              onChange: (value) => setAttributes({ contentPlacement: normalizeContentPlacement(value) }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Content', initialOpen: true },
            wp.element.createElement(TextareaControl, {
              label: 'Eyebrow',
              value: attrs.eyebrow || '',
              rows: 2,
              placeholder: 'Optional eyebrow',
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
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Text',
              value: attrs.text || '',
              rows: 3,
              placeholder: 'Neutral supporting text',
              onChange: (value) => setAttributes({ text: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Button', initialOpen: false },
            wp.element.createElement(TextControl, {
              label: 'Button text',
              value: attrs.buttonText || '',
              placeholder: 'Find my university',
              onChange: (value) => setAttributes({ buttonText: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Button URL',
              value: attrs.buttonUrl || '',
              placeholder: 'https://… or /page',
              onChange: (value) => setAttributes({ buttonUrl: value }),
            }),
            wp.element.createElement(SelectControl, {
              label: 'Button style',
              value: btnStyle,
              options: BUTTON_STYLE_OPTIONS,
              onChange: (value) => setAttributes({ buttonStyle: normalizeBtnStyle(value) }),
            })
          )
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses, style },
          wp.element.createElement(
            'div',
            { className: 'unixedu-media-cta__inner' },
            wp.element.createElement(
              'div',
              { className: 'unixedu-media-cta__content' },
              wp.element.createElement(
                'header',
                { className: 'unixedu-section-header__head' },
                (attrs.eyebrow || '').trim()
                  ? wp.element.createElement('p', { className: 'unixedu-section-header__eyebrow' }, attrs.eyebrow)
                  : null,
                wp.element.createElement(
                  'h2',
                  { className: 'unixedu-section-header__title' },
                  (headerTitleLines.length ? headerTitleLines : [{ text: 'Section title', style: 'default' }]).map((l, i) =>
                    wp.element.createElement(
                      'span',
                      {
                        key: i,
                        className: `unixedu-section-header__title-line unixedu-section-header__title-line--${titleLineBemSuffix(l.style)}`,
                      },
                      l.text
                    )
                  )
                ),
                (attrs.text || '').trim()
                  ? wp.element.createElement('p', { className: 'unixedu-media-cta__text' }, attrs.text)
                  : null
              ),
              showButton
                ? wp.element.createElement(
                    'div',
                    { className: 'unixedu-media-cta__actions' },
                    wp.element.createElement(
                      'a',
                      { className: `btn btn--${btnStyle}`, href: attrs.buttonUrl },
                      attrs.buttonText,
                      wp.element.createElement('span', { 'aria-hidden': 'true' }, ' →')
                    )
                  )
                : null
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

