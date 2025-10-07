import { describe, expect } from 'vitest';
import Select from '../../src/components/Select/Select.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	name: 'select',
	label: 'Select Element',
	options: [
		{ label: 'Option 1', value: 'opt-1' },
		{ label: 'Option 2', value: 'opt-2' },
		{ label: 'Option 3', value: 'opt-3' },
	],
};

describe('Select Component', () => {
	test('renders Select component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Select, 'Select', { props: mockProps });
		expect(result).toMatchSnapshot();
	});
});
