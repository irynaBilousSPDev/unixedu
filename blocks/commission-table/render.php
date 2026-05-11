<?php
/**
 * Commission Table block render.
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

$has_title = false;
foreach ($title_lines as $line) {
	if (isset($line['text']) && '' !== trim((string) $line['text'])) {
		$has_title = true;
		break;
	}
}

$rows_raw = isset($attributes['rows']) && is_array($attributes['rows']) ? $attributes['rows'] : [];
$footnote = isset($attributes['footnote']) ? (string) $attributes['footnote'] : '';
$rows = [];
foreach ($rows_raw as $row) {
	if (!is_array($row)) {
		continue;
	}
	$rows[] = [
		'c1'           => isset($row['c1']) ? (string) $row['c1'] : '',
		'c2'           => isset($row['c2']) ? (string) $row['c2'] : '',
		'c3'           => isset($row['c3']) ? (string) $row['c3'] : '',
		'c4'           => isset($row['c4']) ? (string) $row['c4'] : '',
		'isHighlighted' => !empty($row['isHighlighted']),
	];
}

if (empty($rows)) {
	$rows = [
		[ 'c1' => '1 – 3 students', 'c2' => '40%', 'c3' => 'EUR 240 / student', 'c4' => 'EUR 240 – 720', 'isHighlighted' => false ],
		[ 'c1' => '4 – 10 students', 'c2' => '50%', 'c3' => 'EUR 300 / student', 'c4' => 'EUR 1,200 – 3,000', 'isHighlighted' => false ],
		[ 'c1' => '11 – 20 students', 'c2' => '60%', 'c3' => 'EUR 360 / student', 'c4' => 'EUR 3,960 – 7,200', 'isHighlighted' => false ],
		[ 'c1' => '20+ students', 'c2' => '70%', 'c3' => 'EUR 420 / student', 'c4' => 'EUR 8,400+', 'isHighlighted' => true ],
	];
}

$classes = [
	'unixedu-commission-table',
	'unixedu-commission-table--bg-' . $background,
];

$block_wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => trim(implode(' ', array_filter($classes))),
	]
);

?>
<section <?php echo $block_wrapper_attributes; ?>>
	<div class="unixedu-commission-table__inner">
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
		</header>

		<div class="unixedu-commission-table__table-wrap">
			<table class="commission-table">
				<thead>
					<tr>
						<th><?php echo esc_html__('Students placed / year', 'unixedu'); ?></th>
						<th><?php echo esc_html__('Your commission', 'unixedu'); ?></th>
						<th><?php echo esc_html__('Partner fee / student', 'unixedu'); ?></th>
						<th><?php echo esc_html__('Annual estimate', 'unixedu'); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ($rows as $row) : ?>
						<?php
						$c1 = isset($row['c1']) ? trim((string) $row['c1']) : '';
						$c2 = isset($row['c2']) ? trim((string) $row['c2']) : '';
						$c3 = isset($row['c3']) ? trim((string) $row['c3']) : '';
						$c4 = isset($row['c4']) ? trim((string) $row['c4']) : '';
						$is_highlighted = !empty($row['isHighlighted']);
						?>
						<tr class="<?php echo $is_highlighted ? 'is-highlighted' : ''; ?>">
							<td><?php echo esc_html($c1); ?></td>
							<td><?php echo esc_html($c2); ?></td>
							<td><?php echo esc_html($c3); ?></td>
							<td><?php echo esc_html($c4); ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>

		<?php if ('' !== trim($footnote)) : ?>
			<p class="unixedu-commission-table__footnote"><?php echo wp_kses(nl2br(esc_html($footnote)), ['br' => []]); ?></p>
		<?php endif; ?>
	</div>
</section>

