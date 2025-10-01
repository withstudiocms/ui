import { describe, expect } from 'vitest';
import Dropdown from '../../src/components/Dropdown/Dropdown.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	id: 'dropdown',
	options: [
		{ label: 'Default', value: 'default', color: 'default' },
		{ label: 'Primary', value: 'primary', color: 'primary' },
		{ label: 'Success', value: 'success', color: 'success' },
		{ label: 'Warning', value: 'warning', color: 'warning' },
		{ label: 'Danger', value: 'danger', color: 'danger' },
		{ label: 'Info', value: 'info', color: 'info' },
		{ label: 'Monochrome', value: 'mono', color: 'mono' },
		{ label: 'Disabled', value: 'disabled', disabled: true },
		{ label: 'As Link', value: 'custom-href', href: '/' },
	],
};

describe('Dropdown Component', () => {
	test('renders Dropdown component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Dropdown, 'Dropdown', { props: mockProps });
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ disabled: true },
		{ align: 'start' },
		{ align: 'center' },
		{ align: 'end' },
		{ triggerOn: 'left' },
		{ triggerOn: 'right' },
		{ triggerOn: 'both' },
		{ offset: 0 },
		{ offset: 10 },
	])('renders Dropdown component with props "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(Dropdown, 'Dropdown', {
			props: { ...mockProps, ...props },
		});
		expect(result).toMatchSnapshot();
	});
});
