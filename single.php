<?php
/**
 * The template for displaying all single posts.
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
	<?php
	while (have_posts()) :
		the_post();
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<header class="entry-header">
				<h1 class="entry-title"><?php echo esc_html(get_the_title()); ?></h1>

				<p class="entry-meta">
					<?php
					/* translators: 1: date, 2: author name */
					echo esc_html(sprintf(__('Published %1$s by %2$s', 'unixedu'), get_the_date(), get_the_author()));
					?>
				</p>
			</header>

			<?php if (has_post_thumbnail()) : ?>
				<figure class="entry-featured-image">
					<?php the_post_thumbnail('large'); ?>
				</figure>
			<?php endif; ?>

			<div class="entry-content">
				<?php the_content(); ?>
			</div>
		</article>
		<?php
	endwhile;
	?>
</main>

<?php
get_footer();

