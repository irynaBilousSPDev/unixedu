<?php
/**
 * Logo Marquee block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$background = isset($attributes['background']) ? (string) $attributes['background'] : 'white';
$background = in_array($background, ['white', 'light-gray', 'black'], true) ? $background : 'white';

$title = isset($attributes['title']) ? (string) $attributes['title'] : '';

$logos_raw = isset($attributes['logos']) && is_array($attributes['logos']) ? $attributes['logos'] : [];
$logos = [];
foreach ($logos_raw as $logo) {
	if (!is_array($logo)) {
		continue;
	}
	$url = isset($logo['url']) ? (string) $logo['url'] : '';
	if ('' === trim($url)) {
		continue;
	}
	$logos[] = [
		'url'     => $url,
		'alt'     => isset($logo['alt']) ? (string) $logo['alt'] : '',
		'linkUrl' => isset($logo['linkUrl']) ? (string) $logo['linkUrl'] : '',
	];
}

$default_static_logos = [
	[
		'url'     => function_exists('unixedu_static') ? unixedu_static('images/logo-marquee/oxford.png') : (get_template_directory_uri() . '/static/images/logo-marquee/oxford.png'),
		'alt'     => 'University of Oxford',
		'linkUrl' => '',
	],
	[
		'url'     => function_exists('unixedu_static') ? unixedu_static('images/logo-marquee/ata.png') : (get_template_directory_uri() . '/static/images/logo-marquee/ata.png'),
		'alt'     => 'ATA',
		'linkUrl' => '',
	],
	[
		'url'     => function_exists('unixedu_static') ? unixedu_static('images/logo-marquee/yale.png') : (get_template_directory_uri() . '/static/images/logo-marquee/yale.png'),
		'alt'     => 'Yale',
		'linkUrl' => '',
	],
	[
		'url'     => function_exists('unixedu_static') ? unixedu_static('images/logo-marquee/mit.png') : (get_template_directory_uri() . '/static/images/logo-marquee/mit.png'),
		'alt'     => 'MIT',
		'linkUrl' => '',
	],
	[
		'url'     => function_exists('unixedu_static') ? unixedu_static('images/logo-marquee/mudt.png') : (get_template_directory_uri() . '/static/images/logo-marquee/mudt.png'),
		'alt'     => 'mudt',
		'linkUrl' => '',
	],
	[
		'url'     => function_exists('unixedu_static') ? unixedu_static('images/logo-marquee/harvard.png') : (get_template_directory_uri() . '/static/images/logo-marquee/harvard.png'),
		'alt'     => 'Harvard University',
		'linkUrl' => '',
	],
];

if (empty($logos)) {
	// Fallback to theme-provided static logos.
	$logos = $default_static_logos;
}

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(
			implode(
				' ',
				[
					'unixedu-logo-marquee',
					'unixedu-logo-marquee--' . sanitize_html_class($background),
					// JS will toggle marquee/static based on overflow.
					'unixedu-logo-marquee--static',
				]
			)
		),
	]
);

?>
<section <?php echo $block_wrapper_attributes; ?>>
	<div class="unixedu-logo-marquee__inner">
		<?php if ('' !== trim($title)) : ?>
			<p class="unixedu-logo-marquee__title"><?php echo wp_kses(nl2br(esc_html($title)), ['br' => []]); ?></p>
		<?php endif; ?>

		<?php if (!empty($logos)) : ?>
			<div class="unixedu-logo-marquee__viewport">
				<div class="unixedu-logo-marquee__track" aria-label="<?php echo esc_attr__('Partner logos', 'unixedu'); ?>">
					<?php foreach ($logos as $logo) : ?>
						<?php
						$alt_text = isset($logo['alt']) ? trim((string) $logo['alt']) : '';
						$link_url = isset($logo['linkUrl']) ? trim((string) $logo['linkUrl']) : '';
						$link_label = $alt_text;
						if ('' === $link_label) {
							$link_label = esc_html__('Partner website', 'unixedu');
						}
						?>
						<div class="unixedu-logo-marquee__item">
							<?php if ('' !== $link_url) : ?>
								<a class="unixedu-logo-marquee__link" href="<?php echo esc_url($link_url); ?>" aria-label="<?php echo esc_attr($link_label); ?>">
									<img class="unixedu-logo-marquee__img" src="<?php echo esc_url($logo['url']); ?>" alt="<?php echo esc_attr($alt_text); ?>" loading="lazy" decoding="async" />
								</a>
							<?php else : ?>
								<img class="unixedu-logo-marquee__img" src="<?php echo esc_url($logo['url']); ?>" alt="<?php echo esc_attr($alt_text); ?>" loading="lazy" decoding="async" />
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>

