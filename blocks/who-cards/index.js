(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, SelectControl, ToggleControl, TextControl, TextareaControl } = wp.components;
  const { Fragment } = wp.element;

  const BACKGROUND_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light (#F5F5F5)', value: 'gray' },
    { label: 'Black', value: 'black' },
  ];

  const CARD_TYPE_OPTIONS = [
    { label: 'Light', value: 'light' },
    { label: 'Dark (featured)', value: 'dark' },
  ];

  function CardPanel({ index, attrs, setAttributes }) {
    const prefix = `card${index}`;
    const get = (key) => attrs[`${prefix}${key}`];
    const set = (key, value) => setAttributes({ [`${prefix}${key}`]: value });

    return wp.element.createElement(
      PanelBody,
      { title: `Card ${index}`, initialOpen: false },
      wp.element.createElement(SelectControl, {
        label: 'Type',
        value: get('Type'),
        options: CARD_TYPE_OPTIONS,
        onChange: (value) => set('Type', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Eyebrow',
        value: get('Eyebrow'),
        rows: 2,
        onChange: (value) => set('Eyebrow', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Title',
        value: get('Title'),
        rows: 3,
        onChange: (value) => set('Title', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Text',
        value: get('Text'),
        rows: 4,
        onChange: (value) => set('Text', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Button text',
        value: get('ButtonText'),
        rows: 2,
        onChange: (value) => set('ButtonText', value),
      }),
      wp.element.createElement(TextControl, {
        label: 'Button URL',
        value: get('ButtonUrl'),
        onChange: (value) => set('ButtonUrl', value),
      }),
      wp.element.createElement(TextareaControl, {
        label: 'Small URL text (bottom)',
        value: get('SmallUrlText'),
        rows: 2,
        onChange: (value) => set('SmallUrlText', value),
      })
    );
  }

  registerBlockType('unixedu/who-cards', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;

      const cards = [
        {
          type: attrs.card1Type || 'light',
          eyebrow: attrs.card1Eyebrow || '',
          title: attrs.card1Title || '',
          text: attrs.card1Text || '',
          buttonText: attrs.card1ButtonText || '',
        },
        {
          type: attrs.card2Type || 'dark',
          eyebrow: attrs.card2Eyebrow || '',
          title: attrs.card2Title || '',
          text: attrs.card2Text || '',
          buttonText: attrs.card2ButtonText || '',
        },
        {
          type: attrs.card3Type || 'light',
          eyebrow: attrs.card3Eyebrow || '',
          title: attrs.card3Title || '',
          text: attrs.card3Text || '',
          buttonText: attrs.card3ButtonText || '',
        },
      ];

      const previewEyebrow = (attrs.eyebrow || '').trim() || 'Eyebrow';
      const previewTitle1 = (attrs.titleLine1 || '').trim() || 'Section title';
      const previewTitle2 = (attrs.titleLine2 || '').trim() || '';
      const previewText = (attrs.text || '').trim() || '';

      return wp.element.createElement(
        Fragment,
        null,
        wp.element.createElement(
          InspectorControls,
          null,
          wp.element.createElement(
            PanelBody,
            { title: 'Appearance', initialOpen: true },
            wp.element.createElement(SelectControl, {
              label: 'Background',
              value: attrs.background || 'white',
              options: BACKGROUND_OPTIONS,
              onChange: (value) => setAttributes({ background: value }),
            })
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Section', initialOpen: true },
            wp.element.createElement(SelectControl, {
              label: 'Background',
              value: attrs.background || 'white',
              options: BACKGROUND_OPTIONS,
              onChange: (value) => setAttributes({ background: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Eyebrow',
              value: attrs.eyebrow,
              placeholder: 'Eyebrow',
              onChange: (value) => setAttributes({ eyebrow: value }),
            }),
            wp.element.createElement(ToggleControl, {
              label: 'Eyebrow underline',
              checked: !!attrs.showEyebrowUnderline,
              onChange: (value) => setAttributes({ showEyebrowUnderline: !!value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Title line 1',
              value: attrs.titleLine1,
              placeholder: 'Section title',
              onChange: (value) => setAttributes({ titleLine1: value }),
            }),
            wp.element.createElement(TextControl, {
              label: 'Title line 2',
              value: attrs.titleLine2,
              onChange: (value) => setAttributes({ titleLine2: value }),
            }),
            wp.element.createElement(TextareaControl, {
              label: 'Text',
              value: attrs.text,
              placeholder: 'Optional text',
              onChange: (value) => setAttributes({ text: value }),
            })
          ),
          wp.element.createElement(CardPanel, { index: 1, attrs, setAttributes }),
          wp.element.createElement(CardPanel, { index: 2, attrs, setAttributes }),
          wp.element.createElement(CardPanel, { index: 3, attrs, setAttributes })
        ),
        wp.element.createElement(
          'section',
          {
            className: `unixedu-who-section who-section unixedu-who-section--${attrs.background || 'white'} ${
              attrs.showEyebrowUnderline ? 'has-underline' : ''
            }`,
          },
          wp.element.createElement(
            'div',
            { className: 'container' },
            wp.element.createElement(
              'header',
              { className: `unixedu-who-section__head ${attrs.showEyebrowUnderline ? 'has-underline' : ''}` },
              wp.element.createElement('p', { className: 'unixedu-who-section__eyebrow' }, (attrs.eyebrow || '').trim() ? attrs.eyebrow : previewEyebrow),
              wp.element.createElement(
                'h2',
                { className: 'unixedu-who-section__title' },
                wp.element.createElement('span', { className: 'unixedu-who-section__title-line' }, (attrs.titleLine1 || '').trim() ? attrs.titleLine1 : previewTitle1),
                previewTitle2 ? wp.element.createElement('span', { className: 'unixedu-who-section__title-line' }, previewTitle2) : null
              ),
              previewText ? wp.element.createElement('p', { className: 'unixedu-who-section__text' }, previewText) : null
            ),
            wp.element.createElement(
              'div',
              { className: 'path-grid unixedu-who-section__grid' },
              cards.map((c, i) =>
                wp.element.createElement(
                  'article',
                  {
                    key: i,
                    className: `path-card unixedu-who-card ${c.type === 'dark' ? 'path-card--dark unixedu-who-card--dark' : ''}`,
                    style: { minHeight: '290px' },
                  },
                  wp.element.createElement('p', { className: 'path-card__eyebrow' }, c.eyebrow || 'Card eyebrow'),
                  wp.element.createElement('h3', { className: 'path-card__title' }, c.title || 'Card title'),
                  wp.element.createElement('p', { className: 'path-card__text' }, c.text || 'Card text'),
                  c.buttonText ? wp.element.createElement('span', { className: `btn ${c.type === 'dark' ? 'btn--lime' : 'btn--black'}` }, c.buttonText) : null
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

