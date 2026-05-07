<?php
/**
 * Gutenberg/editor integration.
 *
 * Keep editor-only setup here. Do not enqueue frontend assets in this file.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

if (!function_exists('unixedu_editor_setup')) {
	function unixedu_editor_setup(): void {
		// Loads the compiled theme styles inside the block editor.
		add_editor_style('assets/dist/css/main.css');
	}
}

add_action('after_setup_theme', 'unixedu_editor_setup');

if (!function_exists('unixedu_editor_globals')) {
	/**
	 * Provide theme paths to block editor scripts.
	 */
	function unixedu_editor_globals(): void {
		$static_base = function_exists('unixedu_static') ? unixedu_static('/') : (get_template_directory_uri() . '/static/');
		$payload = wp_json_encode(
			[
				'staticBase' => untrailingslashit((string) $static_base) . '/',
			]
		);

		if (is_string($payload) && '' !== $payload) {
			wp_add_inline_script('wp-blocks', 'window.unixeduTheme=' . $payload . ';', 'before');
		}
	}
}

add_action('enqueue_block_editor_assets', 'unixedu_editor_globals');

