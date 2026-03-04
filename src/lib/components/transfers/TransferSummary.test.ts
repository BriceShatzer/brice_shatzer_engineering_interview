import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TransferSummary from './TransferSummary.svelte';
import type { AccountSummary } from '$lib/types';

const sourceAccount: AccountSummary = {
	account_id: 'acc-1',
	account_number: '111111111',
	routing_number: '021000021',
	account_type: 'CHECKING',
	account_status: 'ACTIVE',
	account_holder_name: 'Jane',
	balance: 2000,
	currency: 'USD',
	opened_date: '2020-01-01'
};

const destAccount: AccountSummary = {
	...sourceAccount,
	account_id: 'acc-2',
	account_number: '222222222',
	account_type: 'SAVINGS',
	balance: 500
};

describe('TransferSummary', () => {
	it('should render the section heading', () => {
		render(TransferSummary, { props: { source: null, destination: null, amount: 0 } });
		expect(screen.getByText('Transfer summary')).toBeInTheDocument();
	});

	it('should show dashes when no accounts are selected', () => {
		render(TransferSummary, { props: { source: null, destination: null, amount: 0 } });
		const dashes = screen.getAllByText('-');
		expect(dashes.length).toBeGreaterThanOrEqual(2);
	});

	it('should show the source account display name when selected', () => {
		render(TransferSummary, { props: { source: sourceAccount, destination: null, amount: 0 } });
		expect(screen.getByText('Everyday Checking')).toBeInTheDocument();
	});

	it('should show the destination account display name when selected', () => {
		render(TransferSummary, { props: { source: null, destination: destAccount, amount: 0 } });
		expect(screen.getByText('High-Yield Savings')).toBeInTheDocument();
	});

	it('should show projected new balances when both accounts and an amount are set', () => {
		render(TransferSummary, {
			props: { source: sourceAccount, destination: destAccount, amount: 300 }
		});
		// source: 2000 - 300 = 1700
		expect(screen.getByText(/\$1,700\.00/)).toBeInTheDocument();
		// dest: 500 + 300 = 800
		expect(screen.getByText(/\$800\.00/)).toBeInTheDocument();
	});

	it('should show "New balance" label when an amount is set', () => {
		render(TransferSummary, {
			props: { source: sourceAccount, destination: destAccount, amount: 100 }
		});
		const newBalanceLabels = screen.getAllByText(/New balance/);
		expect(newBalanceLabels.length).toBe(2);
	});

	it('should show "Current" balance label when amount is zero', () => {
		render(TransferSummary, {
			props: { source: sourceAccount, destination: destAccount, amount: 0 }
		});
		const currentLabels = screen.getAllByText(/Current/);
		expect(currentLabels.length).toBe(2);
	});
});
