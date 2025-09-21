import { describe, expect } from 'vitest';
import Textarea from '../../src/components/Textarea/Textarea.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	name: 'textarea',
};

describe('Textarea Component', () => {
	test('renders Textarea component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Textarea, 'Textarea', { props: mockProps });
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ ...mockProps, label: 'Textarea Label' },
		{ ...mockProps, placeholder: 'Enter text here...' },
		{ ...mockProps, isRequired: true, label: 'Required Textarea' },
		{ ...mockProps, disabled: true, label: 'Disabled Textarea' },
	])('renders Textarea with different props "%s"', async (props, { renderComponent }) => {
		const result = await renderComponent(Textarea, 'Textarea', { props });
		expect(result).toMatchSnapshot();
	});
});
