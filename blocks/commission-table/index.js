(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, SelectControl, TextareaControl, TextControl, Button, ToggleControl } = wp.components;
  const { Fragment } = wp.element;

  const BG_OPTIONS = [
    { label: 'White', value: 'white' },
    { label: 'Light gray (#F5F5F5)', value: 'light-gray' },
    { label: 'Black', value: 'black' },
  ];

  const TITLE_LINE_STYLE_OPTIONS = [
    { label: 'Default', value: 'default' },
    { label: 'Lime', value: 'lime' },
    { label: 'White', value: 'white' },
    { label: 'Lime on dark', value: 'lime-on-dark' },
  ];

  function normalizeBg(v) {
    const x = String(v || '');
    return ['white', 'light-gray', 'black'].includes(x) ? x : 'white';
  }

  function normalizeLineStyle(v) {
    const x = String(v || '');
    return ['default', 'lime', 'white', 'lime-on-dark'].includes(x) ? x : 'default';
  }

  function ensureRows(rows) {
    if (Array.isArray(rows) && rows.length) return rows;
    return [
      { c1: '1 – 3 students', c2: '40%', c3: 'EUR 240 / student', c4: 'EUR 240 – 720', isHighlighted: false },
      { c1: '4 – 10 students', c2: '50%', c3: 'EUR 300 / student', c4: 'EUR 1,200 – 3,000', isHighlighted: false },
      { c1: '11 – 20 students', c2: '60%', c3: 'EUR 360 / student', c4: 'EUR 3,960 – 7,200', isHighlighted: false },
      { c1: '20+ students', c2: '70%', c3: 'EUR 420 / student', c4: 'EUR 8,400+', isHighlighted: true },
    ];
  }

  registerBlockType('unixedu/commission-table', {
    edit: function Edit({ attributes, setAttributes }) {
      const attrs = attributes;
      const bg = normalizeBg(attrs.background);
      const rows = ensureRows(attrs.rows);
      const footnote = typeof attrs.footnote === 'string' ? attrs.footnote : '';

      // Initialize default rows once.
      if (!Array.isArray(attrs.rows) || !attrs.rows.length) {
        setAttributes({ rows });
      }

      function updateRow(idx, patch) {
        const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
        setAttributes({ rows: next });
      }

      function addRow() {
        const next = [...rows, { c1: '', c2: '', c3: '', c4: '', isHighlighted: false }];
        setAttributes({ rows: next });
      }

      function removeRow(idx) {
        const next = rows.filter((_, i) => i !== idx);
        setAttributes({ rows: next });
      }

      function moveRow(idx, dir) {
        const next = [...rows];
        const target = idx + dir;
        if (target < 0 || target >= next.length) return;
        const tmp = next[idx];
        next[idx] = next[target];
        next[target] = tmp;
        setAttributes({ rows: next });
      }

      const wrapperClasses = [
        'unixedu-commission-table',
        `unixedu-commission-table--bg-${bg}`,
        'is-editor-preview',
      ].join(' ');

      const titleLines = [
        { text: (attrs.titleLine1 || '').trim(), style: normalizeLineStyle(attrs.titleLine1Style) },
        { text: (attrs.titleLine2 || '').trim(), style: normalizeLineStyle(attrs.titleLine2Style) },
        { text: (attrs.titleLine3 || '').trim(), style: normalizeLineStyle(attrs.titleLine3Style) },
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
              placeholder: 'Optional eyebrow',
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
          ),
          wp.element.createElement(
            PanelBody,
            { title: 'Footnote', initialOpen: false },
            wp.element.createElement(TextareaControl, {
              label: 'Text under table',
              value: footnote,
              rows: 3,
              onChange: (value) => setAttributes({ footnote: value }),
            })
          )
        ),
        wp.element.createElement(
          'section',
          { className: wrapperClasses },
          wp.element.createElement(
            'div',
            { className: 'unixedu-commission-table__inner' },
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
                    { key: i, className: `unixedu-section-header__title-line unixedu-section-header__title-line--${l.style}` },
                    l.text
                  )
                )
              )
            ),
            wp.element.createElement(
              'div',
              { className: 'unixedu-commission-table__table-wrap' },
              wp.element.createElement(
                'table',
                { className: 'commission-table' },
                wp.element.createElement(
                  'thead',
                  null,
                  wp.element.createElement(
                    'tr',
                    null,
                    wp.element.createElement('th', null, 'Students placed / year'),
                    wp.element.createElement('th', null, 'Your commission'),
                    wp.element.createElement('th', null, 'Partner fee / student'),
                    wp.element.createElement('th', null, 'Annual estimate')
                  )
                ),
                wp.element.createElement(
                  'tbody',
                  null,
                  rows.map((r, idx) =>
                    wp.element.createElement(
                      'tr',
                      { key: idx, className: r.isHighlighted ? 'is-highlighted' : '' },
                      wp.element.createElement('td', null, r.c1 || '—'),
                      wp.element.createElement('td', null, r.c2 || '—'),
                      wp.element.createElement('td', null, r.c3 || '—'),
                      wp.element.createElement('td', null, r.c4 || '—')
                    )
                  )
                )
              )
            ),
            (footnote || '').trim()
              ? wp.element.createElement(
                  'p',
                  { className: 'unixedu-commission-table__footnote' },
                  footnote
                )
              : null,
            wp.element.createElement(
              'div',
              { className: 'unixedu-commission-table__editor' },
              wp.element.createElement(
                'div',
                { className: 'unixedu-commission-table__editor-head' },
                wp.element.createElement('strong', null, 'Rows'),
                wp.element.createElement(Button, { variant: 'secondary', onClick: addRow }, 'Add row')
              ),
              rows.map((r, idx) =>
                wp.element.createElement(
                  'div',
                  { key: idx, className: 'unixedu-commission-table__row-editor' },
                  wp.element.createElement(TextControl, {
                    label: `Row ${idx + 1} col 1`,
                    value: r.c1 || '',
                    onChange: (value) => updateRow(idx, { c1: value }),
                  }),
                  wp.element.createElement(TextControl, {
                    label: `Row ${idx + 1} col 2`,
                    value: r.c2 || '',
                    onChange: (value) => updateRow(idx, { c2: value }),
                  }),
                  wp.element.createElement(TextControl, {
                    label: `Row ${idx + 1} col 3`,
                    value: r.c3 || '',
                    onChange: (value) => updateRow(idx, { c3: value }),
                  }),
                  wp.element.createElement(TextControl, {
                    label: `Row ${idx + 1} col 4`,
                    value: r.c4 || '',
                    onChange: (value) => updateRow(idx, { c4: value }),
                  }),
                  wp.element.createElement(ToggleControl, {
                    label: 'Highlighted row',
                    checked: !!r.isHighlighted,
                    onChange: (value) => updateRow(idx, { isHighlighted: !!value }),
                  }),
                  wp.element.createElement(
                    'div',
                    { style: { display: 'flex', gap: '8px', marginTop: '8px' } },
                    wp.element.createElement(Button, { variant: 'secondary', onClick: () => moveRow(idx, -1), disabled: idx === 0 }, 'Up'),
                    wp.element.createElement(
                      Button,
                      { variant: 'secondary', onClick: () => moveRow(idx, 1), disabled: idx === rows.length - 1 },
                      'Down'
                    ),
                    wp.element.createElement(Button, { variant: 'link', isDestructive: true, onClick: () => removeRow(idx) }, 'Remove')
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

