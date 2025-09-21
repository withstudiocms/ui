import { expect, test } from '../fixtures/playwright/axeAudit';

// This is a placeholder test file. Please copy-paste this file when creating new component tests.
// Then replace all instances of "_Template"/"Template" with the name of the component you are testing.
// Finally, update the test cases below to test the functionality of your component.

test.describe('Template Component', () => {
	test.beforeAll(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/template-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Template Component Test')).toBeVisible();
	});

	test('Test Accessibility', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Template (Dark Mode)', '.sui-template');

		await bestPractice('.sui-template');
		await wcagA('.sui-template');
		await wcagAA('.sui-template');
		await wcagAAA('.sui-template');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Template (Light Mode)', '.sui-template');

		await bestPractice('.sui-template');
		await wcagA('.sui-template');
		await wcagAA('.sui-template');
		await wcagAAA('.sui-template');
	});
});
