<?php
/**
 * The template for displaying archive pages.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

get_header();
?>

<main id="primary" class="site-main">
	<header class="page-header">
		<h1 class="page-title"><?php echo wp_kses_post(get_the_archive_title()); ?></h1>

		<?php
		$unixedu_archive_description = get_the_archive_description();
		if (!empty($unixedu_archive_description)) :
			?>
			<div class="archive-description">
				<?php echo wp_kses_post($unixedu_archive_description); ?>
			</div>
		<?php endif; ?>
	</header>

	<?php if (have_posts()) : ?>
		<?php
		while (have_posts()) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<header class="entry-header">
					<h2 class="entry-title">
						<a href="<?php echo esc_url(get_permalink()); ?>">
							<?php echo esc_html(get_the_title()); ?>
						</a>
					</h2>
				</header>

				<div class="entry-summary">
					<?php if (has_excerpt()) : ?>
						<?php echo wp_kses_post(get_the_excerpt()); ?>
					<?php else : ?>
						<?php the_excerpt(); ?>
					<?php endif; ?>
				</div>
			</article>
			<?php
		endwhile;
		?>
	<?php else : ?>
		<p><?php echo esc_html__('Nothing found.', 'unixedu'); ?></p>
	<?php endif; ?>
</main>

<?php
get_footer();

