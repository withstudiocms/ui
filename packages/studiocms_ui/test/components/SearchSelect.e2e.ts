import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('SearchSelect Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/search-select-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.locator('#basic-test').getByText('Searchable Select Element')).toBeVisible();
		await expect(
			page.getByRole('combobox', { name: 'Searchable Select Element', exact: true })
		).toBeVisible();
		await page.getByRole('combobox', { name: 'Searchable Select Element', exact: true }).click();
		await page.getByRole('option', { name: 'Option 2' }).click();
	});

	test('Multi-Select functionality', async ({ page }) => {
		await expect(page.getByText('Multi-Searchable Select')).toBeVisible();
		await expect(page.getByRole('combobox', { name: 'Multi-Searchable Select' })).toBeVisible();
		await expect(page.locator('#multi-select-container')).toContainText('Option 1');
		await expect(page.locator('#multi-select-container')).toContainText('Option 2');
		await expect(page.locator('#multi-select-container')).toContainText('Option 3');
		await page.getByRole('combobox', { name: 'Multi-Searchable Select' }).click();
		await page.getByRole('combobox', { name: 'Multi-Searchable Select' }).fill('1');
		await expect(page.getByRole('option', { name: 'Option 10' })).toBeVisible();
		await expect(page.getByRole('option', { name: 'Option 11' })).toBeVisible();
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Multi-Select', key: 'multi-select' },
	].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`SearchSelect - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`SearchSelect - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
