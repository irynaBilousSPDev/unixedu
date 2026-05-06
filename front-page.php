<?php
/**
 * The front page template.
 *
 * Keep this minimal and Gutenberg-driven.
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
			<div class="entry-content">
				<?php
				// Front page content should be built with Gutenberg blocks.
				the_content();
				?>
			</div>
		</article>
		<?php
	endwhile;
	?>
</main>

<?php
get_footer();

