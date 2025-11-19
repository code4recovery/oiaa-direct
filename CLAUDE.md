# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working Philosophy

**This is a collaborative project that must maintain professional standards.**

When working on this codebase:
- **Be skeptical and critical** - Question assumptions and point out when there are better approaches
- **Brutal honesty is valued** - If an approach is flawed, say so directly and explain why
- **Suggest alternatives** - Don't just identify problems, propose better solutions
- **Follow best practices** - Maintain high code quality, proper architecture, and industry standards
- **Challenge bad ideas** - Even if requested by the user, flag when something will cause technical debt or maintainability issues

The user values learning and improving through honest technical feedback. It's better to point out a mistake and suggest the right way than to implement something incorrectly.

## Project Overview

OIAA Direct is a client-side React application for browsing and searching online Alcoholics Anonymous meetings. It fetches meeting data from a central-query API and provides filtering, search, and group information features using React Router v7.

## Development Commands

```bash
npm run dev          # Start development server (React Router dev server)
npm run typecheck    # Generate route types + TypeScript check
npm run build        # TypeScript build + React Router production build
npm test             # Run Vitest tests
npm run lint         # ESLint with React hooks + TypeScript rules
npm run preview      # Preview production build
```

### Testing

- Tests use Vitest with jsdom environment
- MSW (Mock Service Worker) handles API mocking
- Test setup in `src/setup.ts` configures MSW server lifecycle
- MSW handlers defined in `src/mocks/handlers.ts`
- Run single test file: `npm test -- path/to/test.test.ts`

## Architecture

### React Router v7 (Client-Side Only)

**Critical:** This app uses React Router v7 with **SSR disabled** (`ssr: false` in `react-router.config.ts`). This is a client-side only application.

- Route definitions in `src/routes.ts` using `@react-router/dev/routes` helpers
- Data fetching uses `clientLoader` functions (NOT `loader` - those are for SSR)
- Type safety with auto-generated types: `Route.ComponentProps`, `Route.ClientLoaderArgs`
- After adding/modifying routes, run `npm run typecheck` to regenerate route types
- Route files live in `src/routes/` with co-located `+types/` directories for generated types

### Data Fetching Pattern

All meeting data comes from the central-query API configured via `VITE_CQ_URL` environment variable.

**Key pattern:**
1. `createFetcher<T>()` in `getData.ts` creates typed fetch functions
2. `fetchData<T>()` in `utils/meetings-utils.ts` handles actual HTTP requests
3. `clientLoader` functions in route files fetch data before rendering
4. Error handling returns empty array on failure (basic - needs improvement per TODO)

**Example:**
```typescript
// In route file
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { searchParams } = new URL(request.url)
  const qs = buildMeetingsQueryString(searchParams)
  const meetings = await getMeetings(qs)
  return { meetings }
}
```

### URL State Management

**Critical pattern:** All filter state lives in URL search parameters for shareability and persistence.

- Uses React Router's `useSearchParams` hook
- Time defaults: If no params exist, automatically sets `start` (current time UTC) and `hours: "1"`
- Filter categories: `features`, `formats`, `type`, `communities`, `languages`, `nameQuery`
- Helper functions in `utils/filter-utils.ts` for updating URL params
- Never use React state for filter selections - always update URL params

### Filter System Architecture

Complex faceted filtering system with dynamic facet loading:

1. **Facet Loading:** `useFacets` hook fetches filter options from `/facets` endpoint on mount
2. **Fallback Data:** Uses constants from `meetingTypes.ts` (TYPE, FORMATS, FEATURES, COMMUNITIES, LANGUAGES) if API fails
3. **Sorting:** All facets sorted alphabetically by description (not code) for consistent UX
4. **Filter UI:**
   - Desktop: Sticky sidebar with all filters expanded
   - Mobile: Collapsible drawer with filter badge showing active count
5. **Filter Application:** URL params passed to API as query string - filtering happens server-side

### Component Organization

```
src/
  components/
    filters/        # All filter-related components
    meetings/       # Meeting display components
    ui/             # Chakra UI wrapper components (button, dialog, etc.)
  routes/           # Route components with clientLoader functions
  utils/            # Pure utility functions (thoroughly tested)
  hooks/            # Custom React hooks (useFacets)
  getData.ts        # API fetcher creation
  meetingTypes.ts   # TypeScript types and constants
```

### Key Data Types

Defined in `meetingTypes.ts`:
- `Meeting`: Core meeting data structure
- `RelatedGroupInfo`: Group details for group-info route
- Constants: `TYPE`, `FORMATS`, `FEATURES`, `COMMUNITIES`, `LANGUAGES`, `TIMEFRAMES`

### Time Handling

Uses Luxon DateTime library for all time operations:
- Timezone handling (always work in UTC for API, convert for display)
- Time frame utilities in `utils/date-and-time-utils.ts`
- Time frames: morning (6-11), midday (11-13), afternoon (13-17), evening (17-20), night (20-24+6)

## Chakra UI v3 Integration

- Custom `Provider` component in `components/ui/provider.tsx` wraps Chakra + color mode
- Responsive design using `useBreakpointValue` hook
- Breakpoint: `md` (768px) separates mobile from desktop layouts
- Custom scrollbar styling for sticky elements
- Theme-aware components using `_dark` prop for dark mode styles

## Critical Patterns to Follow

1. **Data Loading:** Use `clientLoader` in route files, not `useEffect` in components
2. **Filter State:** Always store in URL search params, never in React state
3. **Route Types:** Import as `Route.ComponentProps` and `Route.ClientLoaderArgs`
4. **Type Generation:** Run `npm run typecheck` after route changes
5. **Facet Sorting:** Use `sortFacetRecord()` pattern - sort by description, not code
6. **Error Handling:** Currently returns empty array on fetch errors - log to console
7. **Testing:** Use MSW for API mocking, add handlers in `src/mocks/handlers.ts`

## Environment Configuration

Required environment variable in `.env`:
```
VITE_CQ_URL="https://central-query.apps.code4recovery.org/api/v1/meetings"
```

## Commit Message Style

Follow [Udacity Git Style Guide](https://udacity.github.io/git-styleguide/):
- Format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Add `(wip)` for incomplete features: `feat: (wip) Add feature name`

## Known Issues & TODOs

- Error handling in `fetchData` is basic - returns empty array instead of proper error propagation (see TODO in `utils/meetings-utils.ts`)
