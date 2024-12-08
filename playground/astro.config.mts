import node from '@astrojs/node';
import sentry from '@sentry/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://ui-testing.studiocms.dev',
	adapter: node({
		mode: 'standalone',
	}),
	integrations: [
		sentry({
			dsn: 'https://0f2693e5cc4590650ad844d6ad3f973f@sentry.studiocms.dev/3',
			sourceMapsUploadOptions: {
				project: 'ui-testing',
				authToken: process.env.SENTRY_AUTH_TOKEN,
			},
		}),
	],
});
