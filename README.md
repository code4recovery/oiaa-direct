# oiaa-direct

Version of OIAA's Online Meeting List that queries meeting data from the data source through `central-query`.

## Setup

Currently, the `.env` file is included showing the end point for fetching the next 25 meetings. To use this, you'll likely need to disable CORS in your browser until an updated version of `central-query` is deployed.

## Contributions

Please follow the [Udacity Guide](https://udacity.github.io/git-styleguide/) for commit messages. If committing code for a feature that is not complete (i.e., initial work in progress), please add `(wip)` to the title. For example, `feat: (wip) Add React Router to fetch meeting data.`

I use the Typescript Import Sorter extension with VS Code to standardize imports.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list



## Project Evolution and Architecture Decisions

### Initial Challenges
We encountered several challenges with the original framework-mode setup:
1. **Hydration Issues**
   ```typescript
   // Original approach - complex framework routing
   export const routes = createRoutesFromFolders()
   ```
   - Server/client mismatch in component rendering
   - Unpredictable component lifecycle
   - Difficult to debug render issues

2. **Complex Routing**
   ```typescript
   // Framework-mode required specific file structure
   src/
     ├── routes/
     │   ├── _layout.tsx
     │   └── meetings.tsx
   ```
   - Rigid file-based routing
   - Limited control over route parameters
   - Complex nested layouts

### New Architecture
We simplified the architecture with standard React patterns:

1. **Clean Router Setup**
   ```typescript
   // New approach - explicit routing
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<Meetings />} />
     </Routes>
   </BrowserRouter>
   ```

2. **Component Hierarchy**
   ```typescript
   // Modular component structure
   const MeetingCard = ({ meeting }: MeetingProps) => {
     return (
       <Box borderWidth="1px" borderRadius="lg" p={4}>
         <Heading size="md">{meeting.name}</Heading>
         // ... more component logic
       </Box>
     )
   }
   ```

3. **API Integration**
   ```typescript
   // Clean data fetching with proxy
   const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`
   fetch(proxyUrl)
     .then(res => res.json())
     .then(data => setMeetings(data))
   ```

### Project Structure
```
src/
  ├── components/
  │   ├── layout/          
  │   │   ├── Layout.tsx        # Main page structure
  │   │   └── Sidebar.tsx       # Filter controls
  │   ├── meetings/
  │   │   ├── MeetingCard.tsx   # Individual meeting display
  │   │   ├── MeetingList.tsx   # Grid of meetings
  │   │   └── types.ts          # TypeScript interfaces
  │   └── ui/
  │       ├── SearchInput.tsx   # Reusable search
  │       └── FilterButton.tsx  # Reusable filters
  ├── hooks/
  │   └── useMeetings.ts        # Data management
  └── utils/
      └── formatters.ts         # Helper functions
```

### Technical Decisions

1. **State Management**
   - Using React's built-in useState for local state
   - Custom hooks for data fetching and filtering
   - Props for component communication

2. **Styling Approach**
   ```typescript
   // Chakra UI for consistent design
   import { VStack, Box, Heading } from "@chakra-ui/react"
   
   // Reusable style constants
   const cardStyles = {
     borderRadius: "lg",
     p: 4,
     shadow: "sm"
   }
   ```

3. **Type Safety**
   ```typescript
   // Strong TypeScript interfaces
   interface Meeting {
     slug: string
     name: string
     startDateUTC: string
     conference_url?: string
     types: string[]
     // ... more properties
   }
   ```

### Development Workflow
1. **Local Development**
   - Vite dev server with hot module replacement
   - CORS proxy for API development
   - TypeScript checking in real-time

2. **Code Organization**
   - Components split by responsibility
   - Shared interfaces and types
   - Utility functions for common operations

3. **Future Considerations**
   - Easy to add state management (Redux/Zustand) if needed
   - Simple to implement new features
   - Clear upgrade path for dependencies
