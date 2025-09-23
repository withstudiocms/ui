import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Footer Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/footer-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Acme, Inc.')).toBeVisible();
		await expect(page.getByText('Resources Docs Support Legal')).toBeVisible();
		await expect(page.getByText('MIT License © 2024 - Acme Inc.')).toBeVisible();
	});

	[{ label: 'Basic', key: 'basic' }].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		// Placeholder for more tests
		test(`Test Accessibility - ${label} Styling`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
			switchToLightMode,
		}) => {
			await takeScreenshot(`Footer - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Footer - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
