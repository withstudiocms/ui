import { describe, expect } from 'vitest';
import Toggle from '../../src/components/Toggle/Toggle.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	label: 'Toggle Label',
	name: 'toggle',
};

describe('Toggle Component', () => {
	test('renders Toggle component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Toggle, 'Toggle', { props: mockProps });
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ size: 'sm' },
		{ size: 'md' },
		{ size: 'lg' },
		{ disabled: true },
		{ defaultChecked: true },
		{ isRequired: true },
		{ color: 'primary' },
		{ color: 'default' },
		{ color: 'success' },
		{ color: 'danger' },
		{ color: 'warning' },
		{ color: 'info' },
		{ color: 'mono' },
	])('renders Toggle component with various props: %o', async (props, { renderComponent }) => {
		const result = await renderComponent(Toggle, 'Toggle', { props: { ...mockProps, ...props } });
		expect(result).toMatchSnapshot();
	});
});
