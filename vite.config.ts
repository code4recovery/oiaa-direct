import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { resolve } from "path"

import { reactRouter } from "@react-router/dev/vite"

// Check if we're building for WordPress
const isWordPressBuild = process.env.BUILD_TARGET === 'wordpress'

// https://vite.dev/config/
export default defineConfig({
  plugins: isWordPressBuild ? [tsconfigPaths()] : [reactRouter(), tsconfigPaths()],
  
  // WordPress library build configuration
  ...(isWordPressBuild && {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/entry-wordpress.tsx'),
        name: 'WordPressMeetings',
        fileName: 'wordpress-entry',
        formats: ['es']
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          },
          // Extract CSS to separate file for WordPress integration
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'wordpress-entry.css';
            }
            return assetInfo.name!;
          }
        }
      },
      // Ensure CSS is extracted for library builds
      cssCodeSplit: false
    }
  })
})
