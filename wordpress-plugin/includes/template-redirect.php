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
            basePath: <?php echo wp_json_encode($base_path); ?>
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

    $base_page_id = oiaa_meetings_get_base_page_id();
    if ($base_page_id <= 0) {
        return false;
    }

    return $query_object_id === $base_page_id;
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
