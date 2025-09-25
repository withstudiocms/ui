// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Theme, ThemeHelper } from '../../src/utils/ThemeHelper';

function createThemeProvider() {
	const el = document.createElement('div');
	document.body.appendChild(el);
	return el;
}

// Mock window.matchMedia globally for all tests
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
	matches: query === '(prefers-color-scheme: dark)',
	media: query,
	onchange: null,
	addListener: vi.fn(), // deprecated
	removeListener: vi.fn(), // deprecated
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
}));

describe('ThemeHelper', () => {
	let themeProvider: HTMLElement;
	let themeHelper: ThemeHelper;

	beforeEach(() => {
		// Setup window.matchMedia mock before creating ThemeHelper
		vi.stubGlobal('matchMedia', mockMatchMedia);
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: mockMatchMedia,
		});

		themeProvider = createThemeProvider();
		themeHelper = new ThemeHelper(themeProvider);
		themeProvider.dataset.theme = 'system';
		localStorage.clear();

		// Reset mock calls after setup
		mockMatchMedia.mockClear();
	});

	it('should initialize with system theme by default', () => {
		expect(themeHelper.getTheme()).toBe('system');
	});

	it('should set and get theme correctly', () => {
		themeHelper.setTheme('dark');
		expect(themeHelper.getTheme()).toBe('dark');
		themeHelper.setTheme('light');
		expect(themeHelper.getTheme()).toBe('light');
		themeHelper.setTheme('system');
		expect(themeHelper.getTheme()).toBe('system');
	});

	it('should resolve system theme to dark or light based on matchMedia', () => {
		mockMatchMedia.mockImplementation((query: string) => ({
			matches: query === '(prefers-color-scheme: dark)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));
		themeHelper.setTheme('system');
		expect(themeHelper.getTheme(true)).toBe('dark');

		mockMatchMedia.mockImplementation((query: string) => ({
			matches: query === '(prefers-color-scheme: light)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));
		expect(themeHelper.getTheme(true)).toBe('light');
	});

	it('should throw error if matchMedia is not supported', () => {
		// Temporarily remove matchMedia to test error case
		const originalMatchMedia = window.matchMedia;
		// @ts-expect-error - Intentionally setting to undefined to test error case
		window.matchMedia = undefined;

		themeHelper.setTheme('system');
		expect(() => themeHelper.getTheme(true)).toThrow();

		// Restore matchMedia
		window.matchMedia = originalMatchMedia;
	});

	it('should toggle theme from dark to light and vice versa', () => {
		themeHelper.setTheme('dark');
		themeHelper.toggleTheme();
		expect(themeHelper.getTheme()).toBe('light');
		themeHelper.toggleTheme();
		expect(themeHelper.getTheme()).toBe('dark');
	});

	it('should toggle theme when system is set', () => {
		mockMatchMedia.mockImplementation((query: string) => ({
			matches: query === '(prefers-color-scheme: dark)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));
		themeHelper.setTheme('system');
		themeHelper.toggleTheme();
		expect(themeHelper.getTheme()).toBe('light');
	});

	it('should register toggle and respond to click', () => {
		const toggle = document.createElement('button');
		themeHelper.setTheme('dark');
		themeHelper.registerToggle(toggle);
		toggle.click();
		expect(themeHelper.getTheme()).toBe('light');
		toggle.click();
		expect(themeHelper.getTheme()).toBe('dark');
	});

	it('should not register toggle if element is null', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		themeHelper.registerToggle(null);
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
	});

	it('should call theme change callbacks on theme change', async () => {
		let called = false;
		themeHelper.onThemeChange((newTheme, _oldTheme) => {
			called = true;
			expect(newTheme).toBe('light');
		});
		themeHelper.setTheme('dark');
		themeHelper.setTheme('light');
		// Simulate mutation observer callback by directly triggering the change
		// Instead of calling the private method, we'll simulate the mutation observer trigger
		// by changing the dataset and waiting for the observer
		themeProvider.dataset.theme = 'light';

		// Wait a bit for the mutation observer to trigger
		await new Promise((resolve) => setTimeout(resolve, 10));

		// Manually trigger the change by setting theme again to ensure callback is called
		themeHelper.setTheme('dark');
		themeHelper.setTheme('light');

		expect(called).toBe(true);
	});

	it('should set theme in localStorage if starlight-theme exists', () => {
		localStorage.setItem('starlight-theme', 'dark');
		themeHelper.setTheme('light');
		expect(localStorage.getItem('starlight-theme')).toBe('light');
		themeHelper.setTheme('system');
		expect(localStorage.getItem('starlight-theme')).toBe('');
	});
});
