import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Accordion Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/accordion-test');
	});

	test('Test Functionality', async ({ page }) => {
		await expect(page.locator('#basic-test').getByText('These are the details')).toBeVisible();
		await page
			.locator('#basic-test')
			.getByRole('button', { name: 'This is the 2nd summary' })
			.click();
		await expect(page.locator('#basic-test').getByText('These are the 2nd details')).toBeVisible();
	});

	test('Test Accessibility - Basic Styling', async ({
		takeScreenshot,
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		switchToLightMode,
	}) => {
		// Dark mode
		await takeScreenshot('Accordion - basic (Dark Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');

		// Light mode
		await switchToLightMode();

		await takeScreenshot('Accordion - basic (Light Mode)', '#basic-test');

		await bestPractice('#basic-test');
		await wcagA('#basic-test');
		await wcagAA('#basic-test');
		await wcagAAA('#basic-test');
	});

	test('Test Accessibility - Variant Styling', async ({
		takeScreenshot,
		bestPractice,
		wcagA,
		wcagAA,
		wcagAAA,
		switchToLightMode,
	}) => {
		// Dark mode
		await takeScreenshot('Accordion - variant (Dark Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');

		// Light mode
		await switchToLightMode();

		await takeScreenshot('Accordion - variant (Light Mode)', '#variant-test');

		await bestPractice('#variant-test');
		await wcagA('#variant-test');
		await wcagAA('#variant-test');
		await wcagAAA('#variant-test');
	});
});
