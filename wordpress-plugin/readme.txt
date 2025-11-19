=== OIAA Direct Meetings ===
Contributors: code4recovery
Tags: meetings, recovery, aa, alcoholics anonymous, online meetings
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
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
* Hash-based routing for bookmarkable URLs
* No external dependencies (React bundled within)

**Usage:**

Simply add the `[oiaa_meetings]` shortcode to any page or post where you want the meetings application to appear.

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/oiaa-meetings/` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to Settings → OIAA Meetings to configure the API URL (a default is provided).
4. Add the `[oiaa_meetings]` shortcode to any page or post.

== Frequently Asked Questions ==

= How do I add the meetings application to my site? =

Add the `[oiaa_meetings]` shortcode to any page or post content.

= Can I customize the API endpoint? =

Yes. Go to Settings → OIAA Meetings and enter your custom API URL.

= Can I use the shortcode multiple times on the same page? =

Currently, only one instance per page is supported.

= What browsers are supported? =

Modern browsers including Chrome, Firefox, Safari, and Edge. IE11 is not supported.

= Does this work with page builders? =

Yes, as long as the page builder supports WordPress shortcodes.

== Screenshots ==

1. Meetings list with filters
2. Group information detail page
3. Admin settings page

== Changelog ==

= 1.0.0 =
* Initial release
* Full meetings search and filtering
* Hash-based routing
* Settings page for API configuration
* Shortcode support

== Upgrade Notice ==

= 1.0.0 =
Initial release.

== Third-Party Services ==

This plugin connects to a Central Query API to fetch meeting data. By default, it uses:

* Service: Central Query API
* URL: https://central-query.apps.code4recovery.org
* Purpose: Fetching online meeting data
* Privacy Policy: [Link to privacy policy if available]

You can configure a custom API endpoint in the plugin settings.
