import { expect, test } from '@playwright/test';
import { axeAudit } from '../fixtures/playwright/axeAudit';

test.describe('Accordion Component', () => {
	test('Basic functionality', async ({ page }) => {
		await page.goto('/accordion-test');
		await expect(page.getByText('These are the details')).toBeVisible();
		await page.getByRole('button', { name: 'This is the summary' }).click();
		await page.getByRole('button', { name: 'This is the 2nd summary' }).click();
		await expect(page.getByText('These are the 2nd details')).toBeVisible();
	});

	axeAudit(
		'Test Accessibility (dark mode)',
		async ({ page, takeScreenshot, bestPractice, wcagA, wcagAA, wcagAAA }) => {
			await page.goto('/accordion-test');

			await takeScreenshot('Accordion (Dark Mode)', '.sui-accordion');

			await bestPractice('.sui-accordion');

			await wcagA('.sui-accordion');

			await wcagAA('.sui-accordion');

			await wcagAAA('.sui-accordion');
		}
	);

	axeAudit(
		'Test Accessibility (light mode)',
		async ({ page, takeScreenshot, bestPractice, wcagA, wcagAA, wcagAAA, switchToLightMode }) => {
			await page.goto('/accordion-test');

			await switchToLightMode();

			await takeScreenshot('Accordion (Light Mode)', '.sui-accordion');

			await bestPractice('.sui-accordion');

			await wcagA('.sui-accordion');

			await wcagAA('.sui-accordion');

			await wcagAAA('.sui-accordion');
		}
	);
});
