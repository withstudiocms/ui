import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Breadcrumbs Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/breadcrumbs-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Components' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Breadcrumbs' })).toBeVisible();
	});

	test('Test Accessibility', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Template (Dark Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Template (Light Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');
	});
});
