import path from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';

import { build } from 'esbuild';
import { createBuildSettings } from './esbuild-settings.js';

const outDir = path.resolve('dist');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const settings = createBuildSettings({
	entryPoints: ['src/server.ts'],
	outfile: path.join(outDir, 'server.mjs'),
});

await build(settings);

console.log('✅ ESM bundle → dist/server.mjs');
