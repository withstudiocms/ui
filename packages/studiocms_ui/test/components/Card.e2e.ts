import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Card Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/card-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByText('Content', { exact: true })).toBeVisible();
		await expect(page.locator('#basic-test')).toContainText('Content');
	});

	test('Test Accessibility - Basic Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Card - basic (Dark Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Card - basic (Light Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');
	});

	test('Test Accessibility - Variant Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Card - variant (Dark Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Card - variant (Light Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');
	});

	test('Test Accessibility - Slot Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Card - slot (Dark Mode)', '#slot-test');

		await bestPractice('#slot-test');
		await wcagA('#slot-test');
		await wcagAA('#slot-test');
		await wcagAAA('#slot-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Card - slot (Light Mode)', '#slot-test');

		await bestPractice('#slot-test');
		await wcagA('#slot-test');
		await wcagAA('#slot-test');
		await wcagAAA('#slot-test');
	});

	test('Test Accessibility - Polymorphic Styling', async ({
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		takeScreenshot,
		switchToLightMode,
	}) => {
		await takeScreenshot('Card - polymorphic (Dark Mode)', '#polymorphic-test');

		await bestPractice('#polymorphic-test');
		await wcagA('#polymorphic-test');
		await wcagAA('#polymorphic-test');
		await wcagAAA('#polymorphic-test');

		// Switch to light mode and re-test
		await switchToLightMode();

		await takeScreenshot('Card - polymorphic (Light Mode)', '#polymorphic-test');

		await bestPractice('#polymorphic-test');
		await wcagA('#polymorphic-test');
		await wcagAA('#polymorphic-test');
		await wcagAAA('#polymorphic-test');
	});
});
