# uniXedu WordPress Theme

Custom WordPress theme built for the uniXedu website.

## Requirements

- WordPress: 6.0+
- PHP: 8.0+
- Node.js + npm (for local asset builds)

## Install (theme)

1. Copy this folder to `wp-content/themes/unixedu/`.
2. In WP Admin → **Appearance → Themes**, activate **uniXedu**.
3. Run `npm install` and `npm run build` (or `npm run dev` while developing) so `assets/dist/` is populated before going live.

## Development (build assets)

Install dependencies:

```bash
npm install
```

Development watch (SCSS, JS, and images under `assets/src/images/`):

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Outputs (Gulp writes to `assets/dist/`):

- `assets/dist/css/main.css` — from `assets/src/scss/main.scss`
- `assets/dist/js/main.js` — concatenates `assets/src/js/modules/**/*.js` then `assets/src/js/main.js`
- `assets/dist/images/**` — copied from `assets/src/images/`

## Theme structure (high level)

- `assets/src/` — SCSS, JS modules, and optional raster/SVG sources for `assets/dist/images`
- `assets/dist/` — compiled CSS/JS and copied images (generated; safe to rebuild)
- `blocks/` — Gutenberg blocks (each folder has `block.json`; PHP registers them from `inc/blocks.php`)
- `blocks/shared/` — small editor-only JS helpers imported by blocks
- `inc/` — setup, enqueue, helpers, **Customizer**, Gutenberg, block registration
- `static/` — brand and footer assets served via helpers (not processed by Gulp)

## Customizer

**Appearance → Customize**

- **Footer: tagline & company** — Plain text (line breaks preserved). Tagline appears above the footer logo; company / legal lines appear under the logo. Clear a field and publish to hide that block.
- **Footer: Follow us links** — Full `https://` profile URLs. Icons are output only for networks you fill in.

## Gutenberg blocks

Blocks are registered from `blocks/*/block.json`.

| Block name | Inserter title |
|------------|----------------|
| `unixedu/hero` | Hero |
| `unixedu/who-cards` | Audience Cards |
| `unixedu/process-steps` | Process Steps |
| `unixedu/logo-marquee` | Logo Marquee |
| `unixedu/section-header` | Flexible Universal Section |
| `unixedu/cta-strip` | CTA Strip |
| `unixedu/media-cta` | Media CTA |
| `unixedu/segments` | Segments |
| `unixedu/feature-list-media` | Feature List + Media |
| `unixedu/commission-table` | Commission Table |
| `unixedu/contact-cf7` | Contact (CF7) |

### Block assets

- **Editor JS**: `blocks/<name>/index.js` (Inspector controls, preview markup).
- **Frontend PHP**: `blocks/<name>/render.php` for dynamic blocks.
- **Theme styles**: partials under `assets/src/scss/blocks/` are pulled in via `assets/src/scss/blocks/_index.scss`.
- **Bundled theme JS**: `assets/src/js/main.js` imports modules from `assets/src/js/modules/`.

### Static assets

- Default logo marquee images: `static/images/logo-marquee/`
- Footer logo and social icons used by the theme: `static/images/footer/`, `static/images/social/`

## Other templates

- `404.php` — not-found page template (styles in `assets/src/scss/pages/_page-not-found.scss`).

## Notes

- `functions.php` only loads files from `inc/`.
- Long-lived brand or legal imagery should live in `static/` rather than only in `assets/dist/`.
- **Contact (CF7)** expects Contact Form 7 (or compatible markup) where you place the block; style the form via `_contact-cf7.scss` and CF7 form classes.
