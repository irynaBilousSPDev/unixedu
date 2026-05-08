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

/**
 * Add a custom block category for uniXedu blocks.
 */
add_filter('block_categories_all', function (array $categories, $editor_context): array {
	$slug = 'unixedu';
	foreach ($categories as $category) {
		if (isset($category['slug']) && $category['slug'] === $slug) {
			return $categories;
		}
	}

	return array_merge(
		[
			[
				'slug'  => $slug,
				'title' => __('uniXedu', 'unixedu'),
				'icon'  => null,
			],
		],
		$categories
	);
}, 10, 2);


// add_action('admin_notices', function (): void {
//     if (!current_user_can('manage_options')) {
//         return;
//     }

//     $registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
//     $custom_blocks = [];

//     foreach ($registered_blocks as $block_name => $block_type) {
//         if (str_starts_with($block_name, 'unixedu/')) {
//             $custom_blocks[] = $block_name;
//         }
//     }

//     echo '<div class="notice notice-warning"><p>';
//     echo '<strong>Registered custom blocks:</strong><br>';

//     if (empty($custom_blocks)) {
//         echo 'No unixedu blocks registered.';
//     } else {
//         foreach ($custom_blocks as $block_name) {
//             echo esc_html($block_name) . '<br>';
//         }
//     }

//     echo '</p></div>';
// }, 99);

 