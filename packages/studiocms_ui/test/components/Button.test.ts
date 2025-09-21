import type { ComponentProps } from 'astro/types';
import { describe, expect } from 'vitest';
import Button from '../../src/components/Button/Button.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Button Component', () => {
	test('renders Button component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Button, 'Button', { slots: { default: 'Test Button' } });
		expect(result).toMatchSnapshot();
	});

	test('renders Button component with different sizes', async ({ renderComponent }) => {
		const sizeVariants: ComponentProps<typeof Button>[] = [
			{ size: 'sm' },
			{ size: 'md' },
			{ size: 'lg' },
		];

		for (const props of sizeVariants) {
			const result = await renderComponent(Button, 'Button', {
				props,
				slots: { default: 'Test Button' },
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Button component with different colors', async ({ renderComponent }) => {
		const colorVariants: ComponentProps<typeof Button>[] = [
			{ color: 'primary' },
			{ color: 'default' },
			{ color: 'success' },
			{ color: 'danger' },
			{ color: 'warning' },
			{ color: 'info' },
			{ color: 'mono' },
		];

		for (const props of colorVariants) {
			const result = await renderComponent(Button, 'Button', {
				props,
				slots: { default: 'Test Button' },
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Button component with different variants', async ({ renderComponent }) => {
		const variantVariants: ComponentProps<typeof Button>[] = [
			{ variant: 'solid' },
			{ variant: 'outlined' },
			{ variant: 'flat' },
		];

		for (const props of variantVariants) {
			const result = await renderComponent(Button, 'Button', {
				props,
				slots: { default: 'Test Button' },
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Button component with miscellaneous props', async ({ renderComponent }) => {
		const miscVariants: ComponentProps<typeof Button>[] = [
			{ fullWidth: true },
			{ disabled: true },
			{ as: 'a', href: 'https://example.com' },
		];

		for (const props of miscVariants) {
			const result = await renderComponent(Button, 'Button', {
				props,
				slots: { default: 'Test Button' },
			});
			expect(result).toMatchSnapshot();
		}
	});

	test('renders Button with different slots', async ({ renderComponent }) => {
		const slots: { name: string; content: string }[] = [
			{ name: 'default', content: 'Default Slot' },
			{ name: 'start-content', content: 'Prefix Slot' },
			{ name: 'end-content', content: 'Suffix Slot' },
		];

		for (const slot of slots) {
			const result = await renderComponent(Button, 'Button', {
				slots: { [slot.name]: slot.content },
			});
			expect(result).toMatchSnapshot();
		}
	});
});
