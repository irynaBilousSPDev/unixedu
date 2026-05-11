<?php
/**
 * 404 template (page not found).
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

get_header();
?>

<main id="primary" class="site-main site-main--error-404" role="main">
	<section class="error-404 not-found">
		<div class="error-404__inner container-wide">
			<p class="error-404__code" aria-hidden="true">404</p>
			<h1 class="error-404__title"><?php echo esc_html__('Page not found', 'unixedu'); ?></h1>
			<p class="error-404__lead">
				<?php echo esc_html__('The page you are looking for does not exist or may have been moved.', 'unixedu'); ?>
			</p>

			<div class="error-404__actions btn-row">
				<a class="btn btn--lime" href="<?php echo esc_url(home_url('/')); ?>">
					<?php echo esc_html__('Back to home', 'unixedu'); ?>
				</a>
			</div>
		</div>
	</section>
</main>

<?php
get_footer();
