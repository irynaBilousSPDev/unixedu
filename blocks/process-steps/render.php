<?php
/**
 * Process Steps block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$background_mode = isset($attributes['backgroundMode']) ? (string) $attributes['backgroundMode'] : 'light-gray';
$background_mode = in_array($background_mode, ['white', 'light-gray', 'black', 'image', 'image-dark'], true) ? $background_mode : 'light-gray';

$bg_image_url = isset($attributes['backgroundImageUrl']) ? (string) $attributes['backgroundImageUrl'] : '';

$overlay_opacity = isset($attributes['overlayOpacity']) ? (float) $attributes['overlayOpacity'] : 0.55;
$overlay_opacity = max(0.0, min(0.9, $overlay_opacity));

$card_type = isset($attributes['cardType']) ? (string) $attributes['cardType'] : 'numbers';
$card_type = in_array($card_type, ['numbers', 'tier'], true) ? $card_type : 'numbers';

$cards_layout = isset($attributes['cardsLayout']) ? (string) $attributes['cardsLayout'] : 'four-columns';
$cards_layout = in_array($cards_layout, ['four-columns', 'two-columns', 'stacked'], true) ? $cards_layout : 'four-columns';

$cards_surface = isset($attributes['cardsSurface']) ? (string) $attributes['cardsSurface'] : 'transparent';
$cards_surface = in_array($cards_surface, ['transparent', 'panel'], true) ? $cards_surface : 'transparent';

$eyebrow        = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$show_underline = !empty($attributes['showUnderline']);
$intro_text     = isset($attributes['introText']) ? (string) $attributes['introText'] : '';

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

$steps = [];
for ($i = 1; $i <= 4; $i++) {
	$steps[] = [
		'number'    => isset($attributes['step' . $i . 'Number']) ? (string) $attributes['step' . $i . 'Number'] : '',
		'tier'      => isset($attributes['step' . $i . 'Tier']) ? (string) $attributes['step' . $i . 'Tier'] : '',
		'title'     => isset($attributes['step' . $i . 'Title']) ? (string) $attributes['step' . $i . 'Title'] : '',
		'badge'     => isset($attributes['step' . $i . 'BadgeText']) ? (string) $attributes['step' . $i . 'BadgeText'] : '',
		'badge_style' => isset($attributes['step' . $i . 'BadgeStyle']) ? (string) $attributes['step' . $i . 'BadgeStyle'] : 'dark',
		'text'      => isset($attributes['step' . $i . 'Text']) ? (string) $attributes['step' . $i . 'Text'] : '',
		'link_text' => isset($attributes['step' . $i . 'LinkText']) ? (string) $attributes['step' . $i . 'LinkText'] : '',
		'link_url'  => isset($attributes['step' . $i . 'LinkUrl']) ? (string) $attributes['step' . $i . 'LinkUrl'] : '',
	];
}

// Filter steps to those that have at least one real content field.
$visible_steps = [];
foreach ($steps as $step) {
	$has_link = ('' !== trim($step['link_text'])) && ('' !== trim($step['link_url']));
	$has_card_content =
		('' !== trim($step['title'])) ||
		('' !== trim($step['text'])) ||
		('' !== trim($step['badge'])) ||
		$has_link;

	if ($has_card_content) {
		$visible_steps[] = $step;
	}
}

$cards_count = count($visible_steps);
$cards_count = ($cards_count >= 1 && $cards_count <= 4) ? $cards_count : 4;

// Content tone resolution for frontend (auto from bg + surface).
$resolved_tone = 'dark';
if ('panel' === $cards_surface) {
	$resolved_tone = 'dark';
} elseif (in_array($background_mode, ['black', 'image-dark'], true)) {
	$resolved_tone = 'light';
}

$classes = [
	'unixedu-process',
	'unixedu-process--bg-' . $background_mode,
	'unixedu-process--surface-' . $cards_surface,
	'unixedu-process--layout-' . $cards_layout,
	'unixedu-process--resolved-tone-' . $resolved_tone,
	'unixedu-process--card-type-' . $card_type,
	($cards_count > 0) ? ('unixedu-process--cards-count-' . $cards_count) : '',
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(implode(' ', array_filter($classes))),
	]
);

$section_style = '';
if (in_array($background_mode, ['image', 'image-dark'], true) && '' !== trim($bg_image_url)) {
	$section_style .= sprintf('--unixedu-process-bg: url(%s);', esc_url($bg_image_url));
}

?>
<section <?php echo $block_wrapper_attributes; ?><?php echo $section_style ? ' style="' . esc_attr($section_style) . '"' : ''; ?>>
	<?php if (in_array($background_mode, ['image', 'image-dark'], true) && '' !== trim($bg_image_url)) : ?>
		<div class="unixedu-process__background" aria-hidden="true">
			<?php if ('image-dark' === $background_mode && $overlay_opacity > 0) : ?>
				<div class="unixedu-process__overlay" style="opacity: <?php echo esc_attr((string) $overlay_opacity); ?>" aria-hidden="true"></div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<div class="unixedu-process__inner">
		<header class="<?php echo esc_attr('unixedu-process__head' . ($show_underline ? ' has-underline' : '')); ?>">
			<?php if ('' !== trim($eyebrow)) : ?>
				<p class="unixedu-process__eyebrow"><?php echo wp_kses(nl2br(esc_html($eyebrow)), ['br' => []]); ?></p>
			<?php endif; ?>

			<?php
			$has_title = false;
			foreach ($title_lines as $line) {
				if (isset($line['text']) && '' !== trim((string) $line['text'])) {
					$has_title = true;
					break;
				}
			}
			?>

			<?php if ($has_title) : ?>
				<h2 class="unixedu-process__title">
					<?php foreach ($title_lines as $index => $line) : ?>
						<?php
						$text = isset($line['text']) ? (string) $line['text'] : '';
						if ('' === trim($text)) {
							continue;
						}
						$style = isset($line['style']) ? (string) $line['style'] : 'default';
						$style = in_array($style, $allowed_line_styles, true) ? $style : 'default';
						?>
						<span class="<?php echo esc_attr('unixedu-process__title-line unixedu-process__title-line--' . sanitize_html_class($style)); ?>">
							<?php echo wp_kses(nl2br(esc_html($text)), ['br' => []]); ?>
						</span>
					<?php endforeach; ?>
				</h2>
			<?php endif; ?>

			<?php if ('' !== trim($intro_text)) : ?>
				<p class="unixedu-process__intro"><?php echo wp_kses(nl2br(esc_html($intro_text)), ['br' => []]); ?></p>
			<?php endif; ?>
		</header>

		<?php if (!empty($visible_steps)) : ?>
			<div class="<?php echo esc_attr('unixedu-process__cards' . ('panel' === $cards_surface ? ' is-panel' : '')); ?>">
				<div class="unixedu-process__cards-grid">
					<?php foreach ($visible_steps as $step) : ?>
						<?php $has_link = ('' !== trim($step['link_text'])) && ('' !== trim($step['link_url'])); ?>
						<article class="unixedu-process__card">
							<?php if ('tier' === $card_type) : ?>
								<?php if ('' !== trim($step['tier'])) : ?>
									<div class="unixedu-process__tier"><?php echo wp_kses(nl2br(esc_html($step['tier'])), ['br' => []]); ?></div>
								<?php endif; ?>
							<?php else : ?>
								<?php if ('' !== trim($step['number'])) : ?>
									<div class="unixedu-process__number"><?php echo esc_html($step['number']); ?></div>
								<?php endif; ?>
							<?php endif; ?>

							<?php if ('' !== trim($step['title'])) : ?>
								<h3 class="unixedu-process__card-title"><?php echo wp_kses(nl2br(esc_html($step['title'])), ['br' => []]); ?></h3>
							<?php endif; ?>

							<?php if ('' !== trim($step['badge'])) : ?>
								<?php
								$badge_style = in_array($step['badge_style'], ['dark', 'lime'], true) ? $step['badge_style'] : 'dark';
								?>
								<div class="<?php echo esc_attr('unixedu-process__badge unixedu-process__badge--' . sanitize_html_class($badge_style)); ?>">
									<?php echo wp_kses(nl2br(esc_html($step['badge'])), ['br' => []]); ?>
								</div>
							<?php endif; ?>

							<?php if ('' !== trim($step['text'])) : ?>
								<p class="unixedu-process__card-text"><?php echo wp_kses(nl2br(esc_html($step['text'])), ['br' => []]); ?></p>
							<?php endif; ?>

							<?php if ($has_link) : ?>
								<a class="unixedu-process__card-link" href="<?php echo esc_url($step['link_url']); ?>">
									<?php echo wp_kses(nl2br(esc_html($step['link_text'])), ['br' => []]); ?> <span aria-hidden="true">→</span>
								</a>
							<?php endif; ?>
						</article>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>

