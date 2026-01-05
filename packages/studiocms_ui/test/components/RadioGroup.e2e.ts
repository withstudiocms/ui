import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('RadioGroup Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/radio-group-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Label')).toBeVisible();
		await expect(page.locator('#basic-test label').filter({ hasText: 'Option 1' })).toBeVisible();
		await expect(page.locator('label').filter({ hasText: 'Option 2' })).toBeVisible();
		await page.locator('#basic-test').getByRole('radio', { name: 'Option 1' }).click();
		await page.getByRole('radio', { name: 'Option 2' }).click();
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Color', key: 'color' },
	].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`RadioGroup - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`RadioGroup - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
