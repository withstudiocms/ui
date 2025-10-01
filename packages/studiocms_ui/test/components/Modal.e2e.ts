import { expect, test } from '../fixtures/playwright/axeAudit';

test.describe('Modal Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the test page for this component
		await page.goto('/modal-test');
	});

	test('Basic functionality', async ({ page }) => {
		await expect(page.getByRole('button', { name: 'Modal Trigger' })).toBeVisible();
		await page.getByRole('button', { name: 'Modal Trigger' }).click();
		await expect(page.getByRole('heading', { name: 'Modal Test' })).toBeVisible();
		await expect(page.locator('#modal-btn-x')).toBeVisible();
		await expect(page.getByText('Modal Test Lorem ipsum dolor')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
		await page.getByRole('button', { name: 'Confirm' }).click();
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
			await takeScreenshot(`Modal - ${key} (Dark Mode)`, elmKey);

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

			await takeScreenshot(`Modal - ${key} (Light Mode)`, elmKey);

			await bestPractice(elmKey);
			await wcagA(elmKey);
			await wcagAA(elmKey);
			await wcagAAA(elmKey);
		});
	});
});
