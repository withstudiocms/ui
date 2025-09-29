// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from 'vitest';
import {
	default as DevToolbarColorPicker,
} from '../../src/toolbar/ColorPicker';

describe('DevToolbarColorPicker', () => {
	let devToolbarColorPicker: DevToolbarColorPicker;

	beforeAll(() => {
		customElements.define('dev-toolbar-color-picker', DevToolbarColorPicker);
	});

	it('sets and gets color correctly', () => {
		devToolbarColorPicker = new DevToolbarColorPicker();
		devToolbarColorPicker.setColor("#bd0249");

		expect(devToolbarColorPicker.getColor()).toBe("#bd0249");
	});

	it('gets a color even when not set beforehand', () => {
		devToolbarColorPicker = new DevToolbarColorPicker();

		expect(devToolbarColorPicker.getColor()).toBe("#000000");
	});

	it('sets the correct color in the dataset', () => {
		devToolbarColorPicker = new DevToolbarColorPicker();
		devToolbarColorPicker.setColor("#bd0249");

		expect(devToolbarColorPicker.dataset.color).toBe("#bd0249");
	});
});
