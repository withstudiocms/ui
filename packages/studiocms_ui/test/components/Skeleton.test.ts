import { describe, expect } from 'vitest';
import Skeleton from '../../src/components/Skeleton/Skeleton.astro';
import { test } from '../fixtures/vitest/AstroContainer';

describe('Skeleton Component', () => {
	test('renders Skeleton component correctly', async ({ renderComponent }) => {
		const result = await renderComponent(Skeleton, 'Skeleton', { props: { variant: 'card' } });
		expect(result).toMatchSnapshot();
	});

	test.for([
		{ variant: 'text' },
		{ variant: 'circle', width: '50%', height: '8rem' },
		{ variant: 'block', width: '100px', height: '100px' },
	])('renders Skeleton component with variant: $variant', async (props, { renderComponent }) => {
		const result = await renderComponent(Skeleton, 'Skeleton', {
			props,
		});
		expect(result).toMatchSnapshot();
	});
});
