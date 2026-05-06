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

