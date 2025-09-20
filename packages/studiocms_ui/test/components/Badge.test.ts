import { describe, expect } from 'vitest';
import Badge from '../../src/components/Badge/Badge.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Badge Component', () => {
	test('renders Badge component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Badge, 'Badge', { props: { label: 'Test Badge' } });
		expect(result).toMatchSnapshot();
	});

	test('renders Badge component with different colors', async ({ renderComponent }) => {
		const colors = ['primary', 'success', 'warning', 'danger', 'info', 'mono'];

		for (const color of colors) {
			const result = await renderComponent(Badge, `Badge-${color}`, {
				props: { label: `Badge ${color}`, color },
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Badge component with different sizes', async ({ renderComponent }) => {
		const sizes = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const result = await renderComponent(Badge, `Badge-${size}`, {
				props: { label: `Badge ${size}`, size },
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Badge component with different variants', async ({ renderComponent }) => {
		const variants = ['default', 'flat', 'outline'];

		for (const variant of variants) {
			const result = await renderComponent(Badge, `Badge-${variant}`, {
				props: { label: `Badge ${variant}`, variant },
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Badge component with icon', async ({ renderComponent }) => {
		const positions = [undefined, 'left', 'right'];

		for (const position of positions) {
			const result = await renderComponent(Badge, `Badge-with-icon-${position || 'default'}`, {
				props: {
					label: `Badge with Icon ${position || 'default'}`,
					icon: 'heroicons:academic-cap',
					iconPosition: position,
				},
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Badge component with different rounding', async ({ renderComponent }) => {
		const roundings = [undefined, 'full', 'semi'];

		for (const rounding of roundings) {
			const result = await renderComponent(Badge, `Badge-rounding-${rounding || 'default'}`, {
				props: { label: `Badge ${rounding || 'default'}`, rounding },
			});
			expect(result).toMatchSnapshot();
		}
	});
});
