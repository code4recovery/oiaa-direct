# OIAA Direct (oiaa-direct)

Version of OIAA's Online Meeting List that queries meeting data from the data source through `central-query`.

---

## Project Overview

OIAA Direct is a React + TypeScript + Vite application for browsing and searching online meetings. It fetches meeting data from a central-query API and provides filtering, search, and group information features.

---

## Quick Start

```bash
git clone https://github.com/your-org/oiaa-direct.git
cd oiaa-direct
npm install
Configure `.env`
npm run dev
```

---

## Setup

1. Clone the repo to a folder of your choice.
2. Run `npm install` from that folder.
3. Update `.env` environment variables as needed.

### Required Environment Variable

```env
VITE_CQ_URL="https://central-query.apps.code4recovery.org/api/v1/meetings"
```

---

## Recommended VS Code Extensions

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [JS/TS Import/Export Sorter](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports)

The repo includes config files for each of these plugins.

---

## React Router

This project relies heavily on the [React Router](https://reactrouter.com/) framework (currently **version 7.x**).

- **Route Types:**  
  Always use the types and utilities provided by React Router v7 for generating and maintaining route types.  
  Avoid hardcoding route paths or types—leverage the framework’s helpers and conventions for consistency and type safety.

- **Upgrading:**  
  If upgrading React Router, review the [migration guides](https://reactrouter.com/en/main/upgrading/v6) and update route types, navigation, and related logic accordingly.

Refer to the [official React Router documentation](https://reactrouter.com/en/main) for version-specific APIs and best practices.

---

---

## Folder Structure

```bash
src/
  components/      # React components
  utils/           # Utility functions
  meetingTypes.ts  # TypeScript types
  getData.ts       # Data fetching logic
public/
.env
package.json
```

---

## WordPress Plugin

### Building locally

```bash
npm run build:wordpress-plugin
```

### Releasing

1. [Create a new GitHub release](https://github.com/code4recovery/oiaa-direct/releases/new) with a version tag (e.g. `v1.1.0-beta.1`)
2. The workflow automatically builds the plugin zip with that version stamped into the PHP file
3. The zip is attached as a release asset — download from the release page

### Automated builds

The build workflow also runs on every push to `main`. These dev builds have a date+hash version suffix (e.g. `1.1.0-beta.1-20260205.abc1234`) and are available as artifacts in the [Actions tab](https://github.com/code4recovery/oiaa-direct/actions).

---

## Testing

To run tests (if available):

```bash
npm test
```

---

## Contributions

Please follow the [Udacity Guide](https://udacity.github.io/git-styleguide/) for commit messages.  
If committing code for a feature that is not complete, add `(wip)` to the title.  
Example: `feat: (wip) Add React Router to fetch meeting data.`

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## License

[MIT](LICENSE)

---

## Support

For questions or support, please open an issue or contact the maintainers.
