// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
	type default as DevToolbarColorPicker,
	hex2rgb,
	hsl2rgb,
	hueToRgb,
	rgb2hex,
	rgb2hsl,
} from '../../src/toolbar/ColorPicker';

describe('Color conversion functions', () => {
	it('hex2rgb converts hex to rgb', () => {
		expect(hex2rgb('#ff0000')).toEqual([255, 0, 0]);
		expect(hex2rgb('#00ff00')).toEqual([0, 255, 0]);
		expect(hex2rgb('#0000ff')).toEqual([0, 0, 255]);
		expect(hex2rgb('#123456')).toEqual([18, 52, 86]);
	});

	it('rgb2hex converts rgb to hex', () => {
		expect(rgb2hex([255, 0, 0])).toBe('#ff0000');
		expect(rgb2hex([0, 255, 0])).toBe('#00ff00');
		expect(rgb2hex([0, 0, 255])).toBe('#0000ff');
		expect(rgb2hex([18, 52, 86])).toBe('#123456');
	});

	it('hsl2rgb converts hsl to rgb', () => {
		expect(hsl2rgb([0, 100, 50])).toEqual([255, 0, 0]); // red
		expect(hsl2rgb([120, 100, 50])).toEqual([0, 255, 0]); // green
		expect(hsl2rgb([240, 100, 50])).toEqual([0, 0, 255]); // blue
		expect(hsl2rgb([0, 0, 50])).toEqual([128, 128, 128]); // gray
	});

	it('rgb2hsl converts rgb to hsl', () => {
		expect(rgb2hsl([255, 0, 0]).map(Math.round)).toEqual([0, 100, 50]);
		expect(rgb2hsl([0, 255, 0]).map(Math.round)).toEqual([120, 100, 50]);
		expect(rgb2hsl([0, 0, 255]).map(Math.round)).toEqual([240, 100, 50]);
		expect(rgb2hsl([128, 128, 128]).map(Math.round)).toEqual([0, 0, 50]);
	});

	it('hueToRgb returns correct values for known inputs', () => {
		expect(Math.round(hueToRgb(0, 1, 1 / 6) * 100)).toBe(100);
		expect(Math.round(hueToRgb(0, 1, 0.5) * 100)).toBe(100);
		expect(Math.round(hueToRgb(0, 1, 2 / 3) * 100)).toBe(0);
	});
});

// TODO @louisescher please do this
describe.todo('DevToolbarColorPicker', () => {
	let colorPicker: DevToolbarColorPicker;
	it.todo('sets and gets color correctly', () => {});
});
