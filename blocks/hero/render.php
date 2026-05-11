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

$eyebrow = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$eyebrow_style = isset($attributes['eyebrowStyle']) ? (string) $attributes['eyebrowStyle'] : 'default';
$eyebrow_style = in_array($eyebrow_style, ['default', 'black', 'white', 'lime', 'lime-on-black'], true) ? $eyebrow_style : 'default';
$text    = isset($attributes['text']) ? (string) $attributes['text'] : '';

$title_lines = [
	isset($attributes['titleLine1']) ? (string) $attributes['titleLine1'] : '',
	isset($attributes['titleLine2']) ? (string) $attributes['titleLine2'] : '',
	isset($attributes['titleLine3']) ? (string) $attributes['titleLine3'] : '',
	isset($attributes['titleLine4']) ? (string) $attributes['titleLine4'] : '',
];
$title_line_styles = [
	isset($attributes['titleLine1Style']) ? (string) $attributes['titleLine1Style'] : 'default',
	isset($attributes['titleLine2Style']) ? (string) $attributes['titleLine2Style'] : 'default',
	isset($attributes['titleLine3Style']) ? (string) $attributes['titleLine3Style'] : 'default',
	isset($attributes['titleLine4Style']) ? (string) $attributes['titleLine4Style'] : 'default',
];

// Highlight mode disabled (kept for backward compatibility with saved attributes).
$highlight_mode = 'none';
$highlight_line = 0;

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
					'unixedu-hero--' . sanitize_html_class($variant ?: 'home'),
					('default' !== $eyebrow_style) ? ('unixedu-hero--eyebrow-' . sanitize_html_class($eyebrow_style)) : '',
					$show_stats ? 'unixedu-hero--has-stats' : 'unixedu-hero--no-stats',
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
	// Reduce the hero's visual height so the stats bar is more likely to be visible on the first screen.
	$hero_style_attr .= '--unixedu-hero-viewport-adjust: 180px;';
}

// Auto breadcrumbs (toggle only; ignore custom breadcrumb attributes).
$breadcrumbs = [];
if ($show_breadcrumbs) {
	$home_label = esc_html__('Home', 'unixedu');
	$home_url   = home_url('/');
	$breadcrumbs[] = [
		'label' => $home_label,
		'url'   => $home_url,
	];

	$current_id = function_exists('get_the_ID') ? (int) get_the_ID() : 0;
	$is_home_like = function_exists('is_front_page') && is_front_page();
	$is_home_like = $is_home_like || (function_exists('is_home') && is_home());

	if (!$is_home_like && $current_id > 0) {
		$post_type = get_post_type($current_id);
		if ('page' === $post_type) {
			$ancestors = array_reverse(get_post_ancestors($current_id));
			foreach ($ancestors as $ancestor_id) {
				$ancestor_id = (int) $ancestor_id;
				if ($ancestor_id <= 0) {
					continue;
				}
				$title = (string) get_the_title($ancestor_id);
				if ('' === trim($title)) {
					continue;
				}
				$breadcrumbs[] = [
					'label' => $title,
					'url'   => get_permalink($ancestor_id),
				];
			}
		}

		$current_title = (string) get_the_title($current_id);
		$current_title = trim($current_title);
		if ('' !== $current_title && 'home' !== strtolower($current_title)) {
			$breadcrumbs[] = [
				'label' => $current_title,
				'url'   => '',
			];
		}
	}
}

?>
<section <?php echo $block_wrapper_attributes; ?><?php echo $hero_style_attr ? ' style="' . esc_attr($hero_style_attr) . '"' : ''; ?>>
	<div class="unixedu-hero__inner">
		<div class="unixedu-hero__content">
			<?php if ($show_breadcrumbs && !empty($breadcrumbs)) : ?>
				<div class="unixedu-hero__breadcrumbs">
					<?php foreach ($breadcrumbs as $i => $crumb) : ?>
						<?php
						$label = isset($crumb['label']) ? trim((string) $crumb['label']) : '';
						$url = isset($crumb['url']) ? trim((string) $crumb['url']) : '';
						if ('' === $label) {
							continue;
						}
						$is_last = ($i === (count($breadcrumbs) - 1));
						?>

						<?php if ($i > 0) : ?>
							<span aria-hidden="true"> / </span>
						<?php endif; ?>

						<?php if (!$is_last && '' !== $url) : ?>
							<a href="<?php echo esc_url($url); ?>"><?php echo esc_html($label); ?></a>
						<?php else : ?>
							<span><?php echo esc_html($label); ?></span>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<?php if ($eyebrow !== '') : ?>
				<p class="<?php echo esc_attr('unixedu-hero__eyebrow' . ('lime-on-black' === $eyebrow_style ? ' is-lime-on-black' : '')); ?>">
					<?php echo wp_kses(nl2br(esc_html($eyebrow)), ['br' => []]); ?>
				</p>
			<?php endif; ?>

			<?php
			$has_title = false;
			$title_line_count = 0;
			foreach ($title_lines as $line) {
				if ('' !== trim($line)) {
					$has_title = true;
					$title_line_count++;
				}
			}
			?>

			<?php if ($has_title) : ?>
				<h1 class="<?php echo esc_attr('unixedu-hero__title' . ($title_line_count >= 3 ? ' unixedu-hero__title--three-plus' : '')); ?>">
					<?php foreach ($title_lines as $index => $line) : ?>
						<?php if ('' === trim($line)) : ?>
							<?php continue; ?>
						<?php endif; ?>

						<?php
						$is_highlight = ('limeOnDark' === $highlight_mode) && ($highlight_line === $index);
						$is_mixed_lime = ('mixed' === $highlight_mode) && ('partners' === $variant) && ($index === 0 || $index === 1);
						$line_style = isset($title_line_styles[$index]) ? (string) $title_line_styles[$index] : 'default';
						$line_bem = function_exists('unixedu_title_line_style_bem_suffix')
							? unixedu_title_line_style_bem_suffix($line_style)
							: 'default';

						$line_classes = ['unixedu-hero__title-line'];
						if ('default' !== $line_bem) {
							$line_classes[] = 'unixedu-hero__title-line--' . sanitize_html_class($line_bem);
						}
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

