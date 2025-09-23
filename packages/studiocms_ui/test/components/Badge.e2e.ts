import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Badge Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/badge-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('img')).toBeVisible();
		await expect(page.getByText('Test Badge')).toBeVisible();
		await expect(page.locator('#basic-test')).toContainText('Test Badge');
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Variant', key: 'variant' },
		{ label: 'Colors', key: 'color' },
	].forEach(({ label, key }) => {
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
			await takeScreenshot(`Badge - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Badge - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
