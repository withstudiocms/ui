import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Skeleton Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/skeleton-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.locator('#basic-test div').first()).toBeVisible();
		await expect(page.locator('#basic-test div').nth(1)).toBeVisible();
		await expect(page.locator('#basic-test div').nth(2)).toBeVisible();
		await expect(page.locator('#basic-test div').nth(3)).toBeVisible();
	});

	[
		{ label: 'Basic', key: 'basic' },
		{ label: 'Variant', key: 'variant' },
		{ label: 'Width/Height', key: 'width-height' },
		{ label: 'Radius', key: 'radius' },
		{ label: 'Direction', key: 'direction' },
		{ label: 'Horizontal Alignment', key: 'horizontal-alignment' },
		{ label: 'Vertical Alignment', key: 'vertical-alignment' },
		{ label: 'Gap', key: 'gap' },
	].forEach(({ label, key }) => {
		const elmKey = `#${key}-test`;
		test(`Test Accessibility - ${label} Styling (Dark Mode)`, async ({
			bestPractice,
			wcagA,
			wcagAA,
			wcagAAA,
			takeScreenshot,
		}) => {
			await takeScreenshot(`Skeleton - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Skeleton - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
