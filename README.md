# oiaa-direct

Version of OIAA's Online Meeting List that queries meeting data from the data source through `central-query`.

## Setup

Currently, the `.env` file is included showing the end point for fetching the next 25 meetings. To use this, you'll likely need to disable CORS in your browser until an updated version of `central-query` is deployed.

## Contributions

Please follow the [Udacity Guide](https://udacity.github.io/git-styleguide/) for commit messages. If committing code for a feature that is not complete (i.e., initial work in progress), please add `(wip)` to the title. For example, `feat: (wip) Add React Router to fetch meeting data.`

I use the ~~Typescript Import Sorter~~ _JS/TS Import/Export Sorter_ extension with VS Code to standardize imports. Please use this with the included `import-sorter.json` file.

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
