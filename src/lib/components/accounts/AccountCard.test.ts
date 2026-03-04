import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AccountCard from './AccountCard.svelte';
import type { AccountSummary } from '$lib/types';

const baseAccount: AccountSummary = {
	account_id: 'acc-1',
	account_number: '123456789',
	routing_number: '021000021',
	account_type: 'CHECKING',
	account_status: 'ACTIVE',
	account_holder_name: 'Jane Doe',
	balance: 1500.0,
	currency: 'USD',
	opened_date: '2020-01-01'
};

describe('AccountCard', () => {
	it('should render the friendly account type name', () => {
		render(AccountCard, { props: { account: baseAccount } });
		expect(screen.getByText('Everyday Checking')).toBeInTheDocument();
	});

	it('should display the masked account number', () => {
		render(AccountCard, { props: { account: baseAccount } });
		expect(screen.getByText('****6789')).toBeInTheDocument();
	});

	it('should display the balance formatted as currency', () => {
		render(AccountCard, { props: { account: baseAccount } });
		expect(screen.getByText('$1,500.00')).toBeInTheDocument();
	});

	it('should show "Available" status for active accounts', () => {
		render(AccountCard, { props: { account: baseAccount } });
		expect(screen.getByText('Available')).toBeInTheDocument();
	});

	it('should apply the inactive class for non-ACTIVE accounts', () => {
		const { container } = render(AccountCard, {
			props: { account: { ...baseAccount, account_status: 'FROZEN' } }
		});
		expect(container.querySelector('.account-card')).toHaveClass('inactive');
	});

	it('should apply the negative class for a negative balance', () => {
		render(AccountCard, { props: { account: { ...baseAccount, balance: -100 } } });
		const balanceEl = screen.getByText('-$100.00');
		expect(balanceEl).toHaveClass('negative');
	});

	it('should show the SAVINGS friendly name', () => {
		render(AccountCard, { props: { account: { ...baseAccount, account_type: 'SAVINGS' } } });
		expect(screen.getByText('High-Yield Savings')).toBeInTheDocument();
	});
});
