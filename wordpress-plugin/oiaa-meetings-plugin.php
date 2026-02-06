<?php
/**
 * Plugin Name: OIAA Direct Meetings
 * Plugin URI: https://github.com/code4recovery/oiaa-direct
 * Description: Embeds the OIAA Direct online meetings application via [oiaa_meetings] shortcode
 * Version: 0.0.0-dev
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
define('OIAA_MEETINGS_VERSION', '0.0.0-dev');
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
}
add_action('plugins_loaded', 'oiaa_meetings_init');

/**
 * Activation hook
 */
function oiaa_meetings_activate() {
    // Set default options
    if (get_option('oiaa_api_url') === false) {
        add_option('oiaa_api_url', 'https://central-query.apps.code4recovery.org/api/v1/meetings');
    }
}
register_activation_hook(__FILE__, 'oiaa_meetings_activate');

/**
 * Deactivation hook
 */
function oiaa_meetings_deactivate() {
    // Cleanup if needed
}
register_deactivation_hook(__FILE__, 'oiaa_meetings_deactivate');

/**
 * Uninstall hook
 */
function oiaa_meetings_uninstall() {
    // Remove options
    delete_option('oiaa_api_url');
}
register_uninstall_hook(__FILE__, 'oiaa_meetings_uninstall');
