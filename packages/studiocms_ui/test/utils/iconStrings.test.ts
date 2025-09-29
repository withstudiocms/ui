import { describe, expect, it } from 'vitest';
import { getIconString, type ValidIconString } from '../../src/utils/iconStrings';

const icons: ValidIconString[] = [
	'check-circle',
	'exclamation-triangle',
	'exclamation-circle',
	'information-circle',
	'x-mark',
];

describe('getIconString', () => {
	it('should replace %class%, %width%, and %height% in the SVG string', () => {
		const icon = 'check-circle';
		const classes = 'my-icon';
		const width = 32;
		const height = 32;
		const result = getIconString(icon, classes, width, height);

		expect(result).toContain(`class="${classes}"`);
		expect(result).toContain(`width="${width}"`);
		expect(result).toContain(`height="${height}"`);
		expect(result.startsWith('<svg')).toBe(true);
		expect(result.endsWith('</svg>')).toBe(true);
	});

	it('should return correct SVG for each ValidIconString', () => {
		icons.forEach((icon) => {
			const result = getIconString(icon, 'cls', 24, 24);
			expect(result).toContain(`class="cls"`);
			expect(result).toContain(`width="24"`);
			expect(result).toContain(`height="24"`);
			expect(result.startsWith('<svg')).toBe(true);
			expect(result.endsWith('</svg>')).toBe(true);
		});
	});

	it('should handle different class, width, and height values', () => {
		const result = getIconString('x-mark', 'custom-class', 48, 12);
		expect(result).toContain('class="custom-class"');
		expect(result).toContain('width="48"');
		expect(result).toContain('height="12"');
	});
});
