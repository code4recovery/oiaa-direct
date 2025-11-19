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
 * Sanitize color mode input
 */
function oiaa_meetings_sanitize_color_mode($input) {
    $valid_modes = array('light', 'dark', 'system');
    return in_array($input, $valid_modes, true) ? $input : 'system';
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

        <h2><?php _e('Usage', 'oiaa-meetings'); ?></h2>
        <p><?php _e('Add the following shortcode to any page or post where you want to display the OIAA Meetings application:', 'oiaa-meetings'); ?></p>
        <code>[oiaa_meetings]</code>

        <h3><?php _e('Example', 'oiaa-meetings'); ?></h3>
        <p><?php _e('Create a new page and add this shortcode to the content area. The meetings application will render at that location.', 'oiaa-meetings'); ?></p>

        <h3><?php _e('Plugin Information', 'oiaa-meetings'); ?></h3>
        <ul>
            <li><strong><?php _e('Version:', 'oiaa-meetings'); ?></strong> <?php echo OIAA_MEETINGS_VERSION; ?></li>
            <li><strong><?php _e('GitHub:', 'oiaa-meetings'); ?></strong> <a href="https://github.com/code4recovery/oiaa-direct" target="_blank">code4recovery/oiaa-direct</a></li>
        </ul>
    </div>
    <?php
}
