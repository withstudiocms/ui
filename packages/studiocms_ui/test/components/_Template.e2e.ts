import { expect, test } from '@playwright/test';
import { axeAudit } from '../fixtures/playwright/axeAudit';

// This is a placeholder test file. Please copy-paste this file when creating new component tests.
// Then replace all instances of "_Template"/"Template" with the name of the component you are testing.
// Finally, update the test cases below to test the functionality of your component.

test.describe('Template Component', () => {
	test('Basic functionality', async ({ page }) => {
		await page.goto('/template-test');
		await expect(page.getByText('Template Component Test')).toBeVisible();
	});

	axeAudit(
		'Test Accessibility (dark mode)',
		async ({ page, bestPractice, wcagA, wcagAA, wcagAAA, takeScreenshot }) => {
			await page.goto('/template-test');

			await takeScreenshot('Template (Dark Mode)', '.sui-template');

			await bestPractice('.sui-template');
			await wcagA('.sui-template');
			await wcagAA('.sui-template');
			await wcagAAA('.sui-template');
		}
	);

	axeAudit(
		'Test Accessibility (light mode)',
		async ({ page, bestPractice, wcagA, wcagAA, wcagAAA, takeScreenshot, switchToLightMode }) => {
			await page.goto('/template-test');

			await switchToLightMode();

			await takeScreenshot('Template (Light Mode)', '.sui-template');

			await bestPractice('.sui-template');
			await wcagA('.sui-template');
			await wcagAA('.sui-template');
			await wcagAAA('.sui-template');
		}
	);
});
