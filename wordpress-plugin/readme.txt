=== OIAA Direct Meetings ===
Contributors: code4recovery
Tags: meetings, recovery, aa, alcoholics anonymous, online meetings
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.3.3
License: MIT
License URI: https://opensource.org/licenses/MIT

Embeds the OIAA Direct online meetings application for browsing and searching recovery meetings.

== Description ==

OIAA Direct Meetings is a WordPress plugin that embeds a full-featured React application for browsing, filtering, and searching online Alcoholics Anonymous meetings. The application connects to a central query API to fetch meeting data and provides an intuitive interface for finding meetings.

**Features:**

* Search meetings by name, description, or group
* Filter by type, format, features, communities, and languages
* Time-based filtering (day of week, time of day)
* Dark mode support
* Fully responsive design
* Browser-router friendly URL routing
* No external dependencies (React bundled within)

**Usage:**

Set a Base Path in Settings → OIAA Meetings (for example `/meetings`) and ensure a matching page exists. The plugin renders the app for that path and its sub-routes.

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/oiaa-meetings/` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to Settings → OIAA Meetings to configure the API URL and Base Path.
4. Ensure a page exists that matches your Base Path (for example page slug `meetings` for `/meetings`).
5. Visit Settings → Permalinks and click "Save Changes" if you changed Base Path.

== Frequently Asked Questions ==

= How do I add the meetings application to my site? =

Set the Base Path in Settings → OIAA Meetings and make sure a matching page exists.

= Can I customize the API endpoint? =

Yes. Go to Settings → OIAA Meetings and enter your custom API URL.

= Can I render the app on multiple pages? =

Use one Base Path per plugin instance. The app is intended to render for that configured path and its sub-routes.

= What browsers are supported? =

Modern browsers including Chrome, Firefox, Safari, and Edge. IE11 is not supported.

= Does this work with page builders? =

Yes, as long as the page permalink structure and configured Base Path resolve normally in WordPress.

== Screenshots ==

1. Meetings list with filters
2. Group information detail page
3. Admin settings page

== Changelog ==

= 1.3.2 =
* Improved WordPress theme compatibility for form controls and button/icon spacing.
* Reduced UI glitches from theme CSS interference in the meetings interface.
* Improved filter and category UI consistency, including badge/button color behavior.
* Fixed empty filter tooltip behavior.
* Improved type safety and reliability in time and hours handling.
* Refactored filter and category internals for maintainability.
* Added PR CI checks for lint, typecheck, and tests.

= 1.3.1 =
* Added local WordPress development environment support with JointsWP and Docker setup.
* Improved translation behavior for search and locale passing.
* Updated bundled plugin build artifacts.

= 1.3.0 =
* Added internationalization support using react-i18next.
* Added WPML support and improved language handling.
* Localized additional UI strings and facets.

= 1.3.3 =
* Added MIT open-source license metadata for plugin distribution.
* Reduced heading sizes in the WordPress meetings UI for better visual balance, including meeting names and filter headings.

= 1.2.0 =
* Refactored WordPress integration to template_redirect browser-router flow.
* Improved compatibility for sub-route handling under configured base paths.
* Updated release build artifacts for WordPress packaging.

= 1.1.0 =
* Added WordPress plugin packaging and distribution workflow.
* Added configurable asset delivery using versioned releases and CDN support.
* Added plugin settings for asset versioning and related WordPress integration docs.
* Improved CSS overrides and light/dark mode behavior inside WordPress themes.

= 1.0.0 =
* Initial release
* Full meetings search and filtering
* Browser-router routing with WordPress rewrites
* Settings page for API configuration
* Template redirect rendering at configured base path

== Upgrade Notice ==

= 1.3.2 =
Recommended update for improved WordPress theme compatibility and UI consistency.

= 1.3.1 =
Includes local development workflow improvements and translation-related fixes.

= 1.3.0 =
Introduces internationalization and WPML support.

= 1.3.3 =
Adds MIT license metadata and reduces oversized meeting/filter heading typography.

= 1.2.0 =
Improves WordPress browser-router integration and sub-route handling.

= 1.1.0 =
Adds plugin packaging and release delivery improvements.

= 1.0.0 =
Initial release.

== Third-Party Services ==

This plugin connects to a Central Query API to fetch meeting data:

* Service: Central Query API
* URL: the API URL entered in Settings → OIAA Meetings (there is no default)
* Purpose: Fetching online meeting data
* Privacy Policy: [Link to privacy policy if available]

The app makes no API request until an API URL is set.
