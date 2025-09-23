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

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Variant', key: 'variant' },
	].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		// Placeholder for more tests
		test(`Test Accessibility - ${label} Styling`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
			switchToLightMode,
		}) => {
			await takeScreenshot(`Accordion - ${key} (Dark Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);

			// Switch to light mode and re-test
			await switchToLightMode();

			await takeScreenshot(`Accordion - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
