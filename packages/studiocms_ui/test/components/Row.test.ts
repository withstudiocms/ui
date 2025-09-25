import { describe, expect } from 'vitest';
import Row from '../../src/components/Row/Row.astro';
import { test } from '../fixtures/vitest/AstroContainer';

const mockContent = '<span>Small Row</span> <span>Small Row</span> <span>Small Row</span>';

describe('Row Component', () => {
	test('renders Row component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Row, 'Row', { slots: { default: mockContent } });
		expect(result).toMatchSnapshot();
	});

	test.for([{ alignCenter: true }, { gap: 'sm' }, { gap: 'md' }, { gap: 'lg' }])(
		'renders Row with props: "%s"',
		async (props, { renderComponent }) => {
			const result = await renderComponent(Row, 'Row', { props, slots: { default: mockContent } });
			expect(result).toMatchSnapshot();
		}
	);
});
