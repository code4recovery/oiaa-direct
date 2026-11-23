import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

import { reactRouter } from "@react-router/dev/vite"

// https://vite.dev/config/
export default defineConfig({
  // The React Router plugin is for dev and build only; under Vitest it breaks imports of route modules
  plugins: [!process.env.VITEST && reactRouter(), tsconfigPaths()],
})
