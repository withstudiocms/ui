import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	exclude: ['duplicates', 'optionalPeerDependencies'],
	workspaces: {
		'.': {
			ignoreBinaries: ['preview', 'astro', 'playwright:setup', 'test:vitest:run'],
			ignoreDependencies: ['@changesets/config', 'playwright-ctrf-json-reporter'],
			entry: ['.github/workflows/*.yml', '.changeset/config.json', 'biome.json'],
			project: ['.github/workflows/*.yml', '.changeset/config.json', 'biome.json'],
		},
		'packages/studiocms_ui': {
			ignoreDependencies: ['studiocms'],
			entry: [
				'src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
				'test/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
				'vite.config.{js,ts}',
				'playwright.config.{js,ts}',
			],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			astro: {
				entry: ['src/**/*.astro', 'test/**/*.astro'],
				project: ['src/**/*.astro', 'test/**/*.astro'],
			},
		},
		'packages/*/test/fixtures/test-server': {
			ignoreDependencies: ['studiocms'],
			entry: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,json,html,css,astro}'],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,json,html,css,astro}'],
			astro: {
				entry: ['**/*.astro'],
				project: ['**/*.astro'],
			},
		},
		docs: {
			ignoreDependencies: ['studiocms', 'sharp'],
			entry: [
				'src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
				'scripts/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
				'lunaria/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
				'ec.config.mjs',
				'lunaria.config.ts',
				'starlight-types.ts',
				'hostUtils.ts',
			],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			astro: {
				entry: [
					'astro.config.{js,cjs,mjs,ts,mts}',
					'src/content/config.ts',
					'src/content.config.ts',
					'src/pages/**/*.{astro,mdx,js,ts}',
					'src/components/**/*.{astro,mdx,js,ts}',
					'src/content/**/*.mdx',
					'src/middleware.{js,ts}',
					'src/actions/index.{js,ts}',
				],
			},
		},
	},
};

export default config;
