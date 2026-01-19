# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OIAA Direct is a React + TypeScript + Vite application for browsing online AA meetings. It queries meeting data from a central-query API (`VITE_CQ_URL`) and provides filtering, search, and group information features. Uses React Router v7 with client-side rendering only (SSR disabled).

## Commands

```bash
npm run dev          # Start development server (react-router dev)
npm run typecheck    # Generate route types + TypeScript check
npm run build        # TypeScript build + react-router build
npm test             # Run Vitest tests
npm run lint         # ESLint
npm test -- --run src/utils/someFile.test.ts  # Run a single test file
```

**After adding new routes**: Run `npm run typecheck` to regenerate route types.

### WordPress Plugin Build

```bash
npm run build:wordpress-plugin  # Build plugin zip for WordPress
```

This creates `dist/oiaa-meetings-wordpress-plugin-v{version}.zip` containing a complete WordPress plugin. The build:
1. Compiles React app with hash-router (via `vite.config-wordpress.ts`)
2. Outputs to `dist-wordpress/` with predictable filenames (`oiaa-meetings.js`, `oiaa-meetings.css`)
3. Copies assets to `wordpress-plugin/assets/`
4. Creates installable zip file

## Architecture

### Data Flow
```
central-query API → getData.ts (createFetcher<T>) → Route clientLoaders → Components
```

- `createFetcher<T>()` in `getData.ts` creates type-safe fetch functions
- Routes use `clientLoader` for data fetching (not useEffect)
- Filter state lives in URL search params for shareability

### Routes
- `/` → `src/routes/meetings-filtered.tsx` - Meeting list with filters
- `/group-info/:slug` → `src/routes/group-info.tsx` - Meeting detail view

### Key Patterns

**React Router v7**: Always use framework-provided types:
- `Route.ComponentProps` for component props
- `Route.ClientLoaderArgs` for loader arguments
- Import from route's `+types/` directory (auto-generated)

**URL State**: Filter state goes in URL params via `useSearchParams`, not React state.

**Meeting Types**: Use constants from `src/meetingTypes.ts` (FORMATS, FEATURES, COMMUNITIES, etc.)

**Time Handling**: Luxon for all timezone/datetime operations. Meetings stored in UTC.

**UI**: Chakra UI v3 with responsive breakpoints (base=mobile, md=desktop).

### WordPress Integration

The WordPress build uses a separate entry point (`src/entry-wordpress.tsx`) that:
- Uses hash router instead of browser history (works without server config)
- Reads config from `window.OIAA_CONFIG` (set by PHP shortcode)
- Has `@ts-nocheck` due to hash router type incompatibilities

Plugin structure in `wordpress-plugin/`:
- `oiaa-meetings-plugin.php` - Main plugin file
- `includes/shortcode.php` - `[oiaa_meetings]` shortcode handler
- `includes/settings.php` - Admin settings page
- `assets/` - Built React app (copied by build script)

### Testing
- Vitest + jsdom environment
- MSW for API mocking (handlers in `src/mocks/handlers.ts`)
- Setup file: `src/setup.ts`

## Commit Style

Follow the [Udacity Guide](https://udacity.github.io/git-styleguide/). For incomplete features, add `(wip)` to title:
```
feat: (wip) Add React Router to fetch meeting data
```
