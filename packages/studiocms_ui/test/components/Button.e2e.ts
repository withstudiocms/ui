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
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`Button - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});

		test(`Test Accessibility - ${label} Styling (Light Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
			switchToLightMode,
		}) => {
			// Ensure we are in light mode
			await switchToLightMode();

			await takeScreenshot(`Button - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
