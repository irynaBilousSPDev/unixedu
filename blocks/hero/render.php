<?php
/**
 * Hero block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$variant = isset($attributes['variant']) ? (string) $attributes['variant'] : 'home';
$theme   = isset($attributes['theme']) ? (string) $attributes['theme'] : 'light';

$show_breadcrumbs        = !empty($attributes['showBreadcrumbs']);
$breadcrumb_parent_label = isset($attributes['breadcrumbParentLabel']) ? (string) $attributes['breadcrumbParentLabel'] : '';
$breadcrumb_parent_url   = isset($attributes['breadcrumbParentUrl']) ? (string) $attributes['breadcrumbParentUrl'] : '';
$breadcrumb_label        = isset($attributes['breadcrumbLabel']) ? (string) $attributes['breadcrumbLabel'] : '';

$eyebrow = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$text    = isset($attributes['text']) ? (string) $attributes['text'] : '';

$title_lines = [
	isset($attributes['titleLine1']) ? (string) $attributes['titleLine1'] : '',
	isset($attributes['titleLine2']) ? (string) $attributes['titleLine2'] : '',
	isset($attributes['titleLine3']) ? (string) $attributes['titleLine3'] : '',
	isset($attributes['titleLine4']) ? (string) $attributes['titleLine4'] : '',
];

$highlight_mode = isset($attributes['highlightMode']) ? (string) $attributes['highlightMode'] : 'none';
$highlight_line = isset($attributes['highlightLine']) ? (int) $attributes['highlightLine'] : 0;

$primary_button_text  = isset($attributes['primaryButtonText']) ? (string) $attributes['primaryButtonText'] : '';
$primary_button_url   = isset($attributes['primaryButtonUrl']) ? (string) $attributes['primaryButtonUrl'] : '';
$primary_button_style = isset($attributes['primaryButtonStyle']) ? (string) $attributes['primaryButtonStyle'] : 'lime';

$show_secondary_button  = !empty($attributes['showSecondaryButton']);
$secondary_button_text  = isset($attributes['secondaryButtonText']) ? (string) $attributes['secondaryButtonText'] : '';
$secondary_button_url   = isset($attributes['secondaryButtonUrl']) ? (string) $attributes['secondaryButtonUrl'] : '';
$secondary_button_style = isset($attributes['secondaryButtonStyle']) ? (string) $attributes['secondaryButtonStyle'] : 'dark';

$hero_image_url = isset($attributes['heroImageUrl']) ? (string) $attributes['heroImageUrl'] : '';
$hero_image_alt = isset($attributes['heroImageAlt']) ? (string) $attributes['heroImageAlt'] : '';

// Symbol overlay is not used (kept only for backwards compatibility with saved attributes).
$show_symbol_overlay = false;

$show_stats  = !empty($attributes['showStats']);
$stats_count = isset($attributes['statsCount']) ? (int) $attributes['statsCount'] : 3;
$stats_count = in_array($stats_count, [3, 4], true) ? $stats_count : 3;

$stats_bottom_offset = isset($attributes['statsBottomOffset']) ? (int) $attributes['statsBottomOffset'] : -80;
$stats_gap           = $stats_bottom_offset < 0 ? max(abs($stats_bottom_offset), 120) : 0;

$stats = [
	[
		'value' => isset($attributes['stat1Value']) ? (string) $attributes['stat1Value'] : '',
		'label' => isset($attributes['stat1Label']) ? (string) $attributes['stat1Label'] : '',
	],
	[
		'value' => isset($attributes['stat2Value']) ? (string) $attributes['stat2Value'] : '',
		'label' => isset($attributes['stat2Label']) ? (string) $attributes['stat2Label'] : '',
	],
	[
		'value' => isset($attributes['stat3Value']) ? (string) $attributes['stat3Value'] : '',
		'label' => isset($attributes['stat3Label']) ? (string) $attributes['stat3Label'] : '',
	],
	[
		'value' => isset($attributes['stat4Value']) ? (string) $attributes['stat4Value'] : '',
		'label' => isset($attributes['stat4Label']) ? (string) $attributes['stat4Label'] : '',
	],
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(
			implode(
				' ',
				[
					'unixedu-hero',
					'unixedu-hero--' . sanitize_html_class($theme ?: 'light'),
					'unixedu-hero--' . sanitize_html_class($variant ?: 'home'),
				]
			)
		),
	]
);

$hero_style_attr = '';
if ('' !== trim($hero_image_url)) {
	$hero_style_attr .= sprintf('--unixedu-hero-bg: url(%s);', esc_url($hero_image_url));
}
if ($show_stats) {
	$hero_style_attr .= sprintf('--unixedu-hero-stats-bottom: %dpx; --unixedu-hero-stats-gap: %dpx;', $stats_bottom_offset, $stats_gap);
}

// Auto breadcrumbs (when enabled) if custom breadcrumb fields are empty.
if ($show_breadcrumbs && '' === trim($breadcrumb_label)) {
	$breadcrumb_parent_label = esc_html__('Home', 'unixedu');
	$breadcrumb_parent_url   = home_url('/');

	if (function_exists('get_the_ID')) {
		$current_id = (int) get_the_ID();
		if ($current_id > 0) {
			$current_title = (string) get_the_title($current_id);
			if ('' !== trim($current_title)) {
				$breadcrumb_label = $current_title;
			}
		}
	}
}

?>
<section <?php echo $block_wrapper_attributes; ?><?php echo $hero_style_attr ? ' style="' . esc_attr($hero_style_attr) . '"' : ''; ?>>
	<div class="unixedu-hero__inner">
		<div class="unixedu-hero__content">
			<?php if ($show_breadcrumbs && ($breadcrumb_parent_label || $breadcrumb_label)) : ?>
				<div class="unixedu-hero__breadcrumbs">
					<?php if ($breadcrumb_parent_url && $breadcrumb_parent_label) : ?>
						<a href="<?php echo esc_url($breadcrumb_parent_url); ?>">
							<?php echo esc_html($breadcrumb_parent_label); ?>
						</a>
					<?php elseif ($breadcrumb_parent_label) : ?>
						<?php echo esc_html($breadcrumb_parent_label); ?>
					<?php endif; ?>

					<?php if ($breadcrumb_label) : ?>
						<span aria-hidden="true"> / </span>
						<span><?php echo esc_html($breadcrumb_label); ?></span>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php if ($eyebrow !== '') : ?>
				<p class="unixedu-hero__eyebrow"><?php echo wp_kses(nl2br(esc_html($eyebrow)), ['br' => []]); ?></p>
			<?php endif; ?>

			<?php
			$has_title = false;
			foreach ($title_lines as $line) {
				if ('' !== trim($line)) {
					$has_title = true;
					break;
				}
			}
			?>

			<?php if ($has_title) : ?>
				<h1 class="unixedu-hero__title">
					<?php foreach ($title_lines as $index => $line) : ?>
						<?php if ('' === trim($line)) : ?>
							<?php continue; ?>
						<?php endif; ?>

						<?php
						$is_highlight = ('limeOnDark' === $highlight_mode) && ($highlight_line === $index);
						$is_mixed_lime = ('mixed' === $highlight_mode) && ('partners' === $variant) && ($index === 0 || $index === 1);

						$line_classes = ['unixedu-hero__title-line'];
						if ($is_mixed_lime) {
							$line_classes[] = 'is-lime';
						}
						?>

						<span class="<?php echo esc_attr(implode(' ', $line_classes)); ?>">
							<?php if ($is_highlight) : ?>
								<span class="unixedu-hero__title-highlight"><?php echo wp_kses(nl2br(esc_html($line)), ['br' => []]); ?></span>
							<?php else : ?>
								<?php echo wp_kses(nl2br(esc_html($line)), ['br' => []]); ?>
							<?php endif; ?>
						</span>
					<?php endforeach; ?>
				</h1>
			<?php endif; ?>

			<?php if ('' !== trim($text)) : ?>
				<p class="unixedu-hero__text"><?php echo wp_kses(nl2br(esc_html($text)), ['br' => []]); ?></p>
			<?php endif; ?>

			<?php
			$show_primary = ('' !== trim($primary_button_text)) && ('' !== trim($primary_button_url));
			$show_secondary = $show_secondary_button && ('' !== trim($secondary_button_text)) && ('' !== trim($secondary_button_url));
			?>

			<?php if ($show_primary || $show_secondary) : ?>
				<div class="unixedu-hero__actions">
					<?php if ($show_primary) : ?>
						<a
							class="<?php echo esc_attr('unixedu-hero__button unixedu-hero__button--' . sanitize_html_class($primary_button_style)); ?>"
							href="<?php echo esc_url($primary_button_url); ?>"
						>
							<?php echo esc_html($primary_button_text); ?>
						</a>
					<?php endif; ?>

					<?php if ($show_secondary) : ?>
						<a
							class="<?php echo esc_attr('unixedu-hero__button unixedu-hero__button--' . sanitize_html_class($secondary_button_style)); ?>"
							href="<?php echo esc_url($secondary_button_url); ?>"
						>
							<?php echo esc_html($secondary_button_text); ?>
						</a>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>

	</div>

	<?php if ($show_stats) : ?>
		<div class="unixedu-hero__stats">
			<div class="<?php echo esc_attr('unixedu-hero__stats-inner is-count-' . $stats_count); ?>">
				<?php for ($i = 0; $i < $stats_count; $i++) : ?>
					<?php
					$value = isset($stats[$i]['value']) ? (string) $stats[$i]['value'] : '';
					$label = isset($stats[$i]['label']) ? (string) $stats[$i]['label'] : '';
					if ('' === trim($value) && '' === trim($label)) {
						continue;
					}
					?>
					<div class="unixedu-hero__stat">
						<?php if ('' !== trim($value)) : ?>
							<span class="unixedu-hero__stat-value" data-unixedu-counter="<?php echo esc_attr($value); ?>">
								<?php echo esc_html($value); ?>
							</span>
						<?php endif; ?>
						<?php if ('' !== trim($label)) : ?>
							<span class="unixedu-hero__stat-label"><?php echo esc_html($label); ?></span>
						<?php endif; ?>
					</div>
				<?php endfor; ?>
			</div>
		</div>
	<?php endif; ?>
</section>

