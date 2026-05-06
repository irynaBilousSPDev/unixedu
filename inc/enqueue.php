<?php
/**
 * Enqueue scripts and styles.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

if (!function_exists('unixedu_asset_version')) {
	function unixedu_asset_version(string $relative_dist_path): string {
		$theme_version = (string) wp_get_theme()->get('Version');
		$absolute_path = function_exists('unixedu_asset_path')
			? unixedu_asset_path($relative_dist_path)
			: (get_template_directory() . '/assets/dist/' . ltrim($relative_dist_path, '/'));

		if (is_string($absolute_path) && file_exists($absolute_path)) {
			return (string) filemtime($absolute_path);
		}

		return $theme_version;
	}
}

if (!function_exists('unixedu_enqueue_assets')) {
	function unixedu_enqueue_assets(): void {
		$css_rel = 'css/main.css';
		$js_rel  = 'js/main.js';

		wp_enqueue_style(
			'unixedu-main',
			function_exists('unixedu_asset') ? unixedu_asset($css_rel) : (get_template_directory_uri() . '/assets/dist/' . $css_rel),
			[],
			unixedu_asset_version($css_rel)
		);

		wp_enqueue_script(
			'unixedu-main',
			function_exists('unixedu_asset') ? unixedu_asset($js_rel) : (get_template_directory_uri() . '/assets/dist/' . $js_rel),
			[],
			unixedu_asset_version($js_rel),
			true
		);
	}
}

add_action('wp_enqueue_scripts', 'unixedu_enqueue_assets');

