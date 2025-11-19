import { copyFileSync } from "fs"
import { resolve } from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// Plugin to copy wordpress-overrides.css to dist
function copyWordPressOverrides() {
  return {
    name: "copy-wordpress-overrides",
    closeBundle() {
      const src = resolve(__dirname, "wordpress-plugin/assets/wordpress-overrides.css")
      const dest = resolve(__dirname, "dist-wordpress/wordpress-overrides.css")
      try {
        copyFileSync(src, dest)
        console.log("✅ Copied wordpress-overrides.css to dist-wordpress/")
      } catch (error) {
        console.warn("⚠️  Could not copy wordpress-overrides.css:", error.message)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), copyWordPressOverrides()],

  // Use relative paths so plugin works regardless of WordPress install path
  base: "./",

  build: {
    // Output to dedicated WordPress directory
    outDir: "dist-wordpress",
    emptyOutDir: true,

    // Single entry point for WordPress
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/entry-wordpress.tsx"),
      },
      output: {
        // Clean, predictable output filenames
        entryFileNames: "oiaa-meetings.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          // CSS gets a clean name
          if (assetInfo.name?.endsWith(".css")) {
            return "oiaa-meetings.css"
          }
          // Other assets go to assets folder
          return "assets/[name].[ext]"
        },
      },
    },

    // Don't split CSS into multiple files
    cssCodeSplit: false,

    // Production minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove all console.* statements
        drop_debugger: true, // Remove debugger statements
      },
    },

    // Source maps for debugging (can disable for smaller bundle)
    sourcemap: false,
  },

  // Define build target for environment detection if needed
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
})
