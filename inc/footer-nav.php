<?php
/**
 * Footer nav helpers: social icon slug from menu items (no guessed URLs / 404s).
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

/**
 * Social networks we ship SVGs for (slug => icon filename without path).
 *
 * @return list<string>
 */
function unixedu_footer_social_known_slugs(): array {
	return ['instagram', 'tiktok', 'youtube', 'facebook', 'linkedin', 'x'];
}

/**
 * @return array<string, string>
 */
function unixedu_footer_social_slug_aliases(): array {
	return [
		'twitter'   => 'x',
		'x-twitter' => 'x',
	];
}

function unixedu_footer_social_canonical_slug(string $slug): string {
	$slug = strtolower(trim($slug));
	$aliases = unixedu_footer_social_slug_aliases();

	return $aliases[$slug] ?? $slug;
}

/**
 * @param array<int, mixed> $classes
 */
function unixedu_footer_social_slug_from_classes(array $classes): ?string {
	foreach ($classes as $class) {
		if (! is_string($class) || '' === $class) {
			continue;
		}
		if (preg_match('/^unixedu-social-([a-z0-9-]+)$/i', $class, $matches)) {
			return unixedu_footer_social_canonical_slug($matches[1]);
		}
	}

	return null;
}

function unixedu_footer_social_slug_from_url(string $url): ?string {
	$url = trim($url);
	if ('' === $url) {
		return null;
	}

	$host = wp_parse_url($url, PHP_URL_HOST);
	if (! is_string($host) || '' === $host) {
		return null;
	}

	$host = strtolower($host);
	if (str_starts_with($host, 'www.')) {
		$host = substr($host, 4);
	}

	$map = [
		'instagram.com'  => 'instagram',
		'tiktok.com'     => 'tiktok',
		'youtube.com'    => 'youtube',
		'youtu.be'       => 'youtube',
		'facebook.com'   => 'facebook',
		'fb.com'         => 'facebook',
		'linkedin.com'   => 'linkedin',
		'twitter.com'    => 'x',
		'x.com'          => 'x',
	];

	foreach ($map as $domain => $slug) {
		if ($host === $domain || str_ends_with($host, '.' . $domain)) {
			return $slug;
		}
	}

	return null;
}

/**
 * Resolve icon slug for a top-level nav menu item (class `unixedu-social-{slug}`, URL host, or title slug).
 */
function unixedu_footer_social_slug_from_item(object $item): ?string {
	$known = unixedu_footer_social_known_slugs();

	$classes = [];
	if (isset($item->classes) && is_array($item->classes)) {
		$classes = $item->classes;
	}

	$from_class = unixedu_footer_social_slug_from_classes($classes);
	if (null !== $from_class && in_array($from_class, $known, true)) {
		return $from_class;
	}

	$url = isset($item->url) ? trim((string) $item->url) : '';
	if ('' !== $url && '#' !== $url) {
		$from_host = unixedu_footer_social_slug_from_url($url);
		if (null !== $from_host && in_array($from_host, $known, true)) {
			return $from_host;
		}
	}

	if (isset($item->title)) {
		$title_slug = sanitize_title((string) $item->title);
		$title_slug = unixedu_footer_social_canonical_slug($title_slug);
		if (in_array($title_slug, $known, true)) {
			return $title_slug;
		}
		$compact = str_replace('-', '', $title_slug);
		if ('linkedin' === $compact && in_array('linkedin', $known, true)) {
			return 'linkedin';
		}
	}

	return null;
}

function unixedu_footer_social_icon_filename(string $slug): string {
	return 'icon-' . $slug . '.svg';
}

/**
 * Build social link rows from the “Footer: Follow us” menu (ordered, only valid http(s) URLs, known icons).
 *
 * @return list<array{label: string, href: string, external: bool, svg: string}>
 */
function unixedu_footer_social_links_from_menu(): array {
	$out = [];

	if (! has_nav_menu('footer_social') || ! function_exists('unixedu_static_path')) {
		return $out;
	}

	$locations = get_nav_menu_locations();
	$menu_id   = isset($locations['footer_social']) ? (int) $locations['footer_social'] : 0;
	if ($menu_id <= 0) {
		return $out;
	}

	$items = wp_get_nav_menu_items($menu_id);
	if (! is_array($items)) {
		return $out;
	}

	foreach ($items as $item) {
		if (! is_object($item) || ! isset($item->ID, $item->menu_item_parent, $item->url)) {
			continue;
		}
		if (0 !== (int) $item->menu_item_parent) {
			continue;
		}

		$url = trim((string) $item->url);
		if ('' === $url || '#' === $url) {
			continue;
		}

		$resolved = esc_url_raw($url);
		if ('' === $resolved || ! preg_match('#^https?://#i', $resolved)) {
			continue;
		}

		$slug = unixedu_footer_social_slug_from_item($item);
		if (null === $slug || ! in_array($slug, unixedu_footer_social_known_slugs(), true)) {
			continue;
		}

		$file = unixedu_footer_social_icon_filename($slug);
		$path = unixedu_static_path('images/social/' . $file);
		if (! is_readable($path)) {
			continue;
		}

		$svg_raw = file_get_contents($path);
		if (! is_string($svg_raw) || '' === trim($svg_raw)) {
			continue;
		}

		$label = isset($item->title) ? trim((string) $item->title) : '';
		if ('' === $label) {
			$label = ucfirst($slug);
		}

		$home_host = wp_parse_url(home_url('/'), PHP_URL_HOST);
		$link_host = wp_parse_url($resolved, PHP_URL_HOST);
		$external  = is_string($link_host) && '' !== $link_host
			&& (! is_string($home_host) || strtolower($link_host) !== strtolower($home_host));

		$out[] = [
			'label'    => $label,
			'href'     => $resolved,
			'external' => $external,
			'svg'      => $svg_raw,
		];
	}

	return $out;
}
