<?php
/**
 * Plugin Name: OIAA Direct Meetings
 * Plugin URI: https://github.com/code4recovery/oiaa-direct
 * Description: Embeds the OIAA Direct online meetings application via [oiaa_meetings] shortcode
 * Version: 1.0.0
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
define('OIAA_MEETINGS_VERSION', '1.0.0');
define('OIAA_MEETINGS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('OIAA_MEETINGS_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Initialize the plugin
 */
function oiaa_meetings_init() {
    // Load plugin includes
    require_once OIAA_MEETINGS_PLUGIN_DIR . 'includes/settings.php';
    require_once OIAA_MEETINGS_PLUGIN_DIR . 'includes/shortcode.php';
    require_once OIAA_MEETINGS_PLUGIN_DIR . 'includes/enqueue.php';
    
    // Add rewrite rules for React Router
    add_action('init', 'oiaa_meetings_add_rewrite_rules');
}
add_action('plugins_loaded', 'oiaa_meetings_init');

/**
 * Add rewrite rules to support React Router browser history
 * Routes are derived from the configured base path (which must be a page slug)
 */
function oiaa_meetings_add_rewrite_rules() {
    $base_path = get_option('oiaa_base_path', '/meetings');
    
    // Remove leading slash to get the page slug
    $page_slug = ltrim($base_path, '/');
    
    // Skip rewrite rules for homepage (no need to rewrite to /)
    if (empty($page_slug)) {
        return;
    }
    
    // Add simple rewrite rule that routes all sub-paths to the base page
    // Matches /meetings, /meetings/, /meetings/group-info/slug, etc.
    // and rewrites to the WordPress page with that slug
    add_rewrite_rule(
        '^' . preg_quote($page_slug, '/') . '(/.*)?$',
        'index.php?pagename=' . $page_slug,
        'top'
    );
}

/**
 * Activation hook
 */
function oiaa_meetings_activate() {
    // Set default options
    if (get_option('oiaa_api_url') === false) {
        add_option('oiaa_api_url', 'https://central-query.apps.code4recovery.org/api/v1/meetings');
    }
    
    if (get_option('oiaa_base_path') === false) {
        add_option('oiaa_base_path', '/meetings');
    }
    
    // Flush rewrite rules to add our custom rules
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'oiaa_meetings_activate');

/**
 * Deactivation hook
 */
function oiaa_meetings_deactivate() {
    // Flush rewrite rules to remove our custom rules
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'oiaa_meetings_deactivate');

/**
 * Uninstall hook
 */
function oiaa_meetings_uninstall() {
    // Remove options
    delete_option('oiaa_api_url');
    delete_option('oiaa_base_path');
    delete_option('oiaa_color_mode');
}
register_uninstall_hook(__FILE__, 'oiaa_meetings_uninstall');
