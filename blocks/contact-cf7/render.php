<?php
/**
 * Server-side rendering.
 *
 * @var array $attributes
 */

$background = isset($attributes['background']) ? (string) $attributes['background'] : 'lime';
$background = in_array($background, ['lime', 'white', 'light-gray', 'black'], true) ? $background : 'lime';

$eyebrow = isset($attributes['eyebrow']) ? (string) $attributes['eyebrow'] : '';
$text    = isset($attributes['text']) ? (string) $attributes['text'] : '';

$title_lines = [];
for ($i = 1; $i <= 2; $i++) {
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

$left_label     = isset($attributes['leftLabel']) ? (string) $attributes['leftLabel'] : '';
$email_label    = isset($attributes['emailLabel']) ? (string) $attributes['emailLabel'] : '';
$email          = isset($attributes['email']) ? (string) $attributes['email'] : '';
$phone_label    = isset($attributes['phoneLabel']) ? (string) $attributes['phoneLabel'] : '';
$phone          = isset($attributes['phone']) ? (string) $attributes['phone'] : '';
$whatsapp_label = isset($attributes['whatsappLabel']) ? (string) $attributes['whatsappLabel'] : '';
$whatsapp       = isset($attributes['whatsapp']) ? (string) $attributes['whatsapp'] : '';
$note1          = isset($attributes['noteLine1']) ? (string) $attributes['noteLine1'] : '';
$note2          = isset($attributes['noteLine2']) ? (string) $attributes['noteLine2'] : '';

$form_title    = isset($attributes['formTitle']) ? (string) $attributes['formTitle'] : '';
$cf7_shortcode = isset($attributes['cf7Shortcode']) ? (string) $attributes['cf7Shortcode'] : '';

$classes = [
	'unixedu-contact-cf7',
	'unixedu-contact-cf7--bg-' . $background,
];

?>
<section class="<?php echo esc_attr(implode(' ', $classes)); ?>">
	<div class="unixedu-contact-cf7__inner">
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
				<p class="unixedu-contact-cf7__text"><?php echo nl2br(esc_html($text)); ?></p>
			<?php endif; ?>
		</header>

		<div class="unixedu-contact-cf7__grid">
			<div class="unixedu-contact-cf7__card unixedu-contact-cf7__card--left">
				<?php if (trim($left_label) !== '') : ?>
					<div class="unixedu-contact-cf7__left-label"><?php echo esc_html(strtoupper($left_label)); ?></div>
				<?php endif; ?>
				<div class="unixedu-contact-cf7__left-divider" aria-hidden="true"></div>

				<?php if (trim($email) !== '') : ?>
					<div class="unixedu-contact-cf7__kv">
						<div class="unixedu-contact-cf7__k"><?php echo esc_html(strtoupper($email_label !== '' ? $email_label : __('Email', 'unixedu'))); ?></div>
						<div class="unixedu-contact-cf7__v">
							<a href="mailto:<?php echo esc_attr(sanitize_email($email)); ?>"><?php echo esc_html($email); ?></a>
						</div>
					</div>
				<?php endif; ?>

				<?php if (trim($phone) !== '') : ?>
					<div class="unixedu-contact-cf7__kv">
						<div class="unixedu-contact-cf7__k"><?php echo esc_html(strtoupper($phone_label !== '' ? $phone_label : __('Phone', 'unixedu'))); ?></div>
						<div class="unixedu-contact-cf7__v"><?php echo esc_html($phone); ?></div>
					</div>
				<?php endif; ?>

				<?php if (trim($whatsapp) !== '') : ?>
					<div class="unixedu-contact-cf7__kv">
						<div class="unixedu-contact-cf7__k"><?php echo esc_html(strtoupper($whatsapp_label !== '' ? $whatsapp_label : __('WhatsApp', 'unixedu'))); ?></div>
						<div class="unixedu-contact-cf7__v"><?php echo esc_html($whatsapp); ?></div>
					</div>
				<?php endif; ?>

				<?php if (trim($note1) !== '' || trim($note2) !== '') : ?>
					<div class="unixedu-contact-cf7__notes">
						<?php if (trim($note1) !== '') : ?><p><?php echo esc_html($note1); ?></p><?php endif; ?>
						<?php if (trim($note2) !== '') : ?><p><?php echo esc_html($note2); ?></p><?php endif; ?>
					</div>
				<?php endif; ?>
			</div>

			<div class="unixedu-contact-cf7__card unixedu-contact-cf7__card--right">
				<?php if (trim($form_title) !== '') : ?>
					<h3 class="unixedu-contact-cf7__form-title"><?php echo esc_html($form_title); ?></h3>
				<?php endif; ?>

				<div class="unixedu-contact-cf7__form">
					<?php
					if (trim($cf7_shortcode) !== '') {
						echo do_shortcode($cf7_shortcode);
					}
					?>
				</div>
			</div>
		</div>
	</div>
</section>

