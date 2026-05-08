<?php
/**
 * Segments block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$background = isset($attributes['background']) ? (string) $attributes['background'] : 'white';
$background = in_array($background, ['white', 'light-gray', 'black'], true) ? $background : 'white';

$eyebrow = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';

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

$cards_raw = isset($attributes['cards']) && is_array($attributes['cards']) ? $attributes['cards'] : [];
$cards = [];
foreach ($cards_raw as $card) {
	if (!is_array($card)) {
		continue;
	}
	$tone = isset($card['tone']) ? (string) $card['tone'] : 'default';
	$tone = in_array($tone, ['default', 'lime', 'dark'], true) ? $tone : 'default';

	$cards[] = [
		'eyebrow' => isset($card['eyebrow']) ? (string) $card['eyebrow'] : '',
		'price'   => isset($card['price']) ? (string) $card['price'] : '',
		'subtext' => isset($card['subtext']) ? (string) $card['subtext'] : '',
		'details' => isset($card['details']) ? (string) $card['details'] : '',
		'urlText' => isset($card['urlText']) ? (string) $card['urlText'] : '',
		'url'     => isset($card['url']) ? (string) $card['url'] : '',
		'tone'    => $tone,
	];
}

if (empty($cards)) {
	$cards = [
		[
			'eyebrow' => 'University placements',
			'price'   => '£800 – £2,500',
			'subtext' => 'per student placed',
			'details' => "UG · PG · Foundation · IYO · Pre-Master\nUK, EU, NA, AUS & NZ",
			'urlText' => 'View institutions →',
			'url'     => '',
			'tone'    => 'lime',
		],
		[
			'eyebrow' => 'Language schools',
			'price'   => '15 – 30%',
			'subtext' => 'commission',
			'details' => "General English · Exam Prep\nBusiness · Junior",
			'urlText' => 'View schools →',
			'url'     => '',
			'tone'    => 'default',
		],
		[
			'eyebrow' => 'Summer schools',
			'price'   => '10 – 25%',
			'subtext' => 'commission',
			'details' => "Residential & Day · Ages 8–17\nBuild long-term client relationships",
			'urlText' => 'View programmes →',
			'url'     => '',
			'tone'    => 'default',
		],
		[
			'eyebrow' => 'High school & boarding',
			'price'   => '£2,000 – £5,000',
			'subtext' => 'per student placed',
			'details' => "Premium boarding & private\nhigh schools worldwide",
			'urlText' => 'View institutions →',
			'url'     => '',
			'tone'    => 'dark',
		],
	];
}

$classes = [
	'unixedu-segments',
	'unixedu-segments--bg-' . $background,
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(implode(' ', array_filter($classes))),
	]
);

?>
<section <?php echo $block_wrapper_attributes; ?>>
	<div class="unixedu-segments__inner">
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
		</header>

		<div class="segment-grid unixedu-segments__grid">
			<?php foreach ($cards as $card) : ?>
				<?php
				$tone = isset($card['tone']) ? (string) $card['tone'] : 'default';
				$classes_card = ['segment-card'];
				if ('dark' === $tone) {
					$classes_card[] = 'segment-card--dark';
				}
				if ('lime' === $tone) {
					$classes_card[] = 'segment-card--lime';
				}

				$ey = isset($card['eyebrow']) ? (string) $card['eyebrow'] : '';
				$price = isset($card['price']) ? (string) $card['price'] : '';
				$subtext = isset($card['subtext']) ? (string) $card['subtext'] : '';
				$details = isset($card['details']) ? (string) $card['details'] : '';
				$url_text = isset($card['urlText']) ? (string) $card['urlText'] : '';
				$url = isset($card['url']) ? (string) $card['url'] : '';
				?>

				<article class="<?php echo esc_attr(implode(' ', $classes_card)); ?>">
					<?php if ('' !== trim($ey)) : ?>
						<p class="unixedu-segments__card-eyebrow"><?php echo wp_kses(nl2br(esc_html($ey)), ['br' => []]); ?></p>
					<?php endif; ?>

					<?php if ('' !== trim($price)) : ?>
						<div class="segment-card__price"><?php echo wp_kses(nl2br(esc_html($price)), ['br' => []]); ?></div>
					<?php endif; ?>

					<?php if ('' !== trim($subtext)) : ?>
						<p class="unixedu-segments__card-subtext"><?php echo wp_kses(nl2br(esc_html($subtext)), ['br' => []]); ?></p>
					<?php endif; ?>

					<div class="unixedu-segments__divider" aria-hidden="true"></div>

					<?php if ('' !== trim($details)) : ?>
						<p class="unixedu-segments__details">
							<?php
							$lines = preg_split("/\\r\\n|\\r|\\n/", trim($details));
							if (is_array($lines)) :
								foreach ($lines as $i => $line) :
									$line = (string) $line;
									if ('' === trim($line)) {
										continue;
									}
									?>
									<span class="unixedu-segments__details-line"><?php echo esc_html($line); ?></span>
									<?php
								endforeach;
							endif;
							?>
						</p>
					<?php endif; ?>

					<?php if ('' !== trim($url_text) && '' !== trim($url)) : ?>
						<p class="unixedu-segments__card-link"><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($url_text); ?></a></p>
					<?php elseif ('' !== trim($url_text)) : ?>
						<p class="unixedu-segments__card-link"><?php echo esc_html($url_text); ?></p>
					<?php endif; ?>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

