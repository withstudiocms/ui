import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Badge Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/badge-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('img')).toBeVisible();
		await expect(page.getByText('Test Badge')).toBeVisible();
		await expect(page.locator('#basic-test')).toContainText('Test Badge');
	});

	test('Test Accessibility - Basic Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Badge - basic (Dark Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Badge - basic (Light Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');
	});

	test('Test Accessibility - Color Variant Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Badge - colors (Dark Mode)', '#color-test');

		await bestPractice('#color-test');
		await wcagA('#color-test');
		await wcagAA('#color-test');
		await wcagAAA('#color-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Badge - colors (Light Mode)', '#color-test');

		await bestPractice('#color-test');
		await wcagA('#color-test');
		await wcagAA('#color-test');
		await wcagAAA('#color-test');
	});

	test('Test Accessibility - Variant Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Badge - variants (Dark Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Badge - variants (Light Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');
	});
});
