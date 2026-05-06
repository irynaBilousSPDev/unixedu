<?php
/**
 * Who Cards block render.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

$eyebrow                = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$title_line_1            = isset($attributes['titleLine1']) ? (string) $attributes['titleLine1'] : '';
$title_line_2            = isset($attributes['titleLine2']) ? (string) $attributes['titleLine2'] : '';
$text                   = isset($attributes['text']) ? (string) $attributes['text'] : '';
$show_eyebrow_underline  = !empty($attributes['showEyebrowUnderline']);
$background             = isset($attributes['background']) ? (string) $attributes['background'] : 'white';
$background             = in_array($background, ['white', 'gray', 'black'], true) ? $background : 'white';

$cards = [
	[
		'type'          => isset($attributes['card1Type']) ? (string) $attributes['card1Type'] : 'light',
		'eyebrow'       => isset($attributes['card1Eyebrow']) ? (string) $attributes['card1Eyebrow'] : '',
		'title'         => isset($attributes['card1Title']) ? (string) $attributes['card1Title'] : '',
		'text'          => isset($attributes['card1Text']) ? (string) $attributes['card1Text'] : '',
		'button_text'   => isset($attributes['card1ButtonText']) ? (string) $attributes['card1ButtonText'] : '',
		'button_url'    => isset($attributes['card1ButtonUrl']) ? (string) $attributes['card1ButtonUrl'] : '',
		'small_url_txt' => isset($attributes['card1SmallUrlText']) ? (string) $attributes['card1SmallUrlText'] : '',
	],
	[
		'type'          => isset($attributes['card2Type']) ? (string) $attributes['card2Type'] : 'dark',
		'eyebrow'       => isset($attributes['card2Eyebrow']) ? (string) $attributes['card2Eyebrow'] : '',
		'title'         => isset($attributes['card2Title']) ? (string) $attributes['card2Title'] : '',
		'text'          => isset($attributes['card2Text']) ? (string) $attributes['card2Text'] : '',
		'button_text'   => isset($attributes['card2ButtonText']) ? (string) $attributes['card2ButtonText'] : '',
		'button_url'    => isset($attributes['card2ButtonUrl']) ? (string) $attributes['card2ButtonUrl'] : '',
		'small_url_txt' => isset($attributes['card2SmallUrlText']) ? (string) $attributes['card2SmallUrlText'] : '',
	],
	[
		'type'          => isset($attributes['card3Type']) ? (string) $attributes['card3Type'] : 'light',
		'eyebrow'       => isset($attributes['card3Eyebrow']) ? (string) $attributes['card3Eyebrow'] : '',
		'title'         => isset($attributes['card3Title']) ? (string) $attributes['card3Title'] : '',
		'text'          => isset($attributes['card3Text']) ? (string) $attributes['card3Text'] : '',
		'button_text'   => isset($attributes['card3ButtonText']) ? (string) $attributes['card3ButtonText'] : '',
		'button_url'    => isset($attributes['card3ButtonUrl']) ? (string) $attributes['card3ButtonUrl'] : '',
		'small_url_txt' => isset($attributes['card3SmallUrlText']) ? (string) $attributes['card3SmallUrlText'] : '',
	],
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim('unixedu-who-section who-section unixedu-who-section--' . sanitize_html_class($background)),
	]
);

?>
<section <?php echo $block_wrapper_attributes; ?>>
	<div class="container">
		<header class="<?php echo esc_attr('unixedu-who-section__head' . ($show_eyebrow_underline ? ' has-underline' : '')); ?>">
			<?php if ('' !== trim($eyebrow)) : ?>
				<p class="unixedu-who-section__eyebrow"><?php echo esc_html($eyebrow); ?></p>
			<?php endif; ?>

			<?php if ('' !== trim($title_line_1) || '' !== trim($title_line_2)) : ?>
				<h2 class="unixedu-who-section__title">
					<?php if ('' !== trim($title_line_1)) : ?>
						<span class="unixedu-who-section__title-line"><?php echo esc_html($title_line_1); ?></span>
					<?php endif; ?>
					<?php if ('' !== trim($title_line_2)) : ?>
						<span class="unixedu-who-section__title-line"><?php echo esc_html($title_line_2); ?></span>
					<?php endif; ?>
				</h2>
			<?php endif; ?>

			<?php if ('' !== trim($text)) : ?>
				<p class="unixedu-who-section__text"><?php echo esc_html($text); ?></p>
			<?php endif; ?>
		</header>

		<div class="path-grid unixedu-who-section__grid">
			<?php foreach ($cards as $card) : ?>
				<?php
				$type = in_array($card['type'], ['light', 'dark'], true) ? $card['type'] : 'light';
				$is_dark = ('dark' === $type);
				$card_classes = 'path-card unixedu-who-card';
				if ($is_dark) {
					$card_classes .= ' path-card--dark unixedu-who-card--dark';
				}

				$button_class = $is_dark ? 'btn btn--lime' : 'btn btn--black';
				?>

				<article class="<?php echo esc_attr($card_classes); ?>">
					<?php if ('' !== trim($card['eyebrow'])) : ?>
						<p class="path-card__eyebrow"><?php echo esc_html($card['eyebrow']); ?></p>
					<?php endif; ?>

					<?php if ('' !== trim($card['title'])) : ?>
						<h3 class="path-card__title"><?php echo esc_html($card['title']); ?></h3>
					<?php endif; ?>

					<?php if ('' !== trim($card['text'])) : ?>
						<p class="path-card__text"><?php echo esc_html($card['text']); ?></p>
					<?php endif; ?>

					<?php if ('' !== trim($card['button_text']) && '' !== trim($card['button_url'])) : ?>
						<a class="<?php echo esc_attr($button_class); ?>" href="<?php echo esc_url($card['button_url']); ?>">
							<?php echo esc_html($card['button_text']); ?>
						</a>
					<?php endif; ?>

					<?php if ('' !== trim($card['small_url_txt'])) : ?>
						<span class="path-card__url"><?php echo esc_html($card['small_url_txt']); ?></span>
					<?php endif; ?>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>

