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
import * as os from 'os';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Version: PLUGIN_VERSION (the release workflow sets it from the tag),
// otherwise package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8')
);
const version = process.env.PLUGIN_VERSION || packageJson.version;

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`❌ Version must look like 1.3.4, got "${version}"`);
  process.exit(1);
}

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
const distDir = path.join(rootDir, 'dist');
const pluginAssetsDir = path.join(rootDir, 'wordpress-plugin', 'assets');

// Clean assets directory
if (fs.existsSync(pluginAssetsDir)) {
  fs.rmSync(pluginAssetsDir, { recursive: true, force: true });
}
fs.mkdirSync(pluginAssetsDir, { recursive: true });

// Copy all files from dist to plugin assets
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

// Write the version into a temporary copy of the plugin, so the files in git
// stay as they are
function stamp(file, pattern, replacement) {
  const text = fs.readFileSync(file, 'utf-8');
  if (!pattern.test(text)) {
    console.error(`❌ Could not find the version line in ${file}`);
    process.exit(1);
  }
  fs.writeFileSync(file, text.replace(pattern, replacement));
}

const stampDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oiaa-plugin-'));
fs.cpSync(path.join(rootDir, 'wordpress-plugin'), stampDir, { recursive: true });
stamp(
  path.join(stampDir, 'oiaa-meetings-plugin.php'),
  /^( \* Version:).*$/m,
  `$1 ${version}`
);
stamp(
  path.join(stampDir, 'oiaa-meetings-plugin.php'),
  /(define\('OIAA_MEETINGS_VERSION', ')[^']*('\))/,
  `$1${version}$2`
);
stamp(
  path.join(stampDir, 'readme.txt'),
  /^(Stable tag:).*$/m,
  `$1 ${version}`
);

// Create zip (using system zip command)
try {
  execSync(`zip -r "${zipFilePath}" . -x "*.DS_Store"`, {
    cwd: stampDir,
    stdio: 'inherit',
  });
  console.log('✅ Plugin zip created\n');
} catch (error) {
  console.error('❌ Zip creation failed:', error.message);
  console.error('Note: This requires the zip command. On Windows, you may need to install it separately.');
  process.exit(1);
} finally {
  fs.rmSync(stampDir, { recursive: true, force: true });
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
console.log('   4. Create or confirm a page matching the configured base path (e.g. /meetings)\n');
