/**
 * Shared title line style helpers for uniXedu blocks (editor).
 * Canonical copy: prepended to each block `index.js` so blocks register even if a separate script fails to load.
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
