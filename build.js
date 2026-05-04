#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get proper paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dist directory exists
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

// Run TypeScript compiler
console.log('Compiling TypeScript...');
exec('npx tsc', (error, stdout, stderr) => {
    if (error) {
        console.error('Error compiling TypeScript:', error);
        console.error(stderr);
        process.exit(1);
    }

    if (stdout) {
        console.log(stdout);
    }

    console.log('TypeScript compilation successful');

    // Copy .env.example to dist
    try {
        if (fs.existsSync('./.env.example')) {
            fs.copyFileSync('./.env.example', './dist/.env.example');
            console.log('Copied .env.example to dist directory');
        }
        
        if (fs.existsSync('./README.md')) {
            fs.copyFileSync('./README.md', './dist/README.md');
            console.log('Copied README.md to dist directory');
        }

        // Create package.json in dist that points at compiled src/
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        packageJson.main = 'src/servers/all.js';
        if (packageJson.bin) {
            for (const key of Object.keys(packageJson.bin)) {
                packageJson.bin[key] = packageJson.bin[key].replace(/^\.\//g, '');
            }
        }
        fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
        console.log('Created package.json in dist directory');

        console.log('Build completed successfully');
    } catch (err) {
        console.error('Error copying files:', err);
        process.exit(1);
    }
});
