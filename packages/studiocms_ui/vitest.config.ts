import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';
import ui from './dist/index';

export default defineConfig(
	getViteConfig(
		{
			test: {
				environment: 'node',
				include: ['**/*.test.ts'],
				exclude: ['**/components/_Template.test.ts', '**/test/fixtures/**', '**/node_modules/**'],
				setupFiles: ['./test/fixtures/vitest/setup-jest.ts'],
				reporters: ['default', 'junit'],
				outputFile: {
					junit: './test-report.junit.xml',
				},
				coverage: {
					provider: 'v8',
					reporter: ['text', 'json', 'html'],
					exclude: [
						'playwright.config.ts',
						'vitest.config.ts',
						'**/test/**',
						'**/dist/**',
						'**/node_modules/**',

						// This is a unique case where we want to test the Astro components, but not the underlying TS files as they are internal to the component's implementation
						// and not part of the public API of the package.
						// We should be testing the Astro component's output instead and using E2E tests for end-to-end coverage.
						'src/components/**/*.ts',
					],
				},
			},
		},
		{
			integrations: [ui()],
		}
	)
);
