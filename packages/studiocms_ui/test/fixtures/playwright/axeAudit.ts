import AxeBuilder from '@axe-core/playwright';
import { test as baseTest, expect } from '@playwright/test';

export { expect };

type Include = Parameters<AxeBuilder['include']>[0];

function buildError(opts: { message: string; theme: string }): string {
	return `Axe Audit (${opts.theme} mode): ${opts.message}`;
}

type AxeAudit = {
	/**
	 * Common accessibility best practices
	 * @see https://www.deque.com/axe/core-documentation/api-documentation
	 */
	bestPractice: (include: Include) => Promise<void>;

	/**
	 * WCAG 2.0 Level A and WCAG 2.1 Level A accessibility standards
	 * @see https://www.deque.com/axe/core-documentation/api-documentation
	 */
	wcagA: (include: Include) => Promise<void>;

	/**
	 * WCAG 2.0 Level AA, WCAG 2.1 Level AA and WCAG 2.2 Level AA accessibility standards
	 * @see https://www.deque.com/axe/core-documentation/api-documentation
	 */
	wcagAA: (include: Include) => Promise<void>;

	/**
	 * WCAG 2.0 Level AAA accessibility standards
	 * @see https://www.deque.com/axe/core-documentation/api-documentation
	 */
	wcagAAA: (include: Include) => Promise<void>;

	/**
	 * Take a screenshot of the page or element
	 */
	takeScreenshot: (name: string, selector?: string) => Promise<void>;

	/**
	 * Switch to light mode
	 */
	switchToLightMode: () => Promise<void>;
};

export const test = baseTest.extend<AxeAudit>({
	bestPractice: async ({ page }, use, testInfo) => {
		const runner = async (include: Include) => {
			const results = await new AxeBuilder({ page })
				.withTags(['best-practice'])
				.include(include)
				.analyze();

			const theme = await page.evaluate(() => {
				return document.documentElement.dataset.theme || 'dark';
			});

			await testInfo.attach(`best-practice-results-${theme}`, {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});

			expect(
				results.violations,
				buildError({ message: 'Best Practice Violations', theme })
			).toEqual([]);
		};

		await use(runner);
	},
	wcagA: async ({ page }, use, testInfo) => {
		const runner = async (include: Include) => {
			const results = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag21a'])
				.include(include)
				.analyze();

			const theme = await page.evaluate(() => {
				return document.documentElement.dataset.theme || 'dark';
			});

			await testInfo.attach(`wcag-a-results-${theme}`, {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});

			expect(results.violations, buildError({ message: 'WCAG A Violations', theme })).toEqual([]);
		};

		await use(runner);
	},
	wcagAA: async ({ page }, use, testInfo) => {
		const runner = async (include: Include) => {
			const results = await new AxeBuilder({ page })
				.withTags(['wcag2aa', 'wcag21aa', 'wcag22aa'])
				.include(include)
				.analyze();

			const theme = await page.evaluate(() => {
				return document.documentElement.dataset.theme || 'dark';
			});

			await testInfo.attach(`wcag-aa-results-${theme}`, {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});

			expect(results.violations, buildError({ message: 'WCAG AA Violations', theme })).toEqual([]);
		};

		await use(runner);
	},
	wcagAAA: async ({ page }, use, testInfo) => {
		const runner = async (include: Include) => {
			const results = await new AxeBuilder({ page })
				.withTags(['wcag2aaa'])
				.include(include)
				.analyze();

			const theme = await page.evaluate(() => {
				return document.documentElement.dataset.theme || 'dark';
			});

			await testInfo.attach(`wcag-aaa-results-${theme}`, {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});

			expect(results.violations, buildError({ message: 'WCAG AAA Violations', theme })).toEqual([]);
		};

		await use(runner);
	},
	takeScreenshot: async ({ page }, use, testInfo) => {
		const screenshot = async (name: string, selector?: string) => {
			const element = selector ? page.locator(selector) : page;
			const body = await element.screenshot();
			const options = { body, contentType: 'image/png' };
			testInfo.attach(name, options);
		};

		await use(screenshot);
	},
	switchToLightMode: async ({ page }, use) => {
		const runner = async () => {
			await page.evaluate(() => {
				const selector = document.documentElement;
				if (selector) selector.dataset.theme = 'light';
			});
		};

		await use(runner);
	},
});
