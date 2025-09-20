import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';
import ui from './dist/index';

export default defineConfig(
	getViteConfig(
		{
			test: {
				environment: 'node',
				include: ['**/*.test.ts'],
				setupFiles: ['./test/fixtures/vitest/vitest.setup.ts'],
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
					],
				},
			},
		},
		{
			integrations: [ui()],
		}
	)
);
