<?php
declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

if (!function_exists('unixedu_register_blocks')) {
	function unixedu_register_blocks(): void {
		// Register every /blocks/*/block.json if present.
		$blocks_dir = get_template_directory() . '/blocks';

		if (!is_dir($blocks_dir)) {
			return;
		}

		$block_json_files = glob($blocks_dir . '/*/block.json');
		if (empty($block_json_files) || !is_array($block_json_files)) {
			return;
		}

		foreach ($block_json_files as $block_json_file) {
			$block_dir = dirname($block_json_file);
			if (is_dir($block_dir)) {
				register_block_type($block_dir);
			}
		}
	}
}

add_action('init', 'unixedu_register_blocks');

