# WordPress Plugin - OIAA Direct Meetings

This document explains the WordPress plugin build architecture for embedding OIAA Direct as a self-contained application within WordPress sites.

## Overview

The WordPress plugin allows embedding the OIAA Direct meetings application into any WordPress page or post using the `[oiaa_meetings]` shortcode. The app runs as a complete single-page application (SPA) with hash-based routing, bundling all dependencies for maximum compatibility and ease of deployment.

## Architecture

### Hash-Based Routing

The WordPress build uses **hash routing** (`createHashRouter` from React Router v7) instead of browser history routing. This means:

- URLs look like: `yoursite.com/meetings/#/group-info/abc123`
- No WordPress `.htaccess` modifications needed
- React Router handles all navigation client-side
- Bookmarkable and shareable URLs
- `clientLoader` functions work identically to the standard build

**Why hash routing?**
- WordPress already manages server-side routing
- No conflicts between WordPress and React Router
- Works on any hosting environment
- Simpler deployment (no server configuration required)

### Self-Contained Bundle

The WordPress build bundles **all dependencies** including:
- React 18
- ReactDOM 18
- Chakra UI v3
- All application code

**Why bundle everything?**
- No CDN dependencies or third-party reliability issues
- No version conflicts with WordPress themes/plugins
- Single-file deployment (+ CSS)
- Faster load times (one request instead of multiple)
- Works in offline/local WordPress installations

### Build Output

```
dist-wordpress/
├── oiaa-meetings.js     # ~350KB gzipped - complete app bundle
├── oiaa-meetings.css    # ~20KB gzipped - all styles
└── assets/              # Images, fonts, other static assets
```

The build script copies these files into the plugin structure:

```
wordpress-plugin/
├── oiaa-meetings-plugin.php    # Main plugin file
├── readme.txt                  # WordPress plugin repository format
├── assets/                     # Built files (from dist-wordpress/)
│   ├── oiaa-meetings.js
│   ├── oiaa-meetings.css
│   └── [other assets]
└── includes/
    ├── enqueue.php            # Enqueue scripts/styles
    ├── settings.php           # Admin settings page
    └── shortcode.php          # [oiaa_meetings] shortcode
```

## Using the Plugin

### Installation

1. Download `oiaa-meetings-wordpress-plugin-v{version}.zip` from GitHub releases
2. In WordPress admin: Plugins → Add New → Upload Plugin
3. Choose the .zip file and click "Install Now"
4. Activate the plugin

### Configuration

1. Navigate to **Settings → OIAA Meetings** in WordPress admin
2. Enter the Central Query API URL (e.g., `https://central-query.apps.code4recovery.org/api/v1/meetings`)
3. Save settings

### Adding to Pages

Insert the shortcode in any page or post content:

```
[oiaa_meetings]
```

The app will render at that location in the page.

## Development

### Building the WordPress Plugin

```bash
# Build WordPress bundle only
npm run build:wordpress

# Build complete plugin .zip for distribution
npm run build:wordpress-plugin
```

The plugin .zip file will be created in `dist/` directory.

### Testing Locally

1. Build the plugin: `npm run build:wordpress-plugin`
2. Install in local WordPress test environment
3. Configure API URL in Settings → OIAA Meetings
4. Add `[oiaa_meetings]` to a test page
5. Verify:
   - App renders correctly
   - Filters and search work
   - Hash navigation works (`/#/group-info/abc123`)
   - Dark mode toggle works
   - Responsive layout works

### Development Workflow

1. Make changes to React application code
2. Test in standard development mode: `npm run dev`
3. When ready for WordPress testing: `npm run build:wordpress-plugin`
4. Upload new plugin .zip to WordPress test site
5. Verify changes work in WordPress environment

## Technical Details

### Data Loading

The WordPress build preserves the existing `clientLoader` architecture:

- Route components export `clientLoader` functions
- `HydrateFallback` components show loading skeletons
- Data fetching happens exactly as in standard build
- No refactoring or code duplication needed

### API Configuration

The plugin provides the API URL to the React app via a global variable:

```php
// WordPress sets this before loading the app
<script>
window.OIAA_CONFIG = {
  apiUrl: '<?php echo esc_js(get_option('oiaa_api_url')); ?>'
};
</script>
```

The React entry point reads from `window.OIAA_CONFIG` and makes it available to the app.

### WordPress Integration Points

1. **Shortcode Handler** (`includes/shortcode.php`):
   - Renders container div: `<div id="oiaa-meetings-root"></div>`
   - Outputs configuration script
   - Ensures app scripts are enqueued

2. **Script Enqueueing** (`includes/enqueue.php`):
   - Properly enqueues JS/CSS with WordPress dependency system
   - Adds version hash for cache busting
   - Only loads on pages that use the shortcode

3. **Settings Page** (`includes/settings.php`):
   - Admin interface for API URL configuration
   - Validates and sanitizes input
   - Stores in WordPress options table

### Preventing Console Logs in Production

The Vite build configuration uses Terser minification with:

```javascript
terserOptions: {
  compress: {
    drop_console: true,  // Remove all console.* statements
    drop_debugger: true  // Remove debugger statements
  }
}
```

All `console.log`, `console.error`, etc. are automatically stripped from the production build.

## Deployment & Releases

### Creating a Release

1. Update version in `package.json`
2. Build plugin: `npm run build:wordpress-plugin`
3. Create Git tag: `git tag v1.0.0-wordpress`
4. Push tag: `git push origin v1.0.0-wordpress`
5. Create GitHub release and attach the plugin .zip file

### Updating WordPress Sites

1. Download latest plugin .zip from GitHub releases
2. In WordPress admin: Plugins → Add New → Upload Plugin
3. Choose "Replace current with uploaded" when prompted
4. Activate the updated plugin

## Differences from Standard Build

| Feature | Standard Build | WordPress Build |
|---------|---------------|-----------------|
| **Routing** | Browser history (`/group-info/abc`) | Hash routing (`/#/group-info/abc`) |
| **Entry Point** | `src/entry.client.tsx` | `src/entry-wordpress.tsx` |
| **Dependencies** | Separate vendor chunks | All bundled together |
| **Output** | `build/client/` directory | `dist-wordpress/` + plugin .zip |
| **API Config** | `.env` file | WordPress settings page |
| **Mount Target** | Full `document` | `#oiaa-meetings-root` div |
| **HTML Control** | Full HTML document | Embedded in WordPress page |
| **Build Command** | `npm run build` | `npm run build:wordpress-plugin` |

## Browser Support

Same as standard build:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript support required
- No IE11 support

## Performance

- **Bundle Size**: ~350KB gzipped (JS) + ~20KB gzipped (CSS)
- **Load Time**: Single request for app bundle
- **Runtime Performance**: Identical to standard build
- **Lighthouse Score**: Should achieve >90 when embedded

## Troubleshooting

### App doesn't render

1. Check browser console for JavaScript errors
2. Verify `#oiaa-meetings-root` div exists in page source
3. Verify scripts are loaded (check Network tab)
4. Check for JavaScript conflicts with other WordPress plugins

### API requests failing

1. Verify API URL is configured in Settings → OIAA Meetings
2. Check browser console Network tab for failed requests
3. Verify API endpoint is accessible from browser
4. Check for CORS issues if API is on different domain

### Routing not working

1. Verify hash in URL (should have `/#/` in path)
2. Check for JavaScript errors in console
3. Ensure no other plugins are intercepting hash navigation

### Styles broken

1. Verify `oiaa-meetings.css` is loaded (check page source)
2. Check for CSS conflicts with WordPress theme
3. Use browser DevTools to inspect element styles
4. Verify no other plugins are overriding styles

## Known Limitations

1. **Hash URLs**: URLs contain `#` which may be less aesthetic than clean URLs
2. **SEO**: Hash routing means search engines can't crawl individual routes (but WordPress page is still indexed)
3. **WordPress Routing**: Can't use WordPress routing to load different routes (app handles all routing internally)

## Future Enhancements

Potential improvements for future versions:

- Multiple shortcode instances on same page
- Shortcode parameters for customization (`[oiaa_meetings api_url="..."]`)
- WordPress widget support
- Gutenberg block instead of shortcode
- Admin dashboard widget showing meeting stats
- Automatic plugin updates via WordPress plugin repository

## Support

For issues or questions:
1. Check this documentation
2. Review GitHub issues: [repository URL]
3. Open new issue with:
   - WordPress version
   - Plugin version
   - Browser and version
   - Steps to reproduce
   - Console errors (if any)
