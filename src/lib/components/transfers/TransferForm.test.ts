import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TransferForm from './TransferForm.svelte';
import type { AccountSummary } from '$lib/types';
import { bank } from '$lib/stores';

function makeAccount(overrides: Partial<AccountSummary> = {}): AccountSummary {
	return {
		account_id: 'acc-1',
		account_number: '1234567890',
		routing_number: '021000021',
		account_type: 'CHECKING',
		account_status: 'ACTIVE',
		account_holder_name: 'Jane Doe',
		balance: 1000,
		currency: 'USD',
		opened_date: '2020-01-01',
		...overrides
	};
}

const acc1 = makeAccount({ account_id: 'a1', balance: 1000 });
const acc2 = makeAccount({ account_id: 'a2' });

describe('TransferForm – layout', () => {
	beforeEach(() => {
		bank.set(null);
	});

	it('renders the form heading', () => {
		const { getByText } = render(TransferForm);
		expect(getByText('Transfer between accounts')).toBeTruthy();
	});

	it('shows the institution name in the disclaimer', () => {
		const { getByText } = render(TransferForm);
		expect(getByText(/Northwind Bank/)).toBeTruthy();
	});
});

describe('TransferForm – submit button state', () => {
	it('is disabled when no source, destination, or amount are set', () => {
		const { getByRole } = render(TransferForm);
		expect(getByRole('button', { name: /Complete transfer/i })).toBeDisabled();
	});

	it('is disabled when only source account is set', () => {
		const { getByRole } = render(TransferForm, {
			props: { accounts: [acc1, acc2], sourceAccount: acc1 }
		});
		expect(getByRole('button', { name: /Complete transfer/i })).toBeDisabled();
	});

	it('is disabled when accounts are set but amount is 0', () => {
		const { getByRole } = render(TransferForm, {
			props: { accounts: [acc1, acc2], sourceAccount: acc1, destinationAccount: acc2, amount: 0 }
		});
		expect(getByRole('button', { name: /Complete transfer/i })).toBeDisabled();
	});

	it('is enabled when source, destination, and amount > 0 are all set', () => {
		const { getByRole } = render(TransferForm, {
			props: { accounts: [acc1, acc2], sourceAccount: acc1, destinationAccount: acc2, amount: 100 }
		});
		expect(getByRole('button', { name: /Complete transfer/i })).not.toBeDisabled();
	});

	it('shows "Transferring..." text and is disabled while submitting', () => {
		const { getByRole } = render(TransferForm, {
			props: {
				accounts: [acc1, acc2],
				sourceAccount: acc1,
				destinationAccount: acc2,
				amount: 100,
				submitting: true
			}
		});
		const btn = getByRole('button');
		expect(btn).toHaveTextContent('Transferring...');
		expect(btn).toBeDisabled();
	});
});

describe('TransferForm – amount input formatting', () => {
	it('strips non-numeric characters', async () => {
		const { getByPlaceholderText } = render(TransferForm);
		const input = getByPlaceholderText('0.00') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'abc12.5' } });
		expect(input.value).toBe('12.5');
	});

	it('limits decimal places to 2', async () => {
		const { getByPlaceholderText } = render(TransferForm);
		const input = getByPlaceholderText('0.00') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: '12.999' } });
		expect(input.value).toBe('12.99');
	});

	it('removes leading zeros from the integer part', async () => {
		const { getByPlaceholderText } = render(TransferForm);
		const input = getByPlaceholderText('0.00') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: '007' } });
		expect(input.value).toBe('7');
	});

	it('preserves a single leading zero before a decimal point', async () => {
		const { getByPlaceholderText } = render(TransferForm);
		const input = getByPlaceholderText('0.00') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: '0.50' } });
		expect(input.value).toBe('0.50');
	});
});

describe('TransferForm – submission and validation', () => {
	it('dispatches submit event with source, destination, and amount', async () => {
		const { getByRole, component } = render(TransferForm, {
			props: { accounts: [acc1, acc2], sourceAccount: acc1, destinationAccount: acc2, amount: 250 }
		});
		const handler = vi.fn();
		component.$on('submit', handler);
		await fireEvent.click(getByRole('button', { name: /Complete transfer/i }));
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler.mock.calls[0][0].detail).toMatchObject({
			source: acc1,
			destination: acc2,
			amount: 250
		});
	});

	it('shows error and blocks submit when amount exceeds source balance', async () => {
		const broke = makeAccount({ account_id: 'a1', balance: 100 });
		const { getByRole, getByText, component } = render(TransferForm, {
			props: {
				accounts: [broke, acc2],
				sourceAccount: broke,
				destinationAccount: acc2,
				amount: 500
			}
		});
		const handler = vi.fn();
		component.$on('submit', handler);
		await fireEvent.click(getByRole('button', { name: /Complete transfer/i }));
		expect(getByText(/Amount exceeds available balance/)).toBeTruthy();
		expect(handler).not.toHaveBeenCalled();
	});

	it('shows error and blocks submit when source and destination are the same account', async () => {
		const { getByRole, getByText, component } = render(TransferForm, {
			props: { accounts: [acc1], sourceAccount: acc1, destinationAccount: acc1, amount: 100 }
		});
		const handler = vi.fn();
		component.$on('submit', handler);
		await fireEvent.click(getByRole('button', { name: /Complete transfer/i }));
		expect(getByText('Cannot transfer to the same account')).toBeTruthy();
		expect(handler).not.toHaveBeenCalled();
	});

	it('clears amount error when user updates the input after a validation failure', async () => {
		const broke = makeAccount({ account_id: 'a1', balance: 100 });
		const { getByRole, getByPlaceholderText, queryByText } = render(TransferForm, {
			props: {
				accounts: [broke, acc2],
				sourceAccount: broke,
				destinationAccount: acc2,
				amount: 500
			}
		});
		await fireEvent.click(getByRole('button', { name: /Complete transfer/i }));
		const input = getByPlaceholderText('0.00') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: '50' } });
		expect(queryByText(/Amount exceeds available balance/)).toBeNull();
	});
});
