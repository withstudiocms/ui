import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Textarea Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/textarea-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Label')).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Label' })).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Label' })).toBeEmpty();
		await page.getByRole('textbox', { name: 'Label' }).click();
		await page.getByRole('textbox', { name: 'Label' }).fill('Hello world!');
		await page.locator('#basic-test').click();
		await expect(page.getByRole('textbox', { name: 'Label' })).toHaveValue('Hello world!');
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
			await takeScreenshot(`Textarea - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Textarea - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
