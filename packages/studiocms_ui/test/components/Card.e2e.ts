import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Card Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/card-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Content', { exact: true })).toBeVisible();
		await expect(page.locator('#basic-test')).toContainText('Content');
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Variant', key: 'variant' },
		{ label: 'Slot', key: 'slot' },
		{ label: 'Polymorphic', key: 'polymorphic' },
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
			await takeScreenshot(`Card - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Card - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
