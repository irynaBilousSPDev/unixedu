<?php
/**
 * Section Header block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$render_mode = isset($attributes['renderMode']) ? (string) $attributes['renderMode'] : 'inner';
$render_mode = in_array($render_mode, ['inner', 'section'], true) ? $render_mode : 'inner';

$background = isset($attributes['background']) ? (string) $attributes['background'] : 'white';
$background = in_array($background, ['white', 'light-gray', 'black'], true) ? $background : 'white';

$max_width = isset($attributes['maxWidth']) ? (string) $attributes['maxWidth'] : 'default';
$max_width = in_array($max_width, ['default', 'compact', 'wide'], true) ? $max_width : 'default';

$eyebrow = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$text    = isset($attributes['text']) ? (string) $attributes['text'] : '';
$content = isset($attributes['content']) ? (string) $attributes['content'] : '';
$content_font_weight = isset($attributes['contentFontWeight']) ? (int) $attributes['contentFontWeight'] : 500;
$content_font_weight = in_array($content_font_weight, [400, 500, 600, 700], true) ? $content_font_weight : 500;

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

$has_title = false;
foreach ($title_lines as $line) {
	if (isset($line['text']) && '' !== trim((string) $line['text'])) {
		$has_title = true;
		break;
	}
}

$classes = [
	'unixedu-section-header',
	'unixedu-section-header--bg-' . $background,
	'unixedu-section-header--mode-' . $render_mode,
	'unixedu-section-header--width-' . $max_width,
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(implode(' ', array_filter($classes))),
	]
);

$header_markup = static function () use ($eyebrow, $text, $content, $content_font_weight, $title_lines, $has_title): void {
	?>
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
					$style_raw = isset($line['style']) ? (string) $line['style'] : 'default';
					$style_bem = function_exists('unixedu_title_line_style_bem_suffix')
						? unixedu_title_line_style_bem_suffix($style_raw)
						: 'default';
					?>
					<span class="<?php echo esc_attr('unixedu-section-header__title-line unixedu-section-header__title-line--' . sanitize_html_class($style_bem)); ?>">
						<?php echo wp_kses(nl2br(esc_html($line_text)), ['br' => []]); ?>
					</span>
				<?php endforeach; ?>
			</h2>
		<?php endif; ?>

		<?php if ('' !== trim($text)) : ?>
			<p class="unixedu-section-header__text"><?php echo wp_kses(nl2br(esc_html($text)), ['br' => []]); ?></p>
		<?php endif; ?>

		<?php if ('' !== trim($content)) : ?>
			<div
				class="unixedu-section-header__content"
				style="<?php echo esc_attr('font-weight: ' . $content_font_weight . ';'); ?>"
			><?php echo wp_kses(nl2br(esc_html($content)), ['br' => []]); ?></div>
		<?php endif; ?>
	</header>
	<?php
};

?>
<?php if ('section' === $render_mode) : ?>
	<section <?php echo $block_wrapper_attributes; ?>>
		<div class="unixedu-section-header__inner">
			<?php $header_markup(); ?>
		</div>
	</section>
<?php else : ?>
	<div <?php echo $block_wrapper_attributes; ?>>
		<?php $header_markup(); ?>
	</div>
<?php endif; ?>

