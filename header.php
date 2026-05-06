<?php
/**
 * The header for our theme.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" role="banner">
	<div class="site-header__inner">
		<div class="site-header__branding">
			<?php if (has_custom_logo()) : ?>
				<div class="site-header__logo site-header__logo--custom">
					<?php the_custom_logo(); ?>
				</div>
			<?php elseif (function_exists('unixedu_static_path') && file_exists(unixedu_static_path('images/header/unixedu_logo_header.png'))) : ?>
				<a
					class="site-header__logo site-header__logo--asset"
					href="<?php echo esc_url(home_url('/')); ?>"
					aria-label="<?php echo esc_attr(get_bloginfo('name')); ?>"
					rel="home"
				>
					<img
						class="site-header__logo-img"
						src="<?php echo esc_url(unixedu_static('images/header/unixedu_logo_header.png')); ?>"
						alt="<?php echo esc_attr(get_bloginfo('name')); ?>"
						width="180"
						height="44"
						decoding="async"
					/>
				</a>
			<?php else : ?>
				<a class="site-header__site-title" href="<?php echo esc_url(home_url('/')); ?>" rel="home">
					<?php echo esc_html(get_bloginfo('name')); ?>
				</a>
			<?php endif; ?>
		</div>

		<nav class="site-header__nav" aria-label="<?php echo esc_attr__('Primary menu', 'unixedu'); ?>">
			<?php
			wp_nav_menu(
				[
					'theme_location' => 'primary',
					'container'      => false,
					'fallback_cb'    => false,
					'menu_class'     => 'site-header__menu',
					'depth'          => 2,
				]
			);
			?>
		</nav>

		<?php if (has_nav_menu('header_cta')) : ?>
			<div class="site-header__cta">
				<?php
				// Header CTA is intentionally rendered as a single button (first menu item).
				$unixedu_locations = get_nav_menu_locations();
				$unixedu_cta_menu_id = isset($unixedu_locations['header_cta']) ? (int) $unixedu_locations['header_cta'] : 0;
				$unixedu_cta_items = $unixedu_cta_menu_id ? wp_get_nav_menu_items($unixedu_cta_menu_id) : [];

				if (!empty($unixedu_cta_items) && is_array($unixedu_cta_items)) {
					$unixedu_cta_item = $unixedu_cta_items[0];
					$unixedu_cta_url = isset($unixedu_cta_item->url) ? (string) $unixedu_cta_item->url : '';
					$unixedu_cta_title = isset($unixedu_cta_item->title) ? (string) $unixedu_cta_item->title : '';

					if ('' !== trim($unixedu_cta_url) && '' !== trim($unixedu_cta_title)) {
						?>
						<a class="site-header__cta-link" href="<?php echo esc_url($unixedu_cta_url); ?>">
							<?php echo esc_html($unixedu_cta_title); ?>
						</a>
						<?php
					}
				}
				?>
			</div>
		<?php endif; ?>

		<button
			class="site-header__toggle"
			type="button"
			aria-controls="site-navigation"
			aria-expanded="false"
		>
			<span class="visually-hidden"><?php echo esc_html__('Open menu', 'unixedu'); ?></span>
			<span class="site-header__toggle-icon" aria-hidden="true"></span>
		</button>
	</div>

	<div id="site-navigation" class="site-header__panel" hidden>
		<div class="site-header__panel-inner">
			<nav class="site-header__panel-nav" aria-label="<?php echo esc_attr__('Mobile menu', 'unixedu'); ?>">
				<?php
				wp_nav_menu(
					[
						'theme_location' => 'primary',
						'container'      => false,
						'fallback_cb'    => false,
						'menu_class'     => 'site-header__panel-menu',
						'depth'          => 2,
					]
				);
				?>
			</nav>

			<?php if (has_nav_menu('header_cta')) : ?>
				<div class="site-header__panel-cta">
					<?php
					// Header CTA as a single button in mobile panel too.
					$unixedu_locations = get_nav_menu_locations();
					$unixedu_cta_menu_id = isset($unixedu_locations['header_cta']) ? (int) $unixedu_locations['header_cta'] : 0;
					$unixedu_cta_items = $unixedu_cta_menu_id ? wp_get_nav_menu_items($unixedu_cta_menu_id) : [];

					if (!empty($unixedu_cta_items) && is_array($unixedu_cta_items)) {
						$unixedu_cta_item = $unixedu_cta_items[0];
						$unixedu_cta_url = isset($unixedu_cta_item->url) ? (string) $unixedu_cta_item->url : '';
						$unixedu_cta_title = isset($unixedu_cta_item->title) ? (string) $unixedu_cta_item->title : '';

						if ('' !== trim($unixedu_cta_url) && '' !== trim($unixedu_cta_title)) {
							?>
							<a class="site-header__panel-cta-link" href="<?php echo esc_url($unixedu_cta_url); ?>">
								<?php echo esc_html($unixedu_cta_title); ?>
							</a>
							<?php
						}
					}
					?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</header>

