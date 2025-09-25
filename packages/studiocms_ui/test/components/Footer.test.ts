import { describe, expect } from 'vitest';
import Footer from '../../src/components/Footer/Footer.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockProps = {
	links: {
		Resources: [
			{ label: 'Documentation', href: '#' },
			{ label: 'Tutorials', href: '#' },
		],
		Legal: [
			{ label: 'Privacy Policy', href: '#' },
			{ label: 'Terms of Service', href: '#' },
		],
	},
	copyright: '© 2024 Your Company. All rights reserved.',
};

const slots = {
	brand: 'YourCompany',
};

describe('Footer Component', () => {
	test('renders Footer component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Footer, 'Footer', { props: mockProps, slots });
		expect(result).toMatchSnapshot();
	});
});
