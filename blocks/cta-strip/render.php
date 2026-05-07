<?php
/**
 * CTA Strip block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$background = isset($attributes['background']) ? (string) $attributes['background'] : 'lime';
$background = in_array($background, ['lime', 'black'], true) ? $background : 'lime';

$title = isset($attributes['title']) ? (string) $attributes['title'] : '';
$text  = isset($attributes['text']) ? (string) $attributes['text'] : '';

$button_text = isset($attributes['buttonText']) ? (string) $attributes['buttonText'] : '';
$button_url  = isset($attributes['buttonUrl']) ? (string) $attributes['buttonUrl'] : '';

$show_button = ('' !== trim($button_text)) && ('' !== trim($button_url));

$classes = [
	'unixedu-cta-strip',
	'unixedu-cta-strip--' . $background,
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(implode(' ', array_filter($classes))),
	]
);

?>
<section <?php echo $block_wrapper_attributes; ?>>
	<div class="unixedu-cta-strip__inner">
		<div class="unixedu-cta-strip__content">
			<?php if ('' !== trim($title)) : ?>
				<h2 class="unixedu-cta-strip__title"><?php echo wp_kses(nl2br(esc_html($title)), ['br' => []]); ?></h2>
			<?php endif; ?>

			<?php if ('' !== trim($text)) : ?>
				<p class="unixedu-cta-strip__text"><?php echo wp_kses(nl2br(esc_html($text)), ['br' => []]); ?></p>
			<?php endif; ?>
		</div>

		<?php if ($show_button) : ?>
			<div class="unixedu-cta-strip__actions">
				<a class="unixedu-cta-strip__button" href="<?php echo esc_url($button_url); ?>">
					<?php echo wp_kses(nl2br(esc_html($button_text)), ['br' => []]); ?> <span aria-hidden="true">→</span>
				</a>
			</div>
		<?php endif; ?>
	</div>
</section>

