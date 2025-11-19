<?php
/**
 * Shortcode handler for OIAA Meetings
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the [oiaa_meetings] shortcode
 */
function oiaa_meetings_shortcode($atts) {
    // Parse shortcode attributes with defaults
    $atts = shortcode_atts(array(
        'api_url' => '', // Allow override via shortcode parameter (optional)
    ), $atts, 'oiaa_meetings');

    // Ensure scripts are enqueued when shortcode is used
    oiaa_meetings_enqueue_scripts();

    // Get API URL from settings or shortcode parameter
    $api_url = !empty($atts['api_url'])
        ? esc_url_raw($atts['api_url'])
        : get_option('oiaa_api_url');

    // Get color mode from settings
    $color_mode = get_option('oiaa_color_mode', 'system');

    // Output the container and configuration
    ob_start();
    ?>
    <div id="oiaa-meetings-root"></div>
    <script>
        window.OIAA_CONFIG = {
            apiUrl: <?php echo json_encode($api_url); ?>,
            colorMode: <?php echo json_encode($color_mode); ?>
        };
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('oiaa_meetings', 'oiaa_meetings_shortcode');
