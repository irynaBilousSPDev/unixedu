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
				'footer'     => esc_html__('Footer Menu', 'unixedu'),
				'legal'      => esc_html__('Legal Menu', 'unixedu'),
			]
		);
	}
}

add_action('after_setup_theme', 'unixedu_theme_setup');

