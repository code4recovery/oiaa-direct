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

    // Get settings
    $asset_version = get_option('oiaa_asset_version', OIAA_MEETINGS_VERSION);
    $github_owner = get_option('oiaa_github_owner', 'code4recovery');
    $github_repo = get_option('oiaa_github_repo', 'oiaa-direct');
    $use_local = get_option('oiaa_use_local_assets', false);

    // Local fallback paths
    $local_asset_path = OIAA_MEETINGS_PLUGIN_DIR . 'assets/';
    $local_asset_url = OIAA_MEETINGS_PLUGIN_URL . 'assets/';

    if ($use_local && file_exists($local_asset_path . 'oiaa-meetings.js')) {
        // Use local assets
        $js_url = $local_asset_url . 'oiaa-meetings.js';
        $css_url = $local_asset_url . 'oiaa-meetings.css';
        $override_css_url = $local_asset_url . 'wordpress-overrides.css';
        $version = file_exists($local_asset_path . 'oiaa-meetings.js')
            ? filemtime($local_asset_path . 'oiaa-meetings.js')
            : OIAA_MEETINGS_VERSION;
    } else {
        // Use GitHub release assets
        $release_base = sprintf(
            'https://github.com/%s/%s/releases/download/v%s/',
            esc_attr($github_owner),
            esc_attr($github_repo),
            esc_attr($asset_version)
        );
        $js_url = $release_base . 'oiaa-meetings.js';
        $css_url = $release_base . 'oiaa-meetings.css';
        $override_css_url = $release_base . 'wordpress-overrides.css';
        $version = $asset_version;
    }

    // Enqueue base CSS
    wp_enqueue_style(
        'oiaa-meetings-style',
        $css_url,
        array(),
        $version
    );

    // Enqueue WordPress override CSS with higher priority
    wp_enqueue_style(
        'oiaa-meetings-wordpress-overrides',
        $override_css_url,
        array('oiaa-meetings-style'),
        $version,
        'all'
    );

    // Enqueue JavaScript as ES module
    wp_enqueue_script(
        'oiaa-meetings-app',
        $js_url,
        array(),
        $version,
        true
    );

    // Mark script as ES module (type="module")
    add_filter('script_loader_tag', function($tag, $handle) {
        if ('oiaa-meetings-app' === $handle) {
            $tag = str_replace('<script ', '<script type="module" ', $tag);
        }
        return $tag;
    }, 10, 2);
}
