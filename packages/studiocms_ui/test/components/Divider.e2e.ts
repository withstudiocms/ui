import { expect, test } from '../fixtures/playwright/axeAudit';

// This is a placeholder test file. Please copy-paste this file when creating new component tests.
// Then replace all instances of "_Template"/"Template" with the name of the component you are testing.
// Finally, update the test cases below to test the functionality of your component.

test.describe('Divider Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/divider-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Divider')).toBeVisible();
		await page.locator('div').nth(1).click();
		await expect(page.locator('#basic-test')).toContainText('Divider');
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
			await takeScreenshot(`Divider - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Divider - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
