import { defineConfig, devices } from '@playwright/test';

const port = 4321;
const baseURL = `http://localhost:${port}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './test',
	testMatch: ['**/*.e2e.ts'],
	testIgnore: ['**/test/fixtures/**', '**/node_modules/**', '**/test/components/_Template.e2e.ts'],
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : '50%',
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI ? [['html'], ['list'], ['github']] : [['html'], ['list']],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'pnpm test-server', // run the test fixture
		port,
		timeout: 120000,
		reuseExistingServer: !process.env.CI,
	},

	use: {
		baseURL,
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},

		// Playwright webkit does not seem to work
		// {
		// 	name: 'webkit',
		// 	use: { ...devices['Desktop Safari'] },
		// },
	],
});
