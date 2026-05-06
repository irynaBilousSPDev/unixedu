<?php
/**
 * Small helper functions.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

if (!function_exists('unixedu_asset')) {
	/**
	 * Get a theme asset URL from /assets/dist.
	 *
	 * @param string $path Relative path within assets/dist (e.g. 'css/main.css').
	 */
	function unixedu_asset(string $path): string {
		return get_template_directory_uri() . '/assets/dist/' . ltrim($path, '/');
	}
}

if (!function_exists('unixedu_asset_path')) {
	/**
	 * Get a theme asset absolute path from /assets/dist.
	 *
	 * @param string $path Relative path within assets/dist (e.g. 'css/main.css').
	 */
	function unixedu_asset_path(string $path): string {
		return get_template_directory() . '/assets/dist/' . ltrim($path, '/');
	}
}

if (!function_exists('unixedu_static')) {
	/**
	 * Get a theme static asset URL from /static.
	 *
	 * @param string $path Relative path within static (e.g. 'images/header/logo.png').
	 */
	function unixedu_static(string $path): string {
		return get_template_directory_uri() . '/static/' . ltrim($path, '/');
	}
}

if (!function_exists('unixedu_static_path')) {
	/**
	 * Get a theme static asset absolute path from /static.
	 *
	 * @param string $path Relative path within static (e.g. 'images/header/logo.png').
	 */
	function unixedu_static_path(string $path): string {
		return get_template_directory() . '/static/' . ltrim($path, '/');
	}
}

