<?php
/**
 * Settings page for OIAA Meetings plugin
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add settings page to WordPress admin
 */
function oiaa_meetings_add_admin_menu() {
    add_options_page(
        'OIAA Meetings Settings',
        'OIAA Meetings',
        'manage_options',
        'oiaa-meetings',
        'oiaa_meetings_options_page'
    );
}
add_action('admin_menu', 'oiaa_meetings_add_admin_menu');

/**
 * Register settings
 */
function oiaa_meetings_settings_init() {
    register_setting('oiaa_meetings', 'oiaa_api_url', array(
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://central-query.apps.code4recovery.org/api/v1/meetings'
    ));

    register_setting('oiaa_meetings', 'oiaa_color_mode', array(
        'type' => 'string',
        'sanitize_callback' => 'oiaa_meetings_sanitize_color_mode',
        'default' => 'system'
    ));

    register_setting('oiaa_meetings', 'oiaa_base_path', array(
        'type' => 'string',
        'sanitize_callback' => 'oiaa_meetings_sanitize_base_path',
        'default' => '/meetings'
    ));

    add_settings_section(
        'oiaa_meetings_section',
        __('API Configuration', 'oiaa-meetings'),
        'oiaa_meetings_settings_section_callback',
        'oiaa_meetings'
    );

    add_settings_field(
        'oiaa_api_url',
        __('Central Query API URL', 'oiaa-meetings'),
        'oiaa_meetings_api_url_render',
        'oiaa_meetings',
        'oiaa_meetings_section'
    );

    add_settings_section(
        'oiaa_meetings_appearance_section',
        __('Appearance Settings', 'oiaa-meetings'),
        'oiaa_meetings_appearance_section_callback',
        'oiaa_meetings'
    );

    add_settings_field(
        'oiaa_color_mode',
        __('Color Mode', 'oiaa-meetings'),
        'oiaa_meetings_color_mode_render',
        'oiaa_meetings',
        'oiaa_meetings_appearance_section'
    );

    add_settings_section(
        'oiaa_meetings_routing_section',
        __('Routing Configuration', 'oiaa-meetings'),
        'oiaa_meetings_routing_section_callback',
        'oiaa_meetings'
    );

    add_settings_field(
        'oiaa_base_path',
        __('Base Path', 'oiaa-meetings'),
        'oiaa_meetings_base_path_render',
        'oiaa_meetings',
        'oiaa_meetings_routing_section'
    );
}
add_action('admin_init', 'oiaa_meetings_settings_init');

/**
 * Render API URL input field
 */
function oiaa_meetings_api_url_render() {
    $value = get_option('oiaa_api_url');
    ?>
    <input
        type="url"
        name="oiaa_api_url"
        value="<?php echo esc_attr($value); ?>"
        class="regular-text"
        required
    />
    <p class="description">
        <?php _e('The base URL for the Central Query API (e.g., https://central-query.apps.code4recovery.org/api/v1/meetings)', 'oiaa-meetings'); ?>
    </p>
    <?php
}

/**
 * Settings section description
 */
function oiaa_meetings_settings_section_callback() {
    echo __('Configure the API endpoint for fetching meeting data.', 'oiaa-meetings');
}

/**
 * Appearance settings section description
 */
function oiaa_meetings_appearance_section_callback() {
    echo __('Configure the visual appearance of the meetings application.', 'oiaa-meetings');
}

/**
 * Routing settings section description
 */
function oiaa_meetings_routing_section_callback() {
    echo __('Configure URL routing for the meetings application. This must match the WordPress page where you placed the [oiaa_meetings] shortcode.', 'oiaa-meetings');
}

/**
 * Sanitize color mode input
 */
function oiaa_meetings_sanitize_color_mode($input) {
    $valid_modes = array('light', 'dark', 'system');
    return in_array($input, $valid_modes, true) ? $input : 'system';
}

/**
 * Sanitize base path input
 */
function oiaa_meetings_sanitize_base_path($input) {
    // Trim whitespace
    $input = trim($input);
    
    // Ensure it starts with a slash
    if (!empty($input) && $input[0] !== '/') {
        $input = '/' . $input;
    }
    
    // Remove trailing slash unless it's just "/"
    if (strlen($input) > 1 && substr($input, -1) === '/') {
        $input = rtrim($input, '/');
    }
    
    // Default to /meetings if empty
    if (empty($input)) {
        $input = '/meetings';
    }
    
    return $input;
}

/**
 * Render color mode select field
 */
function oiaa_meetings_color_mode_render() {
    $value = get_option('oiaa_color_mode', 'system');
    ?>
    <select name="oiaa_color_mode" id="oiaa_color_mode">
        <option value="system" <?php selected($value, 'system'); ?>>
            <?php _e('System (Auto-detect from browser/OS)', 'oiaa-meetings'); ?>
        </option>
        <option value="light" <?php selected($value, 'light'); ?>>
            <?php _e('Light', 'oiaa-meetings'); ?>
        </option>
        <option value="dark" <?php selected($value, 'dark'); ?>>
            <?php _e('Dark', 'oiaa-meetings'); ?>
        </option>
    </select>
    <p class="description">
        <?php _e('Choose the color theme for the meetings application. "System" will automatically match the user\'s browser/OS preference. Users can still toggle between light and dark mode using the theme switcher button.', 'oiaa-meetings'); ?>
    </p>
    <?php
}

/**
 * Render base path input field
 */
function oiaa_meetings_base_path_render() {
    $value = get_option('oiaa_base_path', '/meetings');
    ?>
    <input
        type="text"
        name="oiaa_base_path"
        value="<?php echo esc_attr($value); ?>"
        class="regular-text"
        placeholder="/meetings"
        required
    />
    <p class="description">
        <?php _e('The URL path where the [oiaa_meetings] page is located. Must be a page slug matching the WordPress permalink structure. For example, if your page is at <code>https://yoursite.com/meetings</code>, enter <code>/meetings</code>. For the homepage, enter <code>/</code>.', 'oiaa-meetings'); ?>
    </p>
    <p class="description" style="color: #d63638;">
        <strong><?php _e('Important:', 'oiaa-meetings'); ?></strong> <?php _e('The page slug must exactly match this setting. After changing this value, visit Settings → Permalinks and click "Save Changes" to flush rewrite rules.', 'oiaa-meetings'); ?>
    </p>
    <?php
}

/**
 * Render settings page
 */
function oiaa_meetings_options_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('oiaa_meetings');
            do_settings_sections('oiaa_meetings');
            submit_button(__('Save Settings', 'oiaa-meetings'));
            ?>
        </form>

        <hr />

        <h2><?php _e('Setup Instructions', 'oiaa-meetings'); ?></h2>
        <ol>
            <li><?php _e('Ensure WordPress is using the "Post name" permalink structure (Settings → Permalinks)', 'oiaa-meetings'); ?></li>
            <li><?php _e('Create a page with a slug matching your base path setting (e.g., "meetings").', 'oiaa-meetings'); ?></li>
            <li><?php _e('Edit the page and add the shortcode to it:', 'oiaa-meetings'); ?></li>
            <li style="margin-left: 2em; margin-top: 0.5em;"><code>[oiaa_meetings]</code></li>
            <li style="margin-top: 0.5em;"><?php _e('Publish the page.', 'oiaa-meetings'); ?></li>
            <li><?php _e('Configure the base path setting above to match your page slug.', 'oiaa-meetings'); ?></li>
            <li><?php _e('Visit Settings → Permalinks and click "Save Changes" to flush rewrite rules.', 'oiaa-meetings'); ?></li>
            <li><?php _e('All sub-routes (e.g., /meetings/group-info/slug) will now be served by your page.', 'oiaa-meetings'); ?></li>
        </ol>

        <h3><?php _e('Plugin Information', 'oiaa-meetings'); ?></h3>
        <ul>
            <li><strong><?php _e('Version:', 'oiaa-meetings'); ?></strong> <?php echo OIAA_MEETINGS_VERSION; ?></li>
            <li><strong><?php _e('GitHub:', 'oiaa-meetings'); ?></strong> <a href="https://github.com/code4recovery/oiaa-direct" target="_blank">code4recovery/oiaa-direct</a></li>
        </ul>
    </div>
    <?php
}
