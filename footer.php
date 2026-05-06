<?php
/**
 * The template for displaying the footer.
 *
 * @package unixedu
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
	exit;
}

?>

<footer class="site-footer" role="contentinfo">
	<div class="site-footer__inner">
		<div class="site-footer__main">
			<div class="site-footer__brand">
				<p class="site-footer__description">
					<?php
					// Keep this as a 2-line tagline to match the design.
					echo wp_kses_post(__('The smarter way to find<br>your university abroad.', 'unixedu'));
					?>
				</p>

				<?php
				$unixedu_footer_logo_url = function_exists('unixedu_static') ? unixedu_static('images/footer/unixedu_logo_footer.png') : '';
				?>
				<?php if ($unixedu_footer_logo_url && function_exists('unixedu_static_path') && file_exists(unixedu_static_path('images/footer/unixedu_logo_footer.png'))) : ?>
					<a class="site-footer__logo-link" href="<?php echo esc_url(home_url('/')); ?>" rel="home">
						<img
							class="site-footer__logo"
							src="<?php echo esc_url($unixedu_footer_logo_url); ?>"
							alt="<?php echo esc_attr__('uniXedu', 'unixedu'); ?>"
							loading="lazy"
							width="170"
							height="48"
						/>
					</a>
				<?php endif; ?>
			</div>

			<div class="site-footer__columns">
				<?php
				$unixedu_footer_columns = [
					'footer_explore',
					'footer_students',
					'footer_universities',
					'footer_institution',
				];

				$unixedu_locations = get_nav_menu_locations();

				foreach ($unixedu_footer_columns as $unixedu_location) :
					if (!has_nav_menu($unixedu_location)) {
						continue;
					}

					$unixedu_menu_id = isset($unixedu_locations[$unixedu_location]) ? (int) $unixedu_locations[$unixedu_location] : 0;
					$unixedu_items = $unixedu_menu_id ? wp_get_nav_menu_items($unixedu_menu_id) : [];

					if (empty($unixedu_items) || !is_array($unixedu_items)) {
						continue;
					}

					$unixedu_title_item = $unixedu_items[0];
					$unixedu_title = isset($unixedu_title_item->title) ? (string) $unixedu_title_item->title : '';
					$unixedu_title_url = isset($unixedu_title_item->url) ? (string) $unixedu_title_item->url : '';
					?>
					<div class="site-footer__column">
						<?php if ('' !== trim($unixedu_title) && '' !== trim($unixedu_title_url)) : ?>
							<h2 class="site-footer__column-title">
								<a class="site-footer__column-title-link" href="<?php echo esc_url($unixedu_title_url); ?>">
									<?php echo esc_html($unixedu_title); ?>
								</a>
							</h2>
						<?php elseif ('' !== trim($unixedu_title)) : ?>
							<h2 class="site-footer__column-title"><?php echo esc_html($unixedu_title); ?></h2>
						<?php endif; ?>

						<?php if (count($unixedu_items) > 1) : ?>
							<ul class="site-footer__menu">
								<?php for ($i = 1; $i < count($unixedu_items); $i++) : ?>
									<?php
									$unixedu_item = $unixedu_items[$i];
									$unixedu_item_title = isset($unixedu_item->title) ? (string) $unixedu_item->title : '';
									$unixedu_item_url = isset($unixedu_item->url) ? (string) $unixedu_item->url : '';
									if ('' === trim($unixedu_item_title) || '' === trim($unixedu_item_url)) {
										continue;
									}
									?>
									<li>
										<a href="<?php echo esc_url($unixedu_item_url); ?>">
											<?php echo esc_html($unixedu_item_title); ?>
										</a>
									</li>
								<?php endfor; ?>
							</ul>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>

			<div class="site-footer__social">
				<h2 class="site-footer__social-title"><?php echo esc_html__('Follow us', 'unixedu'); ?></h2>

				<?php
				// TODO: Move social URLs to theme options (Customizer/ACF) later.
				$unixedu_social_links = [];

				if (function_exists('unixedu_static') && function_exists('unixedu_static_path')) {
					$unixedu_candidates = [
						[
							'label'    => 'Instagram',
							'href'     => '#',
							'rel_path' => 'images/social/social_instagram.png',
						],
						[
							'label'    => 'TikTok',
							'href'     => '#',
							'rel_path' => 'images/social/social_music.png',
						],
						[
							'label'    => 'YouTube',
							'href'     => '#',
							'rel_path' => 'images/social/social_youtube.png',
						],
						[
							'label'    => 'LinkedIn',
							'href'     => '#',
							'rel_path' => 'images/social/social_in.png',
						],
					];

					foreach ($unixedu_candidates as $unixedu_candidate) {
						if (!empty($unixedu_candidate['rel_path']) && file_exists(unixedu_static_path((string) $unixedu_candidate['rel_path']))) {
							$unixedu_social_links[] = [
								'label' => (string) $unixedu_candidate['label'],
								'href'  => (string) $unixedu_candidate['href'],
								'icon'  => unixedu_static((string) $unixedu_candidate['rel_path']),
							];
						}
					}
				}
				?>

				<?php if (!empty($unixedu_social_links)) : ?>
					<ul class="site-footer__social-list">
						<?php foreach ($unixedu_social_links as $unixedu_social) : ?>
							<li class="site-footer__social-item">
								<a
									class="site-footer__social-link"
									href="<?php echo esc_url($unixedu_social['href']); ?>"
									aria-label="<?php echo esc_attr($unixedu_social['label']); ?>"
								>
									<img
										class="site-footer__social-icon"
										src="<?php echo esc_url($unixedu_social['icon']); ?>"
										alt=""
										loading="lazy"
										width="18"
										height="18"
									/>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</div>
		</div>

		<div class="site-footer__bottom">
			<div class="site-footer__bottom-inner">
				<p class="site-footer__copyright">
					<?php
					echo esc_html(
						sprintf(
							/* translators: %s is the current year. */
							__('© %s uniXedu Sp. z o.o. All rights reserved.', 'unixedu'),
							gmdate('Y')
						)
					);
					?>
				</p>

				<?php if (has_nav_menu('legal')) : ?>
					<nav class="site-footer__legal" aria-label="<?php echo esc_attr__('Legal menu', 'unixedu'); ?>">
						<?php
						wp_nav_menu(
							[
								'theme_location' => 'legal',
								'container'      => false,
								'fallback_cb'    => false,
								'menu_class'     => 'site-footer__menu site-footer__menu--legal',
								'depth'          => 1,
							]
						);
						?>
					</nav>
				<?php else : ?>
					<div class="site-footer__legal site-footer__legal--fallback" aria-label="<?php echo esc_attr__('Legal links', 'unixedu'); ?>">
						<?php echo esc_html__('Privacy Policy · Terms of Use · Cookie Settings · Accessibility', 'unixedu'); ?>
					</div>
				<?php endif; ?>

				<div class="site-footer__decor-dots" aria-hidden="true">
					<span class="site-footer__dot"></span>
					<span class="site-footer__dot"></span>
					<span class="site-footer__dot"></span>
				</div>
			</div>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>

