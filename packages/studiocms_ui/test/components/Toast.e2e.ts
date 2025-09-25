import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Toast Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/toast-test');
	});

	test('Basic functionality', async ({ page }) => {
		await page.getByRole('button', { name: 'Show Toast' }).click();
		await expect(page.getByRole('alert', { name: 'This is a toast! (F8)' })).toBeVisible();
		await expect(page.getByLabel('This is a toast! (F8)')).toContainText('This is a toast!');
		await expect(page.getByLabel('This is a toast! (F8)')).toContainText('Hi there!');
		await page.getByRole('button', { name: 'Close toast' }).click();
	});

	[{ label: 'Basic', key: 'basic' }].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`Toast - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Toast - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
