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
				<?php
				$unixedu_footer_brand_defaults = function_exists('unixedu_footer_brand_defaults')
					? unixedu_footer_brand_defaults()
					: ['tagline' => '', 'company' => ''];
				$unixedu_footer_tagline = get_theme_mod('unixedu_footer_tagline', $unixedu_footer_brand_defaults['tagline']);
				$unixedu_footer_tagline = is_string($unixedu_footer_tagline) ? trim($unixedu_footer_tagline) : '';
				?>
				<?php if ('' !== $unixedu_footer_tagline) : ?>
					<p class="site-footer__description">
						<?php echo wp_kses_post(nl2br(esc_html($unixedu_footer_tagline), false)); ?>
					</p>
				<?php endif; ?>

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

				<?php
				$unixedu_footer_company = get_theme_mod('unixedu_footer_company', $unixedu_footer_brand_defaults['company']);
				$unixedu_footer_company = is_string($unixedu_footer_company) ? trim($unixedu_footer_company) : '';
				?>
				<?php if ('' !== $unixedu_footer_company) : ?>
					<p class="site-footer__description site-footer__description--company">
						<?php echo wp_kses_post(nl2br(esc_html($unixedu_footer_company), false)); ?>
					</p>
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

				<?php
				$unixedu_social_links = [];

				if (function_exists('unixedu_static_path')) {
					$unixedu_candidates = [
						[
							'label'     => 'Instagram',
							'theme_mod' => 'unixedu_social_instagram',
							'file'      => 'icon-instagram.svg',
						],
						[
							'label'     => 'TikTok',
							'theme_mod' => 'unixedu_social_tiktok',
							'file'      => 'icon-tiktok.svg',
						],
						[
							'label'     => 'YouTube',
							'theme_mod' => 'unixedu_social_youtube',
							'file'      => 'icon-youtube.svg',
						],
						[
							'label'     => 'Facebook',
							'theme_mod' => 'unixedu_social_facebook',
							'file'      => 'icon-facebook.svg',
						],
						[
							'label'     => 'LinkedIn',
							'theme_mod' => 'unixedu_social_linkedin',
							'file'      => 'icon-linkedin.svg',
						],
						[
							'label'     => 'X',
							'theme_mod' => 'unixedu_social_x',
							'file'      => 'icon-x.svg',
						],
					];

					foreach ($unixedu_candidates as $unixedu_candidate) {
						$unixedu_svg_path = unixedu_static_path('images/social/' . (string) $unixedu_candidate['file']);
						if (! is_readable($unixedu_svg_path)) {
							continue;
						}
						$unixedu_svg_raw = file_get_contents($unixedu_svg_path);
						if (! is_string($unixedu_svg_raw) || '' === trim($unixedu_svg_raw)) {
							continue;
						}
						$unixedu_raw_url = get_theme_mod((string) $unixedu_candidate['theme_mod'], '');
						$unixedu_raw_url = is_string($unixedu_raw_url) ? trim($unixedu_raw_url) : '';
						if ('' === $unixedu_raw_url) {
							continue;
						}
						$unixedu_resolved = esc_url_raw($unixedu_raw_url);
						if ('' === $unixedu_resolved || ! preg_match('#^https?://#i', $unixedu_resolved)) {
							continue;
						}
						$unixedu_href     = esc_url($unixedu_resolved);
						$unixedu_external = (bool) preg_match('#^https?://#i', $unixedu_resolved);

						$unixedu_social_links[] = [
							'label'    => (string) $unixedu_candidate['label'],
							'href'     => $unixedu_href,
							'external' => $unixedu_external,
							'svg'      => $unixedu_svg_raw,
						];
					}
				}
				?>

				<?php if (!empty($unixedu_social_links)) : ?>
					<div class="site-footer__column site-footer__column--social site-footer__social">
						<h2 id="footer-follow-us-heading" class="site-footer__social-title">
							<span class="site-footer__social-title-mark"><?php echo esc_html__('Follow', 'unixedu'); ?></span><span class="site-footer__social-title-rest"><?php echo esc_html__(' us', 'unixedu'); ?></span>
						</h2>

						<ul class="site-footer__social-list" aria-labelledby="footer-follow-us-heading">
							<?php foreach ($unixedu_social_links as $unixedu_social) : ?>
								<li class="site-footer__social-item">
									<a
										class="site-footer__social-link"
										href="<?php echo esc_url($unixedu_social['href']); ?>"
										aria-label="<?php echo esc_attr($unixedu_social['label']); ?>"
										<?php echo $unixedu_social['external'] ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>
									>
										<?php
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
										echo $unixedu_social['svg'];
										?>
									</a>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<div class="site-footer__bottom">
			<?php
			$unixedu_bottom_inner_classes = ['site-footer__bottom-inner'];
			if (!has_nav_menu('legal')) {
				$unixedu_bottom_inner_classes[] = 'site-footer__bottom-inner--no-legal';
			}
			?>
			<div class="<?php echo esc_attr(implode(' ', $unixedu_bottom_inner_classes)); ?>">
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
					<nav class="site-footer__legal" aria-label="<?php echo esc_attr__('Legal and policies', 'unixedu'); ?>">
						<?php
						wp_nav_menu(
							[
								'theme_location' => 'legal',
								'container'      => false,
								'fallback_cb'    => false,
								'menu_class'     => 'site-footer__menu site-footer__menu--legal',
								'depth'          => 1,
								'menu_id'        => '',
							]
						);
						?>
					</nav>
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

