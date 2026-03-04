import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TotalBalanceCard from './TotalBalanceCard.svelte';

describe('TotalBalanceCard', () => {
	it('should render the total balance formatted as currency', () => {
		render(TotalBalanceCard, { props: { totalBalance: 12345.67, accountCount: 3 } });
		expect(screen.getByText('$12,345.67')).toBeInTheDocument();
	});

	it('should display the account count', () => {
		render(TotalBalanceCard, { props: { totalBalance: 1000, accountCount: 2 } });
		expect(screen.getByText('Across 2 accounts')).toBeInTheDocument();
	});

	it('should display the section heading', () => {
		render(TotalBalanceCard, { props: { totalBalance: 0, accountCount: 0 } });
		expect(screen.getByRole('heading', { name: 'Total balance' })).toBeInTheDocument();
	});

	it('should render $0.00 when balance is zero', () => {
		render(TotalBalanceCard, { props: { totalBalance: 0, accountCount: 1 } });
		expect(screen.getByText('$0.00')).toBeInTheDocument();
	});
});
