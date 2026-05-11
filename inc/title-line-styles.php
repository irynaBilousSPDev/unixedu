<?php
/**
 * Shared title line style → BEM modifier mapping (section-style headers + hero).
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

if (!function_exists('unixedu_title_line_style_bem_suffix')) {
	/**
	 * Map stored block attribute to a single BEM suffix for `*__title-line--{suffix}`.
	 *
	 * Legacy: `lime-on-dark` was used for “dark text on lime pill” → `dark-on-lime`.
	 * Hero legacy: `lime-on-black` (“lime on brand dark”) → `lime-on-dark`.
	 * Canonical “lime on dark pill” is stored as `lime-fg-on-dark` → `lime-on-dark`.
	 *
	 * Hero-only: `black` → `black` (explicit dark text).
	 */
	function unixedu_title_line_style_bem_suffix(string $raw): string {
		$raw = trim($raw);

		if ('lime-on-dark' === $raw) {
			return 'dark-on-lime';
		}

		if ('lime-on-black' === $raw) {
			return 'lime-on-dark';
		}

		if ('black' === $raw) {
			return 'black';
		}

		$allowed = ['default', 'lime', 'white', 'dark-on-white', 'dark-on-lime', 'lime-fg-on-dark', 'white-on-dark'];
		if (! in_array($raw, $allowed, true)) {
			return 'default';
		}

		return 'lime-fg-on-dark' === $raw ? 'lime-on-dark' : $raw;
	}
}
