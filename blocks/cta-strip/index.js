(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, SelectControl, TextareaControl, TextControl } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'Lime', value: 'lime' },
    { label: 'Black', value: 'black' },
  ];

  function normalizeBg(v) {
    const x = String(v || '');
    return ['lime', 'black'].includes(x) ? x : 'lime';
  }

  registerBlockType('unixedu/cta-strip', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const bg = normalizeBg(attrs.background);
      const showButton = (attrs.buttonText || '').trim() && (attrs.buttonUrl || '').trim();

      const wrapperClasses = [
        'unixedu-cta-strip',
        `unixedu-cta-strip--${bg}`,
        'is-editor-preview',
      ].join(' ');

      const titlePreview = (attrs.title || '').trim() ? attrs.title : 'CTA title';
      const textPreview = (attrs.text || '').trim() ? attrs.text : '';

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
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Content', initialOpen: true },
            wp.element.createElement(TextareaControl, {
              label: 'Title',
              value: attrs.title || '',
              placeholder: 'CTA title',
              rows: 2,
              onChange: (value) => setAttributes({ title: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Text',
              value: attrs.text || '',
              placeholder: 'Optional text',
              rows: 3,
              onChange: (value) => setAttributes({ text: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Button text',
              value: attrs.buttonText || '',
              onChange: (value) => setAttributes({ buttonText: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Button URL',
              value: attrs.buttonUrl || '',
              placeholder: 'https://…',
              onChange: (value) => setAttributes({ buttonUrl: value }),
            })
          )
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses },
          wp.element.createElement(
            'div',
            { className: 'unixedu-cta-strip__inner' },
            wp.element.createElement(
              'div',
              { className: 'unixedu-cta-strip__content' },
              wp.element.createElement('h2', { className: 'unixedu-cta-strip__title' }, titlePreview),
              textPreview ? wp.element.createElement('p', { className: 'unixedu-cta-strip__text' }, textPreview) : null
            ),
            showButton
              ? wp.element.createElement(
                  'div',
                  { className: 'unixedu-cta-strip__actions' },
                  wp.element.createElement(
                    'span',
                    { className: 'unixedu-cta-strip__button' },
                    `${attrs.buttonText} →`
                  )
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

