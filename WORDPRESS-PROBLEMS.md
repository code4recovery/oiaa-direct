# OIAA Direct – Backend Build Brief (React Router 7 / WordPress SPA)

This document describes the failures we are seeing when integrating the current build into WordPress and the exact changes we need from the backend build to make the integration robust.

## Context
- App: React 18 + React Router 7 + Chakra UI
- Target host: WordPress page at `/meetings` (pure SPA, no SSR)
- Integration path: load `dist/wordpress-entry.js` and render the default export inside a page template

## What works
- The bundle runs standalone.
- In WordPress, the module loads and renders the top-level app component; Chakra is available when using the default export.

## What fails (reliably)
- Immediate crash inside the bundle around `PE({ loaderData: e })` with `e` undefined.
- Error appears at (minified) `wordpress-entry.js:19073`.
- When trying to mount sub-components directly (e.g., `MeetingsFiltered`) without Chakra, we get: “useContext returned undefined … wrap within <ChakraProvider />”. Using the default export avoids this.
- “No HydrateFallback provided” warnings indicate the bundle expects React Router hydration data path (SSR) even though we are in a pure SPA.

## Root causes
1) Loader data shape mismatch
   - The route loader currently returns a raw array from the Central Query API.
   - The route component `PE({ loaderData })` expects `loaderData` to be an object with a `meetings` property (i.e., `{ meetings: [...] }`).
   - Result: `loaderData` destructuring fails, leading to `TypeError: e is undefined`.

2) Hydration assumptions in a SPA context
   - The bundle’s router creation path appears to read `window.__staticRouterHydrationData` (via React Router’s `Ep()`), i.e., an SSR hydration flow.
   - In WordPress (SPA), there is no SSR-produced hydration object, which causes fallback/hydration warnings and brittle startup unless loader reruns are guaranteed.

3) Provider coupling
   - ChakraProvider must wrap UI. The default export correctly includes it; rendering inner components directly requires ChakraProvider setup in the host (undesirable for WP integration).

## Requests to backend (changes to the source/bundle)

### A. Loader contract (mandatory)
- Ensure the loader feeding `PE` always returns an object:
  - `return Array.isArray(data) ? { meetings: data } : data;`
- Make `PE` resilient:
  - Safely read loaderData: `const allMeetings = Array.isArray(loaderData) ? loaderData : loaderData?.meetings ?? [];`

### B. SPA-first router initialization (mandatory)
- Do NOT depend on `window.__staticRouterHydrationData` in the WordPress/SPA build.
- Create the router with:
  - `createBrowserRouter(routes, { basename, future: { v7_startTransition: true, v7_relativeSplatPath: true } })`
  - Let loaders run at mount; only use `HydrateFallback` when SSR hydration data exists.

### C. Default export responsibilities (mandatory)
- Keep the default export as a fully wired component that:
  - Wraps ChakraProvider
  - Creates the router
  - Accepts a `basename` prop (default `/meetings`)
- No reliance on `process.env` at runtime; accept configuration via props or `globalThis` (e.g., `globalThis.WORDPRESS_BASE_PATH`, `globalThis.CQ_URL`).

### D. WordPress-friendly helper (recommended)
- Export a helper to reduce WP-side mistakes:

```ts
// In the bundle API
export function renderWordPressMeetings(
  container: HTMLElement,
  opts?: { basename?: string; apiUrl?: string }
) {
  const basename = opts?.basename ?? (globalThis.WORDPRESS_BASE_PATH ?? '/meetings');
  const apiUrl = opts?.apiUrl ?? (globalThis.CQ_URL ?? 'https://central-query.apps.code4recovery.org/api/v1/meetings');
  // Create router with loader that returns { meetings } and mount under ChakraProvider
}
```

### E. Build targets (recommended)
- Provide two entry files:
  - `dist/wordpress-entry-spa.js` – SPA-only, never reads SSR hydration data. RECOMMENDED for WordPress.
  - `dist/wordpress-entry-ssr.js` – SSR-capable, can hydrate via `window.__staticRouterHydrationData` if present.
- Document which one to use for WordPress (SPA).

### F. Basename handling (mandatory)
- Respect `basename` prop. Default to `/meetings` when not provided.
- Avoid using `process.env.WORDPRESS_BASE_PATH` in the browser; prefer prop or `globalThis.WORDPRESS_BASE_PATH` fallback.

### G. Environment/config (mandatory)
- Avoid direct `process.env` reads in the browser path. They are not guaranteed in WordPress.
- If needed, read from `globalThis` with defaults, or accept configuration through props.

## Required source edits (high level)
- Route loader: wrap array → `{ meetings }` (and/or handle both shapes in the consumer).
- Router creation: make hydration optional and not required for SPA init.
- Default export: keep Chakra + Router, accept `basename`, accept `apiUrl` (or read from `globalThis`).
- Optional: export `renderWordPressMeetings(container, opts)` helper.

## Acceptance criteria
- In WordPress, with import map for React/ReactDOM and rendering the default export:
  - No “TypeError: e is undefined” at `PE`.
  - No Chakra context errors.
  - No “HydrateFallback” warnings in SPA mode.
  - Meetings render; filters and pagination function under `/meetings`.
- API returns an array; the loader wraps it to `{ meetings }`.
- Navigating nested routes under `/meetings` works with the configured basename.

## Verification checklist (backend/dev)
1. Build `dist/wordpress-entry-spa.js`.
2. Confirm loader code in the built output returns `{ meetings }` when the API responds with an array.
3. Confirm the default export:
   - Wraps ChakraProvider
   - Creates router with `basename`
   - Does not require SSR hydration data
4. WordPress test page:
   - Import map for React/ReactDOM
   - Render default export: `root.render(React.createElement(WordPressMeetings, { basename: '/meetings' }))`
5. Open `/meetings`:
   - No console errors
   - Data loads
6. Navigate between routes; confirm URL base path works (no 404s, no reloads).

## Minimal WP integration (reference)

```php
<div id="meetings-app"></div>

<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18",
    "react-dom/client": "https://esm.sh/react-dom@18/client"
  }
}
</script>

<script type="module">
const [React, ReactDOM, mod] = await Promise.all([
  import('react'),
  import('react-dom/client'),
  import('<?php echo get_template_directory_uri(); ?>/dist/wordpress-entry-spa.js')
]);
const WordPressMeetings = mod.default;
const root = ReactDOM.createRoot(document.getElementById('meetings-app'));
root.render(React.createElement(WordPressMeetings, { basename: '/meetings' }));
</script>
```

## Summary
- The current build assumes a loaderData shape and, at times, SSR hydration. In a WordPress SPA page, that leads to `loaderData` being undefined and hard crashes.
- Fix the loader to return `{ meetings }`, make the component resilient, and offer a SPA-first build path that does not depend on hydration data.
- Keep Chakra + Router inside the default export, accept `basename`, and avoid browser `process.env` dependencies.

## Additional Mandatory Fix: ChakraProvider System/Theme Value

### Symptom in WordPress
- Error: `TypeError: can't access property "_config", t is undefined` inside the bundle at or near Chakra wrapper (`Py` function) when mounting.
- This indicates the Chakra context provider was rendered without a valid internal system/theme value.

### Root Cause
- The provider used internally is likely a low-level Chakra context provider (or an incomplete provider value) instead of the official `ChakraProvider` from `@chakra-ui/react`, which builds the required system object (the thing holding `_config`, `layers`, `getPreflightCss`, `getGlobalCss`, `getTokenCss`, etc.).

### Required Changes
- Use the public `ChakraProvider` from `@chakra-ui/react` to wrap the app. Do not render the internal context provider directly.
- Pass a valid theme/system (e.g., result of `extendTheme({})`) to `ChakraProvider`.
- Ensure this is wired both in the default export and inside the `renderWordPressMeetings` helper so WordPress callers don’t need to provide any provider configuration.

### Reference Implementation (Helper)
```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { MeetingsFiltered } from './exports'

export function renderWordPressMeetings(
  container: HTMLElement,
  opts?: { basename?: string; apiUrl?: string }
) {
  const basename = opts?.basename ?? (globalThis.WORDPRESS_BASE_PATH ?? '/meetings')
  const apiUrl = opts?.apiUrl ?? (globalThis.CQ_URL ?? 'https://central-query.apps.code4recovery.org/api/v1/meetings')

  const theme = extendTheme({})

  const loader = async () => {
    const res = await fetch(apiUrl)
    const data = await res.json()
    return Array.isArray(data) ? { meetings: data } : data
  }

  const router = createBrowserRouter([
    { path: '/*', Component: MeetingsFiltered, loader }
  ], {
    basename,
    future: { v7_startTransition: true, v7_relativeSplatPath: true }
  })

  const root = createRoot(container)
  root.render(
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} fallbackElement={<div>Loading…</div>} />
    </ChakraProvider>
  )

  return { unmount: () => root.unmount() }
}
```

### Acceptance Criteria (updated)
- No Chakra provider/system errors (no `_config is undefined` in provider code).
- Default export and `renderWordPressMeetings` both wrap the app in a valid `ChakraProvider` instance with a theme/system value.
- All previous acceptance criteria remain satisfied (no hydration warnings, loaderData works, navigation under `basename`).

### Verification Steps (backend)
1) Confirm the built bundle imports `ChakraProvider` from `@chakra-ui/react` and does not render the low-level context provider directly.
2) Confirm a valid theme (e.g., result of `extendTheme`) is passed to `ChakraProvider`.
3) In WordPress, call `renderWordPressMeetings(container, { basename: '/meetings' })`:
   - No `_config` error
   - App renders
4) Refresh page to ensure idempotent mounting/unmounting works without leaking providers.

## ⚠️ CRITICAL ISSUE FOUND - Loader Data Not Reaching Component

### Current Status (August 11, 2025)
- ✅ API fetch working: "WordPress: Received meetings data: 32 meetings"
- ✅ Component renders: UI structure appears
- ❌ **Loader data not reaching component**: React fiber inspection shows no `loaderData` props
- ❌ **No meetings display**: Only filter UI renders, no meeting list

### WordPress Console Evidence
```
WordPress: Fetching meetings from: https://central-query.apps.code4recovery.org/api/v1/meetings?start=2025-08-11T02%3A49%3A20.894Z&hours=1
WordPress: Received meetings data: 32 meetings
🔍 Found React fiber - checking for component data...
🔍 Component state keys: ["memoizedState", "baseState", "baseQueue", "queue", "next"]
// NO loaderData prop found in component
```

### Root Cause
The loader is fetching 32 meetings successfully, but the data is not being passed to the component as `loaderData` prop. Component renders empty state.

### Required Fix
**Verify the loader data flow in your build:**
1. Confirm loader returns data in format: `{ meetings: [...] }`
2. Confirm route component receives `loaderData` prop
3. Confirm `useLoaderData()` hook works if used instead
4. Test with simple console.log in component: `console.log('Component received:', loaderData)`

### Test Request
Please add debug logging to the component to confirm what props it receives:
```tsx
// In your main component
const ComponentName = ({ loaderData, ...props }) => {
  console.log('🔍 Component props:', Object.keys(props));
  console.log('🔍 loaderData received:', loaderData);
  console.log('🔍 loaderData type:', typeof loaderData);
  console.log('🔍 loaderData is array:', Array.isArray(loaderData));
  // ... rest of component
}
```

**This is blocking - meetings will not display until loader data reaches the component.**

## 🚨 URGENT: WordPress Build vs Standalone Discrepancy

### Critical Discovery (August 11, 2025)
**The standalone application works perfectly, but the WordPress build (`wordpress-entry.js`) has a broken router/loader connection.**

**Evidence:**
- ✅ Standalone app: Displays meetings correctly
- ❌ WordPress build: Fetches data but NO loader data reaches component
- 🔍 Diagnosis: `🚨 CRITICAL: NO loader data or meeting data found in React components`

### Root Cause Analysis Required
**The WordPress build configuration differs from standalone in a way that breaks the router/loader connection.**

**Backend Action Items:**
1. **Compare router setup:** Standalone vs WordPress entry point
2. **Compare component exports:** What component is exported as `default` in WordPress build?
3. **Compare loader configuration:** Is the loader function properly connected to routes in WordPress build?
4. **Compare build configs:** Are there different webpack/vite settings for WordPress vs standalone?

### Specific Questions for Backend
1. Does the WordPress build use the same router configuration as standalone?
2. Does the WordPress build export the same component that works in standalone?
3. Is the loader function identical between builds?
4. Are there any conditional logic differences for WordPress vs standalone mode?

**Priority: CRITICAL - This is a build-level issue, not a WordPress integration issue.**
