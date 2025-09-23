import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Breadcrumbs Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/breadcrumbs-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Components' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Breadcrumbs' })).toBeVisible();
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
			await takeScreenshot(`Breadcrumbs - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Breadcrumbs - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
