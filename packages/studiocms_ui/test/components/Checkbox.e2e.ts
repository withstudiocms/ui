import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Checkbox Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/checkbox-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Label')).toBeVisible();
		await page.getByRole('checkbox', { name: 'Label' }).click();
		await expect(page.getByRole('checkbox', { name: 'Label' })).toBeChecked();
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Color', key: 'color' },
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
			await takeScreenshot(`Checkbox - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Checkbox - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
