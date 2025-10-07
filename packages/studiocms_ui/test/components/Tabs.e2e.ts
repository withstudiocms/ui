import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Tabs Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/tabs-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.locator('#basic-test').getByText('Content #1')).toBeVisible();
		await page.locator('#basic-test').getByRole('tab', { name: 'Tab #2' }).click();
		await expect(page.locator('#basic-test').getByText('Content #2')).toBeVisible();
		await page.locator('#basic-test').getByRole('tab', { name: 'Tab #3' }).click();
		await expect(page.locator('#basic-test').getByText('Content #3')).toBeVisible();
	});

	test('Sync functionality', async ({ page }) => {
		await expect(page.getByText('Tab Contents #1 (Sync 1)')).toBeVisible();
		await expect(page.getByText('Tab Contents #3 (Sync 1)')).toBeVisible();
		await page.getByRole('tab', { name: 'Tab #2 (Sync 2)' }).click();
		await expect(page.getByText('Tab Contents #2 (Sync 2)')).toBeVisible();
		await expect(page.getByText('Tab Contents #4 (Sync 2)')).toBeVisible();
		await page.getByRole('tab', { name: 'Tab #3 (Sync 1)' }).click();
		await expect(page.getByText('Tab Contents #1 (Sync 1)')).toBeVisible();
		await expect(page.getByText('Tab Contents #3 (Sync 1)')).toBeVisible();
	});

	test('Nested functionality', async ({ page }) => {
		await expect(page.getByText('Tab Contents #1 (Normal)')).toBeVisible();
		await expect(page.getByRole('tab', { name: 'Tab #1 (Normal)' })).toBeVisible();
		await expect(page.getByRole('tab', { name: 'Tab #2 (Nested)' })).toBeVisible();
		await page.getByRole('tab', { name: 'Tab #2 (Nested)' }).click();
		await expect(page.getByRole('tab', { name: 'Nested Tab #1' })).toBeVisible();
		await expect(page.getByRole('tab', { name: 'Nested Tab #2' })).toBeVisible();
		await expect(page.getByText('Nested Tab Contents #1')).toBeVisible();
		await page.getByRole('tab', { name: 'Nested Tab #2' }).click();
		await expect(page.getByText('Nested Tab Contents #2')).toBeVisible();
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Sync', key: 'sync' },
		{ label: 'Nested', key: 'nested' },
		{ label: 'Variant', key: 'variant' },
	].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`Tabs - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Tabs - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
