<?php
/**
 * Theme bootstrap (loader only).
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$unixedu_includes = [
	get_template_directory() . '/inc/theme-setup.php',
	get_template_directory() . '/inc/enqueue.php',
	get_template_directory() . '/inc/helpers.php',
	get_template_directory() . '/inc/gutenberg.php',
	get_template_directory() . '/inc/blocks.php',
];

foreach ($unixedu_includes as $unixedu_file) {
	if (file_exists($unixedu_file)) {
		require_once $unixedu_file;
	}
}

