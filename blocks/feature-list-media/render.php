<?php
/**
 * Server-side rendering of the block.
 *
 * @var array $attributes
 */

$background = isset($attributes['background']) ? (string) $attributes['background'] : 'white';
$background = in_array($background, ['white', 'light-gray', 'black'], true) ? $background : 'white';

$accent = isset($attributes['accent']) ? (string) $attributes['accent'] : 'lime';
$accent = in_array($accent, ['lime', 'gray'], true) ? $accent : 'lime';

$show_accent  = !isset($attributes['showAccent']) || (bool) $attributes['showAccent'];
$accent_width = isset($attributes['accentWidth']) ? (int) $attributes['accentWidth'] : 6;
$accent_gap   = isset($attributes['accentGap']) ? (int) $attributes['accentGap'] : 20;
$accent_width = max(0, min(20, $accent_width));
$accent_gap   = max(0, min(60, $accent_gap));

$accent_scheme = isset($attributes['accentScheme']) ? (string) $attributes['accentScheme'] : 'all-lime';
$accent_scheme = in_array($accent_scheme, ['all-lime', 'all-gray', 'col1-lime-col2-gray', 'col1-gray-col2-lime'], true) ? $accent_scheme : 'all-lime';

$list_cols = isset($attributes['listColumns']) ? (int) $attributes['listColumns'] : 2;
$list_cols = max(1, min(3, $list_cols));

$show_item_icon = !empty($attributes['showItemIcon']);
$item_icon_url  = isset($attributes['itemIconUrl']) ? (string) $attributes['itemIconUrl'] : '';
$item_icon_alt  = isset($attributes['itemIconAlt']) ? (string) $attributes['itemIconAlt'] : '';

$show_dividers = !isset($attributes['showDividers']) || (bool) $attributes['showDividers'];

$eyebrow = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$text    = isset($attributes['text']) ? (string) $attributes['text'] : '';

$title_lines = [];
for ($i = 1; $i <= 3; $i++) {
	$k_text  = 'titleLine' . $i;
	$k_style = 'titleLine' . $i . 'Style';
	$t       = isset($attributes[$k_text]) ? trim((string) $attributes[$k_text]) : '';
	if ($t === '') {
		continue;
	}
	$s = isset($attributes[$k_style]) ? (string) $attributes[$k_style] : 'default';
	$title_lines[] = [
		'text'  => $t,
		'style' => $s,
	];
}

$items = isset($attributes['items']) && is_array($attributes['items']) ? $attributes['items'] : [];
$items = array_values(array_filter($items, function ($it) {
	return is_array($it) && (isset($it['title']) || isset($it['text']));
}));

$show_media = !empty($attributes['showMedia']);
$media_url  = isset($attributes['mediaImageUrl']) ? (string) $attributes['mediaImageUrl'] : '';
$media_alt  = isset($attributes['mediaImageAlt']) ? (string) $attributes['mediaImageAlt'] : '';

$show_logo     = !empty($attributes['showLogo']);
$logo_url      = isset($attributes['logoImageUrl']) ? (string) $attributes['logoImageUrl'] : '';
$logo_alt      = isset($attributes['logoImageAlt']) ? (string) $attributes['logoImageAlt'] : '';
$logo_position = isset($attributes['logoPosition']) ? (string) $attributes['logoPosition'] : 'top-right';
$logo_position = in_array($logo_position, ['top-right', 'top-left'], true) ? $logo_position : 'top-right';

$classes = [
	'unixedu-feature-list-media',
	'unixedu-feature-list-media--bg-' . $background,
	'unixedu-feature-list-media--accent-' . $accent,
	'unixedu-feature-list-media--scheme-' . $accent_scheme,
	'unixedu-feature-list-media--cols-' . (string) $list_cols,
	$show_media ? '' : 'unixedu-feature-list-media--no-media',
	$show_dividers ? '' : 'unixedu-feature-list-media--no-dividers',
	$show_accent ? '' : 'unixedu-feature-list-media--no-accent',
];
$classes = array_values(array_filter($classes));

$style = sprintf(
	'--flm-accent-w:%dpx;--flm-accent-gap:%dpx;--flm-accent-col-w:%s;--flm-cols:%d;',
	$accent_width,
	$accent_gap,
	$show_accent ? max(10, $accent_width + 4) . 'px' : '0px',
	$list_cols
);

?>
<section class="<?php echo esc_attr(implode(' ', $classes)); ?>" style="<?php echo esc_attr($style); ?>">
	<div class="unixedu-feature-list-media__inner">
		<div class="unixedu-feature-list-media__main">
			<header class="unixedu-section-header__head">
				<?php if (trim($eyebrow) !== '') : ?>
					<p class="unixedu-section-header__eyebrow"><?php echo esc_html($eyebrow); ?></p>
				<?php endif; ?>

				<h2 class="unixedu-section-header__title">
					<?php if (!empty($title_lines)) : ?>
						<?php foreach ($title_lines as $line) : ?>
							<?php
							$style_bem = function_exists('unixedu_title_line_style_bem_suffix')
								? unixedu_title_line_style_bem_suffix((string) $line['style'])
								: 'default';
							?>
							<span class="<?php echo esc_attr('unixedu-section-header__title-line unixedu-section-header__title-line--' . sanitize_html_class($style_bem)); ?>">
								<?php echo esc_html($line['text']); ?>
							</span>
						<?php endforeach; ?>
					<?php else : ?>
						<span class="unixedu-section-header__title-line unixedu-section-header__title-line--default">
							<?php echo esc_html__('Section title', 'unixedu'); ?>
						</span>
					<?php endif; ?>
				</h2>

				<?php if (trim($text) !== '') : ?>
					<p class="unixedu-feature-list-media__text"><?php echo nl2br(esc_html($text)); ?></p>
				<?php endif; ?>
			</header>

			<?php if (!empty($items)) : ?>
				<div class="unixedu-feature-list-media__grid">
					<?php foreach ($items as $idx => $it) : ?>
						<?php
						$item_title = isset($it['title']) ? (string) $it['title'] : '';
						$item_text  = isset($it['text']) ? (string) $it['text'] : '';
						$col = ($idx % $list_cols) + 1;
						?>
						<div class="unixedu-feature-list-media__item unixedu-feature-list-media__item--col-<?php echo esc_attr((string) $col); ?>">
							<?php if ($show_accent) : ?>
								<div class="unixedu-feature-list-media__item-accent" aria-hidden="true"></div>
							<?php endif; ?>
							<div class="unixedu-feature-list-media__item-body">
								<?php if (trim($item_title) !== '') : ?>
									<div class="unixedu-feature-list-media__item-head">
										<?php if ($show_item_icon && trim($item_icon_url) !== '') : ?>
											<img class="unixedu-feature-list-media__item-icon" src="<?php echo esc_url($item_icon_url); ?>" alt="<?php echo esc_attr($item_icon_alt); ?>" loading="lazy" decoding="async" />
										<?php endif; ?>
										<h3 class="unixedu-feature-list-media__item-title"><?php echo esc_html($item_title); ?></h3>
									</div>
								<?php endif; ?>
								<?php if (trim($item_text) !== '') : ?>
									<p class="unixedu-feature-list-media__item-text"><?php echo esc_html($item_text); ?></p>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>

		<?php if ($show_media) : ?>
			<div class="unixedu-feature-list-media__media">
				<?php if (trim($media_url) !== '') : ?>
					<div class="unixedu-feature-list-media__media-frame">
						<img class="unixedu-feature-list-media__media-img" src="<?php echo esc_url($media_url); ?>" alt="<?php echo esc_attr($media_alt); ?>" loading="lazy" decoding="async" />
						<?php if ($show_logo && trim($logo_url) !== '') : ?>
							<img class="unixedu-feature-list-media__logo unixedu-feature-list-media__logo--<?php echo esc_attr($logo_position); ?>" src="<?php echo esc_url($logo_url); ?>" alt="<?php echo esc_attr($logo_alt); ?>" loading="lazy" decoding="async" />
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</section>

