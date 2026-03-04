import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import AccountSelect from './AccountSelect.svelte';
import type { AccountSummary } from '$lib/types';

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

const base = {
	accounts: [] as AccountSummary[],
	selected: null as AccountSummary | null,
	excludeAccountId: null as string | null,
	label: 'Transfer from',
	id: 'test-select'
};

describe('AccountSelect – closed state', () => {
	it('shows placeholder when no account is selected', () => {
		const { getByText } = render(AccountSelect, { props: base });
		expect(getByText('Choose account')).toBeTruthy();
	});

	it('has combobox role with aria-expanded=false', () => {
		const { getByRole } = render(AccountSelect, { props: base });
		const combo = getByRole('combobox');
		expect(combo).toHaveAttribute('aria-expanded', 'false');
		expect(combo).toHaveAttribute('aria-haspopup', 'listbox');
	});

	it('does not render the listbox when closed', () => {
		const { queryByRole } = render(AccountSelect, { props: base });
		expect(queryByRole('listbox')).toBeNull();
	});
});

describe('AccountSelect – open/close', () => {
	it('opens dropdown on click and sets aria-expanded=true', async () => {
		const { getByRole } = render(AccountSelect, { props: { ...base, accounts: [makeAccount()] } });
		await fireEvent.click(getByRole('combobox'));
		expect(getByRole('listbox')).toBeTruthy();
		expect(getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
	});

	it('toggles closed on second click', async () => {
		const { getByRole, queryByRole } = render(AccountSelect, {
			props: { ...base, accounts: [makeAccount()] }
		});
		await fireEvent.click(getByRole('combobox'));
		await fireEvent.click(getByRole('combobox'));
		expect(queryByRole('listbox')).toBeNull();
	});

	it('opens on ArrowDown key when closed', async () => {
		const { getByRole } = render(AccountSelect, { props: { ...base, accounts: [makeAccount()] } });
		await fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
		expect(getByRole('listbox')).toBeTruthy();
	});

	it('opens on Enter key when closed', async () => {
		const { getByRole } = render(AccountSelect, { props: { ...base, accounts: [makeAccount()] } });
		await fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' });
		expect(getByRole('listbox')).toBeTruthy();
	});

	it('closes on Escape key', async () => {
		const { getByRole, queryByRole } = render(AccountSelect, {
			props: { ...base, accounts: [makeAccount()] }
		});
		await fireEvent.click(getByRole('combobox'));
		await fireEvent.keyDown(getByRole('combobox'), { key: 'Escape' });
		expect(queryByRole('listbox')).toBeNull();
	});
});

describe('AccountSelect – selection', () => {
	it('renders all accounts as listbox options', async () => {
		const accounts = [
			makeAccount({ account_id: 'a1' }),
			makeAccount({ account_id: 'a2', account_type: 'SAVINGS' })
		];
		const { getByRole, getAllByRole } = render(AccountSelect, { props: { ...base, accounts } });
		await fireEvent.click(getByRole('combobox'));
		expect(getAllByRole('option')).toHaveLength(2);
	});

	it('dispatches select event with account data when option is clicked', async () => {
		const account = makeAccount();
		const { getByRole, getAllByRole, component } = render(AccountSelect, {
			props: { ...base, accounts: [account] }
		});
		const handler = vi.fn();
		component.$on('select', handler);
		await fireEvent.click(getByRole('combobox'));
		await fireEvent.click(getAllByRole('option')[0]);
		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler.mock.calls[0][0].detail).toMatchObject({ account_id: 'acc-1' });
	});

	it('closes the dropdown after an account is selected', async () => {
		const { getByRole, getAllByRole, queryByRole } = render(AccountSelect, {
			props: { ...base, accounts: [makeAccount()] }
		});
		await fireEvent.click(getByRole('combobox'));
		await fireEvent.click(getAllByRole('option')[0]);
		expect(queryByRole('listbox')).toBeNull();
	});

	it('selects the focused option on Enter', async () => {
		const account = makeAccount();
		const { getByRole, component } = render(AccountSelect, {
			props: { ...base, accounts: [account] }
		});
		const handler = vi.fn();
		component.$on('select', handler);
		const combo = getByRole('combobox');
		await fireEvent.keyDown(combo, { key: 'ArrowDown' }); // opens, focusedIndex = 0
		await fireEvent.keyDown(combo, { key: 'Enter' });
		expect(handler).toHaveBeenCalledTimes(1);
	});
});

describe('AccountSelect – excluded and inactive accounts', () => {
	it('shows "Already selected" label for excluded account', async () => {
		const account = makeAccount({ account_id: 'acc-1' });
		const { getByRole, getByText } = render(AccountSelect, {
			props: { ...base, accounts: [account], excludeAccountId: 'acc-1' }
		});
		await fireEvent.click(getByRole('combobox'));
		expect(getByText('Already selected')).toBeTruthy();
	});

	it('does not dispatch select for excluded account', async () => {
		const account = makeAccount({ account_id: 'acc-1' });
		const { getByRole, getAllByRole, component } = render(AccountSelect, {
			props: { ...base, accounts: [account], excludeAccountId: 'acc-1' }
		});
		const handler = vi.fn();
		component.$on('select', handler);
		await fireEvent.click(getByRole('combobox'));
		await fireEvent.click(getAllByRole('option')[0]);
		expect(handler).not.toHaveBeenCalled();
	});

	it('marks inactive account with aria-disabled=true', async () => {
		const frozen = makeAccount({ account_status: 'FROZEN' });
		const { getByRole, getAllByRole } = render(AccountSelect, {
			props: { ...base, accounts: [frozen] }
		});
		await fireEvent.click(getByRole('combobox'));
		expect(getAllByRole('option')[0]).toHaveAttribute('aria-disabled', 'true');
	});

	it('does not dispatch select for inactive account', async () => {
		const frozen = makeAccount({ account_status: 'FROZEN' });
		const { getByRole, getAllByRole, component } = render(AccountSelect, {
			props: { ...base, accounts: [frozen] }
		});
		const handler = vi.fn();
		component.$on('select', handler);
		await fireEvent.click(getByRole('combobox'));
		await fireEvent.click(getAllByRole('option')[0]);
		expect(handler).not.toHaveBeenCalled();
	});
});

describe('AccountSelect – keyboard navigation', () => {
	it('moves focus to the second option after two ArrowDown presses', async () => {
		const accounts = [makeAccount({ account_id: 'a1' }), makeAccount({ account_id: 'a2' })];
		const { getByRole, getAllByRole } = render(AccountSelect, { props: { ...base, accounts } });
		const combo = getByRole('combobox');
		await fireEvent.keyDown(combo, { key: 'ArrowDown' }); // opens, focusedIndex = 0
		await fireEvent.keyDown(combo, { key: 'ArrowDown' }); // focusedIndex = 1
		expect(getAllByRole('option')[1]).toHaveClass('focused');
	});

	it('does not move focus above the first option with ArrowUp', async () => {
		const accounts = [makeAccount({ account_id: 'a1' }), makeAccount({ account_id: 'a2' })];
		const { getByRole, getAllByRole } = render(AccountSelect, { props: { ...base, accounts } });
		const combo = getByRole('combobox');
		await fireEvent.keyDown(combo, { key: 'ArrowDown' }); // opens, focusedIndex = 0
		await fireEvent.keyDown(combo, { key: 'ArrowUp' }); // clamps to 0
		expect(getAllByRole('option')[0]).toHaveClass('focused');
	});
});
