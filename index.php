<?php
/**
 * The main template file (fallback).
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
	<?php if (have_posts()) : ?>
		<?php
		while (have_posts()) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<header class="entry-header">
					<h1 class="entry-title">
						<a href="<?php echo esc_url(get_permalink()); ?>">
							<?php echo esc_html(get_the_title()); ?>
						</a>
					</h1>
				</header>

				<div class="entry-summary">
					<?php if (has_excerpt()) : ?>
						<?php echo wp_kses_post(get_the_excerpt()); ?>
					<?php else : ?>
						<?php the_content(); ?>
					<?php endif; ?>
				</div>

				<footer class="entry-footer">
					<a href="<?php echo esc_url(get_permalink()); ?>">
						<?php echo esc_html__('Read more', 'unixedu'); ?>
					</a>
				</footer>
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

