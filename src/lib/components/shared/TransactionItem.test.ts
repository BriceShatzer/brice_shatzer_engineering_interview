import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TransactionItem from './TransactionItem.svelte';

describe('TransactionItem', () => {
	it('should render the title and meta text', () => {
		render(TransactionItem, { props: { title: 'Grocery Store', meta: 'Dec 14 · Everyday Checking', amount: -82.45 } });
		expect(screen.getByText('Grocery Store')).toBeInTheDocument();
		expect(screen.getByText('Dec 14 · Everyday Checking')).toBeInTheDocument();
	});

	it('should display a negative amount with a minus sign', () => {
		render(TransactionItem, { props: { title: 'Coffee', meta: 'Dec 12', amount: -5.75 } });
		expect(screen.getByText('-$5.75')).toBeInTheDocument();
	});

	it('should display a positive amount with a plus sign', () => {
		render(TransactionItem, { props: { title: 'Salary', meta: 'Dec 13', amount: 2800.0 } });
		expect(screen.getByText('+$2,800.00')).toBeInTheDocument();
	});

	it('should apply the negative CSS class for negative amounts', () => {
		render(TransactionItem, { props: { title: 'Debit', meta: '', amount: -10 } });
		const amountEl = screen.getByText('-$10.00');
		expect(amountEl).toHaveClass('negative');
	});

	it('should apply the positive CSS class for positive amounts', () => {
		render(TransactionItem, { props: { title: 'Credit', meta: '', amount: 10 } });
		const amountEl = screen.getByText('+$10.00');
		expect(amountEl).toHaveClass('positive');
	});
});
