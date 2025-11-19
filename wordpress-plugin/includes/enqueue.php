<?php
/**
 * Handle script and style enqueueing for OIAA Meetings
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue plugin scripts and styles
 * Called by shortcode handler when shortcode is used
 */
function oiaa_meetings_enqueue_scripts() {
    // Prevent double-enqueueing
    static $enqueued = false;
    if ($enqueued) {
        return;
    }
    $enqueued = true;

    $asset_path = OIAA_MEETINGS_PLUGIN_DIR . 'assets/';
    $asset_url = OIAA_MEETINGS_PLUGIN_URL . 'assets/';

    // Check if assets exist
    $js_file = $asset_path . 'oiaa-meetings.js';
    $css_file = $asset_path . 'oiaa-meetings.css';

    if (!file_exists($js_file)) {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-error"><p>';
            echo '<strong>OIAA Meetings:</strong> Plugin assets not found. Please rebuild the plugin.';
            echo '</p></div>';
        });
        return;
    }

    // Get file modification time for cache busting
    $js_version = file_exists($js_file) ? filemtime($js_file) : OIAA_MEETINGS_VERSION;
    $css_version = file_exists($css_file) ? filemtime($css_file) : OIAA_MEETINGS_VERSION;

    // Enqueue base CSS
    if (file_exists($css_file)) {
        wp_enqueue_style(
            'oiaa-meetings-style',
            $asset_url . 'oiaa-meetings.css',
            array(),
            $css_version
        );
    }

    // Enqueue WordPress override CSS with higher priority
    $override_css_file = $asset_path . 'wordpress-overrides.css';
    if (file_exists($override_css_file)) {
        // Use file hash for aggressive cache busting
        $override_version = md5_file($override_css_file);

        wp_enqueue_style(
            'oiaa-meetings-wordpress-overrides',
            $asset_url . 'wordpress-overrides.css',
            array('oiaa-meetings-style'), // Load after base styles
            $override_version, // Hash changes = cache bust
            'all'
        );

        // Add inline comment for debugging
        add_action('wp_head', function() use ($override_version) {
            echo "<!-- OIAA Meetings Override CSS Version: {$override_version} -->\n";
        });
    }

    // Enqueue JavaScript as ES module
    wp_enqueue_script(
        'oiaa-meetings-app',
        $asset_url . 'oiaa-meetings.js',
        array(), // No dependencies - React is bundled
        $js_version,
        true // Load in footer
    );

    // Mark script as ES module (type="module")
    add_filter('script_loader_tag', function($tag, $handle) {
        if ('oiaa-meetings-app' === $handle) {
            $tag = str_replace('<script ', '<script type="module" ', $tag);
        }
        return $tag;
    }, 10, 2);
}
