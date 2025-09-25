import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Dropdown Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/dropdown-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Trigger Dropdown' })).toBeVisible();
		await page.getByRole('button', { name: 'Trigger Dropdown' }).click();
		await expect(page.getByRole('option', { name: 'Option 1' }).locator('div')).toBeVisible();
		await expect(page.getByRole('option', { name: 'Option 2' }).locator('div')).toBeVisible();
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
			await takeScreenshot(`Dropdown - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Dropdown - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
