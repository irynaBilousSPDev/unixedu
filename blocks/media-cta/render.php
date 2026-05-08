<?php
/**
 * Media CTA block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$background_mode = isset($attributes['backgroundMode']) ? (string) $attributes['backgroundMode'] : 'white';
$background_mode = in_array($background_mode, ['white', 'light-gray', 'black', 'image'], true) ? $background_mode : 'white';

$background_image_url = isset($attributes['backgroundImageUrl']) ? (string) $attributes['backgroundImageUrl'] : '';
$background_image_alt = isset($attributes['backgroundImageAlt']) ? (string) $attributes['backgroundImageAlt'] : '';

$background_position = isset($attributes['backgroundPosition']) ? (string) $attributes['backgroundPosition'] : 'center';
$background_position = in_array($background_position, ['left', 'right', 'center'], true) ? $background_position : 'center';

$content_placement = isset($attributes['contentPlacement']) ? (string) $attributes['contentPlacement'] : 'center';
$content_placement = in_array($content_placement, ['left', 'center', 'right'], true) ? $content_placement : 'center';

$eyebrow = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$text    = isset($attributes['text']) ? (string) $attributes['text'] : '';

$title_lines = [
	[
		'text'  => isset($attributes['titleLine1']) ? (string) $attributes['titleLine1'] : '',
		'style' => isset($attributes['titleLine1Style']) ? (string) $attributes['titleLine1Style'] : 'default',
	],
	[
		'text'  => isset($attributes['titleLine2']) ? (string) $attributes['titleLine2'] : '',
		'style' => isset($attributes['titleLine2Style']) ? (string) $attributes['titleLine2Style'] : 'default',
	],
	[
		'text'  => isset($attributes['titleLine3']) ? (string) $attributes['titleLine3'] : '',
		'style' => isset($attributes['titleLine3Style']) ? (string) $attributes['titleLine3Style'] : 'default',
	],
];

$allowed_line_styles = ['default', 'lime', 'white', 'lime-on-dark'];

$has_title = false;
foreach ($title_lines as $line) {
	if (isset($line['text']) && '' !== trim((string) $line['text'])) {
		$has_title = true;
		break;
	}
}

$button_text  = isset($attributes['buttonText']) ? (string) $attributes['buttonText'] : '';
$button_url   = isset($attributes['buttonUrl']) ? (string) $attributes['buttonUrl'] : '';
$button_style = isset($attributes['buttonStyle']) ? (string) $attributes['buttonStyle'] : 'lime';
$button_style = in_array($button_style, ['lime', 'dark', 'black', 'outline-light', 'outline-dark'], true) ? $button_style : 'lime';

$show_button = ('' !== trim($button_text)) && ('' !== trim($button_url));

$classes = [
	'unixedu-media-cta',
	'unixedu-media-cta--bg-' . $background_mode,
	'unixedu-media-cta--content-' . $content_placement,
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(implode(' ', array_filter($classes))),
	]
);

?>
<section
	<?php
	echo $block_wrapper_attributes;
	echo ('image' === $background_mode && '' !== trim($background_image_url))
		? ' style="' . esc_attr('background-image: url(' . esc_url($background_image_url) . '); background-position: ' . $background_position . ';') . '"'
		: '';
	?>
>
	<div class="unixedu-media-cta__inner">
		<div class="unixedu-media-cta__content">
			<header class="unixedu-section-header__head">
				<?php if ('' !== trim($eyebrow)) : ?>
					<p class="unixedu-section-header__eyebrow"><?php echo wp_kses(nl2br(esc_html($eyebrow)), ['br' => []]); ?></p>
				<?php endif; ?>

				<?php if ($has_title) : ?>
					<h2 class="unixedu-section-header__title">
						<?php foreach ($title_lines as $line) : ?>
							<?php
							$line_text = isset($line['text']) ? (string) $line['text'] : '';
							if ('' === trim($line_text)) {
								continue;
							}
							$style = isset($line['style']) ? (string) $line['style'] : 'default';
							$style = in_array($style, $allowed_line_styles, true) ? $style : 'default';
							?>
							<span class="<?php echo esc_attr('unixedu-section-header__title-line unixedu-section-header__title-line--' . sanitize_html_class($style)); ?>">
								<?php echo wp_kses(nl2br(esc_html($line_text)), ['br' => []]); ?>
							</span>
						<?php endforeach; ?>
					</h2>
				<?php endif; ?>

				<?php if ('' !== trim($text)) : ?>
					<p class="unixedu-media-cta__text"><?php echo wp_kses(nl2br(esc_html($text)), ['br' => []]); ?></p>
				<?php endif; ?>
			</header>

			<?php if ($show_button) : ?>
				<div class="unixedu-media-cta__actions">
					<a class="<?php echo esc_attr('btn btn--' . sanitize_html_class($button_style)); ?>" href="<?php echo esc_url($button_url); ?>">
						<?php echo esc_html($button_text); ?> <span aria-hidden="true">→</span>
					</a>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>

