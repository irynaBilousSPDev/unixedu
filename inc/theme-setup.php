<?php
/**
 * Theme setup.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

if (!function_exists('unixedu_theme_setup')) {
	function unixedu_theme_setup(): void {
		load_theme_textdomain('unixedu', get_template_directory() . '/languages');

		add_theme_support('title-tag');
		add_theme_support('post-thumbnails');
		add_theme_support('custom-logo');
		add_theme_support('align-wide');
		add_theme_support('editor-styles');
		add_theme_support('responsive-embeds');

		add_theme_support(
			'html5',
			[
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			]
		);

		register_nav_menus(
			[
				'primary'    => esc_html__('Primary Menu', 'unixedu'),
				'header_cta' => esc_html__('Header CTA', 'unixedu'),
				'footer_explore'      => esc_html__('Footer: Explore', 'unixedu'),
				'footer_students'     => esc_html__('Footer: For Students', 'unixedu'),
				'footer_universities' => esc_html__('Footer: For Universities', 'unixedu'),
				'footer_institution'  => esc_html__('Footer: For Institutions', 'unixedu'),
				'footer'        => esc_html__('Footer Menu', 'unixedu'),
				'legal' => esc_html__('Footer: Legal (Privacy, Terms, Cookies, Accessibility)', 'unixedu'),
			]
		);
	}
}

add_action('after_setup_theme', 'unixedu_theme_setup');

if (!class_exists('Unixedu_Nav_Walker')) {
	/**
	 * Primary menu walker. Adds a submenu toggle for items that have children.
	 */
	class Unixedu_Nav_Walker extends Walker_Nav_Menu {
		/**
		 * @param string $output
		 * @param object $data_object
		 * @param int    $depth
		 * @param mixed  $args
		 * @param int    $current_object_id
		 */
		public function start_el(&$output, $data_object, $depth = 0, $args = null, $current_object_id = 0) {
			parent::start_el($output, $data_object, $depth, $args, $current_object_id);

			$classes = empty($data_object->classes) ? [] : (array) $data_object->classes;
			if (0 === (int) $depth && in_array('menu-item-has-children', $classes, true)) {
				$output .= '<button type="button" class="site-header__submenu-toggle" aria-expanded="false">';
				$output .= '<span class="visually-hidden">' . esc_html__('Open submenu', 'unixedu') . '</span>';
				$output .= '</button>';
			}
		}
	}
}

if (!function_exists('unixedu_nav_page_menu_item')) {
	/**
	 * @return object
	 */
	function unixedu_nav_page_menu_item(WP_Post $page, int $parent_menu_id) {
		$item_id = 900000 + (int) $page->ID;
		$classes = [
			'menu-item',
			'menu-item-type-post_type',
			'menu-item-object-page',
		];

		if ((int) $page->ID === (int) get_queried_object_id()) {
			$classes[] = 'current-menu-item';
		}

		return (object) [
			'ID'                    => $item_id,
			'db_id'                 => $item_id,
			'menu_item_parent'      => $parent_menu_id,
			'object_id'             => (int) $page->ID,
			'object'                => 'page',
			'type'                  => 'post_type',
			'type_label'            => 'Page',
			'title'                 => get_the_title($page),
			'url'                   => (string) get_permalink($page),
			'target'                => '',
			'attr_title'            => '',
			'description'           => '',
			'classes'               => $classes,
			'xfn'                   => '',
			'status'                => 'publish',
			'current'               => in_array('current-menu-item', $classes, true),
			'current_item_ancestor' => false,
			'current_item_parent'   => false,
		];
	}
}

if (!function_exists('unixedu_nav_append_published_children')) {
	/**
	 * Published child pages of a top-level menu page (for example Country)
	 * become its submenu when that item has no manually nested menu items.
	 *
	 * @param array<int, object> $items
	 * @param stdClass           $args
	 * @return array<int, object>
	 */
	function unixedu_nav_append_published_children(array $items, $args): array {
		if (!isset($args->theme_location) || 'primary' !== $args->theme_location) {
			return $items;
		}

		$parents_with_children = [];
		foreach ($items as $item) {
			if (!isset($item->menu_item_parent)) {
				continue;
			}
			$parent_id = (int) $item->menu_item_parent;
			if ($parent_id > 0) {
				$parents_with_children[$parent_id] = true;
			}
		}

		$extra = [];

		foreach ($items as $item) {
			if (!isset($item->object, $item->object_id, $item->ID, $item->menu_item_parent)) {
				continue;
			}
			if ('page' !== $item->object || 0 !== (int) $item->menu_item_parent) {
				continue;
			}
			if (isset($parents_with_children[(int) $item->ID])) {
				continue;
			}

			$children = get_pages(
				[
					'parent'      => (int) $item->object_id,
					'sort_column' => 'post_title',
					'sort_order'  => 'ASC',
					'post_status' => 'publish',
				]
			);

			if (empty($children)) {
				continue;
			}

			if (empty($item->classes) || !is_array($item->classes)) {
				$item->classes = [];
			}
			if (!in_array('menu-item-has-children', $item->classes, true)) {
				$item->classes[] = 'menu-item-has-children';
			}

			foreach ($children as $child) {
				if (!$child instanceof WP_Post) {
					continue;
				}
				$child_item = unixedu_nav_page_menu_item($child, (int) $item->ID);
				if (!empty($child_item->current)) {
					foreach (['current-menu-ancestor', 'current-menu-parent'] as $ancestor_class) {
						if (!in_array($ancestor_class, $item->classes, true)) {
							$item->classes[] = $ancestor_class;
						}
					}
				}
				$extra[] = $child_item;
			}
		}

		if ([] === $extra) {
			return $items;
		}

		return array_merge($items, $extra);
	}
}

add_filter('wp_nav_menu_objects', 'unixedu_nav_append_published_children', 20, 2);

