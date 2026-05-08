<?php
/**
 * The template for displaying pages.
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
			<?php
			// If the page already includes the Hero block, don't duplicate the page title above it.
			$has_hero_block = function_exists('has_block') ? has_block('unixedu/hero', get_the_ID()) : false;
			?>

			<?php if (!$has_hero_block) : ?>
				<header class="entry-header">
					<h1 class="entry-title"><?php echo esc_html(get_the_title()); ?></h1>
				</header>
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

