import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Group Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/group-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Badge 1')).toBeVisible();
		await expect(page.getByText('Badge 2')).toBeVisible();
		await expect(page.getByText('Badge 3')).toBeVisible();
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Button Group', key: 'button-group' },
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
			await takeScreenshot(`Group - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Group - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
