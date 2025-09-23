import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Button Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/button-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Button Component Test' })).toBeVisible();
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Variant', key: 'variant' },
		{ label: 'Polymorphic', key: 'polymorphic' },
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
			await takeScreenshot(`Button - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Button - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
