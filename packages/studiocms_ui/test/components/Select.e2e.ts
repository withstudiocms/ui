import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Select Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/select-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(
			page.locator('#basic-test').getByRole('combobox', { name: 'Select' })
		).toBeVisible();
		await page.locator('#basic-test').getByRole('combobox', { name: 'Select' }).click();
		await expect(page.getByRole('option', { name: 'Option 1' })).toBeVisible();
		await expect(page.getByRole('option', { name: 'Option 2' })).toBeVisible();
		await expect(page.getByRole('option', { name: 'Option 3' })).toBeVisible();
		await page.getByRole('option', { name: 'Option 3' }).click();
		await expect(page.locator('#basic-test')).toContainText('Option 3');
	});

	test('Multiple functionality', async ({ page }) => {
		await expect(
			page.locator('#multiple-test').getByRole('combobox', { name: 'Select' })
		).toBeVisible();
		await expect(page.locator('#multiple-test')).toContainText('Option 1');
		await expect(page.locator('#multiple-test')).toContainText('Option 3');
		await page.locator('#multiple-test').getByRole('combobox', { name: 'Select' }).click();
		await page.getByRole('option', { name: 'Option 1' }).click();
		await page.getByRole('option', { name: 'Option 2' }).click();
		await page.getByRole('option', { name: 'Option 3' }).click();
		await page.getByRole('option', { name: 'Option 4' }).click();
		await page.getByRole('option', { name: 'Option 5' }).click();
		await page.locator('html').click();
		await expect(page.locator('#multiple-test')).toContainText('Option 2');
		await expect(page.locator('#multiple-test')).toContainText('Option 4');
		await expect(page.locator('#multiple-test')).toContainText('Option 5');
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Multiple', key: 'multiple' },
	].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`Select - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Select - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
