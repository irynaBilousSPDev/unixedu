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
 * Enable anchor (HTML id) support for every uniXedu block so editors can set a custom id in Advanced.
 */
add_filter(
	'register_block_type_args',
	static function (array $args, string $name): array {
		if (! str_starts_with($name, 'unixedu/')) {
			return $args;
		}
		if (! isset($args['supports']) || ! is_array($args['supports'])) {
			$args['supports'] = [];
		}
		$args['supports']['anchor'] = true;

		return $args;
	},
	10,
	2
);

/**
 * Sanitize a string for use as an HTML id (safe subset).
 */
if (! function_exists('unixedu_sanitize_block_dom_id')) {
	function unixedu_sanitize_block_dom_id(string $id): string {
		$id = strtolower((string) preg_replace('/[^a-z0-9_-]+/i', '-', $id));
		$id = trim($id, '-');
		if ('' === $id) {
			return 'unixedu-block';
		}
		// HTML5 allows ids starting with a digit; keep leading digits for stability with post ids.

		return $id;
	}
}

/**
 * Ensure each rendered uniXedu block has a unique root id when none is set (custom anchor wins).
 */
add_filter(
	'render_block',
	static function (string $block_content, array $block): string {
		if (empty($block['blockName']) || ! is_string($block['blockName']) || ! str_starts_with($block['blockName'], 'unixedu/')) {
			return $block_content;
		}
		$trimmed = ltrim($block_content);
		if ('' === $trimmed || '<' !== $trimmed[0]) {
			return $block_content;
		}

		static $unixedu_render_seq = 0;
		++$unixedu_render_seq;

		$post_id = (int) get_the_ID();
		if ($post_id < 1) {
			$queried = get_queried_object_id();
			$post_id = $queried > 0 ? $queried : 0;
		}

		$slug = str_replace('/', '-', $block['blockName']);
		$generated = unixedu_sanitize_block_dom_id(sprintf('%s-p%d-i%d', $slug, $post_id, $unixedu_render_seq));

		if (class_exists('WP_HTML_Tag_Processor')) {
			$processor = new WP_HTML_Tag_Processor($block_content);
			if ($processor->next_tag()) {
				$existing = $processor->get_attribute('id');
				if (is_string($existing) && '' !== trim($existing)) {
					return $block_content;
				}
				$processor->set_attribute('id', $generated);

				return $processor->get_updated_html();
			}

			return $block_content;
		}

		if (preg_match('/\bid\s*=\s*["\']/', $block_content)) {
			return $block_content;
		}

		return (string) preg_replace(
			'/(<[a-z][a-z0-9]*\b)/i',
			'$1 id="' . esc_attr($generated) . '"',
			$block_content,
			1
		);
	},
	10,
	2
);

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

 