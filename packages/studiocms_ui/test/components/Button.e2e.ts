import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Button Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/button-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Button Component Test' })).toBeVisible();
	});

	test('Test Accessibility - Basic Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Button - basic (Dark Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Button - basic (Light Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');
	});

	test('Test Accessibility - Colors Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Button - colors (Dark Mode)', '#color-test');

		await bestPractice('#color-test');
		await wcagA('#color-test');
		await wcagAA('#color-test');
		await wcagAAA('#color-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Button - colors (Light Mode)', '#color-test');

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
		await takeScreenshot('Button - variant (Dark Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Button - variant (Light Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');
	});

	test('Test Accessibility - Polymorphic Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Button - polymorphic (Dark Mode)', '#polymorphic-test');

		await bestPractice('#polymorphic-test');
		await wcagA('#polymorphic-test');
		await wcagAA('#polymorphic-test');
		await wcagAAA('#polymorphic-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Button - polymorphic (Light Mode)', '#polymorphic-test');

		await bestPractice('#polymorphic-test');
		await wcagA('#polymorphic-test');
		await wcagAA('#polymorphic-test');
		await wcagAAA('#polymorphic-test');
	});
});
