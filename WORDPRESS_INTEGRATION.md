# WordPress Integration Guide - OIAA Direct Meetings App

This guide provides complete instructions for integrating the OIAA Direct meetings application into WordPress using React Router 7.

## ✅ Current Status: **FULLY TESTED & WORKING**

The integration has been successfully tested and is ready for WordPress deployment.

## Overview

The OIAA Direct meetings application has been built as a WordPress-compatible ES module that can be easily integrated into any WordPress theme or plugin. The module includes React Router 7, Chakra UI, and all necessary components bundled together.

**Key Features:**
- ✅ React Router 7 compatible
- ✅ WordPress REST API integration
- ✅ Modern ES module format
- ✅ Complete UI components included
- ✅ Responsive design
- ✅ Production-ready

## Quick Start

### 1. Build the WordPress Module

```bash
npm run build:wordpress
```

This creates two files:
- `dist/wordpress-entry.js` (~956KB) - your complete WordPress-ready application
- `dist/wordpress-entry.css` (~1KB) - essential styles for proper component display

### 2. Upload to WordPress

Copy both files to your WordPress installation:

```bash
# Copy to your theme's assets directory
cp dist/wordpress-entry.js /path/to/wordpress/wp-content/themes/your-theme/assets/
cp dist/wordpress-entry.css /path/to/wordpress/wp-content/themes/your-theme/assets/

# OR copy to a plugin directory
cp dist/wordpress-entry.js /path/to/wordpress/wp-content/plugins/your-plugin/assets/
cp dist/wordpress-entry.css /path/to/wordpress/wp-content/plugins/your-plugin/assets/
```

### 3. Add to WordPress

**Method A: Simple PHP Integration (Recommended)**

Add to your theme's `functions.php`:

```php
function enqueue_meetings_app() {
    // Load React (if not already loaded by WordPress)
    wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', [], '18.0.0', true);
    wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', ['react'], '18.0.0', true);
    
    // Load the meetings application CSS (IMPORTANT: for proper styling)
    wp_enqueue_style(
        'meetings-app-css',
        get_template_directory_uri() . '/assets/wordpress-entry.css',
        [],
        '1.0.0'
    );
    
    // Load the meetings application JS 
    wp_enqueue_script(
        'meetings-app', 
        get_template_directory_uri() . '/assets/wordpress-entry.js', 
        ['react', 'react-dom'], 
        '1.0.0', 
        true
    );
    wp_script_add_data('meetings-app', 'type', 'module'); // Important: ES module
}
add_action('wp_enqueue_scripts', 'enqueue_meetings_app');
```

### 4. Display the App

Add where you want the meetings app to appear:

```html
<!-- In your template file -->
<div id="meetings-app"></div>

<script type="module">
document.addEventListener('DOMContentLoaded', function() {
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        import('<?php echo get_template_directory_uri(); ?>/assets/wordpress-entry.js')
        .then(({ default: WordPressMeetings }) => {
            const container = document.getElementById('meetings-app');
            if (container) {
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(WordPressMeetings));
            }
        })
        .catch(error => {
            console.error('Failed to load meetings app:', error);
            document.getElementById('meetings-app').innerHTML = 
                '<div class="error">Unable to load meetings application.</div>';
        });
    }
});
</script>
```

## Available Components & Functions

The WordPress module exports these components:

```javascript
// Available exports from wordpress-entry.js
{
    default: WordPressMeetings,           // Pre-configured app component (accepts basename prop)
    createMeetingsRouter,                 // Router factory function (accepts basename parameter)
    RouterProvider,                       // React Router provider
    createBrowserRouter,                  // Browser router factory
    MeetingsFiltered                      // Main meetings component
}
```

### Router Configuration Options

The module supports flexible basename configuration:

```javascript
// Method 1: Pass basename parameter
const router = createMeetingsRouter('/meetings');

// Method 2: Pass props to component
const element = React.createElement(WordPressMeetings, { basename: '/meetings' });

// Method 3: Set global variable (checked automatically)
globalThis.WORDPRESS_BASE_PATH = '/meetings';
```

## Integration Options

### Option 1: WordPress Shortcode

Create a reusable shortcode:

```php
function meetings_app_shortcode($atts) {
    $atts = shortcode_atts(array(
        'base-path' => '/meetings',
        'api-endpoint' => '/wp-json/central-query/v1/meetings'
    ), $atts);
    
    $container_id = 'meetings-app-' . uniqid();
    $base_path = esc_attr($atts['base-path']);
    
    ob_start();
    ?>
    <div id="<?php echo $container_id; ?>" class="meetings-app-container" style="min-height: 400px;"></div>
    <script type="module">
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
            import('<?php echo get_template_directory_uri(); ?>/assets/wordpress-entry.js')
            .then(({ default: WordPressMeetings }) => {
                const container = document.getElementById('<?php echo $container_id; ?>');
                
                if (container) {
                    const root = ReactDOM.createRoot(container);
                    root.render(React.createElement(WordPressMeetings, { basename: '<?php echo $base_path; ?>' }));
                }
            })
            .catch(error => {
                console.error('Failed to load meetings app:', error);
                document.getElementById('<?php echo $container_id; ?>').innerHTML = 
                    '<div style="padding: 20px; border: 1px solid #ccc; background: #f9f9f9;">' +
                    '<strong>Error:</strong> Unable to load meetings application.' +
                    '</div>';
            });
        } else {
            document.getElementById('<?php echo $container_id; ?>').innerHTML = 
                '<div style="padding: 20px; border: 1px solid #ccc; background: #f9f9f9;">' +
                '<strong>Error:</strong> React is not available. Please ensure React is loaded.' +
                '</div>';
        }
    });
    </script>
    <style>
    .meetings-app-container {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    </style>
    <?php
    return ob_get_clean();
}
add_shortcode('meetings_app', 'meetings_app_shortcode');
```

**Usage:** `[meetings_app base-path="/events"]`

### Option 2: Gutenberg Block

```php
// Register custom Gutenberg block
function register_meetings_block() {
    register_block_type('oiaa/meetings-app', [
        'render_callback' => 'render_meetings_block',
        'attributes' => [
            'basePath' => [
                'type' => 'string',
                'default' => '/meetings'
            ]
        ]
    ]);
}
add_action('init', 'register_meetings_block');

function render_meetings_block($attributes) {
    $container_id = 'meetings-block-' . uniqid();
    $base_path = esc_attr($attributes['basePath'] ?? '/meetings');
    
    ob_start();
    ?>
    <div class="wp-block-oiaa-meetings-app">
        <div id="<?php echo $container_id; ?>" class="meetings-app-container"></div>
        <script type="module">
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
                import('<?php echo get_template_directory_uri(); ?>/assets/wordpress-entry.js')
                .then(({ default: WordPressMeetings }) => {
                    const container = document.getElementById('<?php echo $container_id; ?>');
                    
                    if (container) {
                        const root = ReactDOM.createRoot(container);
                        root.render(React.createElement(WordPressMeetings, { basename: '<?php echo $base_path; ?>' }));
                    }
                });
            }
        });
        </script>
    </div>
    <?php
    return ob_get_clean();
}
```

### Option 3: Direct Template Integration

```php
// In your template file (e.g., page-meetings.php)
get_header(); ?>

<div class="meetings-page">
    <h1>Meetings</h1>
    <div id="meetings-app-main"></div>
</div>

<script type="module">
document.addEventListener('DOMContentLoaded', function() {
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        import('<?php echo get_template_directory_uri(); ?>/assets/wordpress-entry.js')
        .then(({ default: WordPressMeetings }) => {
            const container = document.getElementById('meetings-app-main');
            if (container) {
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(WordPressMeetings, { basename: '/meetings' }));
            }
        });
    }
});
</script>

<?php get_footer();
```

## API Configuration

The application is configured to use the external Central Query API:

**API Endpoint:** `https://central-query.apps.code4recovery.org/api/v1/meetings`

> **Note:** This application uses an external API, not a WordPress REST API endpoint. No WordPress API setup is required.

**Response Format:**
```json
{
    "meetings": [
        {
            "id": "meeting-id",
            "title": "Meeting Title",
            "date": "2024-01-15",
            "time": "10:00 AM",
            "location": "Location Name",
            "description": "Meeting description...",
            // ... other meeting fields
        }
    ]
}
```

Since the application uses an external API, no WordPress API endpoint creation is needed. The app will automatically fetch data from the Code4Recovery Central Query API.

## Troubleshooting

### ❌ Common Issues & Solutions

**1. "React is not defined" Error**
```php
// Ensure React is loaded before your module
wp_enqueue_script('react', 'https://unpkg.com/react@18/umd/react.production.min.js', [], '18.0.0', true);
wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', ['react'], '18.0.0', true);
```

**2. "Cannot resolve module" Error**
- Verify file path: `get_template_directory_uri() . '/assets/wordpress-entry.js'`
- Check file permissions and upload
- Ensure ES modules are supported (modern browsers)

**3. API Connection Issues**
- Test external API directly: `https://central-query.apps.code4recovery.org/api/v1/meetings`
- Check network connectivity
- Verify CORS settings if needed (external API should handle this)

**4. Missing Styles / Broken Appearance**
- **CRITICAL**: Ensure you've included `wordpress-entry.css`
- Without the CSS file, components will appear unstyled (white cards, missing button colors)
- Check that CSS is properly enqueued:
```php
wp_enqueue_style('meetings-app-css', get_template_directory_uri() . '/assets/wordpress-entry.css');
```

**5. Styling Conflicts**
- The app includes Chakra UI styles
- Add namespace CSS if conflicts occur:
```css
.meetings-app-container {
    /* Isolate styles */
    all: initial;
    font-family: system-ui;
}
```

### 🔧 Debug Mode

Add debug logging:

```javascript
<script type="module">
console.log('🔍 Debug: Starting meetings app initialization');
console.log('🔍 React available:', typeof React !== 'undefined');
console.log('🔍 ReactDOM available:', typeof ReactDOM !== 'undefined');

import('<?php echo get_template_directory_uri(); ?>/assets/wordpress-entry.js')
.then(module => {
    console.log('🔍 Module loaded:', module);
    console.log('🔍 Available exports:', Object.keys(module));
    // ... rest of initialization
})
.catch(error => {
    console.error('🔍 Module loading failed:', error);
});
</script>
```

## Performance & Production

### Optimization Checklist

- ✅ **Use production React builds**
- ✅ **Enable gzip compression**
- ✅ **Set cache headers for JS files**
- ✅ **Lazy load on pages that need it**
- ✅ **Minify additional CSS if added**

### Caching Configuration

```php
// Add cache headers for the module file
function add_cache_headers() {
    if (strpos($_SERVER['REQUEST_URI'], '/assets/wordpress-entry.js') !== false) {
        header('Cache-Control: public, max-age=31536000'); // 1 year
        header('Expires: ' . gmdate('D, d M Y H:i:s T', time() + 31536000));
    }
}
add_action('init', 'add_cache_headers');
```

## File Information

**Built Files:**
- `dist/wordpress-entry.js` - **Size:** ~956KB (includes all dependencies except React/ReactDOM)  
- `dist/wordpress-entry.css` - **Size:** ~1KB (essential base styles and theme support)

**Required Files:** Both JS and CSS files must be included for proper functionality and appearance.
- **Format:** ES Module
- **Dependencies:** React 18+, ReactDOM 18+
- **Browser Support:** Modern browsers with ES module support
- **Includes:** React Router 7, Chakra UI, OIAA meetings components

## Security Considerations

1. **Sanitize API endpoints** - Validate all WordPress REST API inputs
2. **Authentication** - Add proper auth to sensitive endpoints
3. **CORS Configuration** - Set appropriate CORS headers
4. **Content Security Policy** - Allow ES module imports if CSP is enabled

## Testing Your Integration

### Quick Test Checklist

1. ✅ Upload `wordpress-entry.js` to correct location
2. ✅ Add React/ReactDOM scripts
3. ✅ Add integration code (shortcode/block/template)
4. ✅ Test API endpoint: `https://central-query.apps.code4recovery.org/api/v1/meetings`
5. ✅ Check browser console for errors
6. ✅ Verify meetings display correctly

### Browser Console Verification

You should see:
```
🔍 Debug: Starting meetings app initialization
🔍 React available: true
🔍 ReactDOM available: true
🔍 Module loaded: {MeetingsFiltered: ƒ, RouterProvider: ƒ, createBrowserRouter: ƒ, createMeetingsRouter: ƒ, default: ƒ}
🔍 Available exports: ["MeetingsFiltered", "RouterProvider", "createBrowserRouter", "createMeetingsRouter", "default"]
```

## Support & Next Steps

**This integration is ready for production use!** 

For additional customization:
- Modify `src/entry-wordpress.tsx` for custom exports
- Adjust styling in your WordPress theme
- Extend API endpoints as needed
- Add WordPress user integration if required

**Questions?** The development team has successfully tested this integration and it's ready for your WordPress environment.