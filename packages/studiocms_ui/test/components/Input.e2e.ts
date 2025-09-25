import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Input Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/input-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Basic Input')).toBeVisible();
		await expect(page.getByText('This is some text to help the')).toBeVisible();
		await page.getByRole('textbox', { name: 'Basic Input This is some text' }).click();
		await page.getByRole('textbox', { name: 'Basic Input This is some text' }).fill('Hello World!');
		await expect(page.getByRole('textbox', { name: 'Basic Input This is some text' })).toHaveValue(
			'Hello World!'
		);
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'With Icon', key: 'icon' },
	].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`Input - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Input - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
