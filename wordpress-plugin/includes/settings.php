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
        'default' => OIAA_MEETINGS_DEFAULT_BASE_PATH
    ));

    register_setting('oiaa_meetings', 'oiaa_asset_version', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'latest'
    ));

    register_setting('oiaa_meetings', 'oiaa_use_local_assets', array(
        'type' => 'boolean',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'default' => false
    ));

    register_setting('oiaa_meetings', 'oiaa_github_owner', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'code4recovery'
    ));

    register_setting('oiaa_meetings', 'oiaa_github_repo', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => 'oiaa-direct'
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
        'oiaa_meetings_assets_section',
        __('Asset Settings', 'oiaa-meetings'),
        'oiaa_meetings_assets_section_callback',
        'oiaa_meetings'
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

    add_settings_field(
        'oiaa_asset_version',
        __('Asset Version', 'oiaa-meetings'),
        'oiaa_meetings_asset_version_render',
        'oiaa_meetings',
        'oiaa_meetings_assets_section'
    );

    add_settings_field(
        'oiaa_use_local_assets',
        __('Use Local Assets', 'oiaa-meetings'),
        'oiaa_meetings_use_local_assets_render',
        'oiaa_meetings',
        'oiaa_meetings_assets_section'
    );

    add_settings_field(
        'oiaa_github_owner',
        __('GitHub Owner', 'oiaa-meetings'),
        'oiaa_meetings_github_owner_render',
        'oiaa_meetings',
        'oiaa_meetings_assets_section'
    );

    add_settings_field(
        'oiaa_github_repo',
        __('GitHub Repository', 'oiaa-meetings'),
        'oiaa_meetings_github_repo_render',
        'oiaa_meetings',
        'oiaa_meetings_assets_section'
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
    echo __('Configure URL routing for the meetings application. This must match the WordPress page slug used to host the meetings app.', 'oiaa-meetings');
}

/**
 * Sanitize color mode input
 */
function oiaa_meetings_sanitize_color_mode($input) {
    $valid_modes = array('light', 'dark', 'system');
    return in_array($input, $valid_modes, true) ? $input : 'system';
}

/**
 * Sanitize base path input.
 */
function oiaa_meetings_sanitize_base_path($input) {
    $input = trim((string) $input);

    if ($input === '') {
        return OIAA_MEETINGS_DEFAULT_BASE_PATH;
    }

    if ($input[0] !== '/') {
        $input = '/' . $input;
    }

    if (strlen($input) > 1) {
        $input = rtrim($input, '/');
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
 * Render base path input field.
 */
function oiaa_meetings_base_path_render() {
    $value = oiaa_meetings_get_base_path();
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
        <?php _e('URL path where the meetings page lives. Example: <code>/meetings</code>. Use <code>/</code> for homepage mode.', 'oiaa-meetings'); ?>
    </p>
    <p class="description" style="color: #d63638;">
        <strong><?php _e('Important:', 'oiaa-meetings'); ?></strong> <?php _e('This should match your WordPress page slug. After changing it, re-save permalinks (Settings → Permalinks).', 'oiaa-meetings'); ?>
    </p>
    <?php
}

/**
 * Assets settings section description
 */
function oiaa_meetings_assets_section_callback() {
    echo __('Configure how the meetings JS and CSS are loaded. By default, assets are served via jsDelivr CDN from versioned GitHub releases.', 'oiaa-meetings');
}

/**
 * Render asset version input field
 */
function oiaa_meetings_asset_version_render() {
    $value = get_option('oiaa_asset_version', 'latest');
    $github_owner = get_option('oiaa_github_owner', 'code4recovery');
    $github_repo = get_option('oiaa_github_repo', 'oiaa-direct');

    // Build version ref (add 'v' prefix for semver, but not for 'latest' or 'main')
    $version_ref = ($value === 'latest' || $value === 'main') ? $value : 'v' . $value;
    ?>
    <input
        type="text"
        name="oiaa_asset_version"
        value="<?php echo esc_attr($value); ?>"
        class="regular-text"
        placeholder="latest"
    />
    <p class="description">
        <?php _e('Asset version to load from jsDelivr CDN. Options:', 'oiaa-meetings'); ?>
        <br />
        • <code>latest</code> <?php _e('(default) - Auto-updates to newest release', 'oiaa-meetings'); ?>
        <br />
        • <code>main</code> <?php _e('- Bleeding edge from main branch', 'oiaa-meetings'); ?>
        <br />
        • <code>1.2.0</code> <?php _e('- Pin to specific version (e.g., 1.2.0)', 'oiaa-meetings'); ?>
        <br /><br />
        <?php _e('Current CDN URL:', 'oiaa-meetings'); ?>
        <br />
        <code>https://cdn.jsdelivr.net/gh/<?php echo esc_html($github_owner); ?>/<?php echo esc_html($github_repo); ?>@<?php echo esc_html($version_ref); ?>/dist/</code>
    </p>
    <?php
}

/**
 * Render use local assets checkbox
 */
function oiaa_meetings_use_local_assets_render() {
    $value = get_option('oiaa_use_local_assets', false);
    ?>
    <label>
        <input
            type="checkbox"
            name="oiaa_use_local_assets"
            value="1"
            <?php checked($value, true); ?>
        />
        <?php _e('Load JS and CSS from the plugin assets/ folder instead of GitHub', 'oiaa-meetings'); ?>
    </label>
    <p class="description">
        <?php _e('Use this for local development or if GitHub releases are unavailable.', 'oiaa-meetings'); ?>
    </p>
    <?php
}

/**
 * Render GitHub owner input field
 */
function oiaa_meetings_github_owner_render() {
    $value = get_option('oiaa_github_owner', 'code4recovery');
    ?>
    <input
        type="text"
        name="oiaa_github_owner"
        value="<?php echo esc_attr($value); ?>"
        class="regular-text"
    />
    <p class="description">
        <?php _e('GitHub username or organization (e.g., code4recovery, sblack4)', 'oiaa-meetings'); ?>
    </p>
    <?php
}

/**
 * Render GitHub repo input field
 */
function oiaa_meetings_github_repo_render() {
    $value = get_option('oiaa_github_repo', 'oiaa-direct');
    ?>
    <input
        type="text"
        name="oiaa_github_repo"
        value="<?php echo esc_attr($value); ?>"
        class="regular-text"
    />
    <p class="description">
        <?php _e('GitHub repository name (e.g., oiaa-direct)', 'oiaa-meetings'); ?>
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
            <li><?php _e('Ensure WordPress is using the "Post name" permalink structure (Settings → Permalinks).', 'oiaa-meetings'); ?></li>
            <li><?php _e('Set Base Path above (for example, <code>/meetings</code>).', 'oiaa-meetings'); ?></li>
            <li><?php _e('Activate the plugin to auto-create the page if it does not already exist.', 'oiaa-meetings'); ?></li>
            <li><?php _e('If you changed Base Path, visit Settings → Permalinks and click "Save Changes".', 'oiaa-meetings'); ?></li>
            <li><?php _e('Sub-routes like <code>/meetings/group-info/some-group</code> are handled by the meetings app.', 'oiaa-meetings'); ?></li>
        </ol>

        <h3><?php _e('Plugin Information', 'oiaa-meetings'); ?></h3>
        <ul>
            <li><strong><?php _e('Version:', 'oiaa-meetings'); ?></strong> <?php echo OIAA_MEETINGS_VERSION; ?></li>
            <li><strong><?php _e('GitHub:', 'oiaa-meetings'); ?></strong> <a href="https://github.com/code4recovery/oiaa-direct" target="_blank">code4recovery/oiaa-direct</a></li>
        </ul>
    </div>
    <?php
}
