import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Sidebar (double) Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/sidebar-double-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.locator('#sui-sidebar-outer')).toBeVisible();
		await expect(page.locator('#sui-sidebar-inner')).toBeVisible();
		await expect(page.locator('#sui-sidebar-outer')).toContainText(
			'This is some outer sidebar content.'
		);
		await expect(page.locator('#sui-sidebar-inner')).toContainText(
			'This is some inner sidebar content.'
		);
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
			await takeScreenshot(`Sidebar (double) - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Sidebar (double) - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
