<?php
/**
 * Theme Customizer (footer brand text, social URLs).
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

if (!function_exists('unixedu_footer_brand_defaults')) {
	/**
	 * Default footer brand copy (Customizer + front when theme mod missing).
	 *
	 * @return array{tagline: string, company: string}
	 */
	function unixedu_footer_brand_defaults(): array {
		return [
			'tagline' => __("The smarter way to find\nyour university abroad.", 'unixedu'),
			'company' => __("UNIXEDU LTD\nCompany number 17186185\n167-169 Great Portland Street Fifth Floor,\nLondon, England, W1W5PF", 'unixedu'),
		];
	}
}

if (!function_exists('unixedu_customize_register')) {
	function unixedu_customize_register(WP_Customize_Manager $wp_customize): void {
		$unixedu_footer_brand_defaults = unixedu_footer_brand_defaults();

		$wp_customize->add_section(
			'unixedu_footer_brand',
			[
				'title'       => __('Footer: tagline & company', 'unixedu'),
				'description' => __('Plain text only (line breaks are kept; HTML is stripped on save). Leave a field empty and publish to hide that block on the site.', 'unixedu'),
				'priority'    => 88,
			]
		);

		$wp_customize->add_setting(
			'unixedu_footer_tagline',
			[
				'default'           => $unixedu_footer_brand_defaults['tagline'],
				'sanitize_callback' => 'sanitize_textarea_field',
				'transport'         => 'refresh',
			]
		);

		$wp_customize->add_control(
			'unixedu_footer_tagline',
			[
				'label'       => __('Footer tagline (above logo)', 'unixedu'),
				'description' => __('Shown above the logo. Clear the field to hide the tagline.', 'unixedu'),
				'section'     => 'unixedu_footer_brand',
				'type'        => 'textarea',
				'input_attrs' => [
					'rows' => 3,
				],
			]
		);

		$wp_customize->add_setting(
			'unixedu_footer_company',
			[
				'default'           => $unixedu_footer_brand_defaults['company'],
				'sanitize_callback' => 'sanitize_textarea_field',
				'transport'         => 'refresh',
			]
		);

		$wp_customize->add_control(
			'unixedu_footer_company',
			[
				'label'       => __('Company / legal lines (under logo)', 'unixedu'),
				'description' => __('Shown under the footer logo, same style as the tagline. Clear this field to hide the block.', 'unixedu'),
				'section'     => 'unixedu_footer_brand',
				'type'        => 'textarea',
				'input_attrs' => [
					'rows' => 5,
				],
			]
		);

		$wp_customize->add_section(
			'unixedu_footer_social',
			[
				'title'       => __('Footer: Follow us links', 'unixedu'),
				'description' => __('Paste full profile URLs (https://…). Icons appear only for networks you fill in; empty fields are hidden.', 'unixedu'),
				'priority'    => 90,
			]
		);

		$unixedu_social_fields = [
			'unixedu_social_instagram' => __('Instagram URL', 'unixedu'),
			'unixedu_social_tiktok'    => __('TikTok URL', 'unixedu'),
			'unixedu_social_youtube'   => __('YouTube URL', 'unixedu'),
			'unixedu_social_facebook'  => __('Facebook URL', 'unixedu'),
			'unixedu_social_linkedin'  => __('LinkedIn URL', 'unixedu'),
			'unixedu_social_x'         => __('X (Twitter) URL', 'unixedu'),
		];

		foreach ($unixedu_social_fields as $unixedu_setting_id => $unixedu_label) {
			$wp_customize->add_setting(
				$unixedu_setting_id,
				[
					'default'           => '',
					'sanitize_callback' => 'esc_url_raw',
					'transport'         => 'refresh',
				]
			);

			$wp_customize->add_control(
				$unixedu_setting_id,
				[
					'label'   => $unixedu_label,
					'section' => 'unixedu_footer_social',
					'type'    => 'url',
				]
			);
		}
	}
}

add_action('customize_register', 'unixedu_customize_register');
