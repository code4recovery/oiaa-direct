#!/usr/bin/env node

/**
 * Build script for WordPress plugin
 *
 * This script:
 * 1. Builds the WordPress version using vite.config-wordpress.ts
 * 2. Copies built files to wordpress-plugin/assets/
 * 3. Creates a distributable .zip file
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8')
);
const version = packageJson.version;

console.log('🚀 Building OIAA Meetings WordPress Plugin...\n');

// Step 1: Build using WordPress config
console.log('📦 Step 1: Building React app with WordPress config...');
try {
  execSync('vite build --config vite.config-wordpress.ts', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('✅ Build complete\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Copy built files to plugin assets directory
console.log('📁 Step 2: Copying files to wordpress-plugin/assets/...');
const distDir = path.join(rootDir, 'dist-wordpress');
const pluginAssetsDir = path.join(rootDir, 'wordpress-plugin', 'assets');

// Clean assets directory
if (fs.existsSync(pluginAssetsDir)) {
  fs.rmSync(pluginAssetsDir, { recursive: true, force: true });
}
fs.mkdirSync(pluginAssetsDir, { recursive: true });

// Copy all files from dist-wordpress to plugin assets
function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(distDir, pluginAssetsDir);
console.log('✅ Files copied\n');

// Step 3: Create .zip file
console.log('🗜️  Step 3: Creating plugin .zip file...');
const distOutputDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distOutputDir)) {
  fs.mkdirSync(distOutputDir);
}

const zipFileName = `oiaa-meetings-wordpress-plugin-v${version}.zip`;
const zipFilePath = path.join(distOutputDir, zipFileName);

// Remove old zip if exists
if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

// Create zip (using system zip command)
try {
  execSync(`cd wordpress-plugin && zip -r "../dist/${zipFileName}" . -x "*.DS_Store"`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('✅ Plugin zip created\n');
} catch (error) {
  console.error('❌ Zip creation failed:', error.message);
  console.error('Note: This requires the zip command. On Windows, you may need to install it separately.');
  process.exit(1);
}

// Step 4: Summary
console.log('✨ WordPress Plugin Build Complete!\n');
console.log('📊 Summary:');
console.log(`   Version: ${version}`);
console.log(`   Output: dist/${zipFileName}`);
console.log(`   Size: ${(fs.statSync(zipFilePath).size / 1024 / 1024).toFixed(2)} MB\n`);

console.log('📝 Next steps:');
console.log('   1. Test the plugin in a WordPress installation');
console.log('   2. Upload to WordPress: Plugins → Add New → Upload Plugin');
console.log('   3. Activate and configure: Settings → OIAA Meetings');
console.log('   4. Add shortcode to a page: [oiaa_meetings]\n');
