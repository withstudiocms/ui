import { describe, expect } from 'vitest';
import Modal from '../../src/components/Modal/Modal.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const mockProps = {
	id: 'modal-test',
};

describe('Modal Component', () => {
	test('renders Modal component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Modal, 'Modal', {
			props: mockProps,
			slots: { default: loremIpsum },
		});
		expect(result).toMatchSnapshot();
	});

	test.for([{ size: 'sm' }, { size: 'md' }, { size: 'lg' }])(
		'renders Modal with size "%s"',
		async (props, { renderComponent }) => {
			const result = await renderComponent(Modal, 'Modal', {
				props: { ...mockProps, ...props },
				slots: { default: loremIpsum },
			});
			expect(result).toMatchSnapshot();
		}
	);
});
