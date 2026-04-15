<?php
/**
 * Template redirect renderer for OIAA Meetings
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handle rendering the React app when the configured base page is requested.
 */
function oiaa_meetings_template_redirect() {
    if (!oiaa_meetings_is_base_page_request()) {
        return;
    }

    // Ensure assets are loaded for our custom output.
    oiaa_meetings_enqueue_scripts();

    $api_url = get_option('oiaa_api_url', 'https://central-query.apps.code4recovery.org/api/v1/meetings');
    $color_mode = get_option('oiaa_color_mode', 'system');
    $base_path = oiaa_meetings_get_base_url_resolution();

    oiaa_meetings_render_header();
    ?>
    <main id="oiaa-meetings-app" class="oiaa-meetings-app">
        <div id="oiaa-meetings-root"></div>
    </main>
    <script>
        window.OIAA_CONFIG = {
            apiUrl: <?php echo wp_json_encode(esc_url_raw($api_url)); ?>,
            colorMode: <?php echo wp_json_encode($color_mode); ?>,
            basePath: <?php echo wp_json_encode($base_path); ?>,
            language: <?php echo wp_json_encode(oiaa_meetings_detect_language()); ?>
        };
    </script>
    <?php
    oiaa_meetings_render_footer();

    exit;
}
add_action('template_redirect', 'oiaa_meetings_template_redirect');

/**
 * Render a theme-compatible header for plugin output.
 */
function oiaa_meetings_render_header() {
    if (function_exists('wp_is_block_theme') && wp_is_block_theme()) {
        $template_header = OIAA_MEETINGS_PLUGIN_DIR . 'templates/header.php';
        if (file_exists($template_header)) {
            include $template_header;
            return;
        }
    }

    get_header();
}

/**
 * Render a theme-compatible footer for plugin output.
 */
function oiaa_meetings_render_footer() {
    if (function_exists('wp_is_block_theme') && wp_is_block_theme()) {
        $template_footer = OIAA_MEETINGS_PLUGIN_DIR . 'templates/footer.php';
        if (file_exists($template_footer)) {
            include $template_footer;
            return;
        }
    }

    get_footer();
}

/**
 * Resolve basePath from the currently queried page permalink.
 */
function oiaa_meetings_get_base_url_resolution() {
    $configured_base_path = oiaa_meetings_get_base_path();

    $queried_object_id = (int) get_queried_object_id();
    if ($queried_object_id <= 0) {
        return $configured_base_path;
    }

    $permalink = get_permalink($queried_object_id);
    if (!is_string($permalink) || $permalink === '') {
        return $configured_base_path;
    }

    $path = wp_parse_url($permalink, PHP_URL_PATH);
    if (!is_string($path) || $path === '') {
        return $configured_base_path;
    }

    $trimmed_path = trim($path, '/');
    if ($trimmed_path === '') {
        return '/';
    }

    $home_path = (string) wp_parse_url((string) get_option('home'), PHP_URL_PATH);
    $home_path = trim($home_path, '/');

    if ($home_path !== '') {
        if ($trimmed_path === $home_path) {
            return '/';
        }

        $prefix = $home_path . '/';
        if (strpos($trimmed_path, $prefix) === 0) {
            $trimmed_path = substr($trimmed_path, strlen($prefix));
        }
    }

    return '/' . $trimmed_path;
}

/**
 * Check whether the current query is for the base page configured by oiaa_base_path.
 */
function oiaa_meetings_is_base_page_request() {
    $page_path = oiaa_meetings_get_base_slug();

    // Homepage mode: render on the site front page without resolving a page ID.
    if ($page_path === '') {
        return is_front_page();
    }

    if (!is_page()) {
        return false;
    }

    $query_object_id = (int) get_queried_object_id();
    if ($query_object_id <= 0) {
        return false;
    }

    $base_page_ids = oiaa_meetings_get_base_page_ids();
    if (empty($base_page_ids)) {
        return false;
    }

    return in_array($query_object_id, $base_page_ids, true);
}

/**
 * Resolve and cache the page ID for the configured base path.
 */
function oiaa_meetings_get_base_page_id() {
    $page_path = oiaa_meetings_get_base_slug();

    // Homepage mode does not use a page ID.
    if ($page_path === '') {
        return 0;
    }

    $page = get_page_by_path($page_path, OBJECT, 'page');
    return is_null($page) ? 0 : (int) $page->ID;
}

/**
 * Detect the current language for the React SPA.
 * Uses WPML if available, otherwise falls back to WordPress locale.
 */
function oiaa_meetings_detect_language() {
    if (oiaa_meetings_has_wpml()) {
        $lang = apply_filters('wpml_current_language', null);
        if (is_string($lang) && $lang !== '') {
            return $lang;
        }
    }
    return null;
}

/**
 * Whether WPML integration hooks are available.
 */
function oiaa_meetings_has_wpml() {
    return defined('ICL_SITEPRESS_VERSION') || has_filter('wpml_object_id') || has_filter('wpml_original_element_id');
}

/**
 * Resolve canonical + translated page IDs for the configured base page.
 */
function oiaa_meetings_get_base_page_ids() {
    static $cached_ids = null;

    if (!is_null($cached_ids)) {
        return $cached_ids;
    }

    $canonical_page_id = oiaa_meetings_get_base_page_id();
    if ($canonical_page_id <= 0) {
        $cached_ids = array();
        return $cached_ids;
    }

    $ids = array($canonical_page_id);

    if (oiaa_meetings_has_wpml()) {
        $trid = (int) apply_filters('wpml_element_trid', null, $canonical_page_id, 'post_page');
        if ($trid > 0) {
            $translations = apply_filters('wpml_get_element_translations', null, $trid, 'post_page');
            if (is_array($translations)) {
                foreach ($translations as $translation) {
                    if (!empty($translation->element_id)) {
                        $ids[] = (int) $translation->element_id;
                    }
                }
            }
        }

        if (has_filter('wpml_active_languages') && has_filter('wpml_object_id')) {
            $languages = apply_filters('wpml_active_languages', null, array('skip_missing' => 0));
            if (is_array($languages)) {
                foreach ($languages as $language_code => $language_data) {
                    if (!is_string($language_code) || $language_code === '') {
                        continue;
                    }

                    $translated_id = (int) apply_filters('wpml_object_id', $canonical_page_id, 'page', false, $language_code);
                    if ($translated_id > 0) {
                        $ids[] = $translated_id;
                    }
                }
            }
        }
    }

    $cached_ids = array_values(array_unique(array_filter($ids)));
    return $cached_ids;
}

/**
 * Resolve path map for canonical + translated meetings pages.
 * Returns [page_id => path_without_leading_slash].
 */
function oiaa_meetings_get_base_page_paths() {
    $page_path = oiaa_meetings_get_base_slug();

    // Homepage mode has no nested path rewrites.
    if ($page_path === '') {
        return array();
    }

    $paths = array();

    foreach (oiaa_meetings_get_base_page_ids() as $base_page_id) {
        $permalink = get_permalink($base_page_id);

        if (!is_string($permalink) || $permalink === '') {
            continue;
        }

        $path = wp_parse_url($permalink, PHP_URL_PATH);
        if (!is_string($path) || $path === '') {
            continue;
        }

        $trimmed_path = trim($path, '/');
        if ($trimmed_path === '') {
            continue;
        }

        $home_path = (string) wp_parse_url((string) get_option('home'), PHP_URL_PATH);
        $home_path = trim($home_path, '/');

        if ($home_path !== '') {
            if ($trimmed_path === $home_path) {
                continue;
            }

            $prefix = $home_path . '/';
            if (strpos($trimmed_path, $prefix) === 0) {
                $trimmed_path = substr($trimmed_path, strlen($prefix));
            }
        }

        $paths[(int) $base_page_id] = $trimmed_path;
    }

    return $paths;
}
