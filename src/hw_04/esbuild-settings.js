import esbuildPluginTsc from 'esbuild-plugin-tsc';

export function createBuildSettings(options) {
	return {
		entryPoints: ['src/server.ts'],
		bundle: true,
		plugins: [
			esbuildPluginTsc({
				force: true,
				tsconfigPath: './tsconfig.json',
			}),
		],
		format: 'esm',
		platform: 'node',
		target: 'node20',
		minifySyntax: true,
		minifyWhitespace: true,
		minifyIdentifiers: false,
		treeShaking: true,
		legalComments: 'none',
		banner: {
			js: `
                import { createRequire } from 'node:module';
                // import { fileURLToPath } from 'node:url';
                // import path from 'node:path';
                const require = createRequire(import.meta.url);
                const __filename = fileURLToPath(import.meta.url);
                const __dirname  = path.dirname(__filename);
            `,
		},
		...options,
	};
}
