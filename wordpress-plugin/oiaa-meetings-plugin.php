<?php
/**
 * Plugin Name: OIAA Direct Meetings
 * Plugin URI: https://github.com/code4recovery/oiaa-direct
 * Description: Embeds the OIAA Direct online meetings application on a configured base path
 * Version: 1.3.0
 * Author: Code for Recovery
 * Author URI: https://github.com/code4recovery
 * License: MIT
 * Text Domain: oiaa-meetings
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('OIAA_MEETINGS_VERSION', '1.2.0-beta.0');
define('OIAA_MEETINGS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OIAA_MEETINGS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('OIAA_MEETINGS_DEFAULT_BASE_PATH', '/meetings');
define('OIAA_MEETINGS_CREATED_PAGE_ID_OPTION', 'oiaa_created_page_id');
define('OIAA_MEETINGS_CREATED_PAGE_META_KEY', '_oiaa_created_by_plugin');

/**
 * Initialize the plugin
 */
function oiaa_meetings_init() {
    // Load plugin includes
    require_once OIAA_MEETINGS_PLUGIN_DIR . 'includes/settings.php';
    require_once OIAA_MEETINGS_PLUGIN_DIR . 'includes/enqueue.php';
    require_once OIAA_MEETINGS_PLUGIN_DIR . 'includes/template-redirect.php';

    // Add rewrite rules for browser history routing
    add_action('init', 'oiaa_meetings_add_rewrite_rules');
}
add_action('plugins_loaded', 'oiaa_meetings_init');

/**
 * Add rewrite rules to support browser-router history sub-routes.
 */
function oiaa_meetings_add_rewrite_rules() {
    $page_paths = oiaa_meetings_get_base_page_paths();

    foreach ($page_paths as $page_id => $page_path) {
        $path_regex = preg_quote((string) $page_path, '/');
        add_rewrite_rule(
            '^' . $path_regex . '(?:/(.*))?/?$',
            'index.php?page_id=' . (int) $page_id,
            'top'
        );
    }

    // Fallback for initial setup before a base page ID can be resolved.
    if (empty($page_paths)) {
        $page_slug = oiaa_meetings_get_base_slug();

        // Homepage mode does not need a rewrite rule.
        if ($page_slug === '') {
            return;
        }

        add_rewrite_rule(
            '^' . preg_quote($page_slug, '/') . '(?:/(.*))?/?$',
            'index.php?pagename=' . $page_slug,
            'top'
        );
    }
}

/**
 * Activation hook
 */
function oiaa_meetings_activate() {
    // Set default options
    if (get_option('oiaa_api_url') === false) {
        add_option('oiaa_api_url', 'https://central-query.apps.code4recovery.org/api/v1/meetings');
    }
    if (get_option('oiaa_asset_version') === false) {
        add_option('oiaa_asset_version', 'latest');
    }
    if (get_option('oiaa_base_path') === false) {
        add_option('oiaa_base_path', OIAA_MEETINGS_DEFAULT_BASE_PATH);
    }
    if (get_option('oiaa_github_owner') === false) {
        add_option('oiaa_github_owner', 'code4recovery');
    }
    if (get_option('oiaa_github_repo') === false) {
        add_option('oiaa_github_repo', 'oiaa-direct');
    }

    // Ensure the configured meetings page exists.
    oiaa_meetings_ensure_base_page_exists();

    // Flush rewrite rules to register browser-router paths.
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'oiaa_meetings_activate');

/**
 * Deactivation hook
 */
function oiaa_meetings_deactivate() {
    oiaa_meetings_delete_created_page();
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'oiaa_meetings_deactivate');

/**
 * Uninstall hook
 */
function oiaa_meetings_uninstall() {
    // Remove options
    delete_option('oiaa_api_url');
    delete_option('oiaa_asset_version');
    delete_option('oiaa_use_local_assets');
    delete_option('oiaa_github_owner');
    delete_option('oiaa_github_repo');
    delete_option('oiaa_base_path');
    delete_option('oiaa_color_mode');
    delete_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION);
}
register_uninstall_hook(__FILE__, 'oiaa_meetings_uninstall');

/**
 * Resolve the configured base path.
 */
function oiaa_meetings_get_base_path() {
    return (string) get_option('oiaa_base_path', OIAA_MEETINGS_DEFAULT_BASE_PATH);
}

/**
 * Resolve the slug portion of the configured base path.
 */
function oiaa_meetings_get_base_slug() {
    return trim(oiaa_meetings_get_base_path(), '/');
}

/**
 * Create the meetings page when needed and track ownership.
 */
function oiaa_meetings_ensure_base_page_exists() {
    $page_slug = oiaa_meetings_get_base_slug();

    // Homepage mode has no dedicated page to create.
    if ($page_slug === '') {
        delete_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION);
        return;
    }

    $existing_page = get_page_by_path($page_slug, OBJECT, 'page');
    if (!is_null($existing_page)) {
        // Do not claim ownership of pages created outside this plugin.
        delete_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION);
        return;
    }

    $page_title = ucwords(str_replace(array('-', '_'), ' ', $page_slug));
    if ($page_title === '') {
        $page_title = 'Meetings';
    }

    $page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_title' => $page_title,
        'post_content' => '',
        'post_name' => $page_slug,
    ));

    if (!is_wp_error($page_id) && !empty($page_id)) {
        $page_id = (int) $page_id;
        update_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION, $page_id);
        update_post_meta($page_id, OIAA_MEETINGS_CREATED_PAGE_META_KEY, '1');
    }
}

/**
 * Delete only the page created by this plugin.
 */
function oiaa_meetings_delete_created_page() {
    $created_page_id = (int) get_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION, 0);
    if ($created_page_id <= 0) {
        return;
    }

    $created_page = get_post($created_page_id);
    if (is_null($created_page) || $created_page->post_type !== 'page') {
        delete_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION);
        return;
    }

    $created_marker = (string) get_post_meta($created_page_id, OIAA_MEETINGS_CREATED_PAGE_META_KEY, true);
    if ($created_marker !== '1') {
        delete_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION);
        return;
    }

    wp_delete_post($created_page_id, true);
    delete_option(OIAA_MEETINGS_CREATED_PAGE_ID_OPTION);
}

